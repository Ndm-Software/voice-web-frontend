"use client"; // URL'i okuyabilmek için bileşeni Client Component yapıyoruz

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const pathname = usePathname(); // Şu an bulunduğumuz URL'i alıyoruz (Örn: '/' veya '/calendar')

  // Linklerin aktif olup olmamasına göre stilini belirleyen yardımcı fonksiyon
  const getLinkStyle = (path) => {
    if (pathname === path) {
      // Aktif sekme stili (Koyu yeşil yazı, beyaz arka plan, sol yeşil çizgi)
      return "flex items-center px-4 py-3.5 bg-white text-[#0f4c3a] font-bold rounded-lg shadow-sm border-l-4 border-[#0f4c3a] transition-all";
    }
    // Pasif sekme stili (Gri yazı, hover efekti, transparan sol çizgi)
    return "flex items-center px-4 py-3.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded-lg font-medium transition-all border-l-4 border-transparent";
  };

  return (
    <div className="flex h-screen bg-[#f4f7f6] font-sans text-gray-800">
      
      {/* SOL MENÜ (SIDEBAR) */}
      <aside className="w-[260px] bg-[#f8fcfb] border-r border-gray-200 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Alanı */}
          <div className="p-8 pb-6">
            <h1 className="text-3xl font-bold text-[#0f4c3a] tracking-tight">Voia</h1>
            <p className="text-[13px] text-gray-500 font-medium mt-1">Kişisel Sesli Asistan</p>
          </div>

          {/* Navigasyon Linkleri */}
          <nav className="flex flex-col gap-1 px-4 mt-4">
            
            <Link href="/" className={getLinkStyle('/')}>
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              Panel
            </Link>
            
            <Link href="/calendar" className={getLinkStyle('/calendar')}>
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              Takvim
            </Link>
            
            <Link href="/history" className={getLinkStyle('/history')}>
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Geçmiş
            </Link>
            
            <Link href="/quiet-hours" className={getLinkStyle('/quiet-hours')}>
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path></svg>
              Sessiz Saatler
            </Link>
            
            <Link href="/profile" className={getLinkStyle('/profile')}>
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              Profil
            </Link>
          </nav>
        </div>
        
        {/* Yeni Hatırlatıcı Butonu (Sol Alt) */}
        <div className="p-6">
          <Link 
            href="/calendar/new" 
            className="w-full bg-[#0f4c3a] hover:bg-[#0a3629] text-white font-medium py-3.5 px-4 rounded-xl flex items-center justify-center transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Yeni Hatırlatıcı Oluştur
          </Link>
        </div>
      </aside>

      {/* SAĞ TARAF (Üst Bar + Sayfa İçeriği) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* ÜST BAR (TOPBAR) */}
        <header className="h-[88px] flex items-center justify-between px-10 border-b border-gray-200 bg-[#f4f7f6] shrink-0">
          
          {/* Arama Çubuğu */}
          <div className="relative w-full max-w-md">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input
              type="text"
              placeholder="Hatırlatıcılarda ara..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 shadow-sm"
            />
          </div>

          {/* Sağ Üst Araçlar */}
          <div className="flex items-center gap-6">
            <div className="flex gap-3 text-sm font-semibold">
              <button className="text-[#0f4c3a]">TR</button>
              <button className="text-gray-400 hover:text-gray-600">EN</button>
              <button className="text-gray-400 hover:text-gray-600">DE</button>
            </div>
            
            <div className="flex items-center gap-5 ml-4">
              <button className="relative text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                <span className="absolute top-0 right-0.5 w-2 h-2 bg-red-500 border-2 border-[#f4f7f6] rounded-full"></span>
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </button>
              <div className="w-9 h-9 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm cursor-pointer">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces" alt="Profil" className="w-full h-full object-cover" />
                </div>
            </div>
          </div>
        </header>

        {/* ANA İÇERİK ALANI */}
        <main className="flex-1 overflow-y-auto p-10">
          {children}
        </main>
        
      </div>
    </div>
  );
}