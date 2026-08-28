"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { updateReminder, getReminderById, getLanguages, getUserSettings } from '@/lib/api';

const REPEAT_OPTIONS = [
  { label: 'Tekrarlanmasın', value: 'NONE' },
  { label: 'Her Gün', value: 'DAILY' },
  { label: 'Her Hafta', value: 'WEEKLY' },
  { label: 'Her Ay', value: 'MONTHLY' },
];

// Bildirim zamanlama → dakika dönüşümü
const PUSH_OPTIONS = [
  { label: 'Zamanında', minutes: 0 },
  { label: '5 dk önce', minutes: 5 },
  { label: '15 dk önce', minutes: 15 },
  { label: '30 dk önce', minutes: 30 },
];

// Sesli arama zamanlama → dakika dönüşümü (undefined = arama yok)
const CALL_OPTIONS = [
  { label: 'Yok', minutes: null },
  { label: 'Zamanında', minutes: 0 },
  { label: '5 dk önce', minutes: 5 },
  { label: '15 dk önce', minutes: 15 },
];

export default function EditReminderPage() {
  const router = useRouter();
  const params = useParams();
  const reminderId = params?.id;

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [repeatType, setRepeatType] = useState('NONE');
  const [isRepeatOpen, setIsRepeatOpen] = useState(false);
  const [pushMinutes, setPushMinutes] = useState(0);
  const [callMinutes, setCallMinutes] = useState(null);

  // Dil state
  const [loadingLangs, setLoadingLangs] = useState(true);
  const [selectedLangName, setSelectedLangName] = useState('Yükleniyor...');

  // Sayfa Durumları
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!reminderId) {
        setError('Geçersiz hatırlatıcı ID.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // 1. Dil Ayarını Çek
        try {
          const settings = await getUserSettings();
          if (settings?.language?.name) {
            setSelectedLangName(settings.language.name);
          } else if (settings?.languageId) {
            const langs = await getLanguages();
            const userLang = langs.find((l) => l.languageId === settings.languageId);
            if (userLang) setSelectedLangName(userLang.name);
          } else {
            setSelectedLangName('Türkçe');
          }
        } catch (langErr) {
          console.error('Dil bilgisi alınamadı:', langErr);
          setSelectedLangName('Türkçe');
        }

        // 2. Hatırlatıcı Detayını Çek
        const rem = await getReminderById(reminderId);
        if (!rem) throw new Error('Hatırlatıcı bulunamadı.');

        setTitle(rem.title || '');
        setDescription(rem.description || '');
        setRepeatType(rem.repeatType || 'NONE');

        // Tarih ve saat ayrıştırma
        if (rem.eventDatetime) {
          const d = new Date(rem.eventDatetime);
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          const hh = String(d.getHours()).padStart(2, '0');
          const min = String(d.getMinutes()).padStart(2, '0');

          setDate(`${yyyy}-${mm}-${dd}`);
          setTime(`${hh}:${min}`);
        }

        // Bildirim ve Sesli Arama süreleri
        if (rem.pushNotifications && rem.pushNotifications.length > 0) {
          setPushMinutes(Number(rem.pushNotifications[0].minutesBefore ?? 0));
        } else if (typeof rem.pushMinutesBefore === 'number') {
          setPushMinutes(rem.pushMinutesBefore);
        }

        if (rem.voiceCallSettings && rem.voiceCallSettings.length > 0) {
          setCallMinutes(Number(rem.voiceCallSettings[0].minutesBefore));
        } else if (typeof rem.voiceMinutesBefore === 'number') {
          setCallMinutes(rem.voiceMinutesBefore);
        } else {
          setCallMinutes(null);
        }

      } catch (err) {
        console.error('Veri çekme hatası:', err);
        setError(err.message || 'Hatırlatıcı bilgileri yüklenemedi.');
      } finally {
        setIsLoading(false);
        setLoadingLangs(false);
      }
    };

    fetchData();
  }, [reminderId]);

  const selectedRepeatLabel = REPEAT_OPTIONS.find((r) => r.value === repeatType)?.label ?? 'Tekrarlanmasın';

  const handleUpdate = async () => {
    setError(null);

    if (!title.trim()) {
      setError('Lütfen bir başlık girin.');
      return;
    }
    if (!date || !time) {
      setError('Lütfen tarih ve saat girin.');
      return;
    }

    const eventDateObj = new Date(`${date}T${time}:00`);
    if (isNaN(eventDateObj.getTime())) {
      setError('Geçersiz tarih veya saat formatı.');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      eventDatetime: eventDateObj.toISOString(),
      repeatType: repeatType || 'NONE',
      pushMinutesBefore: Number(pushMinutes),
    };

    if (callMinutes !== null && typeof callMinutes === 'number') {
      payload.voiceMinutesBefore = Number(callMinutes);
    }

    setIsSaving(true);
    try {
      await updateReminder(reminderId, payload);
      router.push('/calendar');
    } catch (err) {
      console.error('Güncelleme hatası:', err);
      setError(err.message || 'Hatırlatıcı güncellenirken bir hata oluştu.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-teal-600 dark:text-[#00BBA7] font-bold">
          <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Hatırlatıcı bilgileri yükleniyor...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-[#27272A] rounded-3xl p-10 shadow-sm border border-gray-100 dark:border-white/10 transition-colors duration-300">
        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>

          {/* Hata Bildirimi */}
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
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1A1A1A]/50 border-none rounded-xl text-gray-800 dark:text-[#F8FAFC] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:focus:ring-[#00BBA7]/20 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            />
          </div>

          {/* Asistan Dili ve Tekrar */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[11px] font-bold text-[#0f4c3a] dark:text-[#00BBA7] uppercase tracking-wider">
                  ASİSTAN DİLİ
                </label>
                <Link
                  href="/profile"
                  className="text-[11px] font-semibold text-[#0f4c3a] dark:text-[#00BBA7] hover:underline"
                >
                  Ayarlardan Değiştir →
                </Link>
              </div>
              <div className="w-full px-4 py-3 bg-gray-100/80 dark:bg-[#1A1A1A]/80 border border-gray-200/60 dark:border-white/10 rounded-xl text-gray-700 dark:text-[#CBD5E1] text-sm font-medium flex justify-between items-center cursor-not-allowed">
                <span>{loadingLangs ? 'Yükleniyor...' : selectedLangName}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 bg-gray-200/60 dark:bg-white/10 px-2 py-0.5 rounded-md">
                  Profil Ayarlarından
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
                  <svg className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-300 ${isRepeatOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {isRepeatOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-[#00BBA7]/20 rounded-xl shadow-xl overflow-hidden">
                    {REPEAT_OPTIONS.map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => { setRepeatType(opt.value); setIsRepeatOpen(false); }}
                        className={`px-4 py-3 cursor-pointer text-sm font-medium transition-colors flex items-center justify-between ${repeatType === opt.value
                            ? 'bg-teal-50 dark:bg-[#00BBA7]/10 text-[#0f4c3a] dark:text-[#00BBA7]'
                            : 'text-gray-700 dark:text-[#CBD5E1] hover:bg-gray-50 dark:hover:bg-[#2A2A2A]'
                          }`}
                      >
                        {opt.label}
                        {repeatType === opt.value && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
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
                className="w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-[#0F172A]/50 border-none rounded-xl text-gray-800 dark:text-[#F8FAFC] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:focus:ring-[#00BBA7]/20 transition-colors"
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
                className="w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-[#0F172A]/50 border-none rounded-xl text-gray-800 dark:text-[#F8FAFC] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:focus:ring-[#00BBA7]/20 transition-colors"
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
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0F172A]/50 border-none rounded-xl text-gray-800 dark:text-[#F8FAFC] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:focus:ring-[#00BBA7]/20 placeholder-gray-400 dark:placeholder-gray-500 resize-none transition-colors"
            />
          </div>

          {/* Zamanlama Seçenekleri */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">

            {/* Bildirim Zamanlaması */}
            <div>
              <label className="block text-xs font-bold text-[#0f4c3a] dark:text-[#00BBA7] uppercase tracking-wider mb-3">
                BİLDİRİM ZAMANLAMASI
              </label>
              <div className="flex p-1 bg-gray-50 dark:bg-[#1A1A1A]/60 rounded-2xl border border-gray-100 dark:border-white/5 gap-1.5">
                {PUSH_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setPushMinutes(opt.minutes)}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all text-center ${pushMinutes === opt.minutes
                        ? 'bg-white dark:bg-[#27272A] text-[#0f4c3a] dark:text-[#00BBA7] shadow-sm border border-teal-100 dark:border-[#00BBA7]/30'
                        : 'text-gray-500 dark:text-[#71717A] hover:text-gray-800 dark:hover:text-[#CBD5E1] border border-transparent'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sesli Arama Zamanlaması */}
            <div>
              <label className="block text-xs font-bold text-[#0f4c3a] dark:text-[#00BBA7] uppercase tracking-wider mb-3">
                SESLİ ARAMA ZAMANLAMASI
              </label>
              <div className="flex p-1 bg-gray-50 dark:bg-[#1A1A1A]/60 rounded-2xl border border-gray-100 dark:border-white/5 gap-1.5">
                {CALL_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setCallMinutes(opt.minutes)}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all text-center ${callMinutes === opt.minutes
                        ? 'bg-white dark:bg-[#27272A] text-[#0f4c3a] dark:text-[#00BBA7] shadow-sm border border-teal-100 dark:border-[#00BBA7]/30'
                        : 'text-gray-500 dark:text-[#71717A] hover:text-gray-800 dark:hover:text-[#CBD5E1] border border-transparent'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Alt Butonlar */}
          <div className="flex items-center justify-end gap-6 pt-6">
            <Link
              href="/calendar"
              className="text-sm font-bold text-[#0f4c3a] dark:text-[#00BBA7] hover:text-[#0a3629] dark:hover:text-[#009F8E] transition-colors"
            >
              İptal Et
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3.5 bg-[#0f4c3a] dark:bg-[#00BBA7] hover:bg-[#0a3629] dark:hover:bg-[#009F8E] text-white text-sm font-bold rounded-xl transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {isSaving ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}