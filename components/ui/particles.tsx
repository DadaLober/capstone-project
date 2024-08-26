// components/ParticleBackground.tsx

import React from 'react';
import Particles from 'react-tsparticles';
import { ISourceOptions } from 'tsparticles-engine';

const particleOptions: ISourceOptions = {
    particles: {
        number: {
        value: 1000,
        },
        color: {
        value: '#ffffff',
        },
        shape: {
        type: 'circle',
        },
        size: {
        value: 1,
        random: true,
        },
        opacity: {
        value: 0.5,
        random: true,
        },
        move: {
        enable: false,
        },
    },
    retina_detect: true,
};

const ParticleBackground: React.FC = () => {
  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, overflow: 'hidden' }}>
      <Particles options={particleOptions} />
    </div>
  );
};

export default ParticleBackground;
