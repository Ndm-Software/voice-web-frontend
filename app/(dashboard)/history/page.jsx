import React from 'react';

export default function HistoryPage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      
      {/* Üst Kısım: Başlık ve Arama */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-[28px] font-bold text-[#0f4c3a] dark:text-[#00BBA7] mb-1">Geçmiş</h2>
          <p className="text-gray-500 dark:text-[#CBD5E1] text-[15px]">Bildirimlerinizi ve arama kayıtlarınızı buradan yönetin.</p>
        </div>
        
        {/* Sayfa İçi Arama Çubuğu */}
        <div className="relative w-64">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#71717A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input
            type="text"
            placeholder="Geçmişte ara..."
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#3F3F46] border border-gray-200 dark:border-[#52525B] rounded-xl text-sm text-gray-800 dark:text-[#F8FAFC] placeholder-gray-400 dark:placeholder-[#71717A] focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 dark:focus:ring-[#00BBA7]/20 shadow-sm"
          />
        </div>
      </div>

      {/* Filtre Butonları */}
      <div className="flex gap-3 mb-10">
        <button className="bg-[#0f4c3a] dark:bg-[#00BBA7] text-white px-5 py-2 rounded-full text-[13px] font-bold shadow-sm">
          Tüm Geçmiş
        </button>
        <button className="bg-teal-50/50 dark:bg-[#00BBA7]/10 text-[#0f4c3a] dark:text-[#00BBA7] px-5 py-2 rounded-full text-[13px] font-semibold hover:bg-teal-50 dark:hover:bg-[#00BBA7]/20 transition-colors">
          Sadece Sesli Aramalar
        </button>
        <button className="bg-teal-50/50 dark:bg-[#00BBA7]/10 text-[#0f4c3a] dark:text-[#00BBA7] px-5 py-2 rounded-full text-[13px] font-semibold hover:bg-teal-50 dark:hover:bg-[#00BBA7]/20 transition-colors">
          Sadece Bildirimler
        </button>
      </div>

      {/* Liste Alanı */}
      <div className="space-y-8">
        
        {/* BUGÜN Grubu */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wider mb-4">BUGÜN</h3>
          <div className="space-y-3">
            
            {/* Öğe 1: Cevapsız Arama */}
            <div className="bg-white dark:bg-[#3F3F46] rounded-2xl p-4 flex items-center justify-between border border-gray-100 dark:border-[#52525B] shadow-sm dark:shadow-none">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 dark:text-red-400 shrink-0">
                  {/* Missed Call Icon */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7l6 6m0-6l-6 6"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-[#F8FAFC] text-[15px]">Annem</h4>
                  <p className="text-[13px] text-gray-500 dark:text-[#CBD5E1] mt-0.5">Cevapsız Sesli Arama</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-gray-500 dark:text-[#71717A] mb-1.5">14:32</div>
                <span className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[11px] font-bold px-3 py-1 rounded-full">Cevapsız</span>
              </div>
            </div>

            {/* Öğe 2: Bildirim */}
            <div className="bg-white dark:bg-[#3F3F46] rounded-2xl p-4 flex items-center justify-between border border-gray-100 dark:border-[#52525B] shadow-sm dark:shadow-none">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-[#00BBA7]/10 flex items-center justify-center text-[#0f4c3a] dark:text-[#00BBA7] shrink-0">
                  {/* Bell Icon */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-[#F8FAFC] text-[15px]">Günlük Özet</h4>
                  <p className="text-[13px] text-gray-500 dark:text-[#CBD5E1] mt-0.5">Yapay zeka analiziniz hazır</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-gray-500 dark:text-[#71717A] mb-1.5">11:15</div>
                <span className="bg-teal-50 dark:bg-[#34D399]/10 text-[#0f4c3a] dark:text-[#34D399] text-[11px] font-bold px-3 py-1 rounded-full">İletildi</span>
              </div>
            </div>

            {/* Öğe 3: Gelen Arama */}
            <div className="bg-white dark:bg-[#3F3F46] rounded-2xl p-4 flex items-center justify-between border border-gray-100 dark:border-[#52525B] shadow-sm dark:shadow-none">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-[#00BBA7]/10 flex items-center justify-center text-[#0f4c3a] dark:text-[#00BBA7] shrink-0">
                  {/* Phone Incoming Icon */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-[#F8FAFC] text-[15px]">Ahmet Yılmaz</h4>
                  <p className="text-[13px] text-gray-500 dark:text-[#CBD5E1] mt-0.5">Gelen Sesli Arama (12 dk)</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-gray-500 dark:text-[#71717A] mb-1.5">09:45</div>
                <span className="bg-teal-50 dark:bg-[#34D399]/10 text-[#0f4c3a] dark:text-[#34D399] text-[11px] font-bold px-3 py-1 rounded-full">İletildi</span>
              </div>
            </div>

          </div>
        </div>

        {/* DÜN Grubu */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wider mb-4">DÜN</h3>
          <div className="space-y-3">
            
            {/* Öğe 4: Hatırlatıcı */}
            <div className="bg-white dark:bg-[#3F3F46] rounded-2xl p-4 flex items-center justify-between border border-gray-100 dark:border-[#52525B] shadow-sm dark:shadow-none">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-[#00BBA7]/10 flex items-center justify-center text-[#0f4c3a] dark:text-[#00BBA7] shrink-0">
                  {/* Task/Clipboard Icon */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-[#F8FAFC] text-[15px]">İlaç Hatırlatıcısı</h4>
                  <p className="text-[13px] text-gray-500 dark:text-[#CBD5E1] mt-0.5">Akşam dozunu almayı unutmayın</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-gray-500 dark:text-[#71717A] mb-1.5">20:00</div>
                <span className="bg-teal-50 dark:bg-[#34D399]/10 text-[#0f4c3a] dark:text-[#34D399] text-[11px] font-bold px-3 py-1 rounded-full">İletildi</span>
              </div>
            </div>

            {/* Öğe 5: Cevapsız Arama */}
            <div className="bg-white dark:bg-[#3F3F46] rounded-2xl p-4 flex items-center justify-between border border-red-200 dark:border-red-900/50 shadow-sm dark:shadow-none relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400 dark:bg-red-500"></div>
              <div className="flex items-center gap-4 pl-2">
                <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 dark:text-red-400 shrink-0">
                  {/* Missed Call Icon */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7l6 6m0-6l-6 6"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-[#F8FAFC] text-[15px]">Bilinmeyen Numara</h4>
                  <p className="text-[13px] text-gray-500 dark:text-[#CBD5E1] mt-0.5">Cevapsız Sesli Arama</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-gray-500 dark:text-[#71717A] mb-1.5">17:42</div>
                <span className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[11px] font-bold px-3 py-1 rounded-full">Cevapsız</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}