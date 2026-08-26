"use client";

import React, { useState, useEffect } from 'react';

const INITIAL_DAYS = [
  { name: 'Pazartesi',  enabled: true, startTime: '22:00', endTime: '07:00' },
  { name: 'Salı',       enabled: true, startTime: '22:00', endTime: '07:00' },
  { name: 'Çarşamba',   enabled: true, startTime: '22:00', endTime: '07:00' },
  { name: 'Perşembe',   enabled: true, startTime: '22:00', endTime: '07:00' },
  { name: 'Cuma',       enabled: true, startTime: '23:00', endTime: '09:00' },
  { name: 'Cumartesi',  enabled: true, startTime: '22:00', endTime: '07:00' },
  { name: 'Pazar',      enabled: true, startTime: '22:00', endTime: '07:00' },
];

export default function QuietHoursSettings() {
  const [days, setDays] = useState(INITIAL_DAYS);
  const [emergencyEnabled, setEmergencyEnabled] = useState(true);
  const [toast, setToast] = useState(null);

  // 1. Sayfa yüklendiğinde kaydedilmiş ayarları getir
  useEffect(() => {
    const savedDays = localStorage.getItem('voia_quiet_hours');
    const savedEmergency = localStorage.getItem('voia_quiet_hours_emergency');
    
    if (savedDays) setDays(JSON.parse(savedDays));
    if (savedEmergency) setEmergencyEnabled(JSON.parse(savedEmergency));
  }, []);

  const showToast = (message) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
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

  // 2. Yeni Kaydet Fonksiyonu
  const handleSaveSettings = () => {
    localStorage.setItem('voia_quiet_hours', JSON.stringify(days));
    localStorage.setItem('voia_quiet_hours_emergency', JSON.stringify(emergencyEnabled));
    showToast('Sessiz saat ayarlarınız başarıyla kaydedildi!');
  };

  return (
    <div className="w-full">
      {/* Toast Bildirimi */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl bg-[#0f4c3a] dark:bg-[#00BBA7] text-white text-sm font-bold">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {toast.message}
        </div>
      )}

      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-[28px] font-bold text-[#0f4c3a] dark:text-[#00BBA7] mb-1">Sessiz Saatler</h2>
          <p className="text-gray-500 dark:text-[#CBD5E1] text-[15px]">Dinlenme zamanlarınızı ve rahatsız edilmeyeceğiniz saatleri buradan yönetin.</p>
        </div>
        {/* KAYDET BUTONU */}
        <button 
          onClick={handleSaveSettings}
          className="bg-[#0f4c3a] hover:bg-[#0a3629] dark:bg-[#00BBA7] dark:hover:bg-[#009F8E] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
        >
          Ayarları Kaydet
        </button>
      </div>

      <div className="flex gap-8">
        {/* ... (Haftalık program ve Bilgi Kartları HTML kodların aynı kalacak) ... */}
        {/* Çok uzatmamak için aradaki mevcut UI kodlarını buraya yapıştırdığını varsayıyorum */}
        <div className="flex-[2] bg-white dark:bg-[#27272A] rounded-2xl p-6 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none">
          {/* Orijinal Haftalık Program HTML'in */}
           <div className="flex justify-between items-center mb-6">
            <div className="flex items-center text-[#0f4c3a] dark:text-[#00BBA7] font-bold">Haftalık Program</div>
            <button onClick={applyToAll} className="text-sm font-semibold text-[#0f4c3a] dark:text-[#00BBA7] hover:underline">Tüm günlere uygula</button>
          </div>
          <div className="space-y-4">
            {days.map((day, index) => (
              <div key={day.name} className={`flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#71717A]/10 transition-all ${!day.enabled ? 'opacity-60' : ''}`}>
                <div className="flex items-center w-1/3">
                  <button onClick={() => toggleDay(index)} className="relative inline-flex items-center cursor-pointer mr-4">
                    <div className={`w-11 h-6 rounded-full peer transition-colors ${day.enabled ? 'bg-[#0f4c3a] dark:bg-[#00BBA7]' : 'bg-gray-200 dark:bg-[#52525B]'}`} />
                    <div className={`absolute left-[2px] top-[2px] bg-white w-5 h-5 rounded-full border transition-transform ${day.enabled ? 'translate-x-full border-gray-300' : 'translate-x-0 border-gray-300'}`} />
                  </button>
                  <span className={`font-bold ${day.enabled ? 'text-gray-800 dark:text-[#F8FAFC]' : 'text-gray-500'}`}>{day.name}</span>
                </div>
                <div className={`flex items-center gap-3 flex-1 justify-end ${!day.enabled ? 'pointer-events-none' : ''}`}>
                  <input type="time" value={day.startTime} onChange={(e) => updateTime(index, 'startTime', e.target.value)} disabled={!day.enabled} className="w-28 text-center py-2 bg-gray-50 border rounded-lg text-sm font-medium" />
                  <span className="text-gray-400 font-medium">-</span>
                  <input type="time" value={day.endTime} onChange={(e) => updateTime(index, 'endTime', e.target.value)} disabled={!day.enabled} className="w-28 text-center py-2 bg-gray-50 border rounded-lg text-sm font-medium" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orijinal Sağ Taraf Kartları */}
        <div className="flex-1 flex flex-col gap-6">
           {/* ... Acil Durum kartı kodun vs ... */}
        </div>
      </div>
    </div>
  );
}