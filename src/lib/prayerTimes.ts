import {
  CalculationMethod,
  DailyPrayersSchedule,
  HijriDateInfo,
  JuristicSchool,
  PrayerTimeItem,
  UserPreferences,
} from "../types";

/**
 * Astronomical Prayer Time Calculation Engine
 * Implements high-precision solar coordinates and hour angle formulas
 */

// Math helpers for degrees
const d2r = (deg: number) => (deg * Math.PI) / 180.0;
const r2d = (rad: number) => (rad * 180.0) / Math.PI;

interface MethodParams {
  fajrAngle: number;
  ishaAngle: number;
  maghribMinutes?: number;
  ishaMinutes?: number;
}

const METHOD_CONFIGS: Record<CalculationMethod, MethodParams> = {
  MWL: { fajrAngle: 18.0, ishaAngle: 17.0 },
  ISNA: { fajrAngle: 15.0, ishaAngle: 15.0 },
  Egypt: { fajrAngle: 19.5, ishaAngle: 17.5 },
  Makkah: { fajrAngle: 18.5, ishaAngle: 0, ishaMinutes: 90 },
  Karachi: { fajrAngle: 18.0, ishaAngle: 18.0 },
  Gulf: { fajrAngle: 19.5, ishaAngle: 0, ishaMinutes: 90 },
};

/**
 * Compute solar position: equation of time (minutes) and declination (degrees)
 */
function getSunPosition(julianDate: number) {
  const d = julianDate - 2451545.0;
  const g = 357.529 + 0.98560028 * d;
  const q = 280.459 + 0.98564736 * d;
  const l = q + 1.915 * Math.sin(d2r(g)) + 0.02 * Math.sin(d2r(2 * g));

  const e = 23.439 - 0.00000036 * d;
  const declination = r2d(Math.asin(Math.sin(d2r(e)) * Math.sin(d2r(l))));

  let ra = r2d(Math.atan2(Math.cos(d2r(e)) * Math.sin(d2r(l)), Math.cos(d2r(l)))) / 15.0;
  ra = (ra + 24.0) % 24.0;

  const equationOfTime = (q / 15.0 - ra) * 60.0;
  return { declination, equationOfTime };
}

function getJulianDate(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    b -
    1524.5
  );
}

/**
 * Calculate prayer times for given coordinates and date
 */
