"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getReminders, deleteReminder } from '@/lib/api';

const VIEWS = ['Gün', 'Hafta', 'Ay'];
const DAY_NAMES = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

export default function CalendarPage() {
  const realToday = new Date(); // Gerçek güncel tarih
  const [activeView, setActiveView]   = useState('Ay');
  const [selectedDay, setSelectedDay] = useState(realToday.getDate());
  const [calMonth, setCalMonth]       = useState(realToday.getMonth());
  const [calYear, setCalYear]         = useState(realToday.getFullYear());

  // Gerçek hatırlatıcı verisi
  const [reminders, setReminders]     = useState([]);
  const [loadingRem, setLoadingRem]   = useState(true);

  // Sayfa açılışında hatırlatıcıları çek
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const data = await getReminders();
        setReminders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Hatırlatıcılar yüklenemedi:', err);
      } finally {
        setLoadingRem(false);
      }
    };
    fetchReminders();
  }, []);

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
  };

  // --- SİLME FONKSİYONU ---
  const handleDelete = async (reminderId) => {
    // Yanlışlıkla tıklamalara karşı onay iste
    const isConfirmed = window.confirm("Bu hatırlatıcıyı silmek istediğinize emin misiniz?");
    if (!isConfirmed) return;

    try {
      await deleteReminder(reminderId);
      // Başarılı olursa, silinen hatırlatıcıyı state'den filtreleyerek ekrandan anında kaldırıyoruz
      setReminders((prevReminders) => prevReminders.filter((r) => (r.reminderId || r.id) !== reminderId));
    } catch (error) {
      console.error("Silme işlemi başarısız:", error);
      alert("Hatırlatıcı silinirken bir hata oluştu.");
    }
  };

  // --- DİNAMİK TAKVİM HESAPLAMASI ---
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Pazartesiden başlat
  };

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const daysInPrevMonth = getDaysInMonth(calYear, calMonth - 1);

  const calendarCells = [];

  // 1. Önceki Ayın Günleri
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarCells.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
  }

  // 2. Mevcut Ayın Günleri (Bugün kontrolü ile)
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday =
      realToday.getDate() === i &&
      realToday.getMonth() === calMonth &&
      realToday.getFullYear() === calYear;

    calendarCells.push({ day: i, isCurrentMonth: true, isToday });
  }

  // 3. Sonraki Ayın Günleri (Izgarayı 35 veya 42'ye tamamla)
  const totalCells = calendarCells.length;
  const remainingCells = totalCells > 35 ? 42 - totalCells : 35 - totalCells;
  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push({ day: i, isCurrentMonth: false });
  }
  // -----------------------------------

  // Seçili güne ait hatırlatıcıları filtrele
  const dayReminders = reminders.filter((r) => {
    const d = new Date(r.eventDatetime);
    return (
      d.getFullYear() === calYear &&
      d.getMonth()    === calMonth &&
      d.getDate()     === selectedDay
    );
  });

  // Hangi günlerde etkinlik var? (Takvim noktası için)
  const daysWithReminders = new Set(
    reminders
      .filter((r) => {
        const d = new Date(r.eventDatetime);
        return d.getFullYear() === calYear && d.getMonth() === calMonth;
      })
      .map((r) => new Date(r.eventDatetime).getDate())
  );

  return (
    <div className="w-full max-w-[1100px] mx-auto flex flex-col lg:flex-row gap-8">

      {/* SOL: Büyük Takvim */}
      <div className="flex-[2] bg-white dark:bg-[#27272A] rounded-2xl p-6 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none flex flex-col h-[calc(100vh-140px)]">

        {/* Takvim Üst Kontrolleri */}
        <div className="flex justify-between items-center mb-6 px-2">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-[#0f4c3a] dark:text-[#00BBA7]">
              {MONTHS[calMonth]} {calYear}
            </h2>
            <div className="flex gap-2 text-gray-500 dark:text-[#71717A]">
              <button onClick={prevMonth} className="p-1 hover:bg-gray-50 dark:hover:bg-[#71717A]/20 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={nextMonth} className="p-1 hover:bg-gray-50 dark:hover:bg-[#71717A]/20 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Görünüm Seçici */}
          <div className="hidden sm:flex bg-gray-100 dark:bg-[#1A1A1A]/50 rounded-lg p-1">
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

          {/* Dinamik Takvim Hücreleri */}
          <div className="grid grid-cols-7 flex-1">
            {calendarCells.map((cell, index) => {
              if (!cell.isCurrentMonth) {
                return (
                  <div key={index} className="border-b border-r border-gray-100 dark:border-white/10 p-2 text-gray-300 dark:text-[#52525B] text-sm font-medium text-right bg-gray-50/30 dark:bg-black/10">
                    {cell.day}
                  </div>
                );
              }

              const isSelected = selectedDay === cell.day;
              const hasEvent = daysWithReminders.has(cell.day);

              return (
                <div
                  key={index}
                  onClick={() => setSelectedDay(cell.day)}
                  className={`border-b border-r border-gray-100 dark:border-white/10 p-2 text-sm font-medium cursor-pointer transition-colors flex flex-col items-end ${
                    isSelected
                      ? 'bg-teal-50/80 dark:bg-[#00BBA7]/10 text-[#0f4c3a] dark:text-[#00BBA7] font-bold'
                      : 'text-gray-800 dark:text-[#CBD5E1] hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  {/* BUGÜN İŞARETLEYİCİSİ: Eğer bugün ise yeşil daire rozeti içinde göster */}
                  <span
                    className={`flex items-center justify-center text-xs font-bold ${
                      cell.isToday
                        ? 'w-6 h-6 rounded-full bg-[#0f4c3a] dark:bg-[#00BBA7] text-white shadow-sm'
                        : ''
                    }`}
                  >
                    {cell.day}
                  </span>

                  {/* Etkinlik (Hatırlatıcı) İndikatörü */}
                  {hasEvent && (
                    <div className={`w-full h-1.5 rounded-full mt-auto mb-1 ${isSelected ? 'bg-[#0f4c3a] dark:bg-[#00BBA7]' : 'bg-[#0f4c3a]/50 dark:bg-[#00BBA7]/50'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SAĞ: Seçili Günün Detayları */}
      <div className="flex-1 flex flex-col">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-[#0f4c3a] dark:text-[#00BBA7]">
            {selectedDay} {MONTHS[calMonth]}, {calYear}
          </h3>
          <p className="text-gray-500 dark:text-[#CBD5E1] text-sm mt-1">
            {loadingRem
              ? 'Yükleniyor...'
              : dayReminders.length > 0
                ? `${dayReminders.length} Hatırlatıcı Planlandı`
                : 'Planlanmış etkinlik yok'
            }
          </p>
        </div>

        <div className="flex-1 space-y-4">
          {!loadingRem && dayReminders.length === 0 && (
            <div className="bg-white dark:bg-[#27272A] rounded-xl p-8 border border-gray-100 dark:border-white/10 shadow-sm text-center">
              <p className="text-gray-400 dark:text-[#71717A] text-sm font-medium mb-4">Bu gün için etkinlik yok.</p>
              {/* URL'ye seçili tarihi YYYY-MM-DD formatında ekliyoruz */}
              <Link
                href={`/calendar/new?date=${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`}
                className="inline-flex items-center px-4 py-2 bg-[#0f4c3a] dark:bg-[#00BBA7] text-white text-sm font-bold rounded-xl hover:bg-[#0a3629] dark:hover:bg-[#009F8E] transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Hatırlatıcı Ekle
              </Link>
            </div>
          )}

          {dayReminders.map((r) => {
            const dt = new Date(r.eventDatetime);
            const timeStr = dt.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
            return (
              <div
                key={r.reminderId || r.id}
                // group class'ını ekledik ki hover (üzerine gelme) efektini yakalayabilelim
                className="group bg-white dark:bg-[#27272A] rounded-xl p-5 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0f4c3a] dark:bg-[#00BBA7]" />
                
                {/* SİLME BUTONU: Normalde görünmez (opacity-0), kartın üzerine gelince görünür (group-hover:opacity-100) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Kartın kendisine tıklanma olayını engeller
                    handleDelete(r.reminderId || r.id);
                  }}
                  title="Hatırlatıcıyı Sil"
                  className="absolute right-4 top-4 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-all opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                <div className="flex justify-between items-start mb-3 pl-2 pr-6">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide bg-[#0f4c3a]/10 dark:bg-[#00BBA7]/10 text-[#0f4c3a] dark:text-[#00BBA7]">
                    {r.repeatType === 'NONE' ? 'TEK' 
                      : r.repeatType === 'DAILY' ? 'GÜNLÜK' 
                      : r.repeatType === 'WEEKLY' ? 'HAFTALIK' 
                      : 'AYLIK'}
                  </span>
                  <span className="text-sm font-bold text-gray-800 dark:text-[#F8FAFC]">{timeStr}</span>
                </div>
                <h4 className="font-bold text-gray-800 dark:text-[#F8FAFC] text-[15px] mb-2 pl-2 pr-6">{r.title}</h4>
                {r.description && (
                  <p className="text-gray-500 dark:text-[#CBD5E1] text-[13px] pl-2 pr-6 line-clamp-2">{r.description}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}