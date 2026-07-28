import React from 'react';

export default function DashboardPage() {
  return (
    <div className="w-full max-w-[1000px] mx-auto">
      
      {/* Karşılama Başlığı */}
      <div className="mb-8">
        <h2 className="text-[28px] font-bold text-[#0f4c3a] dark:text-[#A78BFA] mb-1">Merhaba, Selin!</h2>
        <p className="text-gray-500 dark:text-[#CBD5E1] text-[15px]">İşte bugün için planladıkların ve asistanının notları.</p>
      </div>

      {/* Üst İstatistik Kartları */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-[#3F3F46] rounded-2xl p-6 flex items-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] dark:shadow-none dark:border dark:border-[#52525B]">
          <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-[#A78BFA]/10 flex items-center justify-center text-[#0f4c3a] dark:text-[#A78BFA] mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wider mb-1">AKTİF HATIRLATICILAR</p>
            <p className="text-[22px] font-extrabold text-gray-800 dark:text-[#F8FAFC] leading-none">12</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#3F3F46] rounded-2xl p-6 flex items-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] dark:shadow-none dark:border dark:border-[#52525B]">
          <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-[#A78BFA]/10 flex items-center justify-center text-[#0f4c3a] dark:text-[#A78BFA] mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wider mb-1">BUGÜNKİ ARAMALAR</p>
            <p className="text-[22px] font-extrabold text-gray-800 dark:text-[#F8FAFC] leading-none">4</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#3F3F46] rounded-2xl p-6 flex items-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] dark:shadow-none dark:border dark:border-[#52525B]">
          <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-[#71717A]/20 flex items-center justify-center text-gray-400 dark:text-[#CBD5E1] mr-4 border border-gray-100 dark:border-[#52525B]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wider mb-1">SESSİZ SAAT DURUMU</p>
            <p className="text-[22px] font-extrabold text-gray-800 dark:text-[#F8FAFC] leading-none">Kapalı</p>
          </div>
        </div>
      </div>

      {/* Alt İçerik Izgarası */}
      <div className="grid grid-cols-3 gap-8">
        
        {/* SOL BÖLÜM: Yaklaşan Hatırlatıcılar */}
        <div className="col-span-2">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-base font-bold text-gray-800 dark:text-[#F8FAFC]">Yaklaşan Hatırlatıcılar</h3>
            <button className="text-sm font-semibold text-[#0f4c3a] dark:text-[#A78BFA] hover:underline flex items-center">
              Tümünü Gör 
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Hatırlatıcı 1 */}
            <div className="bg-white dark:bg-[#3F3F46] rounded-[16px] p-5 flex items-center shadow-sm dark:shadow-none dark:border dark:border-[#52525B] relative overflow-hidden h-[76px]">
              <div className="absolute left-6 top-5 bottom-5 w-1.5 rounded-full bg-[#0f4c3a] dark:bg-[#A78BFA]"></div>
              <div className="pl-12">
                <h4 className="font-bold text-gray-800 dark:text-[#F8FAFC] text-[15px]">Doktor Randevusu - Diş Hekimi</h4>
                <p className="text-[13px] text-gray-500 dark:text-[#CBD5E1] mt-0.5">Bugün, 14:30 • Sesli Bildirim Açık</p>
              </div>
            </div>

            {/* Hatırlatıcı 2 */}
            <div className="bg-white dark:bg-[#3F3F46] rounded-[16px] p-5 flex items-center shadow-sm dark:shadow-none dark:border dark:border-[#52525B] relative overflow-hidden h-[76px]">
              <div className="absolute left-6 top-5 bottom-5 w-1.5 rounded-full bg-[#0f4c3a] dark:bg-[#A78BFA]"></div>
              <div className="pl-12">
                <h4 className="font-bold text-gray-800 dark:text-[#F8FAFC] text-[15px]">Market Alışveriş Listesi</h4>
                <p className="text-[13px] text-gray-500 dark:text-[#CBD5E1] mt-0.5">Yarın, 10:00 • Konum Bazlı</p>
              </div>
            </div>

            {/* Hatırlatıcı 3 */}
            <div className="bg-white dark:bg-[#3F3F46] rounded-[16px] p-5 flex items-center shadow-sm dark:shadow-none dark:border dark:border-[#52525B] relative overflow-hidden h-[76px] opacity-70">
              <div className="absolute left-6 top-5 bottom-5 w-1.5 rounded-full bg-gray-300 dark:bg-[#71717A]"></div>
              <div className="pl-12">
                <h4 className="font-bold text-gray-800 dark:text-[#F8FAFC] text-[15px]">Anneyi Ara - Doğum Günü</h4>
                <p className="text-[13px] text-gray-500 dark:text-[#CBD5E1] mt-0.5">15 Ekim, 18:00 • Tekrarlayan</p>
              </div>
            </div>

            {/* Yeni Hatırlatıcı Ekle Butonu (Kesik Çizgili) */}
            <button className="w-full mt-2 h-[76px] rounded-[16px] border-2 border-dashed border-gray-200 dark:border-[#52525B] text-gray-500 dark:text-[#CBD5E1] font-semibold text-[15px] hover:bg-gray-50 dark:hover:bg-[#3F3F46]/60 hover:border-gray-300 dark:hover:border-[#71717A] transition-colors flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Yeni Hatırlatıcı Ekle
            </button>
          </div>
        </div>

        {/* SAĞ BÖLÜM: Takvim ve Sesli Asistan */}
        <div className="col-span-1 flex flex-col gap-6">
          
          {/* Mini Takvim Kartı */}
          <div className="bg-white dark:bg-[#3F3F46] rounded-2xl p-6 shadow-sm dark:shadow-none dark:border dark:border-[#52525B]">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-[13px] font-bold text-gray-800 dark:text-[#F8FAFC] uppercase tracking-wide">EKİM 2023</h4>
              <div className="flex gap-2 text-gray-400 dark:text-[#71717A]">
                <button className="hover:text-gray-800 dark:hover:text-[#F8FAFC] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <button className="hover:text-gray-800 dark:hover:text-[#F8FAFC] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
              </div>
            </div>

            {/* Takvim Izgarası */}
            <div className="grid grid-cols-7 gap-y-4 text-center text-[13px]">
              <div className="text-gray-400 dark:text-[#71717A] font-medium mb-1">Pt</div>
              <div className="text-gray-400 dark:text-[#71717A] font-medium mb-1">Sa</div>
              <div className="text-gray-400 dark:text-[#71717A] font-medium mb-1">Ça</div>
              <div className="text-gray-400 dark:text-[#71717A] font-medium mb-1">Pe</div>
              <div className="text-gray-400 dark:text-[#71717A] font-medium mb-1">Cu</div>
              <div className="text-gray-400 dark:text-[#71717A] font-medium mb-1">Ct</div>
              <div className="text-gray-400 dark:text-[#71717A] font-medium mb-1">Pz</div>
              
              <div className="text-gray-300 dark:text-[#52525B]">27</div>
              <div className="text-gray-300 dark:text-[#52525B]">28</div>
              <div className="text-gray-300 dark:text-[#52525B]">29</div>
              <div className="text-gray-300 dark:text-[#52525B]">30</div>
              <div className="text-gray-700 dark:text-[#CBD5E1] font-medium">1</div>
              <div className="text-gray-700 dark:text-[#CBD5E1] font-medium">2</div>
              <div className="text-gray-700 dark:text-[#CBD5E1] font-medium">3</div>
              
              <div className="text-gray-700 dark:text-[#CBD5E1] font-medium">4</div>
              <div className="text-gray-700 dark:text-[#CBD5E1] font-medium">5</div>
              <div className="text-gray-700 dark:text-[#CBD5E1] font-medium">6</div>
              <div className="text-gray-700 dark:text-[#CBD5E1] font-medium">7</div>
              <div className="text-gray-700 dark:text-[#CBD5E1] font-medium">8</div>
              <div className="text-gray-700 dark:text-[#CBD5E1] font-medium">9</div>
              <div className="text-gray-700 dark:text-[#CBD5E1] font-medium">10</div>
              
              {/* Aktif Gün */}
              <div className="bg-[#0f4c3a] dark:bg-[#A78BFA] text-white font-bold rounded-full w-[26px] h-[26px] flex items-center justify-center mx-auto shadow-md">11</div>
              <div className="text-gray-700 dark:text-[#CBD5E1] font-medium mt-0.5">12</div>
              <div className="text-gray-700 dark:text-[#CBD5E1] font-medium mt-0.5">13</div>
              <div className="text-gray-700 dark:text-[#CBD5E1] font-medium mt-0.5">14</div>
              {/* Altı Çizili Gün */}
              <div className="text-gray-700 dark:text-[#CBD5E1] font-bold mt-0.5 relative">
                15
                <div className="w-1 h-1 bg-[#0f4c3a] dark:bg-[#A78BFA] rounded-full absolute bottom-[-4px] left-1/2 -translate-x-1/2"></div>
              </div>
            </div>
          </div>

          {/* Voia Dinliyor Widget'ı */}
          <div className="bg-[#0f4c3a] dark:bg-[#1e293b] dark:border dark:border-[#A78BFA]/30 rounded-[20px] p-8 text-center shadow-lg relative overflow-hidden flex-1 flex flex-col justify-center min-h-[220px]">
            <div className="w-16 h-16 bg-[#165a46] dark:bg-[#A78BFA]/20 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-[#1c6953] dark:border-[#A78BFA]/40 shadow-inner relative z-10">
              <svg className="w-6 h-6 text-white dark:text-[#A78BFA]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
            </div>
            
            <h4 className="text-white font-bold text-lg mb-2 relative z-10">Voia Dinliyor...</h4>
            <p className="text-teal-100 dark:text-[#CBD5E1] text-[13px] leading-relaxed px-4 relative z-10">
              "Hava durumunu sor" veya "Hatırlatıcı ekle" deyin.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}