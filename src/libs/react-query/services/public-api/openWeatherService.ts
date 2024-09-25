// Convention: The file name should follow 'somethingServices
import type { AxiosResponse } from 'axios';
import axios from 'axios';
// OR import axios from '@libs/axios';

type WeatherData = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;  // Optional since some APIs may not return it
    grnd_level?: number; // Optional for the same reason
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number; // Optional as gust might not always be present
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export type GetOpenWeatherDataParams = {
  lat: string;
  lon: string;
}

export async function getOpenWeatherData({ lat, lon }: GetOpenWeatherDataParams): Promise<AxiosResponse<WeatherData>> {
  const servicePath = 'https://api.openweathermap.org/data/2.5/weather';

  // DEFAULT: FREE PLAN API KEY
  const apiKey = process.env.OPEN_WEATHER_API_KEY || '46f2a250d973903d403c8f49d22eb40f';

  return axios({
    method: 'GET',
    url: servicePath,
    params: {
      lat,
      lon,
      appid: apiKey,
    },
  });
}