"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function NewReminderPage() {
  // Bildirim ve Arama hap (pill) butonları için state'ler
  const [notificationTime, setNotificationTime] = useState('Zamanında');
  const [callTime, setCallTime] = useState('Zamanında');

  return (
    <div className="w-full max-w-4xl mx-auto">
      
      {/* Sayfa İçeriği: Ana Kart */}
      <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
        
        <form className="space-y-8">
          
          {/* 1. Satır: Başlık */}
          <div>
            <label className="block text-[11px] font-bold text-[#0f4c3a] uppercase tracking-wider mb-2">
              BAŞLIK
            </label>
            <input
              type="text"
              placeholder="Toplantı hazırlığı..."
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* 2. Satır: Asistan Dili ve Tekrar */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold text-[#0f4c3a] uppercase tracking-wider mb-2">
                ASİSTAN DİLİ
              </label>
              <div className="relative">
                <select className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 appearance-none cursor-pointer">
                  <option>Türkçe</option>
                  <option>English</option>
                  <option>Deutsch</option>
                </select>
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#0f4c3a] uppercase tracking-wider mb-2">
                TEKRAR
              </label>
              <div className="relative">
                <select className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 appearance-none cursor-pointer">
                  <option>Bir kez</option>
                  <option>Her Gün</option>
                  <option>Her Hafta</option>
                </select>
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* 3. Satır: Tarih ve Saat */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold text-[#0f4c3a] uppercase tracking-wider mb-2">
                TARİH
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="gg.aa.yyyy"
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 border-none rounded-xl text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#0f4c3a] uppercase tracking-wider mb-2">
                SAAT
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="--:--"
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 border-none rounded-xl text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
            </div>
          </div>

          {/* 4. Satır: Açıklama */}
          <div>
            <label className="block text-[11px] font-bold text-[#0f4c3a] uppercase tracking-wider mb-2">
              AÇIKLAMA
            </label>
            <textarea
              rows="3"
              placeholder="Hatırlatıcı detaylarını buraya ekleyin..."
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 resize-none"
            ></textarea>
          </div>

          {/* 5. Satır: Zamanlama Butonları (Haplar) */}
          <div className="grid grid-cols-2 gap-6 pt-2">
            {/* Bildirim Zamanlaması */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">Bildirim Zamanlaması</label>
              <div className="flex gap-2">
                {['Zamanında', '5 dk', '15 dk', '30 dk'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setNotificationTime(time)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                      notificationTime === time
                        ? 'bg-teal-50 border-teal-300 text-[#0f4c3a]'
                        : 'bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Sesli Arama Zamanlaması */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">Sesli Arama Zamanlaması</label>
              <div className="flex gap-2">
                {['Yok', 'Zamanında', '5 dk', '10 dk'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setCallTime(time)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                      callTime === time
                        ? 'bg-teal-50 border-teal-300 text-[#0f4c3a]'
                        : 'bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 6. Satır: Asistan Dinliyor Barı */}
          <div className="mt-8 bg-[#f4f9f7] border border-teal-100 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#0f4c3a] rounded-full flex items-center justify-center text-white shadow-md cursor-pointer hover:bg-[#0a3629] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-[#0f4c3a] uppercase tracking-wider mb-1">ASİSTAN DİNLİYOR...</h4>
                {/* Ses Dalgası Efekti */}
                <div className="flex items-center gap-1">
                  <div className="w-1 h-3 bg-[#0f4c3a] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1 h-4 bg-[#0f4c3a] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1 h-2 bg-[#0f4c3a] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <div className="w-1 h-5 bg-[#0f4c3a] rounded-full animate-bounce" style={{ animationDelay: '450ms' }}></div>
                  <div className="w-1 h-3 bg-[#0f4c3a] rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-500 text-sm italic font-medium">
              "Yarın sabah 9'da proje sunumunu hatırlat"
            </p>
          </div>

          {/* Alt Butonlar (İptal ve Kaydet) */}
          <div className="flex items-center justify-end gap-6 pt-6">
            <Link 
              href="/calendar"
              className="text-sm font-bold text-[#0f4c3a] hover:text-[#0a3629] transition-colors"
            >
              İptal Et
            </Link>
            <button
              type="button"
              className="px-8 py-3.5 bg-[#0f4c3a] hover:bg-[#0a3629] text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
            >
              Hatırlatıcıyı Kaydet
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}