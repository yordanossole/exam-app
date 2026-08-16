'use client';

import { useLanguage } from '../context/LanguageContext';

export default function TranslatedText({ as: Component = 'span', id, params = {}, ...props }) {
  const { t } = useLanguage();
  return <Component {...props}>{t(id, params)}</Component>;
}
