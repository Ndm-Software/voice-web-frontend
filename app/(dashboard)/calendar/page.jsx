"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const VIEWS = ['Gün', 'Hafta', 'Ay'];

const DAY_NAMES = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

const REMINDERS = [
  {
    id: 1, day: 11, tag: 'İŞ', tagClass: 'bg-[#0f4c3a] dark:bg-[#00BBA7] text-white',
    time: '09:30', title: 'Marketing Sync Call',
    subIcon: 'users', sub: 'Çok Dilli Deşifre Aktif',
  },
  {
    id: 2, day: 11, tag: 'KİŞİSEL', tagClass: 'bg-teal-500 dark:bg-[#34D399] text-white dark:text-[#0F172A]',
    time: '14:15', title: 'Diş Randevusu',
    subIcon: 'location', sub: 'Şehir Diş Merkezi',
  },
  {
    id: 3, day: 11, tag: 'İŞ', tagClass: 'bg-[#0f4c3a] dark:bg-[#00BBA7] text-white',
    time: '16:45', title: 'Almanca Brief Çevirileri',
    subIcon: 'globe', sub: 'Voia AI Entegrasyonu',
  },
];

export default function CalendarPage() {
  const [activeView, setActiveView] = useState('Ay');
  const [selectedDay, setSelectedDay] = useState(11);
  const [calMonth, setCalMonth] = useState(9);
  const [calYear, setCalYear] = useState(2023);

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
  };

  const dayReminders = REMINDERS.filter((r) => r.day === selectedDay);

  return (
    <div className="w-full max-w-[1100px] mx-auto flex gap-8">

      {/* SOL: Büyük Takvim */}
      <div className="flex-[2] bg-white dark:bg-[#27272A] rounded-2xl p-6 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none flex flex-col h-[calc(100vh-140px)]">

        {/* Takvim Üst Kontrolleri */}
        <div className="flex justify-between items-center mb-6 px-2">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-[#0f4c3a] dark:text-[#00BBA7]">
              {MONTHS[calMonth]} {calYear}
            </h2>
            <div className="flex gap-2 text-gray-500 dark:text-[#71717A]">
              <button
                onClick={prevMonth}
                className="p-1 hover:bg-gray-50 dark:hover:bg-[#71717A]/20 rounded-lg transition-colors"
                aria-label="Önceki ay"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextMonth}
                className="p-1 hover:bg-gray-50 dark:hover:bg-[#71717A]/20 rounded-lg transition-colors"
                aria-label="Sonraki ay"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Görünüm Seçici */}
          <div className="flex bg-gray-100 dark:bg-[#1A1A1A]/50 rounded-lg p-1">
            {VIEWS.map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-5 py-1.5 text-sm rounded-md transition-all ${
                  activeView === view
                    ? 'font-bold bg-white dark:bg-[#27272A] text-[#0f4c3a] dark:text-[#00BBA7] shadow-sm'
                    : 'font-medium text-gray-500 dark:text-[#71717A] hover:text-gray-800 dark:hover:text-[#CBD5E1]'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        {/* Takvim Izgarası */}
        <div className="flex-1 flex flex-col border border-gray-100 dark:border-white/10 rounded-xl overflow-hidden">
          {/* Gün İsimleri */}
          <div className="grid grid-cols-7 border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-[#1A1A1A]/40">
            {DAY_NAMES.map((day) => (
              <div key={day} className="py-3 text-center text-[13px] font-bold text-gray-500 dark:text-[#71717A]">
                {day}
              </div>
            ))}
          </div>

          {/* Takvim Hücreleri */}
          <div className="grid grid-cols-7 flex-1">
            {/* 1. Hafta - önceki ay */}
            {[25,26,27,28].map((d) => (
              <div key={`prev-${d}`} className={`border-b border-r border-gray-100 dark:border-white/10 p-2 text-gray-300 dark:text-[#52525B] text-sm font-medium text-right`}>
                {d}
              </div>
            ))}
            {[1,2,3].map((d) => (
              <div
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`border-b ${d !== 3 ? 'border-r' : ''} border-gray-100 dark:border-white/10 p-2 text-sm font-medium text-right cursor-pointer transition-colors ${
                  selectedDay === d
                    ? 'bg-teal-50/80 dark:bg-[#00BBA7]/10 text-[#0f4c3a] dark:text-[#00BBA7] font-bold'
                    : 'text-gray-800 dark:text-[#CBD5E1] hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                {d}
              </div>
            ))}

            {/* 2. Hafta */}
            {[4,5,6,7,8,9,10].map((d, i) => (
              <div
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`border-b ${i < 6 ? 'border-r' : ''} border-gray-100 dark:border-white/10 p-2 text-sm font-medium text-right cursor-pointer transition-colors flex flex-col items-end ${
                  selectedDay === d
                    ? 'bg-teal-50/80 dark:bg-[#00BBA7]/10 text-[#0f4c3a] dark:text-[#00BBA7] font-bold'
                    : 'text-gray-800 dark:text-[#CBD5E1] hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                <span>{d}</span>
                {d === 4 && <div className="w-full h-1.5 bg-[#0f4c3a] dark:bg-[#00BBA7] rounded-full mt-auto mb-1" />}
              </div>
            ))}

            {/* 3. Hafta */}
            {[9,10].map((d, i) => (
              <div
                key={`w3-${d}`}
                onClick={() => setSelectedDay(d)}
                className={`border-b border-r border-gray-100 dark:border-white/10 p-2 text-sm font-medium text-right cursor-pointer transition-colors ${
                  selectedDay === d
                    ? 'bg-teal-50/80 dark:bg-[#00BBA7]/10 text-[#0f4c3a] dark:text-[#00BBA7] font-bold'
                    : 'text-gray-800 dark:text-[#CBD5E1] hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                {d}
              </div>
            ))}
            {/* Seçili gün 11 */}
            <div
              onClick={() => setSelectedDay(11)}
              className={`border-b border-r border-gray-100 dark:border-white/10 p-2 font-bold text-right flex flex-col items-end cursor-pointer transition-colors ${
                selectedDay === 11
                  ? 'bg-teal-50/80 dark:bg-[#00BBA7]/10'
                  : 'hover:bg-gray-50 dark:hover:bg-white/5 bg-teal-50/50 dark:bg-[#00BBA7]/10'
              }`}
            >
              <span className="text-[#0f4c3a] dark:text-[#00BBA7]">11</span>
              <div className="w-full mt-auto space-y-1 mb-1">
                <div className="w-full h-1.5 bg-[#0f4c3a] dark:bg-[#00BBA7] rounded-full" />
                <div className="w-full h-1.5 bg-teal-600 dark:bg-[#00BBA7]/60 rounded-full opacity-80" />
              </div>
            </div>
            {[12,13,14,15].map((d, i) => (
              <div
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`border-b ${i < 3 ? 'border-r' : ''} border-gray-100 dark:border-white/10 p-2 text-sm font-medium text-right cursor-pointer transition-colors ${
                  selectedDay === d
                    ? 'bg-teal-50/80 dark:bg-[#00BBA7]/10 text-[#0f4c3a] dark:text-[#00BBA7] font-bold'
                    : 'text-gray-800 dark:text-[#CBD5E1] hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                {d}
              </div>
            ))}

            {/* 4. Hafta */}
            {[16,17,18,19,20,21,22].map((d, i) => (
              <div
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`border-b ${i < 6 ? 'border-r' : ''} border-gray-100 dark:border-white/10 p-2 text-sm font-medium text-right cursor-pointer transition-colors flex flex-col items-end ${
                  selectedDay === d
                    ? 'bg-teal-50/80 dark:bg-[#00BBA7]/10 text-[#0f4c3a] dark:text-[#00BBA7] font-bold'
                    : 'text-gray-800 dark:text-[#CBD5E1] hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                <span>{d}</span>
                {d === 17 && <div className="w-full h-1.5 bg-[#0f4c3a] dark:bg-[#00BBA7] rounded-full mt-auto mb-1" />}
              </div>
            ))}

            {/* 5. Hafta */}
            {[23,24,25,26,27,28,29].map((d, i) => (
              <div
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`${i < 6 ? 'border-r' : ''} border-gray-100 dark:border-white/10 p-2 text-sm font-medium text-right cursor-pointer transition-colors ${
                  selectedDay === d
                    ? 'bg-teal-50/80 dark:bg-[#00BBA7]/10 text-[#0f4c3a] dark:text-[#00BBA7] font-bold'
                    : 'text-gray-800 dark:text-[#CBD5E1] hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                {d}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SAĞ: Günün Detayları */}
      <div className="flex-1 flex flex-col">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-[#0f4c3a] dark:text-[#00BBA7]">
            {selectedDay} {MONTHS[calMonth]}, {['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar'][(selectedDay + 1) % 7]}
          </h3>
          <p className="text-gray-500 dark:text-[#CBD5E1] text-sm mt-1">
            {dayReminders.length > 0 ? `${dayReminders.length} Hatırlatıcı Planlandı` : 'Planlanmış etkinlik yok'}
          </p>
        </div>

        <div className="flex-1 space-y-4">
          {dayReminders.length === 0 && (
            <div className="bg-white dark:bg-[#27272A] rounded-xl p-8 border border-gray-100 dark:border-white/10 shadow-sm text-center">
              <p className="text-gray-400 dark:text-[#71717A] text-sm font-medium mb-4">Bu gün için etkinlik yok.</p>
              <Link
                href="/calendar/new"
                className="inline-flex items-center px-4 py-2 bg-[#0f4c3a] dark:bg-[#00BBA7] text-white text-sm font-bold rounded-xl hover:bg-[#0a3629] dark:hover:bg-[#009F8E] transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Hatırlatıcı Ekle
              </Link>
            </div>
          )}

          {dayReminders.map((r) => (
            <div
              key={r.id}
              className="bg-white dark:bg-[#27272A] rounded-xl p-5 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide ${r.tagClass}`}>
                  {r.tag}
                </span>
                <span className="text-sm font-bold text-gray-800 dark:text-[#F8FAFC]">{r.time}</span>
              </div>
              <h4 className="font-bold text-gray-800 dark:text-[#F8FAFC] text-[15px] mb-2">{r.title}</h4>
              <div className="flex items-center text-gray-500 dark:text-[#CBD5E1] text-[13px]">
                {r.subIcon === 'users' && (
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )}
                {r.subIcon === 'location' && (
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
                {r.subIcon === 'globe' && (
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                )}
                {r.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Voia Dinliyor Mini Kartı */}
        <div className="bg-[#e2f1ec] dark:bg-[#00BBA7]/10 rounded-xl p-5 flex items-center mt-6 shadow-sm dark:shadow-none border border-teal-100 dark:border-[#00BBA7]/30">
          <div className="w-12 h-12 bg-[#0f4c3a] dark:bg-[#00BBA7] rounded-full flex items-center justify-center shrink-0 mr-4 shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-[#0f4c3a] dark:text-[#00BBA7] text-sm">Voia dinliyor...</h4>
            <p className="text-[#0f4c3a] dark:text-[#CBD5E1] text-[12px] italic opacity-80 mt-0.5">
              "Bana bir hatırlatıcı eklememi söyle..."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}