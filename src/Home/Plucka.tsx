import React, { useState } from 'react';

import { motion } from 'framer-motion';
import { Center } from '@mantine/core';
import { Controls } from './Controls';



const Clouds = ({
  airQualityCoeff
}: {
  airQualityCoeff: number;
}) => {
  console.log('airQualityCoeff', airQualityCoeff);

  return (
    <>
      <div
        style={{
          gridColumn: 1,
          gridRow: 1,
          maxWidth: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <motion.img
          src="/clouds/BL.png"
          animate={{
            x: [0, 200*airQualityCoeff],
            y: [0, -200*airQualityCoeff],
          }}
          transition= {{
            duration: 5,
            repeat: 0,
          }}
          style={{
            opacity: 0.8,
            position: 'absolute',
            left: '-40%',
            bottom: '-40%',
            scale: 0.8,
          }}
        />
      </div>

      <div
        style={{
          gridColumn: 1,
          gridRow: 1,
          maxWidth: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <motion.img
          src="/clouds/CL1.png"
          animate={{
            x: [0, 200*airQualityCoeff],
            rotate: [90, 90, 90],
          }}
          transition={{
            duration: 5,
            repeat: 0,
          }}
          style={{
            opacity: 0.8,
            position: 'absolute',
            top: '10%',
            left: '-80%',
            scale: 0.8,
          }}
        />
      </div>
      <div
        style={{
          gridColumn: 1,
          gridRow: 1,
          maxWidth: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <motion.img
          src="/clouds/BC.png"
          animate={{
            y: [0, -200*airQualityCoeff],
          }}

          transition={{
            duration: 5,
            repeat: 0,
          }}
          style={{
            opacity: 0.8,
            position: 'absolute',
            bottom: '-30%',
            left: '0%',
            scale: 0.8,
          }}
        />
      </div>
      <div
        style={{
          gridColumn: 1,
          gridRow: 1,
          maxWidth: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <motion.img
          src="/clouds/BR1.png"
          animate={{
            y: [0, -170*airQualityCoeff],
            x: [0, -170*airQualityCoeff],
          }}
          transition={{
            duration: 5,
          }}
          style={{
            opacity: 0.8,
            position: 'absolute',
            bottom: '-30%',
            right: '-30%',
            scale: 0.8,
          }}
        />
      </div>

      <div
        style={{
          gridColumn: 1,
          gridRow: 1,
          maxWidth: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <motion.img
          src="/clouds/CR1.png"
          animate={{
            x: [0, -200*airQualityCoeff],
          }}
          transition={{
            duration: 5,
            repeat: 0,
          }}
          style={{
            opacity: 0.8,
            position: 'absolute',
            top: '0%',
            right: '-30%',
            scale: 0.8,
          }}
        />
      </div>

      <div
        style={{
          gridColumn: 1,
          gridRow: 1,
          maxWidth: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <motion.img
          src="/clouds/TR.png"
          animate={{
            x: [0, -200*airQualityCoeff],
            y: [0, 200*airQualityCoeff],
          }}
          transition={{
            duration: 5,
            repeat: 0,
          }}
          
          style={{
            opacity: 0.8,
            position: 'absolute',
            top: '-40%',
            right: '-40%',
            scale: 0.8,
          }}
        />
      </div>

      <div
        style={{
          gridColumn: 1,
          gridRow: 1,
          maxWidth: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <motion.img
          src="/clouds/TC.png"
          animate={{
            y: [0, 150*airQualityCoeff],
          }}
          transition={{
            duration: 5,
            repeat: 0,
          }}
          style={{
            opacity: 0.8,
            position: 'absolute',
            top: '-50%',
            left: '0%',
            scale: 0.8,
          }}
        />
      </div>
      <div
        style={{
          gridColumn: 1,
          gridRow: 1,
          maxWidth: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <motion.img
          src="/clouds/TC2.png"
          animate={{
            y: [0, 200*airQualityCoeff],
          }}
          transition={{
            duration: 5,
            repeat: 0,
          }}
          style={{
            opacity: 0.8,
            position: 'absolute',
            top: '-40%',
            left: '20%',
            scale: 0.8,
          }}
        />
      </div>

      <div
        style={{
          gridColumn: 1,
          gridRow: 1,
          maxWidth: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <motion.img
          src="/clouds/TL.png"
          animate={{
            y: [0, 150*airQualityCoeff],
            x: [0, 150*airQualityCoeff],
          }}
          transition={{
            duration: 5,
            repeat: 0,
          }}
          style={{
            opacity: 0.8,
            position: 'absolute',
            top: '-35%',
            left: '-35%',
            scale: 0.8,
          }}
        />
      </div>
    </>
  );
};

const aqiToAirQualityCoeff = (aqi: number) => (aqi - 1) / 4

export const Plucka = ({
  tempAirQuality,
  location,
  setLocation,
  colorScheme,
  currentAirPollution,
}: any) => {
  const aqi = currentAirPollution?.list?.[0]?.main.aqi || 1;
  return (
    <Center style={{ minHeight: '100%', flexDirection: 'column'  }} p={0}>
      <div style={{ width: '100%', display: 'grid', minHeight: '100%', flexGrow: 1, }}>
        <Controls
          location={location}
          setLocation={setLocation}
          colorScheme={colorScheme}
          currentAirPollution={currentAirPollution}
        />
        <Clouds airQualityCoeff={aqiToAirQualityCoeff(aqi)}  />
        <motion.img
          animate={{
            scaleY: [1, 1.01, 1.01, 1],
            transition: {
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.48, 0.52, 1],
            },
          }}
          src="/assets/gardelko_good.png"
          style={{
            width: '40%',
            gridColumn: 1,
            gridRow: 1,
            justifySelf: 'center',
            alignSelf: 'center',
          }}
        />
        <motion.img
          animate={{
            scaleY: [1, 1.01, 1.01, 1],
            transition: {
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.48, 0.52, 1],
            },
          }}
          src="/assets/gardelko_bad.png"
          style={{
            width: '40%',
            gridColumn: 1,
            gridRow: 1,
            opacity: tempAirQuality,
            justifySelf: 'center',
            alignSelf: 'center',
          }}
        />
        <motion.img
          animate={{
            scaleY: [1, 1.05, 1.05, 1],
            scaleX: [1, 1.1, 1.1, 1],
            transition: {
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.48, 0.52, 1],
            },
          }}
          src="/assets/plucka_good.png"
          style={{
            width: '40%',
            gridColumn: 1,
            gridRow: 1,
            justifySelf: 'center',
            alignSelf: 'center',
          }}
        />
        <motion.img
          animate={{
            scaleY: [1, 1.05, 1.05, 1],
            scaleX: [1, 1.1, 1.1, 1],
            transition: {
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.48, 0.52, 1],
            },
          }}
          src="/assets/plucka_bad.png"
          style={{
            width: '40%',
            gridColumn: 1,
            gridRow: 1,
            opacity: tempAirQuality,
            justifySelf: 'center',
            alignSelf: 'center',
          }}
        />
        <div
          style={{
            gridColumn: 1,
            gridRow: 1,
            maxWidth: '100%',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              background: `
            radial-gradient(20% 20% at 50% 50%, rgba(247, 160, 175, 0.6) 0%, rgba(159, 208, 226, 0.00) 100%),
            radial-gradient(30% 15% at 30% 82%, rgba(27, 35, 48, 0.2) 0%, rgba(159, 208, 226, 0.00) 100%),
            radial-gradient(30% 15% at 70% 82%, rgba(27, 35, 48, 0.2) 0%, rgba(159, 208, 226, 0.00) 100%)
            `,
            }}
          />
        </div>
      </div>
    </Center>
  );
};
