"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1A1A1A] font-sans text-gray-900 dark:text-[#F8FAFC] selection:bg-[#00BBA7]/30 transition-colors duration-500">
      
      {/* 1. NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/10 shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#0f4c3a] dark:text-[#00BBA7] tracking-tight">Voia</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-medium text-sm">
            <a href="#ozellikler" className="text-gray-600 dark:text-gray-400 hover:text-[#0f4c3a] dark:hover:text-[#00BBA7] transition-colors">Özellikler</a>
            <a href="#nasil-calisir" className="text-gray-600 dark:text-gray-400 hover:text-[#0f4c3a] dark:hover:text-[#00BBA7] transition-colors">Nasıl Çalışır?</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-[#0f4c3a] dark:hover:text-[#00BBA7] transition-colors px-4 py-2">
              Giriş Yap
            </Link>
            <Link href="/register" className="text-sm font-bold bg-[#0f4c3a] dark:bg-[#00BBA7] hover:bg-[#0a3629] dark:hover:bg-[#009F8E] text-white px-6 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Denemeye Başla
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-400/20 dark:bg-[#00BBA7]/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 dark:bg-[#27272A] border border-teal-100 dark:border-white/10 text-teal-700 dark:text-[#00BBA7] text-xs font-bold uppercase tracking-wider mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            Voia v1.0 Yayında
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 text-gray-900 dark:text-white leading-tight">
            Sadece Hatırlatmaz <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0f4c3a] to-teal-500 dark:from-[#00BBA7] dark:to-teal-300">Size Ulaşır</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
            Sessizce geçip giden geleneksel takvim uyarılarını unutun. Voia, kritik anlarda telefonunuzu çaldırır ve planlarınızı size iletir.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto text-base font-bold bg-[#0f4c3a] dark:bg-[#00BBA7] hover:bg-[#0a3629] dark:hover:bg-[#009F8E] text-white px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center">
              Asistanınızla Tanışın
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
            <a href="#nasil-calisir" className="w-full sm:w-auto text-base font-bold bg-white dark:bg-[#27272A] hover:bg-gray-50 dark:hover:bg-[#323235] text-gray-800 dark:text-white border border-gray-200 dark:border-white/10 px-8 py-4 rounded-xl transition-all shadow-sm flex items-center justify-center">
              Sistemi Keşfet
            </a>
          </div>
        </div>
      </section>

      {/* 3. ÖZELLİKLER */}
      <section id="ozellikler" className="py-24 bg-white dark:bg-[#1E1E1E] transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Gözden Kaçırmayı İmkânsız Kılan Yapı</h2>
            <p className="text-gray-600 dark:text-gray-400">Voia, ekranda unutulan küçük bir simge değil; zamanı geldiğinde proaktif olarak harekete geçen yol arkadaşınızdır.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Özellik 1 */}
            <div className="bg-gray-50 dark:bg-[#27272A] p-8 rounded-3xl border border-gray-100 dark:border-white/5 hover:border-teal-200 dark:hover:border-[#00BBA7]/30 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-[#1A1A1A] flex items-center justify-center text-[#0f4c3a] dark:text-[#00BBA7] mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Türkçe ve İngilizce Desteği</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Voia her iki dilde de doğal konuşmanızı kusursuz anlar ve aksiyon alır. Üstelik çok yakında yeni dillerle karşınızda.
              </p>
            </div>

            {/* Özellik 2 */}
            <div className="bg-gray-50 dark:bg-[#27272A] p-8 rounded-3xl border border-gray-100 dark:border-white/5 hover:border-teal-200 dark:hover:border-[#00BBA7]/30 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-[#1A1A1A] flex items-center justify-center text-[#0f4c3a] dark:text-[#00BBA7] mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Sessiz Saatler</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Uyku veya toplantı saatlerinizde alanınıza saygı duyar. Aramaları keser, bildirimlerinizi uyandığınız veya müsait olduğunuz ana erteler. 
              </p>
            </div>

            {/* Özellik 3 */}
            <div className="bg-gray-50 dark:bg-[#27272A] p-8 rounded-3xl border border-gray-100 dark:border-white/5 hover:border-teal-200 dark:hover:border-[#00BBA7]/30 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-[#1A1A1A] flex items-center justify-center text-[#0f4c3a] dark:text-[#00BBA7] mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Her Yerden Erişim</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                İster bilgisayarınızdan, ister telefonunuzdan. Bulut tabanlı mimarisiyle ne zaman ihtiyaç duyarsanız Voia her zaman yanınızda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NASIL ÇALIŞIR? */}
      <section id="nasil-calisir" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl font-bold mb-4">Sadece 3 Adımda Sıfır Unutma Riski</h2>
            <p className="text-gray-600 dark:text-gray-400">Karmaşık takvim ayarlarına son. Siz planı yapın, geri kalan takibi Voia'ya bırakın.</p>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-[#00BBA7]/50 to-transparent -z-10"></div>

            {/* Adım 1 */}
            <div className="flex flex-col items-center text-center max-w-xs relative z-10">
              <div className="w-16 h-16 rounded-full bg-white dark:bg-[#27272A] border-4 border-gray-50 dark:border-[#1A1A1A] shadow-lg flex items-center justify-center text-2xl font-black text-[#0f4c3a] dark:text-[#00BBA7] mb-6">1</div>
              <h4 className="text-lg font-bold mb-2">Planınızı Oluşturun</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Modern arayüzden görevinizi yazın, bildirim ve arama saatlerini dakikası dakikasına belirleyin.</p>
            </div>

            {/* Adım 2 */}
            <div className="flex flex-col items-center text-center max-w-xs relative z-10">
              <div className="w-16 h-16 rounded-full bg-white dark:bg-[#27272A] border-4 border-gray-50 dark:border-[#1A1A1A] shadow-lg flex items-center justify-center text-2xl font-black text-[#0f4c3a] dark:text-[#00BBA7] mb-6">2</div>
              <h4 className="text-lg font-bold mb-2">Voia Nöbete Geçsin</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sistem, zaman diliminizi ve sessiz saatlerinizi hesaplayarak arka planda hassasiyetle hazır bekler.</p>
            </div>

            {/* Adım 3 */}
            <div className="flex flex-col items-center text-center max-w-xs relative z-10">
              <div className="w-16 h-16 rounded-full bg-white dark:bg-[#27272A] border-4 border-gray-50 dark:border-[#1A1A1A] shadow-lg flex items-center justify-center text-2xl font-black text-[#0f4c3a] dark:text-[#00BBA7] mb-6">3</div>
              <h4 className="text-lg font-bold mb-2">Telefonunuz Çalsın</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Vakti geldiğinde telefonunuz çalar. Asistanınız görevinizi canlı ve net bir sesle size okur.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CTA */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="bg-[#0f4c3a] dark:bg-[#1E1E1E] rounded-[2.5rem] p-12 lg:p-16 text-center relative overflow-hidden border border-transparent dark:border-white/10 shadow-2xl">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-400/30 dark:bg-[#00BBA7]/20 blur-[80px] rounded-full pointer-events-none"></div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 relative z-10">
              Hiçbir Detayı Şansa Bırakmayın
            </h2>
            <p className="text-teal-100 dark:text-gray-400 text-lg mb-10 max-w-2xl mx-auto relative z-10">
              Ücretsiz hesabınızı saniyeler içinde oluşturun, sizi gerçekten arayan kişisel asistan konforunu deneyimleyin.
            </p>
            <Link href="/register" className="inline-block font-bold bg-white dark:bg-[#00BBA7] text-[#0f4c3a] dark:text-white hover:bg-gray-100 dark:hover:bg-[#009F8E] px-8 py-4 rounded-xl transition-all shadow-lg transform hover:-translate-y-1 relative z-10">
              Ücretsiz Hesabını Oluştur
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] transition-colors duration-500 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#0f4c3a] dark:text-[#00BBA7] tracking-tight">Voia</span>
            <span className="text-gray-400 dark:text-[#71717A] text-sm ml-2">© 2026 Tüm hakları saklıdır.</span>
          </div>
          
          <div className="flex gap-6 text-sm font-medium text-gray-500 dark:text-gray-400">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Gizlilik Politikası</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Kullanım Şartları</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">İletişim</a>
          </div>
        </div>
      </footer>

    </div>
  );
}