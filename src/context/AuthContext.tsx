import React, { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  db,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  updateProfile,
  signInWithPopup,
  googleProvider,
  sendPasswordResetEmail,
  type User,
} from "../lib/firebase";
import {
  DEFAULT_PREFERENCES,
  HabitTrackerDay,
  QuranBookmark,
  UserPreferences,
  ZakatState,
  SolatyDayTracking,
  PrayerRecordDetail,
} from "../types";

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const isOffline =
    (error as any)?.code === "unavailable" ||
    errorMessage.includes("the client is offline") ||
    errorMessage.includes("Could not reach Cloud Firestore") ||
    errorMessage.includes("operation could not be completed");

  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };

  if (isOffline) {
    console.info("Firestore operating in offline/cached mode for path:", path);
    return errInfo;
  }

  console.error("Firestore Error: ", JSON.stringify(errInfo));
  return errInfo;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isGuest: boolean;
  isAuthenticated: boolean;
  isAnonymous: boolean;
  preferences: UserPreferences;
  bookmarks: QuranBookmark[];
  todayHabit: HabitTrackerDay;
  solatyRecords: Record<string, SolatyDayTracking>;
  getSolatyTracking: (date: string) => SolatyDayTracking;
  updateSolatyTracking: (date: string, update: Partial<SolatyDayTracking>) => Promise<void>;
  toggleSolatyPrayer: (
    date: string,
    prayerKey: "fajr" | "dhuhr" | "asr" | "maghrib" | "isha",
    options?: { onTime?: boolean; inJamaah?: boolean; isLate?: boolean }
  ) => Promise<void>;
  toggleSolatySunnah: (
    date: string,
    sunnahKey: keyof SolatyDayTracking["sunnah"]
  ) => Promise<void>;
  toggleSolatyNafl: (
    date: string,
    naflKey: keyof SolatyDayTracking["nawafil"]
  ) => Promise<void>;
  setSolatyFasting: (
    date: string,
    fasting: SolatyDayTracking["fasting"]
  ) => Promise<void>;
  setSolatyJournal: (
    date: string,
    journal: Partial<SolatyDayTracking["journal"]>
  ) => Promise<void>;
  lifetimeDhikrCount: number;
  zakatState: ZakatState | null;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => Promise<void>;
  togglePrayerHabit: (prayerKey: keyof HabitTrackerDay["prayers"]) => Promise<void>;
  toggleSunnahHabit: (sunnahKey: keyof HabitTrackerDay["sunnah"]) => Promise<void>;
  setFastingHabit: (fasting: HabitTrackerDay["fasting"]) => Promise<void>;
  setQuranPagesRead: (pages: number) => Promise<void>;
  toggleAdhkarHabit: (type: "morning" | "evening") => Promise<void>;
  addBookmark: (bookmark: Omit<QuranBookmark, "id" | "timestamp">) => Promise<void>;
  removeBookmark: (id: string) => Promise<void>;
  incrementDhikrLifetime: (amount?: number) => Promise<void>;
  saveZakat: (state: ZakatState) => Promise<void>;
  signInEmail: (email: string, pass: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpEmail: (email: string, pass: string, name?: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  signOutUser: () => Promise<void>;
  requestGeolocation: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getTodayKey = () => new Date().toISOString().split("T")[0];

export const createDefaultSolatyDay = (date: string): SolatyDayTracking => ({
  date,
  prayers: {
    fajr: { completed: false, onTime: true, inJamaah: false },
    dhuhr: { completed: false, onTime: true, inJamaah: false },
    asr: { completed: false, onTime: true, inJamaah: false },
    maghrib: { completed: false, onTime: true, inJamaah: false },
    isha: { completed: false, onTime: true, inJamaah: false },
  },
  sunnah: {
    fajr_sunnah: false,
    dhuhr_qebliyah: false,
    dhuhr_baediyah: false,
    asr_qebliyah: false,
    maghrib_baediyah: false,
    isha_baediyah: false,
    witr: false,
  },
  nawafil: {
    duha: false,
    tahajjud: false,
    ishraq: false,
    awwabin: false,
  },
  fasting: "none",
  journal: {
    note: "",
    mood: "peaceful",
  },
});

const defaultTodayHabit: HabitTrackerDay = {
  date: getTodayKey(),
  prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
  sunnah: { duha: false, tahajjud: false, witr: false },
  fasting: "none",
  quranPagesRead: 0,
  adhkarMorning: false,
  adhkarEvening: false,
  charitySadaqah: false,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const local = localStorage.getItem("muslim_daily_preferences");
    return local ? { ...DEFAULT_PREFERENCES, ...JSON.parse(local) } : DEFAULT_PREFERENCES;
  });
  const [bookmarks, setBookmarks] = useState<QuranBookmark[]>([]);
  const [todayHabit, setTodayHabit] = useState<HabitTrackerDay>(() => {
    const local = localStorage.getItem(`muslim_daily_habits_${getTodayKey()}`);
    return local ? JSON.parse(local) : defaultTodayHabit;
  });
  const [lifetimeDhikrCount, setLifetimeDhikrCount] = useState<number>(0);
  const [zakatState, setZakatState] = useState<ZakatState | null>(null);
  const [solatyRecords, setSolatyRecords] = useState<Record<string, SolatyDayTracking>>(() => {
    const local = localStorage.getItem("muslim_daily_solaty_records");
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }
    return {};
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // Initialize and observe Firebase Auth
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Listen to Firestore document for user data in real time
  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    const unsubscribeSnapshot = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.preferences) {
            setPreferences((prev) => {
              const merged = { ...prev, ...data.preferences };
              localStorage.setItem("muslim_daily_preferences", JSON.stringify(merged));
              return merged;
            });
          }
          if (Array.isArray(data.bookmarks)) {
            setBookmarks(data.bookmarks);
          }
          if (data.habits && data.habits[getTodayKey()]) {
            setTodayHabit(data.habits[getTodayKey()]);
            localStorage.setItem(
              `muslim_daily_habits_${getTodayKey()}`,
              JSON.stringify(data.habits[getTodayKey()])
            );
          }
          if (data.solaty) {
            setSolatyRecords((prev) => {
              const merged = { ...prev, ...data.solaty };
              localStorage.setItem("muslim_daily_solaty_records", JSON.stringify(merged));
              return merged;
            });
          }
          if (typeof data.lifetimeDhikrCount === "number") {
            setLifetimeDhikrCount(data.lifetimeDhikrCount);
          }
          if (data.zakatState) {
            setZakatState(data.zakatState);
          }
          setLastSyncedAt(new Date());
        } else {
          // Initialize user document in Firestore with current preferences
          setDoc(
            userDocRef,
            {
              email: user.email,
              displayName: user.displayName || (user.isAnonymous ? "Guest Believer" : "Believer"),
              isAnonymous: user.isAnonymous,
              preferences,
              bookmarks: [],
              habits: { [getTodayKey()]: todayHabit },
              lifetimeDhikrCount: 0,
              createdAt: new Date().toISOString(),
            },
            { merge: true }
          ).catch((e) => console.warn("Init user doc error:", e));
        }
      },
      (error) => {
        console.warn("Firestore snapshot error:", error);
      }
    );

    return () => unsubscribeSnapshot();
  }, [user]);

  // Request GPS coordinates
  const requestGeolocation = async () => {
    if (!navigator.geolocation) return;
    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Reverse geocoding lookup
          let cityName = "Current Location";
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            if (res.ok) {
              const geo = await res.json();
              cityName =
                geo.address?.city ||
                geo.address?.town ||
                geo.address?.municipality ||
                geo.address?.suburb ||
                "Detected City";
            }
          } catch {
            // fallback
          }

          await updatePreferences({
            latitude,
            longitude,
            city: cityName,
          });
        },
        (error) => {
          console.warn("Geolocation permission not granted or error:", error);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } catch (e) {
      console.warn("Geolocation exception:", e);
    }
  };

  // Update shared preferences
  const updatePreferences = async (newPrefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    localStorage.setItem("muslim_daily_preferences", JSON.stringify(updated));

    if (user) {
      setIsSyncing(true);
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { preferences: updated }, { merge: true });
        setLastSyncedAt(new Date());
      } catch (e) {
        console.warn("Preferences cloud sync failed:", e);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  // Habit Tracker: Toggle Fardh prayer
  const togglePrayerHabit = async (prayerKey: keyof HabitTrackerDay["prayers"]) => {
    const updated: HabitTrackerDay = {
      ...todayHabit,
      prayers: {
        ...todayHabit.prayers,
        [prayerKey]: !todayHabit.prayers[prayerKey],
      },
    };
    setTodayHabit(updated);
    localStorage.setItem(`muslim_daily_habits_${getTodayKey()}`, JSON.stringify(updated));

    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          [`habits.${getTodayKey()}`]: updated,
        });
      } catch (e) {
        console.warn("Habit sync error:", e);
      }
    }
  };

  // Habit Tracker: Toggle Sunnah prayer
  const toggleSunnahHabit = async (sunnahKey: keyof HabitTrackerDay["sunnah"]) => {
    const updated: HabitTrackerDay = {
      ...todayHabit,
      sunnah: {
        ...todayHabit.sunnah,
        [sunnahKey]: !todayHabit.sunnah[sunnahKey],
      },
    };
    setTodayHabit(updated);
    localStorage.setItem(`muslim_daily_habits_${getTodayKey()}`, JSON.stringify(updated));

    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          [`habits.${getTodayKey()}`]: updated,
        });
      } catch (e) {
        console.warn("Sunnah habit sync error:", e);
      }
    }
  };

  // Habit Tracker: Fasting
  const setFastingHabit = async (fasting: HabitTrackerDay["fasting"]) => {
    const updated: HabitTrackerDay = { ...todayHabit, fasting };
    setTodayHabit(updated);
    localStorage.setItem(`muslim_daily_habits_${getTodayKey()}`, JSON.stringify(updated));

    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          [`habits.${getTodayKey()}`]: updated,
        });
      } catch (e) {
        console.warn("Fasting sync error:", e);
      }
    }
  };

  // Habit Tracker: Quran pages read
  const setQuranPagesRead = async (pages: number) => {
    const updated: HabitTrackerDay = { ...todayHabit, quranPagesRead: pages };
    setTodayHabit(updated);
    localStorage.setItem(`muslim_daily_habits_${getTodayKey()}`, JSON.stringify(updated));

    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          [`habits.${getTodayKey()}`]: updated,
        });
      } catch (e) {
        console.warn("Quran pages sync error:", e);
      }
    }
  };

  // Habit Tracker: Morning/Evening Adhkar check
  const toggleAdhkarHabit = async (type: "morning" | "evening") => {
    const key = type === "morning" ? "adhkarMorning" : "adhkarEvening";
    const updated: HabitTrackerDay = { ...todayHabit, [key]: !todayHabit[key] };
    setTodayHabit(updated);
    localStorage.setItem(`muslim_daily_habits_${getTodayKey()}`, JSON.stringify(updated));

    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          [`habits.${getTodayKey()}`]: updated,
        });
      } catch (e) {
        console.warn("Adhkar habit sync error:", e);
      }
    }
  };

  // Quran Bookmarks
  const addBookmark = async (item: Omit<QuranBookmark, "id" | "timestamp">) => {
    const newBookmark: QuranBookmark = {
      ...item,
      id: `${item.surahNumber}_${item.ayahNumber}_${Date.now()}`,
      timestamp: Date.now(),
    };
    const updated = [newBookmark, ...bookmarks.filter((b) => !(b.surahNumber === item.surahNumber && b.ayahNumber === item.ayahNumber))];
    setBookmarks(updated);

    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { bookmarks: updated });
      } catch (e) {
        console.warn("Bookmark sync error:", e);
      }
    }
  };

  const removeBookmark = async (id: string) => {
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);

    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { bookmarks: updated });
      } catch (e) {
        console.warn("Remove bookmark error:", e);
      }
    }
  };

  // Lifetime Dhikr Counter
  const incrementDhikrLifetime = async (amount: number = 1) => {
    const nextCount = lifetimeDhikrCount + amount;
    setLifetimeDhikrCount(nextCount);

    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { lifetimeDhikrCount: nextCount });
      } catch (e) {
        console.warn("Dhikr lifetime sync error:", e);
      }
    }
  };

  // Zakat save calculation
  const saveZakat = async (state: ZakatState) => {
    const withDate = { ...state, lastCalculated: new Date().toISOString() };
    setZakatState(withDate);

    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { zakatState: withDate });
      } catch (e) {
        console.warn("Zakat sync error:", e);
      }
    }
  };

  const resetPreferences = async () => {
    setPreferences(DEFAULT_PREFERENCES);
    localStorage.setItem("muslim_daily_preferences", JSON.stringify(DEFAULT_PREFERENCES));
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { preferences: DEFAULT_PREFERENCES }, { merge: true });
        setLastSyncedAt(new Date());
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `users/${user.uid}`);
      }
    }
  };

  // Solaty Prayer Tracking Methods
  const getSolatyTracking = (date: string): SolatyDayTracking => {
    if (solatyRecords[date]) {
      return solatyRecords[date];
    }
    // If todayHabit exists and date === today, seed from todayHabit
    if (date === getTodayKey()) {
      const initial = createDefaultSolatyDay(date);
      initial.prayers.fajr.completed = todayHabit.prayers.fajr;
      initial.prayers.dhuhr.completed = todayHabit.prayers.dhuhr;
      initial.prayers.asr.completed = todayHabit.prayers.asr;
      initial.prayers.maghrib.completed = todayHabit.prayers.maghrib;
      initial.prayers.isha.completed = todayHabit.prayers.isha;
      initial.nawafil.duha = todayHabit.sunnah.duha;
      initial.nawafil.tahajjud = todayHabit.sunnah.tahajjud;
      initial.sunnah.witr = todayHabit.sunnah.witr;
      initial.fasting = todayHabit.fasting;
      return initial;
    }
    return createDefaultSolatyDay(date);
  };

  const updateSolatyTracking = async (date: string, update: Partial<SolatyDayTracking>) => {
    const current = getSolatyTracking(date);
    const updated: SolatyDayTracking = {
      ...current,
      ...update,
      prayers: {
        ...current.prayers,
        ...(update.prayers || {}),
      },
      sunnah: {
        ...current.sunnah,
        ...(update.sunnah || {}),
      },
      nawafil: {
        ...current.nawafil,
        ...(update.nawafil || {}),
      },
      journal: {
        ...current.journal,
        ...(update.journal || {}),
      },
    };

    const newRecords = {
      ...solatyRecords,
      [date]: updated,
    };
    setSolatyRecords(newRecords);
    localStorage.setItem("muslim_daily_solaty_records", JSON.stringify(newRecords));

    // Also synchronize todayHabit if date is today
    if (date === getTodayKey()) {
      const synchedHabit: HabitTrackerDay = {
        ...todayHabit,
        prayers: {
          fajr: updated.prayers.fajr.completed,
          dhuhr: updated.prayers.dhuhr.completed,
          asr: updated.prayers.asr.completed,
          maghrib: updated.prayers.maghrib.completed,
          isha: updated.prayers.isha.completed,
        },
        sunnah: {
          duha: updated.nawafil.duha,
          tahajjud: updated.nawafil.tahajjud,
          witr: updated.sunnah.witr,
        },
        fasting: updated.fasting,
      };
      setTodayHabit(synchedHabit);
      localStorage.setItem(`muslim_daily_habits_${getTodayKey()}`, JSON.stringify(synchedHabit));
    }

    if (user && !user.isAnonymous) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          [`solaty.${date}`]: updated,
        });
      } catch (e) {
        console.warn("Solaty tracking sync error:", e);
      }
    }
  };

  const toggleSolatyPrayer = async (
    date: string,
    prayerKey: "fajr" | "dhuhr" | "asr" | "maghrib" | "isha",
    options?: { onTime?: boolean; inJamaah?: boolean; isLate?: boolean }
  ) => {
    const current = getSolatyTracking(date);
    const existing = current.prayers[prayerKey];
    const newCompleted = !existing.completed;
    const updatedPrayer: PrayerRecordDetail = {
      completed: newCompleted,
      onTime: options?.onTime !== undefined ? options.onTime : existing.onTime ?? true,
      inJamaah: options?.inJamaah !== undefined ? options.inJamaah : existing.inJamaah ?? false,
      isLate: options?.isLate !== undefined ? options.isLate : existing.isLate ?? false,
      loggedAt: newCompleted ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : undefined,
    };

    await updateSolatyTracking(date, {
      prayers: {
        ...current.prayers,
        [prayerKey]: updatedPrayer,
      },
    });
  };

  const toggleSolatySunnah = async (
    date: string,
    sunnahKey: keyof SolatyDayTracking["sunnah"]
  ) => {
    const current = getSolatyTracking(date);
    await updateSolatyTracking(date, {
      sunnah: {
        ...current.sunnah,
        [sunnahKey]: !current.sunnah[sunnahKey],
      },
    });
  };

  const toggleSolatyNafl = async (
    date: string,
    naflKey: keyof SolatyDayTracking["nawafil"]
  ) => {
    const current = getSolatyTracking(date);
    await updateSolatyTracking(date, {
      nawafil: {
        ...current.nawafil,
        [naflKey]: !current.nawafil[naflKey],
      },
    });
  };

  const setSolatyFasting = async (
    date: string,
    fasting: SolatyDayTracking["fasting"]
  ) => {
    await updateSolatyTracking(date, { fasting });
  };

  const setSolatyJournal = async (
    date: string,
    journal: Partial<SolatyDayTracking["journal"]>
  ) => {
    const current = getSolatyTracking(date);
    await updateSolatyTracking(date, {
      journal: {
        ...current.journal,
        ...journal,
        updatedAt: new Date().toISOString(),
      },
    });
  };

  // Auth operations
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signInEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signInWithEmail = signInEmail;

  const signUpEmail = async (email: string, pass: string, name?: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user && name) {
      await updateProfile(cred.user, { displayName: name });
    }
  };

  const signUpWithEmail = signUpEmail;

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const signInAsGuest = async () => {
    try {
      await signInAnonymously(auth);
    } catch (err) {
      console.info("Using local guest session");
      setUser(null);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const signOutUser = logout;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isGuest: !user || user.isAnonymous,
        isAuthenticated: Boolean(user && !user.isAnonymous),
        isAnonymous: Boolean(user?.isAnonymous),
        preferences,
        bookmarks,
        todayHabit,
        solatyRecords,
        getSolatyTracking,
        updateSolatyTracking,
        toggleSolatyPrayer,
        toggleSolatySunnah,
        toggleSolatyNafl,
        setSolatyFasting,
        setSolatyJournal,
        lifetimeDhikrCount,
        zakatState,
        isSyncing,
        lastSyncedAt,
        updatePreferences,
        resetPreferences,
        togglePrayerHabit,
        toggleSunnahHabit,
        setFastingHabit,
        setQuranPagesRead,
        toggleAdhkarHabit,
        addBookmark,
        removeBookmark,
        incrementDhikrLifetime,
        saveZakat,
        signInEmail,
        signInWithEmail,
        signUpEmail,
        signUpWithEmail,
        signInWithGoogle,
        sendPasswordReset,
        signInAsGuest,
        logout,
        signOutUser,
        requestGeolocation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
