"use client";

import React, { useState } from 'react';

const ALL_ITEMS = [
  {
    id: 1, group: 'BUGÜN', type: 'missed-call', name: 'Annem',
    sub: 'Cevapsız Sesli Arama', time: '14:32',
    badge: 'Cevapsız', badgeClass: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    iconBg: 'bg-red-50 dark:bg-red-900/20', iconColor: 'text-red-500 dark:text-red-400',
    icon: 'missed',
  },
  {
    id: 2, group: 'BUGÜN', type: 'notification', name: 'Günlük Özet',
    sub: 'Yapay zeka analiziniz hazır', time: '11:15',
    badge: 'İletildi', badgeClass: 'bg-teal-50 dark:bg-[#34D399]/10 text-[#0f4c3a] dark:text-[#34D399]',
    iconBg: 'bg-teal-50 dark:bg-[#00BBA7]/10', iconColor: 'text-[#0f4c3a] dark:text-[#00BBA7]',
    icon: 'bell',
  },
  {
    id: 3, group: 'BUGÜN', type: 'call', name: 'Ahmet Yılmaz',
    sub: 'Gelen Sesli Arama (12 dk)', time: '09:45',
    badge: 'İletildi', badgeClass: 'bg-teal-50 dark:bg-[#34D399]/10 text-[#0f4c3a] dark:text-[#34D399]',
    iconBg: 'bg-teal-50 dark:bg-[#00BBA7]/10', iconColor: 'text-[#0f4c3a] dark:text-[#00BBA7]',
    icon: 'phone',
  },
  {
    id: 4, group: 'DÜN', type: 'notification', name: 'İlaç Hatırlatıcısı',
    sub: 'Akşam dozunu almayı unutmayın', time: '20:00',
    badge: 'İletildi', badgeClass: 'bg-teal-50 dark:bg-[#34D399]/10 text-[#0f4c3a] dark:text-[#34D399]',
    iconBg: 'bg-teal-50 dark:bg-[#00BBA7]/10', iconColor: 'text-[#0f4c3a] dark:text-[#00BBA7]',
    icon: 'task',
  },
  {
    id: 5, group: 'DÜN', type: 'missed-call', name: 'Bilinmeyen Numara',
    sub: 'Cevapsız Sesli Arama', time: '17:42',
    badge: 'Cevapsız', badgeClass: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    iconBg: 'bg-red-50 dark:bg-red-900/20', iconColor: 'text-red-500 dark:text-red-400',
    icon: 'missed', redBorder: true,
  },
];

const ICON_MAP = {
  missed: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7l6 6m0-6l-6 6" />
    </svg>
  ),
  bell: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  phone: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  task: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
};

const FILTERS = [
  { key: 'all',          label: 'Tüm Geçmiş' },
  { key: 'call',        label: 'Sadece Sesli Aramalar' },
  { key: 'notification', label: 'Sadece Bildirimler' },
];

export default function HistoryPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filterMap = {
    all: ALL_ITEMS,
    call: ALL_ITEMS.filter((i) => i.type === 'call' || i.type === 'missed-call'),
    notification: ALL_ITEMS.filter((i) => i.type === 'notification'),
  };

  const filtered = filterMap[activeFilter].filter(
    (i) => i.name.toLowerCase().includes(search.toLowerCase()) ||
            i.sub.toLowerCase().includes(search.toLowerCase())
  );

  const groups = ['BUGÜN', 'DÜN'];

  return (
    <div className="w-full max-w-4xl mx-auto">

      {/* Üst Kısım: Başlık ve Arama */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-[28px] font-bold text-[#0f4c3a] dark:text-[#00BBA7] mb-1">Geçmiş</h2>
          <p className="text-gray-500 dark:text-[#CBD5E1] text-[15px]">
            Bildirimlerinizi ve arama kayıtlarınızı buradan yönetin.
          </p>
        </div>

        {/* Sayfa İçi Arama */}
        <div className="relative w-64">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#71717A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Geçmişte ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#27272A] border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-800 dark:text-[#F8FAFC] placeholder-gray-400 dark:placeholder-[#71717A] focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 dark:focus:ring-[#00BBA7]/20 shadow-sm"
          />
        </div>
      </div>

      {/* Filtre Butonları */}
      <div className="flex gap-3 mb-10">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all ${
              activeFilter === f.key
                ? 'bg-[#0f4c3a] dark:bg-[#00BBA7] text-white shadow-sm'
                : 'bg-teal-50/50 dark:bg-[#00BBA7]/10 text-[#0f4c3a] dark:text-[#00BBA7] hover:bg-teal-50 dark:hover:bg-[#00BBA7]/20'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="space-y-8">
        {filtered.length === 0 && (
          <div className="text-center text-gray-400 dark:text-[#71717A] py-16 text-sm font-medium">
            Sonuç bulunamadı.
          </div>
        )}

        {groups.map((group) => {
          const items = filtered.filter((i) => i.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group}>
              <h3 className="text-xs font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wider mb-4">
                {group}
              </h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white dark:bg-[#27272A] rounded-2xl p-4 flex items-center justify-between border shadow-sm dark:shadow-none hover:shadow-md transition-shadow cursor-pointer ${
                      item.redBorder
                        ? 'border-red-200 dark:border-red-900/50 relative overflow-hidden'
                        : 'border-gray-100 dark:border-white/10'
                    }`}
                  >
                    {item.redBorder && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400 dark:bg-red-500" />
                    )}
                    <div className={`flex items-center gap-4 ${item.redBorder ? 'pl-2' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.iconBg} ${item.iconColor}`}>
                        {ICON_MAP[item.icon]}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 dark:text-[#F8FAFC] text-[15px]">{item.name}</h4>
                        <p className="text-[13px] text-gray-500 dark:text-[#CBD5E1] mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium text-gray-500 dark:text-[#71717A] mb-1.5">{item.time}</div>
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${item.badgeClass}`}>
                        {item.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}