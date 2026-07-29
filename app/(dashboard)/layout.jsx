"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  // Sayfa ilk yüklendiğinde kullanıcının tercih ettiği temayı (varsa) getir
  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  // Tema Değiştirme Fonksiyonu
  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const menuItems = [
    { name: 'Panel', path: '/', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'Takvim', path: '/calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Geçmiş', path: '/history', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Sessiz Saatler', path: '/quiet-hours', icon: 'M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z' },
    { name: 'Profil', path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
      
      {/* Sol Menü (Sidebar) */}
      <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col transition-colors duration-300">
        
        {/* Logo Alanı */}
        <div className="p-8">
          <h1 className="text-3xl font-bold text-[#0f4c3a] dark:text-[#00BBA7] tracking-tight">Voia</h1>
          <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 mt-1 tracking-wider uppercase">Kişisel Sesli Asistan</p>
        </div>

        {/* Menü Linkleri */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path));
            return (
              <Link
                key={item.name}
                href={item.path}
                // BURASI GÜNCELLENDİ: focus:outline-none eklendi ve border mantığı düzeltildi
                className={`flex items-center px-4 py-3.5 rounded-xl font-bold text-sm transition-all focus:outline-none border ${
                  isActive 
                    ? 'text-[#0f4c3a] dark:text-[#00BBA7] bg-teal-50/50 dark:bg-[#00BBA7]/10 border-teal-100 dark:border-[#00BBA7]/20 shadow-sm' 
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <svg className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-[#0f4c3a] dark:text-[#00BBA7]' : 'text-gray-400 dark:text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                </svg>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Yeni Hatırlatıcı Butonu */}
        <div className="p-6">
          <Link 
            href="/calendar/new" 
            className="w-full bg-[#0f4c3a] hover:bg-[#0a3629] dark:bg-[#00BBA7] dark:hover:bg-[#009F8E] text-white font-medium py-3.5 px-4 rounded-xl flex items-center justify-center transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Yeni Hatırlatıcı Oluştur
          </Link>
        </div>
      </div>

      {/* Sağ Taraf - İçerik Alanı */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOPBAR */}
        <header className="h-20 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-10 shrink-0 transition-colors duration-300">
          
          {/* Arama Çubuğu */}
          <div className="w-[450px] relative">
            <input 
              type="text" 
              placeholder="Hatırlatıcılarda ara..." 
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm text-gray-800 dark:text-gray-200 font-medium focus:outline-none focus:ring-2 focus:ring-[#00BBA7]/20 transition-all placeholder-gray-400"
            />
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>

          <div className="flex items-center gap-6">
            
            {/* Dil Seçimi */}
            <div className="flex items-center gap-3 text-xs font-bold text-gray-400 dark:text-gray-500">
              <button className="text-[#0f4c3a] dark:text-[#00BBA7]">TR</button>
              <button className="hover:text-gray-800 dark:hover:text-gray-200 transition-colors">EN</button>
            </div>
            
            <div className="flex items-center gap-5 border-l border-gray-200 dark:border-gray-700 pl-6">
              
              {/* Bildirim İkonu */}
              <button className="text-gray-400 dark:text-gray-500 hover:text-[#0f4c3a] dark:hover:text-[#00BBA7] transition-colors relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
              </button>

              {/* TEMA DEĞİŞTİRME BUTONU (Custom Toggle Switch) */}
              <button 
                onClick={toggleTheme} 
                className="relative w-16 h-8 flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#00BBA7]/30 shadow-inner"
                title={isDark ? "Açık Moda Geç" : "Koyu Moda Geç"}
              >
                {/* Arka Plan İkonları (Sabit ve Soluk) */}
                <div className="absolute inset-0 flex justify-between items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                  <svg className="w-4 h-4 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                </div>

                {/* Hareketli Yuvarlak (Thumb) */}
                <div className={`relative w-6 h-6 bg-white dark:bg-gray-700 rounded-full shadow-md flex items-center justify-center transform transition-transform duration-300 z-10 ${isDark ? 'translate-x-8' : 'translate-x-0'}`}>
                  {isDark ? (
                    // Koyu Mod Aktifken İçerideki İkon
                    <svg className="w-3.5 h-3.5 text-[#00BBA7]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                  ) : (
                    // Açık Mod Aktifken İçerideki İkon
                    <svg className="w-3.5 h-3.5 text-[#0f4c3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                  )}
                </div>
              </button>

              {/* Profil Resmi */}
              <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer shadow-sm">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces" alt="Profil" className="w-full h-full object-cover" />
              </div>
            </div>

          </div>
        </header>

        {/* Ana İçerik Yeri */}
        <main className="flex-1 overflow-y-auto p-10">
          {children}
        </main>
      </div>

    </div>
  );
}