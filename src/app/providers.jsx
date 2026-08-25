'use client';

import { AppProvider } from '../context/AppContext';
import { ThemeProvider } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';
import { TelegramProvider } from '../context/TelegramContext';

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppProvider>
          <TelegramProvider>{children}</TelegramProvider>
        </AppProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
