"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUserProfile, deleteAccount, getLanguages, getUserSettings, updateUserSettings, updateUserProfile, getDevices, logout } from '@/lib/api';
import { removePushToken } from '@/lib/firebase';

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  language: 'TR',
  notifTime: '30dk',
  callTime: 'Aninda',
};

// Karmaşık User-Agent metnini temiz "İşletim Sistemi • Tarayıcı" formatına çevirir
const formatDeviceName = (deviceName) => {
  if (!deviceName) return "Bilinmeyen Cihaz";

  if (!deviceName.includes("Mozilla")) return deviceName;

  let os = "Bilinmeyen OS";
  if (deviceName.includes("Windows")) os = "Windows";
  else if (deviceName.includes("Mac")) os = "macOS";
  else if (deviceName.includes("Linux")) os = "Linux";
  else if (deviceName.includes("Android")) os = "Android";
  else if (deviceName.includes("iPhone") || deviceName.includes("iPad")) os = "iOS";

  let browser = "Tarayıcı";
  if (deviceName.includes("Edg")) browser = "Edge";
  else if (deviceName.includes("Chrome")) browser = "Chrome";
  else if (deviceName.includes("Firefox")) browser = "Firefox";
  else if (deviceName.includes("Safari")) browser = "Safari";
  else if (deviceName.includes("OPR") || deviceName.includes("Opera")) browser = "Opera";

  return `${os} • ${browser}`;
};

