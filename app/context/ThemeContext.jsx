"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
});

export function ThemeProvider({ children }) {
  // Her zaman 'light' ile başla — sunucu/istemci hydration uyumluluğu için.
  // FOUC script'i (layout.tsx'te) localStorage'dan okuyup html'e dark class'ı
  // sayfa render edilmeden önce ekler, böylece görsel flash olmaz.
  const [theme, setThemeState] = useState('light');

  // initialized: localStorage okunmadan önce DOM'a dokunulmasını engeller.
  // Bu olmadan: mount → theme='light' → dark class kaldırılır → flash!
  const [initialized, setInitialized] = useState(false);

  // 1. Adım: Sadece mount'ta localStorage'dan oku
  useEffect(() => {
    try {
      const saved = localStorage.getItem('voia-theme');
      if (saved === 'dark' || saved === 'light') {
        setThemeState(saved);
      }
      // Yoksa varsayılan 'light' kalır
    } catch (e) {}
    // Her iki durumda da initialized=true yaparak 2. effect'i aktif et
    setInitialized(true);
  }, []);

  // 2. Adım: Sadece initialized=true olduktan sonra DOM'u ve localStorage'ı güncelle
  // initialized olmadan çalışırsa, theme='light' ile dark class silinip flash yaşanır
  useEffect(() => {
    if (!initialized) return;

    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    try {
      localStorage.setItem('voia-theme', theme);
    } catch (e) {}
  }, [theme, initialized]);

  function setTheme(newTheme) {
    setThemeState(newTheme);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
