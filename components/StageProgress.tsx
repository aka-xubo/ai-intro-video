import React from 'react';
import {theme} from './theme';

export interface StageProgressItem {
  number: string;
  title: string;
  color: string;
}

export const StageProgress: React.FC<{stages: StageProgressItem[]; current: number}> = ({stages, current}) => (
  <div
    style={{
      position: 'absolute',
      top: 48,
      left: 64,
      right: 64,
      height: 96,
      display: 'grid',
      gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))`,
      borderTop: `1px solid ${theme.colors.line}`,
      borderBottom: `1px solid ${theme.colors.line}`,
      backgroundColor: 'rgba(255,253,248,0.76)',
      zIndex: 4,
    }}
  >
    {stages.map((stage, index) => {
      const active = index < current;
      return (
        <div
          key={stage.number}
          style={{
            minWidth: 0,
            padding: '17px 18px',
            borderRight: index < stages.length - 1 ? `1px solid ${theme.colors.line}` : undefined,
            borderTop: active ? `4px solid ${stage.color}` : '4px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            opacity: active ? 1 : 0.42,
          }}
        >
          <span style={{fontFamily: theme.font.mono, fontSize: 18, color: active ? stage.color : theme.colors.muted}}>{stage.number}</span>
          <strong style={{minWidth: 0, fontFamily: theme.font.sans, fontSize: 20, whiteSpace: 'nowrap'}}>{stage.title}</strong>
        </div>
      );
    })}
  </div>
);
