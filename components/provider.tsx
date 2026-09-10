'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { defaultLocale, type SupportedLocale } from '@/lib/i18n';

export type SupportedTheme = 'light' | 'dark' | 'system';

interface I18nContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  activeLanguage: 'curl' | 'go' | 'typescript';
  setActiveLanguage: (lang: 'curl' | 'go' | 'typescript') => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  theme: SupportedTheme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: SupportedTheme) => void;
  toggleTheme: () => void;
}

const I18nContext = createContext<I18nContextType>({
  locale: defaultLocale,
  setLocale: () => {},
  activeLanguage: 'curl',
  setActiveLanguage: () => {},
  isSearchOpen: false,
  setIsSearchOpen: () => {},
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
});

export function usePortalI18n() {
  return useContext(I18nContext);
}

export function Provider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(defaultLocale);
  const [activeLanguage, setActiveLanguageState] = useState<'curl' | 'go' | 'typescript'>('curl');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [theme, setThemeState] = useState<SupportedTheme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Initialize from localStorage
  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem('arda_docs_locale') as SupportedLocale;
      if (savedLocale === 'en' || savedLocale === 'vi') {
        setLocaleState(savedLocale);
      }
      const savedLang = localStorage.getItem('arda_docs_lang') as 'curl' | 'go' | 'typescript';
      if (savedLang === 'curl' || savedLang === 'go' || savedLang === 'typescript') {
        setActiveLanguageState(savedLang);
      }
      const savedTheme = localStorage.getItem('arda_docs_theme') as SupportedTheme;
      if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
        setThemeState(savedTheme);
      }
    } catch {
      // ignore
    }
  }, []);

  // Sync theme changes to document class
  useEffect(() => {
    const updateThemeClass = () => {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = theme === 'dark' || (theme === 'system' && systemDark);
      setResolvedTheme(isDark ? 'dark' : 'light');

      const root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
    };

    updateThemeClass();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateThemeClass();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('arda_docs_locale', newLocale);
    } catch {
      // ignore
    }
  };

  const setActiveLanguage = (lang: 'curl' | 'go' | 'typescript') => {
    setActiveLanguageState(lang);
    try {
      localStorage.setItem('arda_docs_lang', lang);
    } catch {
      // ignore
    }
  };

  const setTheme = (newTheme: SupportedTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('arda_docs_theme', newTheme);
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    const nextTheme: SupportedTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        activeLanguage,
        setActiveLanguage,
        isSearchOpen,
        setIsSearchOpen,
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}
