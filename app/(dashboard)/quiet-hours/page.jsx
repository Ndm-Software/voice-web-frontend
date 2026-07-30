"use client";

import React, { useState } from 'react';

// ─── Başlangıç State'i ───────────────────────────────────────────────
const INITIAL_DAYS = [
  { name: 'Pazartesi',  enabled: true, startTime: '22:00', endTime: '07:00' },
  { name: 'Salı',       enabled: true, startTime: '22:00', endTime: '07:00' },
  { name: 'Çarşamba',   enabled: true, startTime: '22:00', endTime: '07:00' },
  { name: 'Perşembe',   enabled: true, startTime: '22:00', endTime: '07:00' },
  { name: 'Cuma',       enabled: true, startTime: '23:00', endTime: '09:00' },
  { name: 'Cumartesi',  enabled: true, startTime: '22:00', endTime: '07:00' },
  { name: 'Pazar',      enabled: true, startTime: '22:00', endTime: '07:00' },
];

export default function QuietHoursPage() {
  const [days, setDays] = useState(INITIAL_DAYS);
  const [emergencyEnabled, setEmergencyEnabled] = useState(true);
  const [toast, setToast] = useState(null); // { message: string }

  // ─── Yardımcı Fonksiyonlar ────────────────────────────────────────
  const showToast = (message) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleDay = (index) => {
    setDays((prev) =>
      prev.map((day, i) =>
        i === index ? { ...day, enabled: !day.enabled } : day
      )
    );
  };

  const updateTime = (index, field, value) => {
    setDays((prev) =>
      prev.map((day, i) =>
        i === index ? { ...day, [field]: value } : day
      )
    );
  };

  // Pazartesi'nin saatlerini tüm günlere uygula
  const applyToAll = () => {
    const ref = days[0];
    setDays((prev) =>
      prev.map((day) => ({ ...day, startTime: ref.startTime, endTime: ref.endTime }))
    );
    showToast(`${ref.startTime} – ${ref.endTime} tüm günlere uygulandı.`);
  };

  const handleOptimize = () => {
    showToast('Program optimize edildi! Voia önerilen saatler uygulandı.');
  };

  return (
    <div className="w-full max-w-5xl mx-auto">

      {/* ─── Toast Bildirimi ─────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl bg-[#0f4c3a] dark:bg-[#00BBA7] text-white text-sm font-bold">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {toast.message}
        </div>
      )}

      {/* ─── Üst Başlık ve Arama ─────────────────────────────────── */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-[28px] font-bold text-[#0f4c3a] dark:text-[#00BBA7] mb-1">Sessiz Saatler</h2>
          <p className="text-gray-500 dark:text-[#CBD5E1] text-[15px]">
            Dinlenme zamanlarınızı ve rahatsız edilmeyeceğiniz saatleri buradan yönetin.
          </p>
        </div>

        {/* Sayfa İçi Arama Çubuğu */}
        <div className="relative w-64">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#71717A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Ayarlarda ara..."
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#3F3F46] border border-gray-200 dark:border-[#52525B] rounded-xl text-sm text-gray-800 dark:text-[#F8FAFC] placeholder-gray-400 dark:placeholder-[#71717A] focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 dark:focus:ring-[#00BBA7]/20 shadow-sm"
          />
        </div>
      </div>

      <div className="flex gap-8">

        {/* ─── SOL: Haftalık Program ─────────────────────────────── */}
        <div className="flex-[2] bg-white dark:bg-[#3F3F46] rounded-2xl p-6 border border-gray-100 dark:border-[#52525B] shadow-sm dark:shadow-none">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center text-[#0f4c3a] dark:text-[#00BBA7] font-bold">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Haftalık Program
            </div>
            <button
              onClick={applyToAll}
              className="text-sm font-semibold text-[#0f4c3a] dark:text-[#00BBA7] hover:underline transition-colors"
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
                  {/* Başlangıç Saati */}
                  <div className="relative">
                    <input
                      type="time"
                      value={day.startTime}
                      onChange={(e) => updateTime(index, 'startTime', e.target.value)}
                      disabled={!day.enabled}
                      className="w-28 text-center py-2 bg-gray-50 dark:bg-[#0F172A]/40 border border-gray-200 dark:border-[#52525B] rounded-lg text-sm font-medium text-gray-800 dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 dark:focus:ring-[#00BBA7]/20 cursor-pointer"
                    />
                  </div>

                  <span className="text-gray-400 dark:text-[#71717A] font-medium">-</span>

                  {/* Bitiş Saati */}
                  <div className="relative">
                    <input
                      type="time"
                      value={day.endTime}
                      onChange={(e) => updateTime(index, 'endTime', e.target.value)}
                      disabled={!day.enabled}
                      className="w-28 text-center py-2 bg-gray-50 dark:bg-[#0F172A]/40 border border-gray-200 dark:border-[#52525B] rounded-lg text-sm font-medium text-gray-800 dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 dark:focus:ring-[#00BBA7]/20 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── SAĞ: Bilgi Kartları ───────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-6">

          {/* Yerel Saat Kartı */}
          <div className="bg-white dark:bg-[#3F3F46] rounded-2xl p-6 border border-gray-100 dark:border-[#52525B] shadow-sm dark:shadow-none">
            <h4 className="text-[11px] font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wider mb-2">YEREL SAAT</h4>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-extrabold text-[#0f4c3a] dark:text-[#00BBA7] leading-none">21:38</span>
              <span className="text-sm font-bold text-gray-500 dark:text-[#CBD5E1] mb-1">GMT+3</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-[#CBD5E1] leading-relaxed">
              Şu anki saat diliminiz İstanbul/Türkiye olarak ayarlanmıştır.
            </p>
          </div>

          {/* Acil Durum Kartı */}
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
                  Aynı kişiden 3 dakika içinde gelen ardışık aramaların veya mesajların sessiz saatleri aşmasına izin verin.
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
              {/* Acil Durum Toggle */}
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

          {/* Akıllı Bilgi Kartı */}
          <div className="bg-[#0f4c3a] dark:bg-[#1e293b] dark:border dark:border-[#00BBA7]/30 rounded-2xl p-6 shadow-lg relative overflow-hidden text-white flex-1 min-h-[200px]">
            {/* Dekoratif Arka Plan */}
            <svg className="absolute top-4 right-4 w-12 h-12 text-teal-600/30 dark:text-[#00BBA7]/20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
            </svg>

            <div className="flex items-center gap-2 mb-3 relative z-10">
              <svg className="w-5 h-5 text-teal-300 dark:text-[#00BBA7]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
                <path d="M19 16L19.75 19.25L23 20L19.75 20.75L19 24L18.25 20.75L15 20L18.25 19.25L19 16Z" />
              </svg>
              <h4 className="font-bold text-lg">Akıllı Bilgi</h4>
            </div>
            <p className="text-teal-50 dark:text-[#CBD5E1] text-[13px] leading-relaxed mb-6 relative z-10 opacity-90">
              Voia, hafta içi 06:30'da uyandığınızı fark etti. Sabah brifingi deneyiminizi iyileştirmek için sessiz saatleri bu saate göre optimize edebilirsiniz.
            </p>
            <button
              onClick={handleOptimize}
              className="w-full bg-[#1c6953] dark:bg-[#00BBA7]/20 hover:bg-[#258268] dark:hover:bg-[#00BBA7]/30 text-white font-bold py-3 rounded-xl text-xs tracking-wider transition-colors border border-[#258268] dark:border-[#00BBA7]/40 shadow-sm relative z-10"
            >
              PROGRAMI OPTİMİZE ET
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}