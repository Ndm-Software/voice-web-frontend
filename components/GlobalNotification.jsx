"use client";

import { useEffect, useState } from 'react';
import { onForegroundMessage } from '@/lib/firebase';

export default function GlobalNotification() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Uygulama açıkken gelen mesajları dinle
    const unsubscribe = onForegroundMessage((payload) => {
      const title = payload.notification?.title || 'Yeni Bildirim';
      const body = payload.notification?.body || '';
      
      setToast({ title, body });
      
      // 5 saniye sonra otomatik kapanması için
      setTimeout(() => setToast(null), 5000);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Eğer toast yoksa hiçbir şey render etme (Görünmez bileşen)
  if (!toast) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[9999] flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl bg-[#0f4c3a] dark:bg-[#00BBA7] text-white text-sm font-bold animate-[fadeIn_0.3s_ease-out]">
      <div className="mt-0.5">
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-sm">{toast.title}</span>
        {toast.body && <span className="text-xs font-normal opacity-90 mt-1">{toast.body}</span>}
      </div>
    </div>
  );
}