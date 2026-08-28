"use client";

import React, { useEffect, useRef } from 'react';
import { onForegroundMessage, requestPushPermissionAndGetToken } from '@/lib/firebase';
import { updateDevice, getSilentHours } from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';

function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(':');
  return (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
}

function isSilentNow(rules) {
  if (!Array.isArray(rules) || rules.length === 0) return false;

  const now = new Date();
  const daysEN = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const currentDayEN = daysEN[now.getDay()];
  const currentMin = now.getHours() * 60 + now.getMinutes();

  const rule = rules.find((r) => (r.dayOfWeek || '').toUpperCase().trim() === currentDayEN);
  if (!rule || !rule.silentStart || !rule.silentEnd) return false;

  const startMin = timeToMinutes(rule.silentStart);
  const endMin = timeToMinutes(rule.silentEnd);

  if (startMin > endMin) {
    return currentMin >= startMin || currentMin < endMin;
  }
  return currentMin >= startMin && currentMin < endMin;
}

// Sadece o an susturulan olayın tekil ID'sini veya tam saniyesini kaydeder (Başlık kaydetmez)
function recordSilencedItem(payload) {
  try {
    const raw = localStorage.getItem('voia_silenced_records');
    const list = raw ? JSON.parse(raw) : [];

    const exactId = payload?.data?.reminderId || payload?.data?.historyId || payload?.data?.id || null;

    list.push({
      id: exactId ? String(exactId).trim() : null,
      timestamp: Date.now()
    });

    localStorage.setItem('voia_silenced_records', JSON.stringify(list.slice(-30)));
  } catch (e) {}
}

export default function GlobalNotification() {
  const isRegisteredRef = useRef(false);
  const pathname = usePathname();

  const isAuthPage = !pathname || pathname === '/' || pathname === '/login' || pathname === '/register';

  useEffect(() => {
    if (isAuthPage) return;

    const register = async () => {
      if (isRegisteredRef.current) return;
      isRegisteredRef.current = true;

      try {
        const pushToken = await requestPushPermissionAndGetToken();
        let installationId = localStorage.getItem('voia_installation_id');
        if (!installationId) {
          installationId = typeof crypto !== 'undefined' && crypto.randomUUID 
            ? crypto.randomUUID() 
            : 'web-' + Date.now();
          localStorage.setItem('voia_installation_id', installationId);
        }

        if (pushToken) {
          await updateDevice({
            installationId,
            platform: 'WEB',
            deviceName: window.navigator.userAgent.substring(0, 99) || 'Web Browser',
            pushToken: pushToken,
          });
        }
      } catch (err) {}
    };

    register();

    const unsubscribe = onForegroundMessage(async (payload) => {
      let isSilenced = false;
      try {
        const rawList = await getSilentHours();
        const silentList = Array.isArray(rawList) ? rawList : (rawList?.data || []);
        if (isSilentNow(silentList)) {
          isSilenced = true;
          recordSilencedItem(payload);
        }
      } catch (err) {}

      window.dispatchEvent(new CustomEvent('voia_new_notification'));

      if (isSilenced) {
        console.warn('🔇 SESSİZ SAAT: Bildirim susturuldu.');
        return;
      }

      const title = payload?.notification?.title || payload?.data?.title || 'Yeni Bildirim';
      const body = payload?.notification?.body || payload?.data?.body || '';

      const isVoiceCall =
        title.includes('Arıyor') ||
        title.includes('📞') ||
        payload?.data?.type === 'VOICE_CALL';

      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? 'animate-enter opacity-100 scale-100' : 'animate-leave opacity-0 scale-95'
            } max-w-sm w-full shadow-2xl rounded-2xl p-4 flex items-start gap-3.5 border pointer-events-auto transition-all duration-300 my-1 ${
              isVoiceCall
                ? 'bg-gradient-to-br from-[#0a3629] to-[#0f4c3a] text-white border-emerald-400/50 shadow-emerald-950/50 ring-1 ring-emerald-400/30'
                : 'bg-white dark:bg-[#27272A] text-gray-800 dark:text-[#F8FAFC] border-gray-100 dark:border-white/10 shadow-gray-200/60 dark:shadow-black/60'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                isVoiceCall
                  ? 'bg-emerald-400/20 text-emerald-300 ring-2 ring-emerald-400/50 animate-pulse'
                  : 'bg-teal-50 dark:bg-[#00BBA7]/10 text-[#0f4c3a] dark:text-[#00BBA7]'
              }`}
            >
              {isVoiceCall ? (
                <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              )}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <h4 className={`text-sm font-bold truncate ${isVoiceCall ? 'text-white' : 'text-gray-800 dark:text-[#F8FAFC]'}`}>
                {title}
              </h4>
              <p className={`text-xs mt-0.5 line-clamp-2 ${isVoiceCall ? 'text-emerald-100/90' : 'text-gray-500 dark:text-[#CBD5E1]'}`}>
                {body}
              </p>
            </div>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ),
        {
          duration: isVoiceCall ? 12000 : 6000,
          position: 'bottom-right',
          id: `${isVoiceCall ? 'call' : 'notif'}-${Date.now()}-${Math.random()}`,
        }
      );
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [isAuthPage]);

  if (isAuthPage) return null;

  return (
    <Toaster
      position="bottom-right"
      reverseOrder={true}
      gutter={12}
      toastOptions={{
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
        },
      }}
    />
  );
}