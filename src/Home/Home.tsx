import React, { useState } from 'react';

import Layout from '../Layout';
import {
  Box,
  Grid,
  Button,
  Image,
  Stack,
  Text,
  Title,
  Transition,
  Container,
  Group,
  useMantineColorScheme,
  TextInput,
} from '@mantine/core';
import dateSubtract from 'date-fns/sub';

import { getAQI, getAssetUrl } from './airQuality';
import { useAirQuality } from '../shared/queries/airQuality';

import Game from '../Game/Game';
import { LocationSelect } from './LocationSelect';
import {
  AQI_NAMES,
  useCurrentAirPollution,
  useSummarizedHistoricalAirPollution,
} from '../shared/queries/openWeather';

import { Plucka } from './Plucka';

const scaleYLungs = {
  in: { opacity: 1, transform: 'scaleY(1)' },
  out: { opacity: 0, transform: 'scaleY(0)' },
  common: { transformOrigin: 'top' },
  transitionProperty: 'transform, opacity',
};
const scaleYGame = {
  in: { opacity: 1, transform: 'scaleY(1)' },
  out: { opacity: 0, transform: 'scaleY(0)' },
  common: { transformOrigin: 'bottom' },
  transitionProperty: 'transform, opacity',
};

export default function Home() {
  const [location, setLocation] = useState({
    label: 'Kraków',
    value: JSON.stringify({
      latitude: 50.06143,
      longitude: 19.93658,
    }),
  });

  const locationDecoded = JSON.parse(location.value) as {
    latitude: number;
    longitude: number;
  };

  const { data: currentAirPollution } = useCurrentAirPollution(locationDecoded);
  const tempAirQuality = useSummarizedHistoricalAirPollution({
    ...locationDecoded,
    dateStart: dateSubtract(new Date(), { weeks: 2 }),
    dateEnd: new Date(),
  });

  const { colorScheme } = useMantineColorScheme();
  const [gameShown, setGameShown] = useState(false);

  return (
    <Stack mih="100%" gap={0}>
      <Box h="60px" pt="10px" style={{ borderBottom: '1px solid #0F12191A' }}>
        <Container fluid>
          <Image h="40px" w="auto" src={getAssetUrl('logo')} />
        </Container>
      </Box>
      <Grid styles={{ root: { flexGrow: 1 }, inner: { minHeight: '100%' } }} gutter={0}>
        <Grid.Col
          span={{ base: 12, md: 8 }}
          order={{ base: 1, md: 2 }}
          style={{
            boxShadow: 'inset 6px 6px 10px 0px rgba(0,0,0,0.2)',
            backgroundColor: gameShown ? 'rgb(58, 68, 102)' : '#8DAABBCC',
            ...(gameShown ? { padding: 0 } : {}),
          }}
        >
          <Transition
            mounted={!gameShown}
            transition={scaleYLungs}
            duration={200}
            timingFunction="ease"
          >
            {(transitionStyle) => (
              <Container fluid style={{ ...transitionStyle, zIndex: 1, height: '100%' }}  p={0}>
                <Plucka
                  location={location}
                  setLocation={setLocation}
                  colorScheme={colorScheme}
                  currentAirPollution={currentAirPollution}
                  tempAirQuality={tempAirQuality}
                />
              </Container>
            )}
          </Transition>
          <Transition
            mounted={gameShown}
            transition={scaleYGame}
            duration={200}
            timingFunction="ease"
          >
            {(transitionStyle) => (
              <Box style={{ ...transitionStyle, zIndex: 2, width: '100%' }}>
                <Game
                  lungsDeteriorationLevel={Math.round((tempAirQuality * 4) + 1)}
                  onCloseGame={() => setGameShown(false)}
                />
              </Box>
            )}
          </Transition>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }} order={{ base: 2, md: 1 }}>
          <Stack style={{ flexGrow: 1 }} p="md" h="100%">
            <Stack style={{ flexGrow: 1 }} px="xl" justify="center" gap="xl">
              <Title order={2}>You are what you breath in</Title>
              <Text ta="justify">
                These are your lungs at the moment. That’s how
                accumulated air pollution from past two weeks is affecting your
                health.
              </Text>
              <Text ta="justify">
                Our mission is to combat air pollution by utilizing technology
                and raising awareness. We aim to reach millions to drive action,
                advocating the replacement of old stoves and home insulation
                after severe smog seasons. 'Smoke-belching' coal and wood
                boilers contribute to 78% of harmful PM2.5 emissions nationwide.
              </Text>
              <Text ta="justify">
                At Polski Alarm Smogowy, our focus lies in mitigating harmful
                emissions and promoting healthier environments. Now you can join
                us in our commitment to fostering cleaner air and better health
                for everyone.
              </Text>
              <Button color="#E16070" onClick={() => setGameShown(!gameShown)}>
                {gameShown ? 'Close the game' : 'Play the game'}
              </Button>
            </Stack>
            <Stack>
              <Text ta="center">Supporting us:</Text>
              <Image src={getAssetUrl('logos')}></Image>
            </Stack>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
