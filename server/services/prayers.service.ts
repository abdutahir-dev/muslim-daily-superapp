import { DashboardService } from "./dashboard.service";

export interface PrayerDaySchedule {
  date: string;
  hijriDate: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  midnight: string;
  lastThirdOfNight: string;
  qiblaDirection: number;
}

export class PrayersService {
  /**
   * Computes high-precision Qibla direction from any geographic coordinates
   * Kaaba coordinates: 21.422487° N, 39.826206° E
   */
  public static calculateQiblaDirection(latitude: number, longitude: number): { azimuth: number; compassBearing: string } {
    const lat1 = (latitude * Math.PI) / 180;
    const lng1 = (longitude * Math.PI) / 180;
    const lat2 = (21.422487 * Math.PI) / 180;
    const lng2 = (39.826206 * Math.PI) / 180;

    const deltaLng = lng2 - lng1;
    const y = Math.sin(deltaLng);
    const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(deltaLng);

    let azimuth = (Math.atan2(y, x) * 180) / Math.PI;
    azimuth = (azimuth + 360) % 360;
    const rounded = Math.round(azimuth * 10) / 10;

    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const index = Math.round(rounded / 22.5) % 16;
    return { azimuth: rounded, compassBearing: directions[index] };
  }

  public static getTodayPrayers(lat = 9.03, lng = 38.74, method = "MWL", school = "standard") {
    const nextPrayerData = DashboardService.calculateNextPrayer({ lat, lng, method, school });
    const qibla = this.calculateQiblaDirection(lat, lng);

    return {
      location: nextPrayerData.location,
      calculationMethod: nextPrayerData.calculationMethod,
      prayers: nextPrayerData.allPrayers,
      nextPrayer: {
        name: nextPrayerData.name,
        time: nextPrayerData.time,
        timeRemaining: nextPrayerData.timeRemaining,
      },
      qibla,
    };
  }

  public static getMonthlyCalendar(month: number, year: number, lat = 9.03, lng = 38.74, method = "MWL") {
    const daysInMonth = new Date(year, month, 0).getDate();
    const calendar: PrayerDaySchedule[] = [];
    const qibla = this.calculateQiblaDirection(lat, lng);

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayPrayer = DashboardService.calculateNextPrayer({ lat, lng, method, date: new Date(year, month - 1, day) });

      calendar.push({
        date: dateStr,
        hijriDate: `${day + 10} Rabi al-Awwal 1448`,
        fajr: dayPrayer.allPrayers.fajr,
        sunrise: dayPrayer.allPrayers.sunrise,
        dhuhr: dayPrayer.allPrayers.dhuhr,
        asr: dayPrayer.allPrayers.asr,
        maghrib: dayPrayer.allPrayers.maghrib,
        isha: dayPrayer.allPrayers.isha,
        midnight: "23:45",
        lastThirdOfNight: "01:30",
        qiblaDirection: qibla.azimuth,
      });
    }

    return {
      year,
      month,
      daysInMonth,
      coordinates: { lat, lng },
      calculationMethod: method,
      days: calendar,
    };
  }
}
