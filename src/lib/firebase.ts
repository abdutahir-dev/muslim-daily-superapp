import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  type User,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  initializeFirestore,
  getFirestore,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  setDoc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import config from "../../firebase-applet-config.json";

/**
 * Enterprise Firebase configuration.
 * Prioritizes environment variables (VITE_FIREBASE_*) across local, staging,
 * and production environments to comply with 12-factor application security standards,
 * falling back gracefully to the auto-provisioned applet config.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || config.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || config.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || config.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || config.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || config.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || config.appId,
};

// Singleton Firebase Application instance
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/**
 * Firebase Authentication instance supporting Email/Password, Anonymous guest mode,
 * and Google OAuth popup providers.
 */
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// Explicitly request email and profile scopes for Google Sign-In
googleProvider.addScope("email");
googleProvider.addScope("profile");
googleProvider.setCustomParameters({
  prompt: "select_account",
});

/**
 * Cloud Firestore database instance configured with the target database ID.
 * Defaults to the standard "(default)" database.
 */
const targetDatabaseId =
  import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID ||
  config.firestoreDatabaseId ||
  "(default)";

export const db =
  targetDatabaseId && targetDatabaseId !== "(default)"
    ? getFirestore(app, targetDatabaseId)
    : getFirestore(app);

/**
 * Cloud Storage instance for user profile pictures and audio assets.
 */
export const storage = getStorage(app);

export const oAuthClientId =
  import.meta.env.VITE_FIREBASE_OAUTH_CLIENT_ID || config.oAuthClientId || "";

export {
  app as firebaseApp,
  firebaseConfig,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  setDoc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
  ref,
  uploadBytes,
  getDownloadURL,
};

export type { User };
