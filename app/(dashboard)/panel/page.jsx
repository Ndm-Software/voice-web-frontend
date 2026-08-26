"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUserProfile, getReminders, updateDevice, deleteReminder } from '@/lib/api'; // deleteReminder eklendi
import { requestPushPermissionAndGetToken } from '@/lib/firebase';
import { onForegroundMessage } from '@/lib/firebase';
import toast from 'react-hot-toast';

const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [reminders, setReminders] = useState([]);
  const [loadingRem, setLoadingRem] = useState(true);

  // Sessiz Saatler için yeni durum state'i
  const [quietHoursStatus, setQuietHoursStatus] = useState("Hesaplanıyor...");

  // Gerçek zamanlı başlangıç tarihleri
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const router = useRouter();

  // 1. KULLANICI VE HATIRLATICI VERİLERİNİ ÇEKME
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);
      } catch (error) {
        console.error("Kullanıcı verisi çekilemedi:", error);
      } finally {
        setLoadingUser(false);
      }
    };

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

    fetchUser();
    fetchReminders();
    // fetchSettings() BURADAN KALDIRILDI!
  }, []);

  // 2. AKILLI SESSİZ SAATLER HESAPLAYICISI (LOCALSTORAGE)
  useEffect(() => {
    const calculateQuietHours = () => {
      const savedSettings = localStorage.getItem('voia_quiet_hours');
      if (!savedSettings) {
        setQuietHoursStatus("Kapalı"); // Ayar yapılmamışsa varsayılan olarak kapalı
        return;
      }

      const daysConfig = JSON.parse(savedSettings);
      const now = new Date();

      // JavaScript'te pazar=0, pzt=1'dir. Bizim days dizimizde pzt=0, pazar=6
      const jsDayToConfigIndex = [6, 0, 1, 2, 3, 4, 5];
      const todayConfig = daysConfig[jsDayToConfigIndex[now.getDay()]];

      if (!todayConfig.enabled) {
        setQuietHoursStatus("Kapalı");
        return;
      }

      // Saatleri dakikaya çevirip karşılaştırma yapıyoruz
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const [startH, startM] = todayConfig.startTime.split(':').map(Number);
      const [endH, endM] = todayConfig.endTime.split(':').map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      let isActive = false;
      if (startMinutes > endMinutes) {
        // Gece yarısını geçiyor (Örn: 22:00'den ertesi sabah 07:00'ye)
        isActive = currentMinutes >= startMinutes || currentMinutes <= endMinutes;
      } else {
        // Aynı gün içinde (Örn: 10:00'dan 15:00'e)
        isActive = currentMinutes >= startMinutes && currentMinutes <= endMinutes;
      }

      setQuietHoursStatus(isActive ? "Açık" : "Kapalı");
    };

    calculateQuietHours();

    // Her 1 dakikada bir saati kontrol edip durumu güncellesin
    const interval = setInterval(calculateQuietHours, 60000);
    return () => clearInterval(interval);
  }, []);

  // 3. ÖN PLAN BİLDİRİM DİNLEYİCİSİ
  useEffect(() => {
    const unsubscribe = onForegroundMessage((payload) => {
      const title = payload?.notification?.title || 'Yeni Bildirim';
      const body = payload?.notification?.body || '';

      toast(
        (t) => (
          <div className="flex flex-col gap-1">
            <span className="font-bold text-[15px] text-[#00BBA7]">{title}</span>
            <span className="text-sm text-gray-200">{body}</span>
          </div>
        ),
        {
          icon: '🔔',
          id: payload?.messageId,
        }
      );
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // 4. FİREBASE VE CİHAZ KAYDI
  useEffect(() => {
    const initFirebaseAndRegisterDevice = async () => {
      let pushToken = null;

      try {
        pushToken = await requestPushPermissionAndGetToken();
      } catch (firebaseError) {
        console.warn("Firebase hatası:", firebaseError.message);
      }

      try {
        if (pushToken) {
          await updateDevice({
            installationId: localStorage.getItem('voia_installation_id') || "Bilinmeyen-ID",
            platform: 'WEB',
            deviceName: window.navigator.userAgent.substring(0, 99),
            pushToken: pushToken
          });
        }
      } catch (apiError) {
        if (apiError?.status === 409) {
          console.warn("Sistem Notu: Bu tarayıcıdaki token zaten aktif. Uygulama normal çalışmasına devam ediyor.");
        } else {
          console.error("Cihaz kaydedilirken hata:", apiError);
        }
      }
    };

    initFirebaseAndRegisterDevice();
  }, []);

  // Panel sayfası için silme fonksiyon
  const handleDelete = async (e, reminderId) => {
    e.stopPropagation();
    const isConfirmed = window.confirm("Bu hatırlatıcıyı silmek istediğinize emin misiniz?");
    if (!isConfirmed) return;

    try {
      await deleteReminder(reminderId);
      setReminders((prev) => prev.filter((r) => (r.reminderId || r.id) !== reminderId));
      toast.success("Hatırlatıcı başarıyla silindi");
    } catch (error) {
      console.error(error);
      toast.error("Hatırlatıcı silinirken bir hata oluştu");
    }
  };

  // Bugüne ait hatırlatıcılar
  const today = new Date();
  const upcomingReminders = reminders
    .filter((r) => new Date(r.eventDatetime) >= today)
    .sort((a, b) => new Date(a.eventDatetime) - new Date(b.eventDatetime))
    .slice(0, 3);

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const daysInPrevMonth = getDaysInMonth(calYear, calMonth - 1);

  const calendarCells = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    calendarCells.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
  }

  const currentDate = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const hasReminder = reminders.some(r => {
      const d = new Date(r.eventDatetime);
      return d.getFullYear() === calYear && d.getMonth() === calMonth && d.getDate() === i;
    });

    const isToday = currentDate.getFullYear() === calYear && currentDate.getMonth() === calMonth && currentDate.getDate() === i;
    calendarCells.push({ day: i, isCurrentMonth: true, isToday, hasReminder });
  }

  const totalCells = calendarCells.length;
  const remainingCells = totalCells > 35 ? 42 - totalCells : 35 - totalCells;
  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push({ day: i, isCurrentMonth: false });
  }

  return (
    <div className="w-full max-w-[1000px] mx-auto">
      <div className="mb-8">
        <h2 className="text-[28px] font-bold text-[#0f4c3a] dark:text-[#00BBA7] mb-1">
          {loadingUser ? 'Yükleniyor...' : `Merhaba, ${user?.firstName || 'Kullanıcı'}!`}
        </h2>
        <p className="text-gray-500 dark:text-[#CBD5E1] text-[15px]">
          İşte bugün için planladıkların ve asistanının notları.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-10">
        <Link href="/calendar" className="bg-white dark:bg-[#27272A] rounded-2xl p-6 flex items-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] dark:shadow-none dark:border dark:border-white/10 hover:shadow-md dark:hover:border-[#00BBA7]/40 transition-all cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-[#00BBA7]/10 flex items-center justify-center text-[#0f4c3a] dark:text-[#00BBA7] mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wider mb-1">AKTİF HATIRLATICILAR</p>
            <p className="text-[22px] font-extrabold text-gray-800 dark:text-[#F8FAFC] leading-none">
              {loadingRem ? '...' : reminders.length}
            </p>
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
          <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-[#00BBA7]/10 flex items-center justify-center text-[#0f4c3a] dark:text-[#00BBA7] mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wider mb-1">SESSİZ SAAT DURUMU</p>
            <p className={`text-[22px] font-extrabold leading-none ${quietHoursStatus === 'Açık' ? 'text-[#0f4c3a] dark:text-[#00BBA7]' : 'text-gray-800 dark:text-[#F8FAFC]'}`}>
              {quietHoursStatus}
            </p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-base font-bold text-gray-800 dark:text-[#F8FAFC]">Yaklaşan Hatırlatıcılar</h3>
            <Link href="/calendar" className="text-sm font-semibold text-[#0f4c3a] dark:text-[#00BBA7] hover:underline flex items-center">
              Tümünü Gör
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="space-y-4">
            {loadingRem ? (
              <div className="bg-white dark:bg-[#27272A] rounded-[16px] p-5 flex items-center justify-center h-[76px] border border-gray-100 dark:border-white/10">
                <span className="text-sm text-gray-400 dark:text-[#71717A]">Yükleniyor...</span>
              </div>
            ) : upcomingReminders.length === 0 ? (
              <div className="bg-white dark:bg-[#27272A] rounded-[16px] p-5 flex items-center justify-center h-[76px] border border-gray-100 dark:border-white/10">
                <span className="text-sm text-gray-400 dark:text-[#71717A]">Yakında planlanmış etkinlik yok.</span>
              </div>
            ) : (
              upcomingReminders.map((r) => {
                const dt = new Date(r.eventDatetime);
                const isToday = dt.toDateString() === today.toDateString();
                const dateLabel = isToday
                  ? `Bugün, ${dt.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`
                  : `${dt.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}, ${dt.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
                const repeatLabel = r.repeatType === 'DAILY' ? 'Tekrarlıyor' : r.repeatType === 'WEEKLY' ? 'Haftalık' : '';

                return (
                  <div
                    key={r.reminderId || r.id}
                    onClick={() => router.push('/calendar')} // Karta tıklanınca takvime gider
                    className="group bg-white dark:bg-[#27272A] rounded-[16px] p-5 flex items-center shadow-sm dark:shadow-none dark:border dark:border-white/10 relative overflow-hidden h-[76px] hover:shadow-md dark:hover:border-[#00BBA7]/40 transition-all cursor-pointer block"
                  >
                    <div className="absolute left-6 top-5 bottom-5 w-1.5 rounded-full bg-[#0f4c3a] dark:bg-[#00BBA7]" />
                    <div className="pl-12 flex-1">
                      <h4 className="font-bold text-gray-800 dark:text-[#F8FAFC] text-[15px] truncate max-w-[200px] sm:max-w-[280px]">
                        {r.title}
                      </h4>
                      <p className="text-[13px] text-gray-500 dark:text-[#CBD5E1] mt-0.5">
                        {dateLabel}{repeatLabel ? ` • ${repeatLabel}` : ''}
                      </p>
                    </div>

                    {/* AKSİYON BUTONLARI (Sadece üzerine gelince görünür) */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-[#27272A] pl-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/calendar/${r.reminderId || r.id}`);
                        }}
                        className="p-2 text-gray-400 hover:text-[#0f4c3a] hover:bg-teal-50 dark:hover:bg-[#00BBA7]/10 dark:hover:text-[#00BBA7] rounded-md transition-colors"
                        title="Düzenle"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, r.reminderId || r.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                        title="Sil"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })
            )}

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

        <div className="col-span-1 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#27272A] rounded-2xl p-6 shadow-sm dark:shadow-none dark:border dark:border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-[13px] font-bold text-gray-800 dark:text-[#F8FAFC] uppercase tracking-wide">
                {MONTHS[calMonth].toUpperCase()} {calYear}
              </h4>
              <div className="flex gap-2 text-gray-400 dark:text-[#71717A]">
                <button onClick={prevMonth} className="hover:text-gray-800 dark:hover:text-[#F8FAFC] transition-colors p-0.5 rounded" aria-label="Önceki ay">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button onClick={nextMonth} className="hover:text-gray-800 dark:hover:text-[#F8FAFC] transition-colors p-0.5 rounded" aria-label="Sonraki ay">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-y-4 text-center text-[13px]">
              {['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'].map((d) => (
                <div key={d} className="text-gray-400 dark:text-[#71717A] font-medium mb-1">{d}</div>
              ))}

              {calendarCells.map((cell, index) => {
                if (!cell.isCurrentMonth) {
                  return (
                    <div key={index} className="text-gray-300 dark:text-[#52525B] mt-1">
                      {cell.day}
                    </div>
                  );
                }

                const isSelected = selectedDay === cell.day;

                return (
                  <div key={index} onClick={() => setSelectedDay(cell.day)} className="relative flex justify-center cursor-pointer mt-0.5 group">
                    <div className={`flex items-center justify-center w-[26px] h-[26px] transition-all ${isSelected
                      ? 'bg-[#0f4c3a] dark:bg-[#00BBA7] text-white font-bold rounded-full shadow-md scale-110'
                      : cell.isToday
                        ? 'bg-[#0f4c3a]/80 dark:bg-[#00BBA7]/80 text-white font-bold rounded-full'
                        : 'text-gray-700 dark:text-[#CBD5E1] group-hover:text-[#0f4c3a] dark:group-hover:text-[#00BBA7] font-medium'
                      }`}>
                      {cell.day}
                    </div>
                    {cell.hasReminder && !isSelected && (
                      <div className="w-1 h-1 bg-[#0f4c3a] dark:bg-[#00BBA7] rounded-full absolute -bottom-1.5" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}