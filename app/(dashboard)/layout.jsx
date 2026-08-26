"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import GlobalNotification from '@/components/GlobalNotification';

// Auth storage'ı temizleyen yardımcı fonksiyon.
// Projedeki token key'i backend entegrasyonuna göre belirleneceğinden
// yaygın kullanılan tüm key'ler temizleniyor.
const clearAuthStorage = () => {
  const AUTH_KEYS = ['token', 'access_token', 'refresh_token', 'authToken', 'auth', 'user'];
  AUTH_KEYS.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
};

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [activeLang, setActiveLang] = useState('TR');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Bildirim paneli ve Profil Menüsü dışına tıklayınca kapat
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
    { name: 'Panel', path: '/panel', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'Takvim', path: '/calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Geçmiş', path: '/history', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Profil', path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#1A1A1A] font-sans transition-colors duration-300">
      
      {/* Sol Menü (Sidebar) */}
      <div className="w-64 bg-white dark:bg-[#1A1A1A] border-r border-gray-100 dark:border-white/10 flex flex-col transition-colors duration-300">
        
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
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5'
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
        <header className="h-20 bg-white dark:bg-[#1A1A1A] border-b border-gray-100 dark:border-white/10 flex items-center justify-between px-10 shrink-0 transition-colors duration-300">
          
          {/* Arama Çubuğu */}
          <div className="w-[450px] relative">
            <input 
              type="text" 
              placeholder="Hatırlatıcılarda ara..." 
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-[#27272A] border-none rounded-2xl text-sm text-gray-800 dark:text-[#F8FAFC] font-medium focus:outline-none focus:ring-2 focus:ring-[#00BBA7]/20 transition-all placeholder-gray-400 dark:placeholder-[#71717A]"
            />
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>

          <div className="flex items-center gap-6">
            
            {/* Dil Seçimi */}
            <div className="flex items-center gap-3 text-xs font-bold text-gray-400 dark:text-gray-500">
              <button
                onClick={() => setActiveLang('TR')}
                className={`transition-colors ${activeLang === 'TR' ? 'text-[#0f4c3a] dark:text-[#00BBA7]' : 'hover:text-gray-800 dark:hover:text-gray-200'}`}
              >TR</button>
              <button
                onClick={() => setActiveLang('EN')}
                className={`transition-colors ${activeLang === 'EN' ? 'text-[#0f4c3a] dark:text-[#00BBA7]' : 'hover:text-gray-800 dark:hover:text-gray-200'}`}
              >EN</button>
            </div>
            
            <div className="flex items-center gap-5 border-l border-gray-200 dark:border-white/10 pl-6">
              
              {/* Bildirim İkonu */}
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => setShowNotifications((p) => !p)}
                  className="text-gray-400 dark:text-gray-500 hover:text-[#0f4c3a] dark:hover:text-[#00BBA7] transition-colors relative"
                  aria-label="Bildirimleri aç"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1A1A1A]"></span>
                </button>

                {/* Bildirim Dropdown Paneli */}
                {showNotifications && (
                  <div className="absolute right-0 top-10 w-80 bg-white dark:bg-[#27272A] rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/10">
                      <h3 className="text-sm font-bold text-gray-800 dark:text-[#F8FAFC]">Bildirimler</h3>
                      <span className="text-[10px] font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">2 yeni</span>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-white/10 max-h-72 overflow-y-auto">
                      {[
                        { icon: '🔔', title: 'Doktor Randevusu', sub: 'Bugün 14:30 – 2 saat sonra', unread: true },
                        { icon: '📞', title: 'Cevapsız Arama', sub: 'Annem – 14:32', unread: true },
                        { icon: '✅', title: 'Günlük Özet Hazır', sub: 'Yapay zeka analiziniz hazır', unread: false },
                      ].map((n, i) => (
                        <div key={i} className={`flex items-start gap-3 px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors ${n.unread ? 'bg-teal-50/30 dark:bg-[#00BBA7]/5' : ''}`}>
                          <span className="text-xl shrink-0">{n.icon}</span>
                          <div>
                            <p className={`text-sm ${n.unread ? 'font-bold text-gray-800 dark:text-[#F8FAFC]' : 'font-medium text-gray-600 dark:text-[#CBD5E1]'}`}>{n.title}</p>
                            <p className="text-[12px] text-gray-400 dark:text-[#71717A] mt-0.5">{n.sub}</p>
                          </div>
                          {n.unread && <div className="w-2 h-2 bg-[#0f4c3a] dark:bg-[#00BBA7] rounded-full shrink-0 mt-1.5 ml-auto" />}
                        </div>
                      ))}
                    </div>
                    <div className="px-5 py-3 border-t border-gray-100 dark:border-white/10">
                      <Link href="/history" onClick={() => setShowNotifications(false)} className="text-xs font-bold text-[#0f4c3a] dark:text-[#00BBA7] hover:underline">
                        Tüm geçmişi görüntüle →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* TEMA DEĞİŞTİRME BUTONU (Custom Toggle Switch) */}
              <button 
                onClick={toggleTheme} 
                className="relative w-16 h-8 flex items-center bg-gray-100 dark:bg-[#27272A] rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#00BBA7]/30 shadow-inner"
                title={isDark ? "Açık Moda Geç" : "Koyu Moda Geç"}
              >
                {/* Arka Plan İkonları (Sabit ve Soluk) */}
                <div className="absolute inset-0 flex justify-between items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                  <svg className="w-4 h-4 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                </div>

                {/* Hareketli Yuvarlak (Thumb) */}
                <div className={`relative w-6 h-6 bg-white dark:bg-[#3F3F46] rounded-full shadow-md flex items-center justify-center transform transition-transform duration-300 z-10 ${isDark ? 'translate-x-8' : 'translate-x-0'}`}>
                  {isDark ? (
                    // Koyu Mod Aktifken İçerideki İkon
                    <svg className="w-3.5 h-3.5 text-[#00BBA7]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                  ) : (
                    // Açık Mod Aktifken İçerideki İkon
                    <svg className="w-3.5 h-3.5 text-[#0f4c3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                  )}
                </div>
              </button>

              {/* Profil Menüsü */}
              <div ref={profileRef} className="relative">
                <button 
                  onClick={() => setShowProfileMenu((p) => !p)} 
                  className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden border border-gray-200 dark:border-white/10 cursor-pointer shadow-sm hover:ring-2 hover:ring-[#0f4c3a] dark:hover:ring-[#00BBA7] transition-all block focus:outline-none"
                >
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces" alt="Profil" className="w-full h-full object-cover" />
                </button>

                {/* Profil Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 top-12 w-48 bg-white dark:bg-[#27272A] rounded-xl shadow-xl border border-gray-100 dark:border-white/10 z-50 overflow-hidden py-1">
                    <button
                      onClick={() => { setShowProfileMenu(false); router.push('/profile'); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[#CBD5E1] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      Profil
                    </button>
                    <div className="border-t border-gray-100 dark:border-white/10 my-1" />
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        clearAuthStorage();
                        router.push('/');
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[#CBD5E1] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Çıkış Yap
                    </button>
                  </div>
                )}
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