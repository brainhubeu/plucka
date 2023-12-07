import z from 'zod';
import { QUERY_KEYS, useCustomQuery } from './index';
import { config } from '../../config';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const airQualitySchema = z.object({
  city_name: z.string(),
  country_code: z.string(),
  data: z.array(
    z.object({
      aqi: z.number(),
      co: z.number(),
      mold_level: z.number(),
      no2: z.number(),
      o3: z.number(),
      pm10: z.number(),
      pm25: z.number(),
      pollen_level_grass: z.number(),
      pollen_level_tree: z.number(),
      pollen_level_weed: z.number(),
      predominant_pollen_type: z.string(),
      so2: z.number(),
    }),
  ),
  lat: z.number(),
  lon: z.number(),
  state_code: z.string(),
  timezone: z.string(),
});
// export const useAirQuality = (enabled = true) =>
//   useCustomQuery(
//     [QUERY_KEYS.EXAMPLE],
//     {
//       url: '/current/airquality',
//       baseURL: 'https://air-quality.p.rapidapi.com',
//       method: 'GET',
//       params: {
//         lon: '18.665462',
//         lat: '50.294074',
//       },
//       headers: {
//         'X-RapidAPI-Key': config.rapidApiKey,
//         'X-RapidAPI-Host': 'air-quality.p.rapidapi.com'
//       }
//     },
//     z.any(),
//     {
//       placeholderData: null,
//       enabled,
//     }
//   )

export const useAirQuality = (enabled = true) =>
  useQuery<z.infer<typeof airQualitySchema> | null>({
    queryKey: [QUERY_KEYS.EXAMPLE],
    queryFn: async () => {
      const data = {
        "city_name": "Gliwice",
        "country_code": "PL",
        "data": [
          {
            "aqi": 171,
            "co": 1211,
            "mold_level": 1,
            "no2": 111,
            "o3": 4,
            "pm10": 95,
            "pm25": 71.25,
            "pollen_level_grass": 1,
            "pollen_level_tree": 1,
            "pollen_level_weed": 1,
            "predominant_pollen_type": "Molds",
            "so2": 30
          }
        ],
        "lat": 50.2941,
        "lon": 18.6655,
        "state_code": "83",
        "timezone": "Europe/Warsaw"
      };

      return data;
    },
    placeholderData: null,
    enabled,
  })
