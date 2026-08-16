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
  minHeight: '100dvh',
  background: 'var(--color-bg)',
};
