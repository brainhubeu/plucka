import { groupBy } from 'lodash';
import z from 'zod';
import { endOfDay, startOfDay, format } from 'date-fns';

import { config } from '../../config';
import { QUERY_KEYS, useCustomQuery } from './index';

type UseHistoricalAirPollution = {
  dateStart: Date;
  dateEnd?: Date;
  longitude: number;
  latitude: number;
};

const MAX_AIR_QUALITY_SUM = 22_000;

const airPollutionSchema = z.object({
  coord: z.object({
    lon: z.number(),
    lat: z.number(),
  }),
  list: z.array(
    z.object({
      main: z.object({
        aqi: z.number().min(1).max(5),
      }),
      components: z.object({
        co: z.number(),
        no: z.number(),
        no2: z.number(),
        o3: z.number(),
        so2: z.number(),
        pm2_5: z.number(),
        pm10: z.number(),
        nh3: z.number(),
      }),
      dt: z.number(),
    }),
  ),
});

export const foundLocationSchema = z.object({
  name: z.string(),
  local_names: z.record(z.string()).optional(),
  lat: z.number(),
  lon: z.number(),
  country: z.string(),
  state: z.string().optional(),
});

export const useHistoricalAirPollution = (
  params: UseHistoricalAirPollution,
) => {
  const start = startOfDay(params.dateStart).getTime() / 1000;
  const end = Math.floor(
    endOfDay(params.dateEnd || new Date()).getTime() / 1000,
  );

  return useCustomQuery(
    [
      QUERY_KEYS.OPEN_WEATHER_HISTORICAL,
      start,
      end,
      params.longitude,
      params.latitude,
    ],
    {
      url: 'https://api.openweathermap.org/data/2.5/air_pollution/history',
      params: {
        appid: config.openWeatherApiKey,
        lat: params.latitude,
        lon: params.longitude,
        start,
        end,
      },
    },
    airPollutionSchema,
  );
};

export const useSummarizedHistoricalAirPollution = (
  params: UseHistoricalAirPollution,
) => {
  const { data } = useHistoricalAirPollution(params);

  const result = groupBy(data?.list ?? [], (item) =>
    format(new Date(item.dt * 1000), 'dd.MM.yyyy'),
  );

  const airQualitySum = Object.values(result).reduce((acc, items) => {
    return (
      acc +
      items.reduce(
        (acc, item) => acc + item.components.pm10,
        0,
      )
    );
  }, 0);
  return Math.min(airQualitySum, MAX_AIR_QUALITY_SUM) / MAX_AIR_QUALITY_SUM;
};

type UseCurrentAirPollutionParams = {
  longitude: number;
  latitude: number;
};

export const AQI_NAMES: Record<any, any> = {
  LOADING: 'Loading...',
  1: 'Good',
  2: 'Fair',
  3: 'Moderate',
  4: 'Bad',
  5: 'Terrible',
};

export const useCurrentAirPollution = ({
  longitude,
  latitude,
}: UseCurrentAirPollutionParams) =>
  useCustomQuery(
    [QUERY_KEYS.OPEN_WEATHER_CURRENT_POLLUTION, { longitude, latitude }],
    {
      url: 'https://api.openweathermap.org/data/2.5/air_pollution',
      params: {
        appid: config.openWeatherApiKey,
        lat: latitude,
        lon: longitude,
      },
    },
    airPollutionSchema,
  );

type UseSearchLocationProps = {
  query: string;
};
export const useSearchLocation = ({ query }: UseSearchLocationProps) =>
  useCustomQuery(
    [QUERY_KEYS.OPEN_WEATHER_LOCATION_SEARCH, query],
    {
      url: 'https://api.openweathermap.org/geo/1.0/direct',
      params: {
        appid: config.openWeatherApiKey,
        q: query,
      },
    },
    foundLocationSchema.array(),
    {
      enabled: !!query,
      placeholderData: [],
    },
  );
