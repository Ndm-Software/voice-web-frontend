import React from 'react';

export default function ProfilePage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      
      {/* Üst Kısım: Başlık */}
      <div className="mb-8">
        <h2 className="text-[28px] font-bold text-[#0f4c3a] mb-1">Hesap Ayarları</h2>
        <p className="text-gray-500 text-[15px]">Profil bilgilerinizi yönetin ve asistan tercihlerinizi özelleştirin.</p>
      </div>

      <div className="space-y-8">
        
        {/* KİŞİSEL BİLGİLER KARTI */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center text-[#0f4c3a] font-bold text-lg mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            Kişisel Bilgiler
          </div>

          <div className="flex gap-10">
            {/* Sol Taraf: Profil Fotoğrafı */}
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden mb-3">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces" alt="Profil" className="w-full h-full object-cover" />
                {/* Kamera İkonu (Fotoğrafı Değiştir Butonu) */}
                <button className="absolute bottom-2 right-2 w-8 h-8 bg-[#0f4c3a] text-white rounded-lg flex items-center justify-center hover:bg-[#0a3629] transition-colors shadow-md border border-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </button>
              </div>
              <button className="text-sm font-bold text-gray-800 hover:text-[#0f4c3a] transition-colors">Fotoğrafı Değiştir</button>
            </div>

            {/* Sağ Taraf: Form Elemanları */}
            <div className="flex-1 grid grid-cols-2 gap-6">
              {/* Ad Soyad */}
              <div className="col-span-1">
                <label className="block text-xs font-bold text-gray-800 mb-2">Ad Soyad</label>
                <input 
                  type="text" 
                  defaultValue="Selin Aydın" 
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 focus:bg-white transition-all"
                />
              </div>

              {/* E-posta Adresi */}
              <div className="col-span-1">
                <label className="block text-xs font-bold text-gray-800 mb-2">E-posta Adresi</label>
                <input 
                  type="email" 
                  defaultValue="selin.aydin@voia.com" 
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 focus:bg-white transition-all"
                />
              </div>

              {/* Telefon Numarası */}
              <div className="col-span-2 relative">
                <label className="block text-xs font-bold text-gray-800 mb-2">Telefon Numarası</label>
                <input 
                  type="tel" 
                  defaultValue="+90 532 123 45 67" 
                  className="w-full pl-4 pr-32 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 focus:bg-white transition-all"
                />
                {/* Doğrulandı Rozeti */}
                <div className="absolute right-3 top-[34px] flex items-center bg-teal-50 text-teal-600 border border-teal-100 px-2.5 py-1 rounded-md">
                  <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span className="text-[10px] font-bold tracking-wide">DOĞRULANDI</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TERCİHLER KARTI */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center text-[#0f4c3a] font-bold text-lg mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            Tercihler
          </div>

          {/* Asistan Dili */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-800 mb-3">Asistan Dili</label>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center px-4 py-2.5 bg-teal-50 border-2 border-[#0f4c3a] text-[#0f4c3a] rounded-xl font-bold text-sm shadow-sm transition-all">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Türkçe (TR)
              </button>
              <button className="px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-medium text-sm hover:border-gray-300 hover:bg-gray-50 transition-all">English (US)</button>
              <button className="px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-medium text-sm hover:border-gray-300 hover:bg-gray-50 transition-all">Deutsch (DE)</button>
              <button className="px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-medium text-sm hover:border-gray-300 hover:bg-gray-50 transition-all">Français (FR)</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Varsayılan Bildirim Zamanı */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">Varsayılan Bildirim Zamanı</label>
              <div className="flex bg-gray-50/50 p-1 rounded-xl border border-gray-200">
                <button className="flex-1 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors">15 dk önce</button>
                <button className="flex-1 py-2 text-sm font-bold text-[#0f4c3a] bg-teal-50 border border-teal-100 rounded-lg shadow-sm">30 dk önce</button>
                <button className="flex-1 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors">1 saat önce</button>
              </div>
            </div>

            {/* Varsayılan Arama Hatırlatıcı */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">Varsayılan Arama Hatırlatıcı</label>
              <div className="flex bg-gray-50/50 p-1 rounded-xl border border-gray-200">
                <button className="flex-1 py-2 text-sm font-bold text-[#0f4c3a] bg-teal-50 border border-teal-100 rounded-lg shadow-sm">Anında</button>
                <button className="flex-1 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors">5 dk önce</button>
                <button className="flex-1 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors">10 dk önce</button>
              </div>
            </div>
          </div>
        </div>

        {/* ALT BUTONLAR (Hesabı Sil & Kaydet) */}
        <div className="flex items-center justify-between pt-4">
          <button className="flex items-center text-red-500 font-bold text-sm hover:text-red-700 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            Hesabı Sil
          </button>

          <div className="flex items-center gap-4">
            <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors">
              İptal Et
            </button>
            <button className="flex items-center px-6 py-3 bg-[#0f4c3a] hover:bg-[#0a3629] text-white font-bold rounded-xl text-sm transition-colors shadow-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
              Değişiklikleri Kaydet
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}