import React from 'react';
import {AbsoluteFill} from 'remotion';
import {theme} from './theme';

export const PaperBackground: React.FC<{dark?: boolean}> = ({dark = false}) => (
  <AbsoluteFill
    style={{
      backgroundColor: dark ? theme.colors.dark : theme.colors.paper,
      color: dark ? theme.colors.white : theme.colors.ink,
      fontFamily: theme.font.sans,
      overflow: 'hidden',
    }}
  >
    <AbsoluteFill
      style={{
        opacity: dark ? 0.05 : 0.13,
        backgroundImage:
          'repeating-linear-gradient(0deg, transparent 0, transparent 47px, rgba(29,37,44,0.16) 48px)',
      }}
    />
  </AbsoluteFill>
);
