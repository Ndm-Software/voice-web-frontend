"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { updateReminder, getReminderById, getLanguages, getUserSettings } from '@/lib/api';

const REPEAT_OPTIONS = [
  { label: 'Tekrarlanmasın', value: 'NONE'    },
  { label: 'Her Gün',        value: 'DAILY'   },
  { label: 'Her Hafta',      value: 'WEEKLY'  },
  { label: 'Her Ay',         value: 'MONTHLY' },
];

const PUSH_OPTIONS = [
  { label: 'Zamanında', minutes: 0  },
  { label: '5 dk',      minutes: 5  },
  { label: '15 dk',     minutes: 15 },
  { label: '30 dk',     minutes: 30 },
];

const CALL_OPTIONS = [
  { label: 'Yok',       minutes: undefined },
  { label: 'Zamanında', minutes: 0         },
  { label: '5 dk',      minutes: 5         },
  { label: '10 dk',     minutes: 10        },
];

export default function EditReminderPage() {
  const router = useRouter();
  const params = useParams(); // URL'den ID'yi alıyoruz (/calendar/[id])
  const reminderId = params?.id;

  // Form state
  const [title, setTitle]               = useState('');
  const [description, setDescription]   = useState('');
  const [date, setDate]                 = useState(''); 
  const [time, setTime]                 = useState('');
  const [repeatType, setRepeatType]     = useState('NONE');
  const [isRepeatOpen, setIsRepeatOpen] = useState(false);
  
  const [pushMinutes, setPushMinutes]   = useState(0);       
  const [callMinutes, setCallMinutes]   = useState(undefined); 

  // Dil listesi
  const [loadingLangs, setLoadingLangs] = useState(true);
  const [selectedLangName, setSelectedLangName] = useState('Yükleniyor...');

  // UI state
  const [isFetching, setIsFetching] = useState(true); // İlk veri yükleme
  const [isSaving, setIsSaving]     = useState(false);
  const [error, setError]           = useState(null);
  const [toast, setToast]           = useState(null);

  // 1. Sayfa açılışında Dili ve Mevcut Hatırlatıcıyı Çek
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsFetching(true);
        
        // A. Kullanıcı Dilini Çek
        const settings = await getUserSettings();
        if (settings?.language?.name) {
          setSelectedLangName(settings.language.name);
        } else if (settings?.languageId) {
          const langs = await getLanguages();
          const userLang = langs.find(l => l.languageId === settings.languageId);
          if (userLang) setSelectedLangName(userLang.name);
        } else {
          setSelectedLangName('Türkçe');
        }
        setLoadingLangs(false);

        // B. Mevcut Hatırlatıcıyı Çek
        if (reminderId) {
          const reminder = await getReminderById(reminderId);
          
          setTitle(reminder.title || '');
          setDescription(reminder.description || '');
          setRepeatType(reminder.repeatType || 'NONE');

          // Backend'den gelen ISO tarihi Date objesine çevirip inputlara uygun parçalıyoruz
          if (reminder.eventDatetime) {
            const dt = new Date(reminder.eventDatetime);
            const localDate = dt.toLocaleDateString('sv-SE'); // YYYY-MM-DD
            const localTime = dt.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
            setDate(localDate);
            setTime(localTime);
          }

          if (reminder.pushNotifications?.length > 0) {
            setPushMinutes(reminder.pushNotifications[0].minutesBefore);
          }
          if (reminder.voiceCallSettings?.length > 0) {
            setCallMinutes(reminder.voiceCallSettings[0].minutesBefore);
          }
        }
      } catch (err) {
        console.error('Veriler çekilemedi:', err);
        setError('Hatırlatıcı bilgileri yüklenemedi. Belki silinmiş olabilir.');
      } finally {
        setIsFetching(false);
      }
    };

    fetchInitialData();
  }, [reminderId]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const selectedRepeatLabel = REPEAT_OPTIONS.find(r => r.value === repeatType)?.label ?? 'Tekrarlanmasın';

  // 2. Güncellemeleri Kaydet (Hataya sebep olan isUrgent temizlendi)
  const handleSave = async () => {
    setError(null);

    if (!title.trim()) {
      setError('Lütfen bir başlık girin.');
      return;
    }
    if (!date || !time) {
      setError('Lütfen tarih ve saat girin.');
      return;
    }

    const eventDatetime = new Date(`${date}T${time}:00`).toISOString();
    if (isNaN(new Date(eventDatetime).getTime())) {
      setError('Geçersiz tarih veya saat formatı.');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      eventDatetime,
      repeatType,
    };

    setIsSaving(true);
    try {
      await updateReminder(reminderId, payload);
      
      showToast('Hatırlatıcı başarıyla güncellendi!');
      setTimeout(() => {
        router.push('/calendar');
      }, 1000);
    } catch (err) {
      console.error('Hatırlatıcı güncellenemedi:', err);
      setError(err.message || 'Hatırlatıcı güncellenemedi. Lütfen tekrar deneyin.');
      setIsSaving(false);
    }
  };

  if (isFetching) {
    return (
      <div className="w-full max-w-4xl mx-auto flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-500 font-medium">Hatırlatıcı bilgileri yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto pb-10">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl bg-[#0f4c3a] dark:bg-[#00BBA7] text-white text-sm font-bold">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {toast}
        </div>
      )}

      {/* Üst Geri Dönüş Linki */}
      <Link href="/calendar" className="inline-flex items-center text-sm font-bold text-gray-500 dark:text-[#71717A] hover:text-[#0f4c3a] dark:hover:text-[#00BBA7] transition-colors mb-6 group">
        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mr-3 group-hover:bg-[#0f4c3a] dark:group-hover:bg-[#00BBA7] group-hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </div>
        Takvime Dön
      </Link>

      <div className="mb-8">
        <h2 className="text-[28px] font-bold text-[#0f4c3a] dark:text-[#00BBA7] mb-1">Hatırlatıcıyı Düzenle</h2>
        <p className="text-gray-500 dark:text-[#CBD5E1] text-[15px]">
          Mevcut etkinlik detaylarınızı ve asistan tercihlerinizi güncelleyin.
        </p>
      </div>

      {/* Ana Form Kartı */}
      <div className="bg-white dark:bg-[#27272A] rounded-3xl p-10 shadow-sm border border-gray-100 dark:border-white/10 transition-colors duration-300">
        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>

          {/* Hata mesajı */}
          {error && (
            <div className="px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-sm text-red-600 dark:text-red-400 font-medium">
              {error}
            </div>
          )}

          {/* Başlık */}
          <div>
            <label className="block text-[11px] font-bold text-[#0f4c3a] dark:text-[#00BBA7] uppercase tracking-wider mb-2">
              BAŞLIK *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Toplantı hazırlığı..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1A1A1A]/50 border-none rounded-xl text-gray-800 dark:text-[#F8FAFC] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/25 transition-colors"
            />
          </div>

          {/* Asistan Dili ve Tekrar */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[11px] font-bold text-[#0f4c3a] dark:text-[#00BBA7] uppercase tracking-wider">
                  ASİSTAN DİLİ
                </label>
                <Link href="/profile" className="text-[11px] font-semibold text-[#0f4c3a] dark:text-[#00BBA7] hover:underline">
                  Ayarlardan Değiştir →
                </Link>
              </div>
              <div className="w-full px-4 py-3 bg-gray-100/80 dark:bg-[#1A1A1A]/80 border border-gray-200/60 dark:border-white/10 rounded-xl text-gray-700 dark:text-[#CBD5E1] text-sm font-medium flex justify-between items-center cursor-not-allowed">
                <span>{loadingLangs ? 'Yükleniyor...' : selectedLangName}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 bg-gray-200/60 dark:bg-white/10 px-2 py-0.5 rounded-md">
                  Profil
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#0f4c3a] dark:text-[#00BBA7] uppercase tracking-wider mb-2">
                TEKRAR
              </label>
              <div className="relative">
                <div
                  onClick={() => setIsRepeatOpen(!isRepeatOpen)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1A1A1A]/50 rounded-xl text-gray-800 dark:text-[#F8FAFC] text-sm font-medium cursor-pointer flex justify-between items-center transition-all hover:bg-gray-100 dark:hover:bg-[#1A1A1A]/80"
                >
                  <span>{selectedRepeatLabel}</span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isRepeatOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {isRepeatOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-[#00BBA7]/20 rounded-xl shadow-xl overflow-hidden">
                    {REPEAT_OPTIONS.map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => { setRepeatType(opt.value); setIsRepeatOpen(false); }}
                        className={`px-4 py-3 cursor-pointer text-sm font-medium transition-colors flex items-center justify-between ${
                          repeatType === opt.value
                            ? 'bg-teal-50 dark:bg-[#00BBA7]/10 text-[#0f4c3a] dark:text-[#00BBA7]'
                            : 'text-gray-700 dark:text-[#CBD5E1] hover:bg-gray-50 dark:hover:bg-[#2A2A2A]'
                        }`}
                      >
                        {opt.label}
                        {repeatType === opt.value && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tarih ve Saat */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold text-[#0f4c3a] dark:text-[#00BBA7] uppercase tracking-wider mb-2">
                TARİH *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0F172A]/50 border-none rounded-xl text-gray-800 dark:text-[#F8FAFC] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/25 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#0f4c3a] dark:text-[#00BBA7] uppercase tracking-wider mb-2">
                SAAT *
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0F172A]/50 border-none rounded-xl text-gray-800 dark:text-[#F8FAFC] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/25 transition-colors"
              />
            </div>
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-[11px] font-bold text-[#0f4c3a] dark:text-[#00BBA7] uppercase tracking-wider mb-2">
              AÇIKLAMA
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Hatırlatıcı detaylarını buraya ekleyin..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0F172A]/50 border-none rounded-xl text-gray-800 dark:text-[#F8FAFC] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/25 resize-none transition-colors"
            />
          </div>

          {/* Bildirim ve Sesli Arama Ayarları (Salt Okunur) */}
          <div className="grid grid-cols-2 gap-6 pt-2">
            <div className="opacity-60 pointer-events-none">
              <label className="block text-sm font-bold text-gray-800 dark:text-[#F8FAFC] mb-3">Bildirim (Mevcut Ayar)</label>
              <div className="flex gap-2">
                {PUSH_OPTIONS.map((opt) => (
                  <button key={opt.label} type="button" className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${pushMinutes === opt.minutes ? 'bg-teal-50 dark:bg-[#00BBA7]/10 border-teal-300 dark:border-[#00BBA7]/50 text-[#0f4c3a] dark:text-[#00BBA7]' : 'bg-gray-100 dark:bg-[#71717A]/20 border-transparent text-gray-500 dark:text-[#CBD5E1]'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="opacity-60 pointer-events-none">
              <label className="block text-sm font-bold text-gray-800 dark:text-[#F8FAFC] mb-3">Sesli Arama (Mevcut Ayar)</label>
              <div className="flex gap-2">
                {CALL_OPTIONS.map((opt) => (
                  <button key={opt.label} type="button" className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${callMinutes === opt.minutes ? 'bg-teal-50 dark:bg-[#00BBA7]/10 border-teal-300 dark:border-[#00BBA7]/50 text-[#0f4c3a] dark:text-[#00BBA7]' : 'bg-gray-100 dark:bg-[#71717A]/20 border-transparent text-gray-500 dark:text-[#CBD5E1]'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Alt Butonlar */}
          <div className="flex items-center justify-end gap-6 pt-6">
            <Link href="/calendar" className="text-sm font-bold text-[#0f4c3a] dark:text-[#00BBA7] hover:underline">
              İptal Et
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3.5 bg-[#0f4c3a] dark:bg-[#00BBA7] hover:bg-[#0a3629] dark:hover:bg-[#009F8E] text-white text-sm font-bold rounded-xl transition-colors shadow-sm disabled:opacity-60"
            >
              {isSaving ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}