import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { runGame } from './runGame';
import { useSmartEffect } from '../shared/utility/useSmartEffect';
import { Box, Modal, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

type GameProps = {
  lungsDeteriorationLevel: number;
  onCloseGame: () => void;
};
export default function Game({ lungsDeteriorationLevel, onCloseGame }: GameProps) {
  const [won, { open: openWin, close: closeWin }] = useDisclosure(false);
  const [lost, { open: openLost, close: closeLost }] = useDisclosure(false);

  const handleCloseWin = useCallback(() => {
    closeWin();
    onCloseGame();
  }, [onCloseGame, closeWin]);
  const handleCloseLost = useCallback(() => {
    closeLost();
    onCloseGame();
  }, [onCloseGame, closeLost]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number, height: number } | null>(null);

  useLayoutEffect(() => {
    setTimeout(() => {
      if (!dimensions && containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    }, 500);
  }, [dimensions]);
  useSmartEffect(() => {
    if (!dimensions) {
      return;
    }
    const quit = runGame('#game', {
      lungsDeteriorationLevel,
      width: dimensions.width,
      height: dimensions.height,
      onWin: () => openWin(),
      onLose: () => openLost(),
    });

    return () => quit();
  }, [lungsDeteriorationLevel, dimensions], [dimensions]);

  return <Box ref={containerRef} style={{ height: 'calc(100vh - 60px)', width: '100%' }}>
    {dimensions ? <canvas id="game"/> : null}
    <Modal opened={won} onClose={handleCloseWin} withCloseButton={false}>
      <Title order={2}>You won!</Title>
      <Text>Let's keep fighting and help us defeat the pollution!</Text>
    </Modal>
    <Modal opened={lost} onClose={handleCloseLost} withCloseButton={false}>
      <Title order={2}>You lost!</Title>
      <Text>But there's still hope! Keep fighting and help us defeat the pollution</Text>
    </Modal>
  </Box>
}
