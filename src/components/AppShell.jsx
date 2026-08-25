'use client';

import { usePathname } from 'next/navigation';
import TopAppBar from './TopAppBar';
import BottomTabBar from './BottomTabBar';

export default function AppShell({ children }) {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return children;

  return (
    <div style={shell}>
      <TopAppBar />
      {children}
      <BottomTabBar />
    </div>
  );
}

const shell = {
  minHeight: 'var(--app-viewport-height)',
  // In fullscreen Telegram draws its native controls over the web viewport.
  // Begin application chrome below the content-safe region it reports.
  paddingTop: 'var(--app-content-safe-area-top)',
  background: 'var(--color-bg)',
};