const clearAuthStorage = () => {
  const AUTH_KEYS = ['token', 'access_token', 'refresh_token', 'authToken', 'auth', 'user'];
  AUTH_KEYS.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
};

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(INITIAL_FORM);
  const [saved, setSaved] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [avatarSrc, setAvatarSrc] = useState(
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces'
  );
  const [toast, setToast] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [devices, setDevices] = useState([]);
  const [createdAt, setCreatedAt] = useState('');
  const [userSettings, setUserSettings] = useState(null);

  const [preferences, setPreferences] = useState({
    languageId: '',
    defaultPushBefore: 30,
    defaultCallBefore: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. KULLANICI BİLGİLERİNİ ÇEK
        const userData = await getUserProfile();

        const backendData = {
          ...INITIAL_FORM,
          name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
          email: userData.email || '',
          phone: userData.phoneNumber || '',
        };
        setForm(backendData);
        setSaved(backendData);

        if (userData.createdAt) {
          const date = new Date(userData.createdAt);
          setCreatedAt(date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }));
        }

        // 2. SİSTEMDEKİ DİLLERİ ÇEK
        let langs = await getLanguages();
        if (langs && langs.length > 0) {
          // 'TR' kodlu dili her zaman listenin en başına (sola) al
          langs = langs.sort((a, b) => {
            if (a.code.toUpperCase() === 'TR') return -1;
            if (b.code.toUpperCase() === 'TR') return 1;
            return a.name.localeCompare(b.name); // Diğer dilleri alfabetik sırala
          });
        }
        setLanguages(langs || []);

        // 3. KULLANICININ AYARLARINI ÇEK
        const settings = await getUserSettings();
        
        console.log("Backend'den gelen ayarlar:", settings); 

        if (settings) {
          setUserSettings(settings);
          
          const savedLangId = settings.languageId || settings.language?.languageId || settings.language?.id;

          setPreferences({
            languageId: savedLangId || (langs.length > 0 ? langs[0].languageId : ''),
            defaultPushBefore: settings.defaultPushBefore || 30,
            defaultCallBefore: settings.defaultCallBefore || 0
          });

          setForm(prev => ({
            ...prev,
            notifTime: settings.defaultPushBefore === 60 ? '1saat' : `${settings.defaultPushBefore}dk`,
            callTime: settings.defaultCallBefore === 0 ? 'Aninda' : `${settings.defaultCallBefore}dk`
          }));
        } else {
          if (langs.length > 0) {
            setPreferences(prev => ({ ...prev, languageId: langs[0].languageId }));
          }
        }

        // 4. KULLANICININ BAĞLI CİHAZLARINI ÇEK
        const userDevices = await getDevices();
        setDevices(userDevices || []);

      } catch (error) {
        console.error("Veriler çekilirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    setLoading(true);

    if (!preferences.languageId) {
      showToast('Lütfen bir asistan dili seçin (Eğer seçenek yoksa sisteme dil eklenmelidir).', 'error');
      setLoading(false);
      return;
    }

    try {
      const pushMinutes = form.notifTime === '1saat' ? 60 : parseInt(form.notifTime.replace('dk', '')) || 30;
      const callMinutes = form.callTime === 'Aninda' ? 0 : parseInt(form.callTime.replace('dk', '')) || 0;

      const settingsPayload = {
        languageId: preferences.languageId,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        province: "İstanbul",
        notificationsEnabled: true,
        defaultPushBefore: pushMinutes,
        defaultCallBefore: callMinutes
      };

      const nameParts = form.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      let formattedPhone = form.phone.replace(/\s/g, ''); 

      if (formattedPhone.startsWith('0')) {
        formattedPhone = '+90' + formattedPhone.substring(1);
      } else if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+90' + formattedPhone;
      }

      const profilePayload = {
        firstName,
        lastName,
        email: form.email,
        phoneNumber: formattedPhone 
      };

      await Promise.all([
        updateUserSettings(settingsPayload),
        updateUserProfile(profilePayload)
      ]);

      setSaved({ ...form });
      showToast('Tüm değişiklikler başarıyla kaydedildi.');
    } catch (error) {
      console.error("Kaydetme hatası:", error);
      showToast('Kaydedilemedi: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await removePushToken();
      await logout(); 
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu:", error);
    } finally {
      clearAuthStorage();
      localStorage.removeItem('voia_active_installation_id');
      router.push('/');
    }
  };

  const handleCancel = () => {
    setForm({ ...saved });
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      clearAuthStorage();
      router.push('/');
    } catch (err) {
      console.error('Hesap silme hatası:', err);
      showToast('Hesap silinemedi: ' + (err.message || 'Bir hata oluştu.'), 'error');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarSrc(url);
  };

  const NOTIF_OPTS = [
    { key: '15dk', label: '15 dk önce' },
    { key: '30dk', label: '30 dk önce' },
    { key: '1saat', label: '1 saat önce' },
  ];

  const CALL_OPTS = [
    { key: 'Aninda', label: 'Anında' },
    { key: '5dk', label: '5 dk önce' },
    { key: '10dk', label: '10 dk önce' },
  ];

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-500 font-medium text-lg">Profil bilgileri yükleniyor...</div>
      </div>
    );
  }

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

      {/* Hesap Silme Onay Modali */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />

          {/* Modal Kart */}
          <div className="relative w-full max-w-md bg-white dark:bg-[#27272A] rounded-2xl border border-gray-100 dark:border-white/10 shadow-2xl p-8 animate-[fadeInScale_0.18s_ease-out]">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-[#71717A] hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-600 dark:hover:text-[#CBD5E1] transition-all"
              aria-label="Kapat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-5">
              <svg className="w-7 h-7 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            <h3 id="delete-modal-title" className="text-lg font-bold text-gray-900 dark:text-[#F8FAFC] mb-3">
              Hesabı Sil
            </h3>

            <p className="text-sm text-gray-500 dark:text-[#CBD5E1] leading-relaxed mb-7">
              Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve{' '}
              <span className="font-semibold text-red-500 dark:text-red-400">tüm verileriniz kalıcı olarak silinir.</span>
            </p>

            <div className="flex items-center gap-3">
              <button
                id="btn-cancel-delete"
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-5 py-3 bg-gray-100 dark:bg-[#71717A]/20 hover:bg-gray-200 dark:hover:bg-[#71717A]/30 text-gray-700 dark:text-[#CBD5E1] font-bold rounded-xl text-sm transition-all active:scale-[0.98]"
              >
                İptal
              </button>
              <button
                id="btn-confirm-delete"
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-red-500 hover:bg-red-600 dark:bg-red-500/90 dark:hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-all shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
                {isDeleting ? 'Siliniyor...' : 'Evet, Hesabımı Sil'}
              </button>
            </div>
          </div>
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
        <div className="bg-white dark:bg-[#27272A] rounded-2xl p-8 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none">
          <div className="flex items-center text-[#0f4c3a] dark:text-[#00BBA7] font-bold text-lg mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Kişisel Bilgiler
          </div>

          <div className="flex gap-10">
            {/* Profil Fotoğrafı */}
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 rounded-2xl bg-gray-100 dark:bg-[#71717A]/30 border border-gray-200 dark:border-white/10 overflow-hidden mb-3">
                <img src={avatarSrc} alt="Profil" className="w-full h-full object-cover" />
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
                  className="w-full px-4 py-3 bg-gray-50/50 dark:bg-[#1A1A1A]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-800 dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 dark:focus:ring-[#00BBA7]/20 focus:bg-white dark:focus:bg-[#1A1A1A]/80 transition-all"
                />
              </div>

              {/* E-posta */}
              <div className="col-span-1">
                <label className="block text-xs font-bold text-gray-800 dark:text-[#CBD5E1] mb-2">E-posta Adresi</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50/50 dark:bg-[#1A1A1A]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-800 dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 dark:focus:ring-[#00BBA7]/20 focus:bg-white dark:focus:bg-[#1A1A1A]/80 transition-all"
                />
              </div>

              {/* Telefon */}
              <div className="col-span-2 relative">
                <label className="block text-xs font-bold text-gray-800 dark:text-[#CBD5E1] mb-2">Telefon Numarası</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full pl-4 pr-32 py-3 bg-gray-50/50 dark:bg-[#1A1A1A]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-800 dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 dark:focus:ring-[#00BBA7]/20 focus:bg-white dark:focus:bg-[#1A1A1A]/80 transition-all"
                />
                <div className="absolute right-3 top-[34px] flex items-center bg-teal-50 dark:bg-[#34D399]/10 text-teal-600 dark:text-[#34D399] border border-teal-100 dark:border-[#34D399]/30 px-2.5 py-1 rounded-md">
                  <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[10px] font-bold tracking-wide">DOĞRULANDI</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- YENİ EKLENEN KISIM: SESSİZ SAATLER'E YÖNLENDİRME KARTI --- */}
        <Link 
          href="/quiet-hours" 
          className="block bg-white dark:bg-[#27272A] rounded-2xl p-6 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md hover:border-teal-100 dark:hover:border-[#00BBA7]/30 transition-all group focus:outline-none"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-[#00BBA7]/10 flex items-center justify-center text-[#0f4c3a] dark:text-[#00BBA7] group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0f4c3a] dark:text-[#00BBA7] mb-1">Sessiz Saatler</h3>
                <p className="text-sm text-gray-500 dark:text-[#CBD5E1]">Asistanın sizi rahatsız etmeyeceği dinlenme zamanlarını ayarlayın.</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-[#0f4c3a] dark:group-hover:text-[#00BBA7] group-hover:bg-teal-50 dark:group-hover:bg-[#00BBA7]/10 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        {/* TERCİHLER KARTI */}
        <div className="bg-white dark:bg-[#27272A] rounded-2xl p-8 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none">
          <div className="flex items-center text-[#0f4c3a] dark:text-[#00BBA7] font-bold text-lg mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Tercihler
          </div>

          {/* Asistan Dili */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
              Asistan Dili
            </label>
            <div className="flex flex-wrap gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.languageId}
                  type="button"
                  onClick={() => setPreferences({ ...preferences, languageId: lang.languageId })}
                  className={`flex items-center px-4 py-2 rounded-xl border text-sm font-medium transition-all
          ${preferences.languageId === lang.languageId
                      ? 'border-[#0f4c3a] text-[#0f4c3a] bg-[#0f4c3a]/5 dark:border-[#00BBA7] dark:text-[#00BBA7] dark:bg-[#00BBA7]/10'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-white/10 dark:text-gray-400 dark:hover:border-white/20'
                    }`}
                >
                  {preferences.languageId === lang.languageId && (
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {lang.name} ({lang.code})
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Bildirim Zamanı */}
            <div>
              <label className="block text-sm font-bold text-gray-800 dark:text-[#CBD5E1] mb-3">Varsayılan Bildirim Zamanı</label>
              <div className="flex bg-gray-50/50 dark:bg-[#1A1A1A]/40 p-1 rounded-xl border border-gray-200 dark:border-white/10">
                {NOTIF_OPTS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setForm({ ...form, notifTime: opt.key })}
                    className={`flex-1 py-2 text-sm transition-all rounded-lg ${form.notifTime === opt.key
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
              <div className="flex bg-gray-50/50 dark:bg-[#1A1A1A]/40 p-1 rounded-xl border border-gray-200 dark:border-white/10">
                {CALL_OPTS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setForm({ ...form, callTime: opt.key })}
                    className={`flex-1 py-2 text-sm transition-all rounded-lg ${form.callTime === opt.key
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

        {/* BAĞLI CİHAZLAR KARTI */}
        <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-white/5 rounded-2xl p-6 md:p-8 mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-5 h-5 text-[#0f4c3a] dark:text-[#00BBA7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <h3 className="text-lg font-bold text-[#0f4c3a] dark:text-[#00BBA7]">Bağlı Cihazlar</h3>
          </div>

          <div className="space-y-4">
            {devices.length === 0 ? (
              <p className="text-sm text-gray-500">Henüz bağlı bir cihaz bulunmuyor.</p>
            ) : (
              devices.map((device) => (
                <div
                  key={device.deviceId}
                  className={`flex items-center justify-between p-4 rounded-xl relative overflow-hidden transition-colors group
                    ${device.isActive
                      ? 'border border-teal-100 dark:border-[#00BBA7]/20 bg-teal-50/30 dark:bg-[#00BBA7]/5'
                      : 'border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#27272A]/50 hover:bg-white dark:hover:bg-[#2A2A2A]'
                    }`}
                >
                  {device.isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0f4c3a] dark:bg-[#00BBA7]"></div>
                  )}

                  <div className="flex items-center gap-4 pl-2">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-sm transition-colors
                      ${device.isActive
                        ? 'bg-teal-100 dark:bg-[#1A1A1A] text-[#0f4c3a] dark:text-[#00BBA7]'
                        : 'bg-gray-200 dark:bg-[#1A1A1A] text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                      }`}
                    >
                      {device.platform === 'WEB' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-bold flex items-center gap-2 ${device.isActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                        {formatDeviceName(device.deviceName)}
                        {device.isActive && (
                          <span className="bg-teal-100 text-teal-800 dark:bg-[#00BBA7]/20 dark:text-[#00BBA7] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Aktif</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {device.isActive
                          ? 'Şu an bu cihazdasınız'
                          : `Son görülme: ${new Date(device.lastActive).toLocaleDateString('tr-TR')} ${new Date(device.lastActive).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* HESAP YÖNETİMİ KARTI */}
        <div className="bg-white dark:bg-[#27272A] rounded-2xl p-8 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none">
          <div className="flex items-center text-[#0f4c3a] dark:text-[#00BBA7] font-bold text-lg mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Hesap Yönetimi
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-800 dark:text-[#CBD5E1] mb-3">Hesap Bilgileri</label>
            <div className="bg-gray-50/50 dark:bg-[#1A1A1A]/40 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-[#00BBA7]/10 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-[#0f4c3a] dark:text-[#00BBA7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-[#71717A]">Hesap Oluşturma Tarihi</span>
                </div>
                <span className="text-sm font-bold text-gray-800 dark:text-[#F8FAFC]">{createdAt || '-'}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-[#00BBA7]/10 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-[#0f4c3a] dark:text-[#00BBA7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-[#71717A]">Son Giriş</span>
                </div>
                <span className="text-sm font-bold text-teal-600 dark:text-[#00BBA7]">Şu an aktif</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-white/10 mb-6" />

          <div>
            <div className="flex items-center gap-4">
              <button
                id="btn-delete-account"
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 dark:bg-red-500/90 dark:hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Hesabı Sil
              </button>
              <button
                id="btn-logout"
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-[#71717A]/20 hover:bg-gray-200 dark:hover:bg-[#71717A]/30 text-gray-700 dark:text-[#CBD5E1] font-bold rounded-xl text-sm transition-all active:scale-[0.98]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>

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