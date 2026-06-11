export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  midnight: string;
  third_night: string;
}

export interface PrayerResponse {
  location: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
  date: {
    gregorian: string;
    hijri: string;
  };
  method: {
    name: string;
    madhab: string;
    high_lat?: string;
  };
  times: PrayerTimes;
}

export interface PrayerAPIResponse {
  status: string;
  data: PrayerResponse;
}
