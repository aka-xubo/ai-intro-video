import React from 'react';
import {AbsoluteFill} from 'remotion';
import {PaperBackground} from './PaperBackground';
import {theme} from './theme';

export const Cover: React.FC = () => (
  <AbsoluteFill>
    <PaperBackground />
    <div style={{position: 'absolute', inset: 0, padding: '90px 72px'}}>
      <div style={{marginTop: 210, color: theme.colors.coral, fontFamily: theme.font.mono, fontSize: 24, fontWeight: 800}}>ONE TOPIC · ONE CLEAR STORY</div>
      <h1 style={{margin: '32px 0 0', fontFamily: theme.font.display, fontSize: 132, lineHeight: 1.05, color: theme.colors.ink}}>
        今天聊：<br /><span style={{color: theme.colors.coral}}>什么是 RAG？</span>
      </h1>
      <p style={{margin: '54px 0 0', maxWidth: 820, fontFamily: theme.font.sans, fontSize: 39, lineHeight: 1.5, color: theme.colors.muted}}>
        用一个具体问题，把复杂概念讲清楚
      </p>

      <div style={{position: 'absolute', top: 1380, left: 72, right: 72, paddingTop: 17, borderTop: `1px solid ${theme.colors.line}`, display: 'flex', justifyContent: 'space-between', color: theme.colors.muted, fontFamily: theme.font.mono, fontSize: 16}}>
        <span>WARM EDITORIAL · EVIDENCE FIRST</span>
        <span>COVER</span>
      </div>
    </div>
  </AbsoluteFill>
);
