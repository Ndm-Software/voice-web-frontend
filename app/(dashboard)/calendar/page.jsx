"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getReminders, deleteReminder } from '@/lib/api';
import { useRouter } from 'next/navigation';

const DAY_NAMES = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

export default function CalendarPage() {
  const realToday = new Date(); // Gerçek güncel tarih
  const [selectedDay, setSelectedDay] = useState(realToday.getDate());
  const [calMonth, setCalMonth] = useState(realToday.getMonth());
  const [calYear, setCalYear] = useState(realToday.getFullYear());

  // Gerçek hatırlatıcı verisi
  const [reminders, setReminders] = useState([]);
  const [loadingRem, setLoadingRem] = useState(true);

  const router = useRouter();

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
    const isConfirmed = window.confirm("Bu hatırlatıcıyı silmek istediğinize emin misiniz?");
    if (!isConfirmed) return;

    try {
      await deleteReminder(reminderId);
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

  // 2. Mevcut Ayın Günleri
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday =
      realToday.getDate() === i &&
      realToday.getMonth() === calMonth &&
      realToday.getFullYear() === calYear;

    calendarCells.push({ day: i, isCurrentMonth: true, isToday });
  }

  // 3. Sonraki Ayın Günleri
  const totalCells = calendarCells.length;
  const remainingCells = totalCells > 35 ? 42 - totalCells : 35 - totalCells;
  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push({ day: i, isCurrentMonth: false });
  }

  // Seçili güne ait hatırlatıcıları filtrele
  const dayReminders = reminders.filter((r) => {
    const d = new Date(r.eventDatetime);
    return (
      d.getFullYear() === calYear &&
      d.getMonth() === calMonth &&
      d.getDate() === selectedDay
    );
  });

  // Hangi günlerde etkinlik var?
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

        {/* Takvim Üst Kontrolleri (Seçiciler kaldırıldı, tamamen sadeleştirildi) */}
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
                  className={`border-b border-r border-gray-100 dark:border-white/10 p-2 text-sm font-medium cursor-pointer transition-colors flex flex-col items-end ${isSelected
                      ? 'bg-teal-50/80 dark:bg-[#00BBA7]/10 text-[#0f4c3a] dark:text-[#00BBA7] font-bold'
                      : 'text-gray-800 dark:text-[#CBD5E1] hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                >
                  <span
                    className={`flex items-center justify-center text-xs font-bold ${cell.isToday
                        ? 'w-6 h-6 rounded-full bg-[#0f4c3a] dark:bg-[#00BBA7] text-white shadow-sm'
                        : ''
                      }`}
                  >
                    {cell.day}
                  </span>

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
                onClick={() => router.push(`/calendar/${r.reminderId || r.id}`)}
                className="group bg-white dark:bg-[#27272A] rounded-xl p-5 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none hover:shadow-md transition-all cursor-pointer relative overflow-hidden flex flex-col min-h-[110px]"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0f4c3a] dark:bg-[#00BBA7]" />
                
                <div className="flex justify-between items-start mb-3 pl-2">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide bg-[#0f4c3a]/10 dark:bg-[#00BBA7]/10 text-[#0f4c3a] dark:text-[#00BBA7]">
                    {r.repeatType === 'NONE' ? 'TEK' 
                      : r.repeatType === 'DAILY' ? 'GÜNLÜK' 
                      : r.repeatType === 'WEEKLY' ? 'HAFTALIK' 
                      : 'AYLIK'}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-[#F8FAFC] bg-gray-50 dark:bg-[#1A1A1A]/60 px-2.5 py-1 rounded-lg border border-gray-100 dark:border-white/5">
                    <svg className="w-3.5 h-3.5 text-[#0f4c3a] dark:text-[#00BBA7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{timeStr}</span>
                  </div>
                </div>

                <div className="pl-2 pr-2 mb-1 flex-1">
                  <h4 className="font-bold text-gray-800 dark:text-[#F8FAFC] text-[15px] mb-1 pr-16">{r.title}</h4>
                  {r.description && (
                    <p className="text-gray-500 dark:text-[#CBD5E1] text-[13px] line-clamp-2 pr-16">{r.description}</p>
                  )}
                </div>

                <div className="absolute right-3 bottom-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/calendar/${r.reminderId || r.id}`);
                    }}
                    title="Düzenle"
                    className="p-1.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200/70 dark:border-white/10 text-gray-500 hover:text-[#0f4c3a] hover:bg-teal-50 dark:text-[#CBD5E1] dark:hover:bg-[#00BBA7]/20 dark:hover:text-[#00BBA7] rounded-lg shadow-sm transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(r.reminderId || r.id);
                    }}
                    title="Sil"
                    className="p-1.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200/70 dark:border-white/10 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-[#CBD5E1] dark:hover:bg-red-500/20 dark:hover:text-red-400 rounded-lg shadow-sm transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}