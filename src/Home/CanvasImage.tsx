import { Container } from '@mantine/core';
import React, { useEffect, useRef } from 'react';
import { getAssetUrl } from './airQuality';

let logged = 0;
function darkenCenter(context, centerX, centerY, maxDarkeningLevel, radius, grainAmount) {
  const imgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
  const pixels = imgData.data;

  for (let y = 0; y < context.canvas.height; y++) {
    for (let x = 0; x < context.canvas.width; x++) {
      const i = (y * context.canvas.width + x) * 4;

      // Calculate the distance from the center of the lung
      const dx = centerX - x;
      const dy = centerY - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Normalize the distance based on the radius
      const normalizedDistance = distance / radius;


      // Calculate the darkening effect based on the distance
      const darkeningEffect = maxDarkeningLevel * (1 - Math.min(1, normalizedDistance));

      if (logged++ < 50) {
        console.log('distance', normalizedDistance);
      }

      // Apply the darkening effect to the pixel
      pixels[i] -= darkeningEffect;     // Red
      pixels[i + 1] -= darkeningEffect; // Green
      pixels[i + 2] -= darkeningEffect; // Blue
      // Alpha channel (i + 3) remains unchanged

      // Add grain effect
      const grain = Math.random() * grainAmount - grainAmount / 2;
      pixels[i] += grain;     // Red
      pixels[i + 1] += grain; // Green
      pixels[i + 2] += grain; // Blue
    }
  }

  context.putImageData(imgData, 0, 0);
}

const renderCanvasImage = (canvas: HTMLCanvasElement | null, src: string) => {
  const context = canvas?.getContext('2d');
  if (!canvas || !context) {
    return;
  }
  const image = new Image();
  image.src = src;
  image.onload = function() {
    canvas.width = image.width;
    canvas.height = image.height;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0);

    const centerX1 = context.canvas.width * 0.30;
    const centerX2 = context.canvas.width * 0.75;
    const centerY = context.canvas.height * 0.65;
    const maxDarkeningLevel = 200; // The maximum level of darkening at the center of the lung
    const radius = 400; // The radius of the effect from the center of the lung
    const grainAmount = 60; // The amount of grain to add to the image

    darkenCenter(context, centerX1, centerY, maxDarkeningLevel, radius, grainAmount);
    // darkenCenter(context, centerX2, centerY, maxDarkeningLevel, radius);
  };
};


export const CanvasImage = ({ src }: { src: string }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    renderCanvasImage(canvasRef.current, getAssetUrl('plucka'));
  }, []);

  return (
    <Container>
      <canvas style={{ width: '100%' }} ref={canvasRef} id="lungs-canvas" />
    </Container>
  );
}
