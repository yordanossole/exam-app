'use client';

import { AppProvider } from '../context/AppContext';
import { ThemeProvider } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppProvider>{children}</AppProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
