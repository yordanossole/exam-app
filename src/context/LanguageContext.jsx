'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { languages, translations } from '../i18n/translations';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'nt-exams-language';
const DEFAULT_LANGUAGE = 'en';

function interpolate(value, params) {
  return String(value).replace(/\{(\w+)\}/g, (match, key) => (
    Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : match
  ));
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (languages.some(item => item.code === stored)) setLanguageState(stored);
  }, []);

  useEffect(() => {
    const activeLanguage = languages.find(item => item.code === language);
    document.documentElement.lang = language;
    document.documentElement.dir = activeLanguage?.direction ?? 'ltr';
  }, [language]);

  const setLanguage = useCallback((nextLanguage) => {
    if (!languages.some(item => item.code === nextLanguage)) return;
    localStorage.setItem(STORAGE_KEY, nextLanguage);
    setLanguageState(nextLanguage);
  }, []);

  const t = useCallback((key, params = {}) => {
    const value = translations[language]?.[key] ?? translations[DEFAULT_LANGUAGE]?.[key] ?? key;
    return interpolate(value, params);
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, languages, t }), [language, setLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
