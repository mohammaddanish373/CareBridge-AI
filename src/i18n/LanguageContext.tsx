import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SUPPORTED_LANGUAGES, LanguageInfo, getLanguage, DEFAULT_LANGUAGE } from './languages';
import { getTranslations, Translations } from './translations';

interface LanguageContextType {
  currentLanguage: LanguageInfo;
  setLanguage: (code: string) => void;
  t: Translations;
  dir: 'ltr' | 'rtl';
  isRTL: boolean;
  supportedLanguages: LanguageInfo[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [langCode, setLangCode] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('carebridge_lang') || sessionStorage.getItem('carebridge_lang');
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
      // Check browser language
      const browserLang = navigator.language?.slice(0, 2).toLowerCase();
      const match = SUPPORTED_LANGUAGES.find((l) => l.code === browserLang);
      if (match) return match.code;
    } catch (e) {
      console.warn('Storage unavailable for language:', e);
    }
    return DEFAULT_LANGUAGE;
  });

  const currentLanguage = getLanguage(langCode);
  const t = getTranslations(langCode);
  const dir = currentLanguage.dir;
  const isRTL = dir === 'rtl';

  useEffect(() => {
    try {
      localStorage.setItem('carebridge_lang', langCode);
      sessionStorage.setItem('carebridge_lang', langCode);
    } catch (e) {
      console.warn('Storage error:', e);
    }

    // Set document direction and lang attribute for accessibility and proper Urdu RTL rendering
    document.documentElement.dir = dir;
    document.documentElement.lang = langCode;
  }, [langCode, dir]);

  const setLanguage = (code: string) => {
    if (SUPPORTED_LANGUAGES.some((l) => l.code === code)) {
      setLangCode(code);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        dir,
        isRTL,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      <div dir={dir} className={isRTL ? 'rtl font-urdu' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
