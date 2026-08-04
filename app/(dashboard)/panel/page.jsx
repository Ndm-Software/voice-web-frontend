"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

// Ekim 2023 takvim verisi (sabit demo)
const CALENDAR_DAYS = [
  { day: 27, prev: true }, { day: 28, prev: true }, { day: 29, prev: true }, { day: 30, prev: true },
  { day: 1 }, { day: 2 }, { day: 3 },
  { day: 4 }, { day: 5 }, { day: 6 }, { day: 7 }, { day: 8 }, { day: 9 }, { day: 10 },
  { day: 11, today: true, hasEvent: true }, { day: 12 }, { day: 13 }, { day: 14 },
  { day: 15, hasDot: true },
];

export default function DashboardPage() {
  const [calMonth, setCalMonth] = useState(9); // Ekim = 9
  const [calYear, setCalYear]   = useState(2023);
  const [selectedDay, setSelectedDay] = useState(11);

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto">

      {/* Karşılama Başlığı */}
      <div className="mb-8">
        <h2 className="text-[28px] font-bold text-[#0f4c3a] dark:text-[#00BBA7] mb-1">Merhaba, Selin!</h2>
        <p className="text-gray-500 dark:text-[#CBD5E1] text-[15px]">
          İşte bugün için planladıkların ve asistanının notları.
        </p>
      </div>

      {/* Üst İstatistik Kartları */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <Link href="/calendar" className="bg-white dark:bg-[#27272A] rounded-2xl p-6 flex items-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] dark:shadow-none dark:border dark:border-white/10 hover:shadow-md dark:hover:border-[#00BBA7]/40 transition-all cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-[#00BBA7]/10 flex items-center justify-center text-[#0f4c3a] dark:text-[#00BBA7] mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wider mb-1">AKTİF HATIRLATICILAR</p>
            <p className="text-[22px] font-extrabold text-gray-800 dark:text-[#F8FAFC] leading-none">12</p>
          </div>
        </Link>

        <Link href="/history" className="bg-white dark:bg-[#27272A] rounded-2xl p-6 flex items-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] dark:shadow-none dark:border dark:border-white/10 hover:shadow-md dark:hover:border-[#00BBA7]/40 transition-all cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-[#00BBA7]/10 flex items-center justify-center text-[#0f4c3a] dark:text-[#00BBA7] mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wider mb-1">BUGÜNKİ ARAMALAR</p>
            <p className="text-[22px] font-extrabold text-gray-800 dark:text-[#F8FAFC] leading-none">4</p>
          </div>
        </Link>

        <Link href="/quiet-hours" className="bg-white dark:bg-[#27272A] rounded-2xl p-6 flex items-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] dark:shadow-none dark:border dark:border-white/10 hover:shadow-md dark:hover:border-[#00BBA7]/40 transition-all cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-[#71717A]/20 flex items-center justify-center text-gray-400 dark:text-[#CBD5E1] mr-4 border border-gray-100 dark:border-[#52525B]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wider mb-1">SESSİZ SAAT DURUMU</p>
            <p className="text-[22px] font-extrabold text-gray-800 dark:text-[#F8FAFC] leading-none">Kapalı</p>
          </div>
        </Link>
      </div>

      {/* Alt İçerik Izgarası */}
      <div className="grid grid-cols-3 gap-8">

        {/* SOL BÖLÜM: Yaklaşan Hatırlatıcılar */}
        <div className="col-span-2">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-base font-bold text-gray-800 dark:text-[#F8FAFC]">Yaklaşan Hatırlatıcılar</h3>
            <Link
              href="/history"
              className="text-sm font-semibold text-[#0f4c3a] dark:text-[#00BBA7] hover:underline flex items-center"
            >
              Tümünü Gör
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="space-y-4">
            {/* Hatırlatıcı 1 */}
            <Link
              href="/calendar"
              className="bg-white dark:bg-[#27272A] rounded-[16px] p-5 flex items-center shadow-sm dark:shadow-none dark:border dark:border-white/10 relative overflow-hidden h-[76px] hover:shadow-md dark:hover:border-[#00BBA7]/40 transition-all cursor-pointer block"
            >
              <div className="absolute left-6 top-5 bottom-5 w-1.5 rounded-full bg-[#0f4c3a] dark:bg-[#00BBA7]" />
              <div className="pl-12">
                <h4 className="font-bold text-gray-800 dark:text-[#F8FAFC] text-[15px]">Doktor Randevusu - Diş Hekimi</h4>
                <p className="text-[13px] text-gray-500 dark:text-[#CBD5E1] mt-0.5">Bugün, 14:30 • Sesli Bildirim Açık</p>
              </div>
            </Link>

            {/* Hatırlatıcı 2 */}
            <Link
              href="/calendar"
              className="bg-white dark:bg-[#27272A] rounded-[16px] p-5 flex items-center shadow-sm dark:shadow-none dark:border dark:border-white/10 relative overflow-hidden h-[76px] hover:shadow-md dark:hover:border-[#00BBA7]/40 transition-all cursor-pointer block"
            >
              <div className="absolute left-6 top-5 bottom-5 w-1.5 rounded-full bg-[#0f4c3a] dark:bg-[#00BBA7]" />
              <div className="pl-12">
                <h4 className="font-bold text-gray-800 dark:text-[#F8FAFC] text-[15px]">Market Alışveriş Listesi</h4>
                <p className="text-[13px] text-gray-500 dark:text-[#CBD5E1] mt-0.5">Yarın, 10:00 • Konum Bazlı</p>
              </div>
            </Link>

            {/* Hatırlatıcı 3 */}
            <Link
              href="/calendar"
              className="bg-white dark:bg-[#27272A] rounded-[16px] p-5 flex items-center shadow-sm dark:shadow-none dark:border dark:border-white/10 relative overflow-hidden h-[76px] opacity-70 hover:opacity-100 hover:shadow-md dark:hover:border-[#00BBA7]/40 transition-all cursor-pointer block"
            >
              <div className="absolute left-6 top-5 bottom-5 w-1.5 rounded-full bg-gray-300 dark:bg-[#71717A]" />
              <div className="pl-12">
                <h4 className="font-bold text-gray-800 dark:text-[#F8FAFC] text-[15px]">Anneyi Ara - Doğum Günü</h4>
                <p className="text-[13px] text-gray-500 dark:text-[#CBD5E1] mt-0.5">15 Ekim, 18:00 • Tekrarlayan</p>
              </div>
            </Link>

            {/* Yeni Hatırlatıcı Ekle */}
            <Link
              href="/calendar/new"
              className="w-full mt-2 h-[76px] rounded-[16px] border-2 border-dashed border-gray-200 dark:border-[#52525B] text-gray-500 dark:text-[#CBD5E1] font-semibold text-[15px] hover:bg-gray-50 dark:hover:bg-[#3F3F46]/60 hover:border-gray-300 dark:hover:border-[#71717A] transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Yeni Hatırlatıcı Ekle
            </Link>
          </div>
        </div>

        {/* SAĞ BÖLÜM: Takvim ve Sesli Asistan */}
        <div className="col-span-1 flex flex-col gap-6">

          {/* Mini Takvim Kartı */}
          <div className="bg-white dark:bg-[#27272A] rounded-2xl p-6 shadow-sm dark:shadow-none dark:border dark:border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-[13px] font-bold text-gray-800 dark:text-[#F8FAFC] uppercase tracking-wide">
                {MONTHS[calMonth].toUpperCase()} {calYear}
              </h4>
              <div className="flex gap-2 text-gray-400 dark:text-[#71717A]">
                <button
                  onClick={prevMonth}
                  className="hover:text-gray-800 dark:hover:text-[#F8FAFC] transition-colors p-0.5 rounded"
                  aria-label="Önceki ay"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextMonth}
                  className="hover:text-gray-800 dark:hover:text-[#F8FAFC] transition-colors p-0.5 rounded"
                  aria-label="Sonraki ay"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Takvim Izgarası */}
            <div className="grid grid-cols-7 gap-y-4 text-center text-[13px]">
              {['Pt','Sa','Ça','Pe','Cu','Ct','Pz'].map((d) => (
                <div key={d} className="text-gray-400 dark:text-[#71717A] font-medium mb-1">{d}</div>
              ))}

              {/* Önceki ay günleri */}
              <div className="text-gray-300 dark:text-[#52525B]">27</div>
              <div className="text-gray-300 dark:text-[#52525B]">28</div>
              <div className="text-gray-300 dark:text-[#52525B]">29</div>
              <div className="text-gray-300 dark:text-[#52525B]">30</div>
              <div className="text-gray-700 dark:text-[#CBD5E1] font-medium cursor-pointer hover:text-[#0f4c3a] dark:hover:text-[#00BBA7]" onClick={() => setSelectedDay(1)}>1</div>
              <div className="text-gray-700 dark:text-[#CBD5E1] font-medium cursor-pointer hover:text-[#0f4c3a] dark:hover:text-[#00BBA7]" onClick={() => setSelectedDay(2)}>2</div>
              <div className="text-gray-700 dark:text-[#CBD5E1] font-medium cursor-pointer hover:text-[#0f4c3a] dark:hover:text-[#00BBA7]" onClick={() => setSelectedDay(3)}>3</div>

              {[4,5,6,7,8,9,10].map((d) => (
                <div
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`font-medium cursor-pointer transition-colors ${
                    selectedDay === d
                      ? 'bg-[#0f4c3a] dark:bg-[#00BBA7] text-white font-bold rounded-full w-[26px] h-[26px] flex items-center justify-center mx-auto shadow-md'
                      : 'text-gray-700 dark:text-[#CBD5E1] hover:text-[#0f4c3a] dark:hover:text-[#00BBA7]'
                  }`}
                >
                  {d}
                </div>
              ))}

              {/* Seçili gün 11 (bugün) */}
              <div
                onClick={() => setSelectedDay(11)}
                className={`cursor-pointer font-bold rounded-full w-[26px] h-[26px] flex items-center justify-center mx-auto shadow-md transition-colors ${
                  selectedDay === 11
                    ? 'bg-[#0f4c3a] dark:bg-[#00BBA7] text-white'
                    : 'bg-[#0f4c3a]/80 dark:bg-[#00BBA7]/80 text-white'
                }`}
              >
                11
              </div>

              {[12,13,14].map((d) => (
                <div
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`font-medium cursor-pointer mt-0.5 transition-colors ${
                    selectedDay === d
                      ? 'bg-[#0f4c3a] dark:bg-[#00BBA7] text-white font-bold rounded-full w-[26px] h-[26px] flex items-center justify-center mx-auto shadow-md'
                      : 'text-gray-700 dark:text-[#CBD5E1] hover:text-[#0f4c3a] dark:hover:text-[#00BBA7]'
                  }`}
                >
                  {d}
                </div>
              ))}

              {/* Noktalı gün 15 */}
              <div
                onClick={() => setSelectedDay(15)}
                className={`font-bold mt-0.5 relative cursor-pointer transition-colors ${
                  selectedDay === 15
                    ? 'text-[#0f4c3a] dark:text-[#00BBA7]'
                    : 'text-gray-700 dark:text-[#CBD5E1] hover:text-[#0f4c3a] dark:hover:text-[#00BBA7]'
                }`}
              >
                15
                <div className="w-1 h-1 bg-[#0f4c3a] dark:bg-[#00BBA7] rounded-full absolute bottom-[-4px] left-1/2 -translate-x-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}