import React from 'react';
import {PaperBackground} from './PaperBackground';
import {theme} from './theme';

export const EditorialFrame: React.FC<{
  label: string;
  title: React.ReactNode;
  accent?: string;
  footerLeft?: string;
  footerRight?: string;
  children: React.ReactNode;
}> = ({label, title, accent = theme.colors.coral, footerLeft, footerRight, children}) => (
  <>
    <PaperBackground />
    <div style={{position: 'absolute', inset: 0, padding: '184px 64px 280px'}}>
      <div style={{color: accent, fontFamily: theme.font.mono, fontSize: 18, fontWeight: 800}}>{label}</div>
      <h1
        style={{
          maxWidth: 930,
          margin: '25px 0 0',
          color: theme.colors.ink,
          fontFamily: theme.font.display,
          fontSize: 72,
          fontWeight: 700,
          lineHeight: 1.14,
          textWrap: 'balance',
        }}
      >
        {title}
      </h1>
      {children}
    </div>
    {(footerLeft || footerRight) && (
      <div
        style={{
          position: 'absolute',
          top: 1380,
          left: 64,
          right: 64,
          paddingTop: 17,
          borderTop: `1px solid ${theme.colors.line}`,
          display: 'flex',
          justifyContent: 'space-between',
          color: theme.colors.muted,
          fontFamily: theme.font.mono,
          fontSize: 16,
        }}
      >
        <span>{footerLeft}</span>
        <span>{footerRight}</span>
      </div>
    )}
  </>
);
