"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSilentHours, createSilentHour, updateSilentHour, deleteSilentHour, getUserSettings, patchUserSettings } from '@/lib/api';

// Backend'in beklediği gün formatları
const DAY_MAPPINGS = [
  { name: 'Pazartesi', value: 'MONDAY' },
  { name: 'Salı',      value: 'TUESDAY' },
  { name: 'Çarşamba',  value: 'WEDNESDAY' },
  { name: 'Perşembe',  value: 'THURSDAY' },
  { name: 'Cuma',      value: 'FRIDAY' },
  { name: 'Cumartesi', value: 'SATURDAY' },
  { name: 'Pazar',     value: 'SUNDAY' },
];

const DEFAULT_START = '22:00';
const DEFAULT_END = '07:00';

export default function QuietHoursPage() {
  const [days, setDays] = useState([]);
  const [emergencyEnabled, setEmergencyEnabled] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. İLK YÜKLEMEDE API'DEN VERİLERİ ÇEK
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Backend'den verileri paralel olarak çek
      const [dbHours, settings] = await Promise.all([
        getSilentHours(),
        getUserSettings()
      ]);

      // Acil Durum Ayarı (User Settings tablosundan gelir)
      if (settings) {
        setEmergencyEnabled(settings.emergencyOverride || false);
      }

      // Günleri backend verisiyle eşleştir (Mapper)
      const initialDays = DAY_MAPPINGS.map(dayMap => {
        const existing = (dbHours || []).find(h => h.dayOfWeek === dayMap.value);
        if (existing) {
          return {
            ...dayMap,
            enabled: true,
            silentHourId: existing.silentHourId,
            startTime: existing.silentStart,
            endTime: existing.silentEnd,
          };
        }
        return {
          ...dayMap,
          enabled: false,
          silentHourId: null,
          startTime: DEFAULT_START,
          endTime: DEFAULT_END,
        };
      });

      setDays(initialDays);
    } catch (error) {
      console.error("Veriler çekilirken hata:", error);
      showToast("Ayarlar yüklenemedi. Lütfen sayfayı yenileyin.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 2. DEĞİŞİKLİKLERİ BACKEND'E KAYDET
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // A) Acil Durum (Emergency Override) Güncellemesi
      await patchUserSettings({ emergencyOverride: emergencyEnabled });

      // B) Sessiz Saat Güncellemeleri
      // Promise.all ile tüm istekleri aynı anda atarak performansı artırıyoruz
      const promises = days.map(async (day) => {
        if (day.enabled) {
          if (day.silentHourId) {
            // Var olanı güncelle (PATCH)
            return updateSilentHour(day.silentHourId, {
              silentStart: day.startTime,
              silentEnd: day.endTime
            });
          } else {
            // Yeni oluştur (POST)
            return createSilentHour({
              dayOfWeek: day.value,
              silentStart: day.startTime,
              silentEnd: day.endTime
            });
          }
        } else {
          // Açıkken kapatıldıysa (DELETE)
          if (day.silentHourId) {
            return deleteSilentHour(day.silentHourId);
          }
        }
      });

      await Promise.all(promises);
      
      showToast('Tüm ayarlarınız başarıyla kaydedildi!');
      
      // Oluşturulan yeni ID'leri almak için sayfayı arka planda tazele
      await fetchData(); 
    } catch (error) {
      console.error("Kaydetme hatası:", error);
      showToast('Ayarlar kaydedilirken bir hata oluştu.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleDay = (index) => {
    setDays((prev) => prev.map((day, i) => i === index ? { ...day, enabled: !day.enabled } : day));
  };

  const updateTime = (index, field, value) => {
    setDays((prev) => prev.map((day, i) => i === index ? { ...day, [field]: value } : day));
  };

  const applyToAll = () => {
    const ref = days[0];
    setDays((prev) => prev.map((day) => ({ ...day, startTime: ref.startTime, endTime: ref.endTime })));
    showToast(`${ref.startTime} – ${ref.endTime} tüm günlere uygulandı.`);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-500 font-medium">Ayarlar yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto pb-10">
      {/* Toast Bildirimi */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-sm font-bold ${toast.type === 'error' ? 'bg-red-500' : 'bg-[#0f4c3a] dark:bg-[#00BBA7]'}`}>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={toast.type === 'error' ? "M6 18L18 6M6 6l12 12" : "M5 13l4 4L19 7"} />
          </svg>
          {toast.message}
        </div>
      )}

      {/* Üst Geri Dönüş Linki */}
      <Link href="/profile" className="inline-flex items-center text-sm font-bold text-gray-500 dark:text-[#71717A] hover:text-[#0f4c3a] dark:hover:text-[#00BBA7] transition-colors mb-6 group">
        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mr-3 group-hover:bg-[#0f4c3a] dark:group-hover:bg-[#00BBA7] group-hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </div>
        Profil Ayarlarına Dön
      </Link>

      {/* Üst Başlık ve Kaydet Butonu */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-[28px] font-bold text-[#0f4c3a] dark:text-[#00BBA7] mb-1">Sessiz Saatler</h2>
          <p className="text-gray-500 dark:text-[#CBD5E1] text-[15px]">
            Dinlenme zamanlarınızı ve rahatsız edilmeyeceğiniz saatleri buradan yönetin.
          </p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center px-6 py-3 bg-[#0f4c3a] hover:bg-[#0a3629] dark:bg-[#00BBA7] dark:hover:bg-[#009F8E] text-white font-bold rounded-xl text-sm transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Kaydediliyor...
            </>
          ) : (
             <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Değişiklikleri Kaydet
            </>
          )}
        </button>
      </div>

      <div className="flex gap-8">
        {/* SOL: Haftalık Program */}
        <div className="flex-[2] bg-white dark:bg-[#27272A] rounded-2xl p-6 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center text-[#0f4c3a] dark:text-[#00BBA7] font-bold">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Haftalık Program
            </div>
            <button
              onClick={applyToAll}
              className="text-sm font-semibold text-[#0f4c3a] dark:text-[#00BBA7] hover:underline transition-colors focus:outline-none"
            >
              Tüm günlere uygula
            </button>
          </div>

          <div className="space-y-4">
            {days.map((day, index) => (
              <div
                key={day.name}
                className={`flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#71717A]/10 transition-all ${
                  !day.enabled ? 'opacity-60' : ''
                }`}
              >
                {/* Toggle + Gün Adı */}
                <div className="flex items-center w-1/3">
                  <button
                    onClick={() => toggleDay(index)}
                    className="relative inline-flex items-center cursor-pointer mr-4 focus:outline-none"
                    aria-label={`${day.name} sessiz saatleri ${day.enabled ? 'kapat' : 'aç'}`}
                  >
                    <div
                      className={`w-11 h-6 rounded-full peer transition-colors duration-300 ${
                        day.enabled
                          ? 'bg-[#0f4c3a] dark:bg-[#00BBA7]'
                          : 'bg-gray-200 dark:bg-[#52525B]'
                      }`}
                    />
                    <div
                      className={`absolute left-[2px] top-[2px] bg-white w-5 h-5 rounded-full border transition-transform duration-300 ${
                        day.enabled
                          ? 'translate-x-full border-gray-300 dark:border-[#52525B]'
                          : 'translate-x-0 border-gray-300 dark:border-[#71717A]'
                      }`}
                    />
                  </button>
                  <span
                    className={`font-bold ${
                      day.enabled
                        ? 'text-gray-800 dark:text-[#F8FAFC]'
                        : 'text-gray-500 dark:text-[#71717A]'
                    }`}
                  >
                    {day.name}
                  </span>
                </div>

                {/* Saat Inputları */}
                <div
                  className={`flex items-center gap-3 flex-1 justify-end ${
                    !day.enabled ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <div className="relative">
                    <input
                      type="time"
                      value={day.startTime}
                      onChange={(e) => updateTime(index, 'startTime', e.target.value)}
                      disabled={!day.enabled}
                      className="w-28 text-center py-2 bg-gray-50 dark:bg-[#1A1A1A]/40 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium text-gray-800 dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 dark:focus:ring-[#00BBA7]/20 cursor-pointer"
                    />
                  </div>
                  <span className="text-gray-400 dark:text-[#71717A] font-medium">-</span>
                  <div className="relative">
                    <input
                      type="time"
                      value={day.endTime}
                      onChange={(e) => updateTime(index, 'endTime', e.target.value)}
                      disabled={!day.enabled}
                      className="w-28 text-center py-2 bg-gray-50 dark:bg-[#1A1A1A]/40 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium text-gray-800 dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 dark:focus:ring-[#00BBA7]/20 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SAĞ: Bilgi Kartları */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#27272A] rounded-2xl p-6 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none">
            <h4 className="text-[11px] font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wider mb-2">YEREL SAAT</h4>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-extrabold text-[#0f4c3a] dark:text-[#00BBA7] leading-none">
                {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-sm font-bold text-gray-500 dark:text-[#CBD5E1] mb-1">GMT+3</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-[#CBD5E1] leading-relaxed">
              Şu anki saat diliminiz İstanbul/Türkiye olarak ayarlanmıştır.
            </p>
          </div>

          <div className="bg-red-50/50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-100 dark:border-red-900/30 shadow-sm dark:shadow-none">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-[#3F3F46] flex items-center justify-center text-red-500 dark:text-red-400 shrink-0 border border-red-100 dark:border-red-900/30 shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-[#F8FAFC] text-[15px] mb-1">Acil Durum Geçişi</h4>
                <p className="text-xs text-gray-600 dark:text-[#CBD5E1] leading-relaxed">
                  Aynı kişiden 3 dakika içinde gelen ardışık aramaların sessiz saatleri aşmasına izin verin.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-2">
              <span
                className={`text-xs font-bold uppercase transition-colors ${
                  emergencyEnabled
                    ? 'text-[#0f4c3a] dark:text-[#00BBA7]'
                    : 'text-gray-400 dark:text-[#71717A]'
                }`}
              >
                {emergencyEnabled ? 'AKTİF' : 'PASİF'}
              </span>
              <button
                onClick={() => setEmergencyEnabled((prev) => !prev)}
                className="relative inline-flex items-center cursor-pointer focus:outline-none"
                aria-label="Acil durum geçişini aç/kapat"
              >
                <div
                  className={`w-11 h-6 rounded-full peer transition-colors duration-300 ${
                    emergencyEnabled
                      ? 'bg-[#0f4c3a] dark:bg-[#00BBA7]'
                      : 'bg-gray-200 dark:bg-[#52525B]'
                  }`}
                />
                <div
                  className={`absolute left-[2px] top-[2px] bg-white w-5 h-5 rounded-full border transition-transform duration-300 ${
                    emergencyEnabled
                      ? 'translate-x-full border-gray-300 dark:border-[#52525B]'
                      : 'translate-x-0 border-gray-300 dark:border-[#71717A]'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}