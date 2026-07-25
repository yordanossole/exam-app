'use client';

import TopAppBar from './TopAppBar';
import BottomTabBar from './BottomTabBar';

export default function AppShell({ children }) {
  return (
    <div style={shell}>
      <TopAppBar />
      {children}
      <BottomTabBar />
    </div>
  );
}

const shell = {
  minHeight: '100dvh',
  background: 'var(--color-bg)',
};