export function calculatePrayerTimes(
  date: Date,
  prefs: UserPreferences
): DailyPrayersSchedule {
  const lat = prefs.latitude;
  const lng = prefs.longitude;
  const method = METHOD_CONFIGS[prefs.calculationMethod] || METHOD_CONFIGS.MWL;
  const juristicShadowFactor = prefs.juristicSchool === "hanafi" ? 2 : 1;

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const jd = getJulianDate(year, month, day);
  const { declination, equationOfTime } = getSunPosition(jd);

  // Timezone offset in hours
  const timezoneOffsetHours = -date.getTimezoneOffset() / 60.0;

  // Midday (Dhuhr) in local hours
  const noonSolar = 12.0 + timezoneOffsetHours - lng / 15.0 - equationOfTime / 60.0;

  // Hour angle helper
  const hourAngle = (angle: number): number => {
    const val =
      (-Math.sin(d2r(angle)) - Math.sin(d2r(lat)) * Math.sin(d2r(declination))) /
      (Math.cos(d2r(lat)) * Math.cos(d2r(declination)));
    if (val > 1.0) return 0;
    if (val < -1.0) return Math.PI;
    return r2d(Math.acos(val)) / 15.0;
  };

  // Asr hour angle
  const asrAngle = (): number => {
    const alt = r2d(
      Math.atan(1.0 / (juristicShadowFactor + Math.tan(d2r(Math.abs(lat - declination)))))
    );
    const val =
      (Math.sin(d2r(alt)) - Math.sin(d2r(lat)) * Math.sin(d2r(declination))) /
      (Math.cos(d2r(lat)) * Math.cos(d2r(declination)));
    if (val > 1.0) return 0;
    if (val < -1.0) return Math.PI;
    return r2d(Math.acos(val)) / 15.0;
  };

  // Sunrise/Sunset uses 0.833° for atmospheric refraction
  const sunAngle = 0.833;
  const sunriseHour = noonSolar - hourAngle(sunAngle);
  const sunsetHour = noonSolar + hourAngle(sunAngle);

  // Fajr
  const fajrHour = noonSolar - hourAngle(method.fajrAngle);

  // Dhuhr (standard 1 to 2 minutes after zenith)
  const dhuhrHour = noonSolar + 2 / 60.0;

  // Asr
  const asrHour = noonSolar + asrAngle();

  // Maghrib (typically sunset or sunset + 2 mins)
  const maghribHour = sunsetHour + 2 / 60.0;

  // Isha
  let ishaHour = method.ishaMinutes
    ? maghribHour + method.ishaMinutes / 60.0
    : noonSolar + hourAngle(method.ishaAngle);

  // Convert decimal hours to Date
  const toDate = (hours: number, baseDate: Date): Date => {
    const h = Math.floor(hours);
    const remainder = (hours - h) * 60;
    const m = Math.floor(remainder);
    const s = Math.round((remainder - m) * 60);

    const d = new Date(baseDate);
    d.setHours(h, m, s, 0);
    return d;
  };

  const fajrDate = toDate(fajrHour, date);
  const sunriseDate = toDate(sunriseHour, date);
  const dhuhrDate = toDate(dhuhrHour, date);
  const asrDate = toDate(asrHour, date);
  const maghribDate = toDate(maghribHour, date);
  const ishaDate = toDate(ishaHour, date);

  // Qiyam / Last third of night (between Maghrib and Fajr)
  const nextFajrDate = new Date(fajrDate);
  nextFajrDate.setDate(nextFajrDate.getDate() + 1);
  const nightDurationMs = nextFajrDate.getTime() - maghribDate.getTime();
  const qiyamDate = new Date(maghribDate.getTime() + (nightDurationMs * 2) / 3);

  const formatTimeStr = (d: Date): string => {
    return d.toLocaleTimeString([], {
      hour: prefs.timeFormat24h ? "2-digit" : "numeric",
      minute: "2-digit",
      hour12: !prefs.timeFormat24h,
    });
  };

  const now = new Date();

  const items: PrayerTimeItem[] = [
    {
      id: "fajr",
      name: "Fajr",
      arabicName: "الفجر",
      time: formatTimeStr(fajrDate),
      date: fajrDate,
      isPassed: now.getTime() > fajrDate.getTime(),
      isNext: false,
      isCurrent: false,
    },
    {
      id: "sunrise",
      name: "Sunrise",
      arabicName: "الشروق",
      time: formatTimeStr(sunriseDate),
      date: sunriseDate,
      isPassed: now.getTime() > sunriseDate.getTime(),
      isNext: false,
      isCurrent: false,
    },
    {
      id: "dhuhr",
      name: "Dhuhr",
      arabicName: "الظهر",
      time: formatTimeStr(dhuhrDate),
      date: dhuhrDate,
      isPassed: now.getTime() > dhuhrDate.getTime(),
      isNext: false,
      isCurrent: false,
    },
    {
      id: "asr",
      name: "Asr",
      arabicName: "العصر",
      time: formatTimeStr(asrDate),
      date: asrDate,
      isPassed: now.getTime() > asrDate.getTime(),
      isNext: false,
      isCurrent: false,
    },
    {
      id: "maghrib",
      name: "Maghrib",
      arabicName: "المغرب",
      time: formatTimeStr(maghribDate),
      date: maghribDate,
      isPassed: now.getTime() > maghribDate.getTime(),
      isNext: false,
      isCurrent: false,
    },
    {
      id: "isha",
      name: "Isha",
      arabicName: "العشاء",
      time: formatTimeStr(ishaDate),
      date: ishaDate,
      isPassed: now.getTime() > ishaDate.getTime(),
      isNext: false,
      isCurrent: false,
    },
  ];

  // Find current prayer and next prayer
  let nextPrayer: PrayerTimeItem | null = null;
  let currentPrayer: PrayerTimeItem | null = null;

  for (let i = 0; i < items.length; i++) {
    if (now.getTime() < items[i].date.getTime()) {
      nextPrayer = items[i];
      if (i > 0) {
        currentPrayer = items[i - 1];
      }
      break;
    }
  }

  // If all prayers today have passed, next prayer is Fajr tomorrow
  if (!nextPrayer) {
    const tomorrowFajr = new Date(fajrDate);
    tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
    nextPrayer = {
      id: "fajr",
      name: "Fajr (Tomorrow)",
      arabicName: "الفجر",
      time: formatTimeStr(tomorrowFajr),
      date: tomorrowFajr,
      isPassed: false,
      isNext: true,
      isCurrent: false,
    };
    currentPrayer = items[items.length - 1]; // Isha
  }

  // Mark flags in items
  items.forEach((item) => {
    if (nextPrayer && item.id === nextPrayer.id && !item.isPassed) {
      item.isNext = true;
    }
    if (currentPrayer && item.id === currentPrayer.id) {
      item.isCurrent = true;
    }
  });

  // Calculate remaining time
  const msRemaining = Math.max(0, nextPrayer.date.getTime() - now.getTime());
  const hoursRemaining = Math.floor(msRemaining / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const secondsRemaining = Math.floor((msRemaining % (1000 * 60)) / 1000);

  const timeRemainingToNext = `${hoursRemaining > 0 ? `${hoursRemaining}h ` : ""}${minutesRemaining}m ${secondsRemaining}s`;

  // Calculate day progress percentage
  const dayStart = fajrDate.getTime();
  const dayEnd = ishaDate.getTime();
  const progressPercentage = Math.min(
    100,
    Math.max(0, ((now.getTime() - dayStart) / (dayEnd - dayStart)) * 100)
  );

  return {
    fajr: formatTimeStr(fajrDate),
    sunrise: formatTimeStr(sunriseDate),
    dhuhr: formatTimeStr(dhuhrDate),
    asr: formatTimeStr(asrDate),
    maghrib: formatTimeStr(maghribDate),
    isha: formatTimeStr(ishaDate),
    qiyam: formatTimeStr(qiyamDate),
    items,
    nextPrayer,
    timeRemainingToNext,
    progressPercentage,
  };
}

/**
 * Hijri (Islamic Lunar) Calendar Converter with adjustment offset
 */
export function getHijriDate(date: Date, adjustmentDays: number = 0): HijriDateInfo {
  const adjusted = new Date(date);
  adjusted.setDate(adjusted.getDate() + adjustmentDays);

  const day = adjusted.getDate();
  const month = adjusted.getMonth();
  const year = adjusted.getFullYear();

  // Umm al-Qura algorithmic approximation
  let m = month + 1;
  let y = year;
  if (m < 3) {
    y -= 1;
    m += 12;
  }

  let a = Math.floor(y / 100);
  let b = 2 - a + Math.floor(a / 4);
  if (y < 1583) b = 0;
  if (y === 1582) {
    if (m > 10) b = -10;
    if (m === 10) {
      b = 0;
      if (day > 4) b = -10;
    }
  }

  const jd =
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    b -
    1524;

  let bJd = jd;
  if (jd > 2299160) {
    const aa = Math.floor((jd - 1867216.25) / 36524.25);
    bJd = jd + 1 + aa - Math.floor(aa / 4);
  }

  const bb = bJd + 1524;
  const cc = Math.floor((bb - 122.1) / 365.25);
  const dd = Math.floor(365.25 * cc);
  const ee = Math.floor((bb - dd) / 30.6001);

  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const lPrime = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - lPrime) / 5316) * Math.floor((50 * lPrime) / 17719) +
    Math.floor(lPrime / 5670) * Math.floor((43 * lPrime) / 15238);
  const lDoublePrime =
    lPrime -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const hijriMonth = Math.floor((24 * lDoublePrime) / 709);
  const hijriDay = lDoublePrime - Math.floor((709 * hijriMonth) / 24);
  const hijriYear = 30 * n + j - 30;

  const HIJRI_MONTHS = [
    "Muharram",
    "Safar",
    "Rabi' al-Awwal",
    "Rabi' al-Thani",
    "Jumada al-Ula",
    "Jumada al-Akhirah",
    "Rajab",
    "Sha'ban",
    "Ramadan",
    "Shawwal",
    "Dhu al-Qi'dah",
    "Dhu al-Hijjah",
  ];

  const HIJRI_MONTHS_ARABIC = [
    "مُحَرَّم",
    "صَفَر",
    "رَبِيع الأوَّل",
    "رَبِيع الآخِر",
    "جُمَادَى الأُولَى",
    "جُمَادَى الآخِرَة",
    "رَجَب",
    "شَعْبَان",
    "رَمَضَان",
    "شَوَّال",
    "ذُو القَعْدَة",
    "ذُو الحِجَّة",
  ];

  const monthIdx = Math.max(0, Math.min(11, hijriMonth - 1));
  const safeDay = Math.max(1, Math.min(30, hijriDay));

  return {
    day: safeDay,
    monthName: HIJRI_MONTHS[monthIdx] || "Ramadan",
    monthNameArabic: HIJRI_MONTHS_ARABIC[monthIdx] || "رَمَضَان",
    year: hijriYear || 1448,
    formatted: `${safeDay} ${HIJRI_MONTHS[monthIdx]} ${hijriYear} AH`,
    formattedArabic: `${safeDay} ${HIJRI_MONTHS_ARABIC[monthIdx]} ${hijriYear} هـ`,
  };
}

/**
 * Kaaba coordinates in Makkah
 */
export const KAABA_COORDINATES = {
  lat: 21.422487,
  lng: 39.826206,
};

/**
 * Calculate Great Circle Qibla bearing from user coordinates
 */
export function calculateQiblaDirection(userLat: number, userLng: number): {
  bearingDegrees: number;
  distanceKm: number;
  distanceMiles: number;
} {
  const phi1 = d2r(userLat);
  const lambda1 = d2r(userLng);
  const phi2 = d2r(KAABA_COORDINATES.lat);
  const lambda2 = d2r(KAABA_COORDINATES.lng);

  const deltaLambda = lambda2 - lambda1;

  // Bearing equation
  const y = Math.sin(deltaLambda);
  const x =
    Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);
  let bearing = r2d(Math.atan2(y, x));
  bearing = (bearing + 360) % 360;

  // Haversine formula for distance
  const R = 6371; // Earth radius in km
  const deltaPhi = phi2 - phi1;
  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.round(R * c);
  const distanceMiles = Math.round(distanceKm * 0.621371);

  return {
    bearingDegrees: Math.round(bearing * 10) / 10,
    distanceKm,
    distanceMiles,
  };
}
