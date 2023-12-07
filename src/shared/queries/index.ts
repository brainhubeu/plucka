import axios, { AxiosRequestConfig } from 'axios';
import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ZodType } from 'zod';


const defaultOptions = {
  refetchOnWindowFocus: false,
  staleTime: 2 * 60 * 1000, // 2 minutes
}
export const useCustomQuery = <TQueryFnData = unknown, TError = unknown, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(
  key: TQueryKey,
  axiosParams: AxiosRequestConfig,
  schema?: ZodType<TQueryFnData> | null,
  options: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'> = {}
) => {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data } = await axios({
        ...axiosParams,
      });
      if (!schema) {
        return data;
      }
      return schema.parseAsync(data).catch(error => {
        console.error(error);
        throw error;
      });
    },
    ...defaultOptions,
    ...options,
  });
}

export const QUERY_KEYS = {
  AIR_QUALITY: 'airQuality',
  OPEN_WEATHER_HISTORICAL: 'openWeatherHistorical',
  OPEN_WEATHER_CURRENT_POLLUTION: 'openWeatherCurrentPolution',
  OPEN_WEATHER_LOCATION_SEARCH: 'openWeatherLocationSearch',
  EXAMPLE: 'example',
};

