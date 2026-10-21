import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from './theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = interpolate(frame, [0.35 * fps, 1.1 * fps], [0, 1], clamp);
  const y = interpolate(frame, [0.35 * fps, 1.1 * fps], [22, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(145deg, #111722 0%, #202538 55%, #172231 100%)',
        color: theme.colors.white,
        fontFamily: theme.font.sans,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 45,
      }}
    >
      <div style={{maxWidth: 520, opacity, transform: `translateY(${y}px)`}}>
        <div style={{fontSize: 69, fontWeight: 900, color: theme.colors.white}}>感谢观看</div>
        <div style={{marginTop: 18, fontSize: 63}}>敬请期待</div>
        <div style={{marginTop: 34, fontFamily: theme.font.mono, fontSize: 23, color: 'rgba(255,255,255,0.65)'}}>STAY CURIOUS · KEEP LOOKING</div>
      </div>
    </AbsoluteFill>
  );
};
