"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const INITIAL_FORM = {
  name:      'Selin Aydın',
  email:     'selin.aydin@voia.com',
  phone:     '+90 532 123 45 67',
  language:  'TR',
  notifTime: '30dk',
  callTime:  'Aninda',
};

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [form, setForm]           = useState(INITIAL_FORM);
  const [saved, setSaved]         = useState({ ...INITIAL_FORM });
  const [avatarSrc, setAvatarSrc] = useState(
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces'
  );
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    setSaved({ ...form });
    showToast('Değişiklikler başarıyla kaydedildi.');
  };

  const handleCancel = () => {
    setForm({ ...saved });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarSrc(url);
  };

  const NOTIF_OPTS = [
    { key: '15dk',   label: '15 dk önce' },
    { key: '30dk',   label: '30 dk önce' },
    { key: '1saat',  label: '1 saat önce' },
  ];

  const CALL_OPTS = [
    { key: 'Aninda', label: 'Anında'    },
    { key: '5dk',    label: '5 dk önce' },
    { key: '10dk',   label: '10 dk önce'},
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl bg-[#0f4c3a] dark:bg-[#00BBA7] text-white text-sm font-bold">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {toast.message}
        </div>
      )}

      {/* Başlık */}
      <div className="mb-8">
        <h2 className="text-[28px] font-bold text-[#0f4c3a] dark:text-[#00BBA7] mb-1">Hesap Ayarları</h2>
        <p className="text-gray-500 dark:text-[#CBD5E1] text-[15px]">
          Profil bilgilerinizi yönetin ve asistan tercihlerinizi özelleştirin.
        </p>
      </div>

      <div className="space-y-8">

        {/* KİŞİSEL BİLGİLER KARTI */}
        <div className="bg-white dark:bg-[#3F3F46] rounded-2xl p-8 border border-gray-100 dark:border-[#52525B] shadow-sm dark:shadow-none">
          <div className="flex items-center text-[#0f4c3a] dark:text-[#00BBA7] font-bold text-lg mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Kişisel Bilgiler
          </div>

          <div className="flex gap-10">
            {/* Profil Fotoğrafı */}
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 rounded-2xl bg-gray-100 dark:bg-[#71717A]/30 border border-gray-200 dark:border-[#52525B] overflow-hidden mb-3">
                <img src={avatarSrc} alt="Profil" className="w-full h-full object-cover" />
                {/* Gizli dosya input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 w-8 h-8 bg-[#0f4c3a] dark:bg-[#00BBA7] text-white rounded-lg flex items-center justify-center hover:bg-[#0a3629] dark:hover:bg-[#009F8E] transition-colors shadow-md border border-white dark:border-[#3F3F46]"
                  aria-label="Fotoğraf değiştir"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-sm font-bold text-gray-800 dark:text-[#CBD5E1] hover:text-[#0f4c3a] dark:hover:text-[#00BBA7] transition-colors"
              >
                Fotoğrafı Değiştir
              </button>
            </div>

            {/* Form Elemanları */}
            <div className="flex-1 grid grid-cols-2 gap-6">
              {/* Ad Soyad */}
              <div className="col-span-1">
                <label className="block text-xs font-bold text-gray-800 dark:text-[#CBD5E1] mb-2">Ad Soyad</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50/50 dark:bg-[#0F172A]/50 border border-gray-200 dark:border-[#52525B] rounded-xl text-gray-800 dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 dark:focus:ring-[#00BBA7]/20 focus:bg-white dark:focus:bg-[#0F172A]/80 transition-all"
                />
              </div>

              {/* E-posta */}
              <div className="col-span-1">
                <label className="block text-xs font-bold text-gray-800 dark:text-[#CBD5E1] mb-2">E-posta Adresi</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50/50 dark:bg-[#0F172A]/50 border border-gray-200 dark:border-[#52525B] rounded-xl text-gray-800 dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 dark:focus:ring-[#00BBA7]/20 focus:bg-white dark:focus:bg-[#0F172A]/80 transition-all"
                />
              </div>

              {/* Telefon */}
              <div className="col-span-2 relative">
                <label className="block text-xs font-bold text-gray-800 dark:text-[#CBD5E1] mb-2">Telefon Numarası</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full pl-4 pr-32 py-3 bg-gray-50/50 dark:bg-[#0F172A]/50 border border-gray-200 dark:border-[#52525B] rounded-xl text-gray-800 dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 dark:focus:ring-[#00BBA7]/20 focus:bg-white dark:focus:bg-[#0F172A]/80 transition-all"
                />
                <div className="absolute right-3 top-[34px] flex items-center bg-teal-50 dark:bg-[#34D399]/10 text-teal-600 dark:text-[#34D399] border border-teal-100 dark:border-[#34D399]/30 px-2.5 py-1 rounded-md">
                  <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[10px] font-bold tracking-wide">DOĞRULANDII</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TERCİHLER KARTI */}
        <div className="bg-white dark:bg-[#3F3F46] rounded-2xl p-8 border border-gray-100 dark:border-[#52525B] shadow-sm dark:shadow-none">
          <div className="flex items-center text-[#0f4c3a] dark:text-[#00BBA7] font-bold text-lg mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Tercihler
          </div>

          {/* Asistan Dili */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-800 dark:text-[#CBD5E1] mb-3">Asistan Dili</label>
            <div className="flex flex-wrap gap-3">
              {[{ key: 'TR', label: 'Türkçe (TR)' }, { key: 'EN', label: 'English (US)' }].map((lang) => (
                <button
                  key={lang.key}
                  onClick={() => setForm({ ...form, language: lang.key })}
                  className={`flex items-center px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all ${
                    form.language === lang.key
                      ? 'bg-teal-50 dark:bg-[#00BBA7]/10 border-2 border-[#0f4c3a] dark:border-[#00BBA7] text-[#0f4c3a] dark:text-[#00BBA7]'
                      : 'bg-white dark:bg-[#0F172A]/30 border border-gray-200 dark:border-[#52525B] text-gray-600 dark:text-[#CBD5E1] font-medium hover:border-gray-300 dark:hover:border-[#71717A] hover:bg-gray-50 dark:hover:bg-[#3F3F46]/60'
                  }`}
                >
                  {form.language === lang.key && (
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Bildirim Zamanı */}
            <div>
              <label className="block text-sm font-bold text-gray-800 dark:text-[#CBD5E1] mb-3">Varsayılan Bildirim Zamanı</label>
              <div className="flex bg-gray-50/50 dark:bg-[#0F172A]/40 p-1 rounded-xl border border-gray-200 dark:border-[#52525B]">
                {NOTIF_OPTS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setForm({ ...form, notifTime: opt.key })}
                    className={`flex-1 py-2 text-sm transition-all rounded-lg ${
                      form.notifTime === opt.key
                        ? 'font-bold text-[#0f4c3a] dark:text-[#00BBA7] bg-teal-50 dark:bg-[#00BBA7]/10 border border-teal-100 dark:border-[#00BBA7]/30 shadow-sm'
                        : 'font-medium text-gray-500 dark:text-[#71717A] hover:text-gray-800 dark:hover:text-[#CBD5E1]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Arama Hatırlatıcı */}
            <div>
              <label className="block text-sm font-bold text-gray-800 dark:text-[#CBD5E1] mb-3">Varsayılan Arama Hatırlatıcı</label>
              <div className="flex bg-gray-50/50 dark:bg-[#0F172A]/40 p-1 rounded-xl border border-gray-200 dark:border-[#52525B]">
                {CALL_OPTS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setForm({ ...form, callTime: opt.key })}
                    className={`flex-1 py-2 text-sm transition-all rounded-lg ${
                      form.callTime === opt.key
                        ? 'font-bold text-[#0f4c3a] dark:text-[#00BBA7] bg-teal-50 dark:bg-[#00BBA7]/10 border border-teal-100 dark:border-[#00BBA7]/30 shadow-sm'
                        : 'font-medium text-gray-500 dark:text-[#71717A] hover:text-gray-800 dark:hover:text-[#CBD5E1]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ALT BUTONLAR — "Hesabı Sil" KALDIRILDI */}
        <div className="flex items-center justify-end pt-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-100 dark:bg-[#71717A]/20 hover:bg-gray-200 dark:hover:bg-[#71717A]/30 text-gray-700 dark:text-[#CBD5E1] font-bold rounded-xl text-sm transition-colors"
            >
              İptal Et
            </button>
            <button
              onClick={handleSave}
              className="flex items-center px-6 py-3 bg-[#0f4c3a] hover:bg-[#0a3629] dark:bg-[#00BBA7] dark:hover:bg-[#009F8E] text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Değişiklikleri Kaydet
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}