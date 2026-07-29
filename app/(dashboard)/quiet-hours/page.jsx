import React from 'react';

export default function QuietHoursPage() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      
      {/* Üst Kısım: Başlık ve Arama */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-[28px] font-bold text-[#0f4c3a] dark:text-[#00BBA7] mb-1">Sessiz Saatler</h2>
          <p className="text-gray-500 dark:text-[#CBD5E1] text-[15px]">Dinlenme zamanlarınızı ve rahatsız edilmeyeceğiniz saatleri buradan yönetin.</p>
        </div>
        
        {/* Sayfa İçi Arama Çubuğu */}
        <div className="relative w-64">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#71717A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input
            type="text"
            placeholder="Ayarlarda ara..."
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#3F3F46] border border-gray-200 dark:border-[#52525B] rounded-xl text-sm text-gray-800 dark:text-[#F8FAFC] placeholder-gray-400 dark:placeholder-[#71717A] focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 dark:focus:ring-[#00BBA7]/20 shadow-sm"
          />
        </div>
      </div>

      <div className="flex gap-8">
        
        {/* SOL BÖLÜM: Haftalık Program (Toggle'lar ve Saatler) */}
        <div className="flex-[2] bg-white dark:bg-[#3F3F46] rounded-2xl p-6 border border-gray-100 dark:border-[#52525B] shadow-sm dark:shadow-none">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center text-[#0f4c3a] dark:text-[#00BBA7] font-bold">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Haftalık Program
            </div>
            <button className="text-sm font-semibold text-[#0f4c3a] dark:text-[#00BBA7] hover:underline">
              Tüm günlere uygula
            </button>
          </div>

          <div className="space-y-4">
            
            {/* Gün Bileşeni - Aktif (Pazartesi - Perşembe) */}
            {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe'].map((day) => (
              <div key={day} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#71717A]/10 transition-colors">
                <div className="flex items-center w-1/3">
                  {/* Aktif Toggle Switch */}
                  <div className="relative inline-flex items-center cursor-pointer mr-4">
                    <div className="w-11 h-6 bg-[#0f4c3a] dark:bg-[#00BBA7] rounded-full peer"></div>
                    <div className="absolute left-[2px] top-[2px] bg-white w-5 h-5 rounded-full border border-gray-300 dark:border-[#52525B] transition-transform translate-x-full"></div>
                  </div>
                  <span className="font-bold text-gray-800 dark:text-[#F8FAFC]">{day}</span>
                </div>
                
                <div className="flex items-center gap-3 flex-1 justify-end">
                  {/* Başlangıç Saati */}
                  <div className="relative">
                    <input type="text" value="22:00" readOnly className="w-24 text-center py-2 bg-gray-50 dark:bg-[#0F172A]/40 border border-gray-200 dark:border-[#52525B] rounded-lg text-sm font-medium text-gray-800 dark:text-[#F8FAFC] focus:outline-none" />
                    <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-600 dark:text-[#00BBA7]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <span className="text-gray-400 dark:text-[#71717A] font-medium">-</span>
                  {/* Bitiş Saati */}
                  <div className="relative">
                    <input type="text" value="07:00" readOnly className="w-24 text-center py-2 bg-gray-50 dark:bg-[#0F172A]/40 border border-gray-200 dark:border-[#52525B] rounded-lg text-sm font-medium text-gray-800 dark:text-[#F8FAFC] focus:outline-none" />
                    <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-600 dark:text-[#00BBA7]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                </div>
              </div>
            ))}

            {/* Cuma (Farklı Saat) */}
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#71717A]/10 transition-colors">
              <div className="flex items-center w-1/3">
                <div className="relative inline-flex items-center cursor-pointer mr-4">
                  <div className="w-11 h-6 bg-[#0f4c3a] dark:bg-[#00BBA7] rounded-full peer"></div>
                  <div className="absolute left-[2px] top-[2px] bg-white w-5 h-5 rounded-full border border-gray-300 dark:border-[#52525B] transition-transform translate-x-full"></div>
                </div>
                <span className="font-bold text-gray-800 dark:text-[#F8FAFC]">Cuma</span>
              </div>
              <div className="flex items-center gap-3 flex-1 justify-end">
                <div className="relative">
                  <input type="text" value="23:00" readOnly className="w-24 text-center py-2 bg-gray-50 dark:bg-[#0F172A]/40 border border-gray-200 dark:border-[#52525B] rounded-lg text-sm font-medium text-gray-800 dark:text-[#F8FAFC] focus:outline-none" />
                  <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-600 dark:text-[#00BBA7]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <span className="text-gray-400 dark:text-[#71717A] font-medium">-</span>
                <div className="relative">
                  <input type="text" value="09:00" readOnly className="w-24 text-center py-2 bg-gray-50 dark:bg-[#0F172A]/40 border border-gray-200 dark:border-[#52525B] rounded-lg text-sm font-medium text-gray-800 dark:text-[#F8FAFC] focus:outline-none" />
                  <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-600 dark:text-[#00BBA7]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
              </div>
            </div>

            {/* Gün Bileşeni - Pasif (Hafta Sonu) */}
            {['Cumartesi', 'Pazar'].map((day) => (
              <div key={day} className="flex items-center justify-between p-3 rounded-xl opacity-60 hover:opacity-100 hover:bg-gray-50 dark:hover:bg-[#71717A]/10 transition-all">
                <div className="flex items-center w-1/3">
                  {/* Pasif Toggle Switch */}
                  <div className="relative inline-flex items-center cursor-pointer mr-4">
                    <div className="w-11 h-6 bg-gray-200 dark:bg-[#52525B] rounded-full peer"></div>
                    <div className="absolute left-[2px] top-[2px] bg-white w-5 h-5 rounded-full border border-gray-300 dark:border-[#71717A] transition-transform"></div>
                  </div>
                  <span className="font-bold text-gray-500 dark:text-[#71717A]">{day}</span>
                </div>
                <div className="flex items-center gap-3 flex-1 justify-end opacity-50 pointer-events-none">
                  <input type="text" value="00:00" readOnly className="w-24 text-center py-2 bg-gray-50 dark:bg-[#0F172A]/40 border border-gray-200 dark:border-[#52525B] rounded-lg text-sm font-medium text-gray-400 dark:text-[#71717A] focus:outline-none" />
                  <span className="text-gray-400 dark:text-[#71717A] font-medium">-</span>
                  <input type="text" value="00:00" readOnly className="w-24 text-center py-2 bg-gray-50 dark:bg-[#0F172A]/40 border border-gray-200 dark:border-[#52525B] rounded-lg text-sm font-medium text-gray-400 dark:text-[#71717A] focus:outline-none" />
                </div>
              </div>
            ))}
            
          </div>
        </div>

        {/* SAĞ BÖLÜM: Bilgi Kartları */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Yerel Saat Kartı */}
          <div className="bg-white dark:bg-[#3F3F46] rounded-2xl p-6 border border-gray-100 dark:border-[#52525B] shadow-sm dark:shadow-none">
            <h4 className="text-[11px] font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wider mb-2">YEREL SAAT</h4>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-extrabold text-[#0f4c3a] dark:text-[#00BBA7] leading-none">21:38</span>
              <span className="text-sm font-bold text-gray-500 dark:text-[#CBD5E1] mb-1">GMT+3</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-[#CBD5E1] leading-relaxed">
              Şu anki saat diliminiz İstanbul/Türkiye olarak ayarlanmıştır.
            </p>
          </div>

          {/* Acil Durum Kartı */}
          <div className="bg-red-50/50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-100 dark:border-red-900/30 shadow-sm dark:shadow-none">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-[#3F3F46] flex items-center justify-center text-red-500 dark:text-red-400 shrink-0 border border-red-100 dark:border-red-900/30 shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-[#F8FAFC] text-[15px] mb-1">Acil Durum Geçişi</h4>
                <p className="text-xs text-gray-600 dark:text-[#CBD5E1] leading-relaxed">
                  Aynı kişiden 3 dakika içinde gelen ardışık aramaların veya mesajların sessiz saatleri aşmasına izin verin.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-2">
              <span className="text-xs font-bold text-gray-400 dark:text-[#71717A] uppercase">PASİF</span>
              {/* Pasif Toggle Switch */}
              <div className="relative inline-flex items-center cursor-pointer">
                <div className="w-11 h-6 bg-gray-200 dark:bg-[#52525B] rounded-full peer"></div>
                <div className="absolute left-[2px] top-[2px] bg-white w-5 h-5 rounded-full border border-gray-300 dark:border-[#71717A] transition-transform"></div>
              </div>
            </div>
          </div>

          {/* Akıllı Bilgi Kartı */}
          <div className="bg-[#0f4c3a] dark:bg-[#1e293b] dark:border dark:border-[#00BBA7]/30 rounded-2xl p-6 shadow-lg relative overflow-hidden text-white flex-1 min-h-[200px]">
             {/* Dekoratif Arka Plan (Sparkles) */}
            <svg className="absolute top-4 right-4 w-12 h-12 text-teal-600/30 dark:text-[#00BBA7]/20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z"></path></svg>
            
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <svg className="w-5 h-5 text-teal-300 dark:text-[#00BBA7]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"></path><path d="M19 16L19.75 19.25L23 20L19.75 20.75L19 24L18.25 20.75L15 20L18.25 19.25L19 16Z"></path></svg>
              <h4 className="font-bold text-lg">Akıllı Bilgi</h4>
            </div>
            <p className="text-teal-50 dark:text-[#CBD5E1] text-[13px] leading-relaxed mb-6 relative z-10 opacity-90">
              Voia, hafta içi 06:30'da uyandığınızı fark etti. Sabah brifingi deneyiminizi iyileştirmek için sessiz saatleri bu saate göre optimize edebilirsiniz.
            </p>
            <button className="w-full bg-[#1c6953] dark:bg-[#00BBA7]/20 hover:bg-[#258268] dark:hover:bg-[#00BBA7]/30 text-white font-bold py-3 rounded-xl text-xs tracking-wider transition-colors border border-[#258268] dark:border-[#00BBA7]/40 shadow-sm relative z-10">
              PROGRAMI OPTİMİZE ET
            </button>
          </div>

        </div>
      </div>
      
    </div>
  );
}