import React from 'react';

export default function CalendarPage() {
  return (
    <div className="w-full max-w-[1100px] mx-auto flex gap-8">
      
      {/* SOL BÖLÜM: Büyük Takvim */}
      <div className="flex-[2] bg-white dark:bg-[#3F3F46] rounded-2xl p-6 border border-gray-100 dark:border-[#52525B] shadow-sm dark:shadow-none flex flex-col h-[calc(100vh-140px)]">
        
        {/* Takvim Üst Kontrolleri */}
        <div className="flex justify-between items-center mb-6 px-2">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-[#0f4c3a] dark:text-[#00BBA7]">Ekim 2023</h2>
            <div className="flex gap-2 text-gray-500 dark:text-[#71717A]">
              <button className="p-1 hover:bg-gray-50 dark:hover:bg-[#71717A]/20 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              <button className="p-1 hover:bg-gray-50 dark:hover:bg-[#71717A]/20 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          </div>
          
          {/* Görünüm Seçici (Gün / Hafta / Ay) */}
          <div className="flex bg-gray-100 dark:bg-[#0F172A]/50 rounded-lg p-1">
            <button className="px-5 py-1.5 text-sm font-medium text-gray-500 dark:text-[#71717A] rounded-md hover:text-gray-800 dark:hover:text-[#CBD5E1]">Gün</button>
            <button className="px-5 py-1.5 text-sm font-medium text-gray-500 dark:text-[#71717A] rounded-md hover:text-gray-800 dark:hover:text-[#CBD5E1]">Hafta</button>
            <button className="px-5 py-1.5 text-sm font-bold bg-white dark:bg-[#3F3F46] text-[#0f4c3a] dark:text-[#00BBA7] rounded-md shadow-sm">Ay</button>
          </div>
        </div>

        {/* Takvim Izgarası */}
        <div className="flex-1 flex flex-col border border-gray-100 dark:border-[#52525B] rounded-xl overflow-hidden">
          {/* Gün İsimleri */}
          <div className="grid grid-cols-7 border-b border-gray-100 dark:border-[#52525B] bg-gray-50 dark:bg-[#0F172A]/40">
            {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day) => (
              <div key={day} className="py-3 text-center text-[13px] font-bold text-gray-500 dark:text-[#71717A]">
                {day}
              </div>
            ))}
          </div>
          
          {/* Takvim Hücreleri */}
          <div className="grid grid-cols-7 flex-1">
            {/* 1. Hafta */}
            <div className="border-b border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-300 dark:text-[#52525B] text-sm font-medium text-right">25</div>
            <div className="border-b border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-300 dark:text-[#52525B] text-sm font-medium text-right">26</div>
            <div className="border-b border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-300 dark:text-[#52525B] text-sm font-medium text-right">27</div>
            <div className="border-b border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-300 dark:text-[#52525B] text-sm font-medium text-right">28</div>
            <div className="border-b border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-300 dark:text-[#52525B] text-sm font-medium text-right">29</div>
            <div className="border-b border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-300 dark:text-[#52525B] text-sm font-medium text-right">30</div>
            <div className="border-b border-gray-100 dark:border-[#52525B] p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right">1</div>
            
            {/* 2. Hafta */}
            <div className="border-b border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right">2</div>
            <div className="border-b border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right">3</div>
            <div className="border-b border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right flex flex-col items-end">
              <span>4</span>
              <div className="w-full h-1.5 bg-[#0f4c3a] dark:bg-[#00BBA7] rounded-full mt-auto mb-1"></div>
            </div>
            <div className="border-b border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right">5</div>
            <div className="border-b border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right">6</div>
            <div className="border-b border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right">7</div>
            <div className="border-b border-gray-100 dark:border-[#52525B] p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right">8</div>

            {/* 3. Hafta (Seçili günün olduğu hafta) */}
            <div className="border-b border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right">9</div>
            <div className="border-b border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right">10</div>
            {/* Seçili Gün: 11 */}
            <div className="border-b border-r border-gray-100 dark:border-[#52525B] p-2 relative font-bold text-right flex flex-col items-end bg-teal-50/50 dark:bg-[#00BBA7]/10">
              <span className="text-[#0f4c3a] dark:text-[#00BBA7]">11</span>
              <div className="w-full mt-auto space-y-1 mb-1">
                <div className="w-full h-1.5 bg-[#0f4c3a] dark:bg-[#00BBA7] rounded-full"></div>
                <div className="w-full h-1.5 bg-teal-600 dark:bg-[#00BBA7]/60 rounded-full opacity-80"></div>
              </div>
            </div>
            <div className="border-b border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right">12</div>
            <div className="border-b border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right">13</div>
            <div className="border-b border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right">14</div>
            <div className="border-b border-gray-100 dark:border-[#52525B] p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right">15</div>

            {/* 4. Hafta */}
            <div className="border-b border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right">16</div>
            <div className="border-b border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right flex flex-col items-end">
              <span>17</span>
              <div className="w-full h-1.5 bg-[#0f4c3a] dark:bg-[#00BBA7] rounded-full mt-auto mb-1"></div>
            </div>
            <div className="border-b border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right">18</div>
            <div className="border-b border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right">19</div>
            <div className="border-b border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right">20</div>
            <div className="border-b border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right">21</div>
            <div className="border-b border-gray-100 dark:border-[#52525B] p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right">22</div>

            {/* 5. Hafta */}
            <div className="border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right">23</div>
            <div className="border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right">24</div>
            <div className="border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right">25</div>
            <div className="border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right">26</div>
            <div className="border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right">27</div>
            <div className="border-r border-gray-100 dark:border-[#52525B] p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right">28</div>
            <div className="p-2 relative text-gray-800 dark:text-[#CBD5E1] text-sm font-medium text-right">29</div>
          </div>
        </div>
      </div>

      {/* SAĞ BÖLÜM: Günün Detayları */}
      <div className="flex-1 flex flex-col">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-[#0f4c3a] dark:text-[#00BBA7]">11 Ekim, Çarşamba</h3>
          <p className="text-gray-500 dark:text-[#CBD5E1] text-sm mt-1">3 Hatırlatıcı Planlandı</p>
        </div>

        <div className="flex-1 space-y-4">
          
          {/* Hatırlatıcı Kartı 1 */}
          <div className="bg-white dark:bg-[#3F3F46] rounded-xl p-5 border border-gray-100 dark:border-[#52525B] shadow-sm dark:shadow-none">
            <div className="flex justify-between items-start mb-3">
              <span className="bg-[#0f4c3a] dark:bg-[#00BBA7] text-white text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide">İŞ</span>
              <span className="text-sm font-bold text-gray-800 dark:text-[#F8FAFC]">09:30</span>
            </div>
            <h4 className="font-bold text-gray-800 dark:text-[#F8FAFC] text-[15px] mb-2">Marketing Sync Call</h4>
            <div className="flex items-center text-gray-500 dark:text-[#CBD5E1] text-[13px]">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              Çok Dilli Deşifre Aktif
            </div>
          </div>

          {/* Hatırlatıcı Kartı 2 */}
          <div className="bg-white dark:bg-[#3F3F46] rounded-xl p-5 border border-gray-100 dark:border-[#52525B] shadow-sm dark:shadow-none">
            <div className="flex justify-between items-start mb-3">
              <span className="bg-teal-500 dark:bg-[#34D399] text-white dark:text-[#0F172A] text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide">KİŞİSEL</span>
              <span className="text-sm font-bold text-gray-800 dark:text-[#F8FAFC]">14:15</span>
            </div>
            <h4 className="font-bold text-gray-800 dark:text-[#F8FAFC] text-[15px] mb-2">Diş Randevusu</h4>
            <div className="flex items-center text-gray-500 dark:text-[#CBD5E1] text-[13px]">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Şehir Diş Merkezi
            </div>
          </div>

          {/* Hatırlatıcı Kartı 3 */}
          <div className="bg-white dark:bg-[#3F3F46] rounded-xl p-5 border border-gray-100 dark:border-[#52525B] shadow-sm dark:shadow-none">
            <div className="flex justify-between items-start mb-3">
              <span className="bg-[#0f4c3a] dark:bg-[#00BBA7] text-white text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide">İŞ</span>
              <span className="text-sm font-bold text-gray-800 dark:text-[#F8FAFC]">16:45</span>
            </div>
            <h4 className="font-bold text-gray-800 dark:text-[#F8FAFC] text-[15px] mb-2">Almanca Brief Çevirileri</h4>
            <div className="flex items-center text-gray-500 dark:text-[#CBD5E1] text-[13px]">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
              Voia AI Entegrasyonu
            </div>
          </div>

        </div>

        {/* Voia Dinliyor Mini Kartı */}
        <div className="bg-[#e2f1ec] dark:bg-[#00BBA7]/10 rounded-xl p-5 flex items-center mt-6 shadow-sm dark:shadow-none border border-teal-100 dark:border-[#00BBA7]/30">
          <div className="w-12 h-12 bg-[#0f4c3a] dark:bg-[#00BBA7] rounded-full flex items-center justify-center shrink-0 mr-4 shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
          </div>
          <div>
            <h4 className="font-bold text-[#0f4c3a] dark:text-[#00BBA7] text-sm">Voia dinliyor...</h4>
            <p className="text-[#0f4c3a] dark:text-[#CBD5E1] text-[12px] italic opacity-80 mt-0.5">"Bana bir hatırlatıcı eklememi söyle..."</p>
          </div>
        </div>

      </div>
    </div>
  );
}