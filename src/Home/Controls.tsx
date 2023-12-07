import {
  Box,
  Group,
  TextInput,
} from '@mantine/core';

import { LocationSelect } from './LocationSelect';
import {
  AQI_NAMES,
} from '../shared/queries/openWeather';


export const Controls = ({
  location,
  setLocation,
  colorScheme,
  currentAirPollution,
}: any) => {
  return (
    <Group
      py="xl"
      px="70px"
      bg={
        colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255,255,255,0.3)'
      }
      gap="xl"
      style={{
        gridColumn: 1,
        gridRow: 1,
        justifySelf: 'start',
        alignSelf: 'start',
        zIndex: 100,
        width: '100%',
      }}
    >
      <Box miw={200}>
        <LocationSelect
          value={location}
          onChange={setLocation}
          label={'Your location'}
        />
      </Box>
      <Box miw={200}>
        <TextInput
          readOnly
          label="Current air quality"
          value={
            AQI_NAMES[currentAirPollution?.list?.[0]?.main.aqi ?? 'LOADING']
          }
        />
      </Box>
    </Group>
  );
};
