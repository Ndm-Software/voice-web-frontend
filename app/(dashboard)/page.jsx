import React from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="w-full max-w-[1000px] mx-auto">
      
      {/* Karşılama Başlığı */}
      <div className="mb-8">
        <h2 className="text-[28px] font-bold text-brand dark:text-brand mb-1">Merhaba, Selin!</h2>
        <p className="text-secondary dark:text-secondary text-[15px]">İşte bugün için planladıkların ve asistanının notları.</p>
      </div>

      {/* Üst İstatistik Kartları */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-surface rounded-2xl p-6 flex items-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] dark:shadow-none dark:border dark:border-default">
          <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-brand/10 flex items-center justify-center text-brand dark:text-brand mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-muted dark:text-muted uppercase tracking-wider mb-1">AKTİF HATIRLATICILAR</p>
            <p className="text-[22px] font-extrabold text-primary dark:text-primary leading-none">12</p>
          </div>
        </div>

        <div className="bg-white dark:bg-surface rounded-2xl p-6 flex items-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] dark:shadow-none dark:border dark:border-default">
          <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-brand/10 flex items-center justify-center text-brand dark:text-brand mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-muted dark:text-muted uppercase tracking-wider mb-1">BUGÜNKİ ARAMALAR</p>
            <p className="text-[22px] font-extrabold text-primary dark:text-primary leading-none">4</p>
          </div>
        </div>

        <div className="bg-white dark:bg-surface rounded-2xl p-6 flex items-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] dark:shadow-none dark:border dark:border-default">
          <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-muted dark:text-secondary mr-4 border border-default dark:border-default">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-muted dark:text-muted uppercase tracking-wider mb-1">SESSİZ SAAT DURUMU</p>
            <p className="text-[22px] font-extrabold text-primary dark:text-primary leading-none">Kapalı</p>
          </div>
        </div>
      </div>

      {/* Alt İçerik Izgarası */}
      <div className="grid grid-cols-3 gap-8">
        
        {/* SOL BÖLÜM: Yaklaşan Hatırlatıcılar */}
        <div className="col-span-2">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-base font-bold text-primary dark:text-primary">Yaklaşan Hatırlatıcılar</h3>
            {/* "Tümünü Gör" → Takvim sayfasına yönlendirir */}
            <Link
              href="/calendar"
              id="dashboard-see-all-btn"
              className="text-sm font-semibold text-brand dark:text-brand hover:underline flex items-center"
            >
              Tümünü Gör 
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </Link>
          </div>

          <div className="space-y-4">
            {/* Hatırlatıcı 1 */}
            <div className="bg-white dark:bg-surface rounded-[16px] p-5 flex items-center shadow-sm dark:shadow-none dark:border dark:border-default relative overflow-hidden h-[76px]">
              <div className="absolute left-6 top-5 bottom-5 w-1.5 rounded-full bg-brand dark:bg-brand"></div>
              <div className="pl-12">
                <h4 className="font-bold text-primary dark:text-primary text-[15px]">Doktor Randevusu - Diş Hekimi</h4>
                <p className="text-[13px] text-secondary dark:text-secondary mt-0.5">Bugün, 14:30 • Sesli Bildirim Açık</p>
              </div>
            </div>

            {/* Hatırlatıcı 2 */}
            <div className="bg-white dark:bg-surface rounded-[16px] p-5 flex items-center shadow-sm dark:shadow-none dark:border dark:border-default relative overflow-hidden h-[76px]">
              <div className="absolute left-6 top-5 bottom-5 w-1.5 rounded-full bg-brand dark:bg-brand"></div>
              <div className="pl-12">
                <h4 className="font-bold text-primary dark:text-primary text-[15px]">Market Alışveriş Listesi</h4>
                <p className="text-[13px] text-secondary dark:text-secondary mt-0.5">Yarın, 10:00 • Konum Bazlı</p>
              </div>
            </div>

            {/* Hatırlatıcı 3 */}
            <div className="bg-white dark:bg-surface rounded-[16px] p-5 flex items-center shadow-sm dark:shadow-none dark:border dark:border-default relative overflow-hidden h-[76px] opacity-70">
              <div className="absolute left-6 top-5 bottom-5 w-1.5 rounded-full bg-gray-300 dark:bg-muted"></div>
              <div className="pl-12">
                <h4 className="font-bold text-primary dark:text-primary text-[15px]">Anneyi Ara - Doğum Günü</h4>
                <p className="text-[13px] text-secondary dark:text-secondary mt-0.5">15 Ekim, 18:00 • Tekrarlayan</p>
              </div>
            </div>

            {/* "Yeni Hatırlatıcı Ekle" → /calendar/new'e yönlendirir */}
            <Link
              href="/calendar/new"
              id="dashboard-add-reminder-btn"
              className="w-full mt-2 h-[76px] rounded-[16px] border-2 border-dashed border-default dark:border-default text-secondary dark:text-secondary font-semibold text-[15px] hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-300 dark:hover:border-white/20 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Yeni Hatırlatıcı Ekle
            </Link>
          </div>
        </div>

        {/* SAĞ BÖLÜM: Takvim ve Sesli Asistan */}
        <div className="col-span-1 flex flex-col gap-6">
          
          {/* Mini Takvim Kartı */}
          <div className="bg-white dark:bg-surface rounded-2xl p-6 shadow-sm dark:shadow-none dark:border dark:border-default">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-[13px] font-bold text-primary dark:text-primary uppercase tracking-wide">EKİM 2023</h4>
              <div className="flex gap-2 text-muted dark:text-muted">
                <Link href="/calendar" className="hover:text-primary dark:hover:text-primary transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </Link>
                <Link href="/calendar" className="hover:text-primary dark:hover:text-primary transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </Link>
              </div>
            </div>

            {/* Takvim Izgarası */}
            <div className="grid grid-cols-7 gap-y-4 text-center text-[13px]">
              <div className="text-muted dark:text-muted font-medium mb-1">Pt</div>
              <div className="text-muted dark:text-muted font-medium mb-1">Sa</div>
              <div className="text-muted dark:text-muted font-medium mb-1">Ça</div>
              <div className="text-muted dark:text-muted font-medium mb-1">Pe</div>
              <div className="text-muted dark:text-muted font-medium mb-1">Cu</div>
              <div className="text-muted dark:text-muted font-medium mb-1">Ct</div>
              <div className="text-muted dark:text-muted font-medium mb-1">Pz</div>
              
              <div className="text-gray-300 dark:text-muted">27</div>
              <div className="text-gray-300 dark:text-muted">28</div>
              <div className="text-gray-300 dark:text-muted">29</div>
              <div className="text-gray-300 dark:text-muted">30</div>
              <div className="text-gray-700 dark:text-secondary font-medium">1</div>
              <div className="text-gray-700 dark:text-secondary font-medium">2</div>
              <div className="text-gray-700 dark:text-secondary font-medium">3</div>
              
              <div className="text-gray-700 dark:text-secondary font-medium">4</div>
              <div className="text-gray-700 dark:text-secondary font-medium">5</div>
              <div className="text-gray-700 dark:text-secondary font-medium">6</div>
              <div className="text-gray-700 dark:text-secondary font-medium">7</div>
              <div className="text-gray-700 dark:text-secondary font-medium">8</div>
              <div className="text-gray-700 dark:text-secondary font-medium">9</div>
              <div className="text-gray-700 dark:text-secondary font-medium">10</div>
              
              {/* Aktif Gün */}
              <div className="bg-brand dark:bg-brand text-white font-bold rounded-full w-[26px] h-[26px] flex items-center justify-center mx-auto shadow-md">11</div>
              <div className="text-gray-700 dark:text-secondary font-medium mt-0.5">12</div>
              <div className="text-gray-700 dark:text-secondary font-medium mt-0.5">13</div>
              <div className="text-gray-700 dark:text-secondary font-medium mt-0.5">14</div>
              {/* Altı Çizili Gün */}
              <div className="text-gray-700 dark:text-secondary font-bold mt-0.5 relative">
                15
                <div className="w-1 h-1 bg-brand dark:bg-brand rounded-full absolute bottom-[-4px] left-1/2 -translate-x-1/2"></div>
              </div>
            </div>
          </div>

          {/* Voia Dinliyor Widget'ı */}
          <div className="bg-brand dark:bg-surface dark:border dark:border-brand/20 rounded-[20px] p-8 text-center shadow-lg relative overflow-hidden flex-1 flex flex-col justify-center min-h-[220px]">
            <div className="w-16 h-16 bg-[#165a46] dark:bg-brand/20 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-[#1c6953] dark:border-brand/30 shadow-inner relative z-10">
              <svg className="w-6 h-6 text-white dark:text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
            </div>
            
            <h4 className="text-white font-bold text-lg mb-2 relative z-10">Voia Dinliyor...</h4>
            <p className="text-teal-100 dark:text-secondary text-[13px] leading-relaxed px-4 relative z-10">
              "Hava durumunu sor" veya "Hatırlatıcı ekle" deyin.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}