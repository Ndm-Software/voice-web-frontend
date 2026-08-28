"use client";

import React, { useState, useEffect } from 'react';
import { getReminderHistory, deleteReminderHistory } from '@/lib/api';

const ICON_MAP = {
 missed: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {/* Telefon Ahizesi */}
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      {/* Dengeli Çarpı / Cevapsız Çağrı Çizgileri */}
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 4l5 5m0-5l-5 5" />
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
  silent: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  )
};

const FILTERS = [
  { key: 'all',          label: 'Tüm Geçmiş' },
  { key: 'call',         label: 'Sadece Sesli Aramalar' },
  { key: 'notification', label: 'Sadece Bildirimler' },
];

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const showToast = (message) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const backendLogs = await getReminderHistory();
      
      const rawSilenced = localStorage.getItem('voia_silenced_records');
      const silencedRecords = rawSilenced ? JSON.parse(rawSilenced) : [];

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const getValidDate = (log) => {
        const raw = log.sentAt || log.createdAt || log.reminder?.eventDatetime;
        if (!raw) return new Date();
        const d = new Date(raw);
        return isNaN(d.getTime()) ? new Date() : d;
      };

      const sortedLogs = (backendLogs || []).sort((a, b) => getValidDate(b) - getValidDate(a));

      const formattedItems = sortedLogs.map((log) => {
        const dateObj = getValidDate(log);
        const logTime = dateObj.getTime();
        const isToday = dateObj.toDateString() === today.toDateString();
        const isYesterday = dateObj.toDateString() === yesterday.toDateString();
        
        let group = '';
        if (isToday) group = 'BUGÜN';
        else if (isYesterday) group = 'DÜN';
        else group = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }).toUpperCase();

        const isPush = String(log.historyType).includes('PUSH');
        const isSuccess = log.status === 'SUCCESS' || log.status === 'DELIVERED' || log.status === 'COMPLETED';

        // SADECE ID eşleşirse VEYA o saniye içinde susturulduysa susturulmuştur (Başlık kontrolü kaldırıldı)
        const isSilenced = silencedRecords.some((s) => {
          if (s.id) {
            return (
              (log.reminderId && String(log.reminderId) === s.id) ||
              (log.historyId && String(log.historyId) === s.id) ||
              (log.reminder?.id && String(log.reminder.id) === s.id)
            );
          }
          // ID yoksa sadece susturulma saniyesine (15 saniye tolerans) bakar, sonraki dakikaları etkilemez
          return Math.abs(s.timestamp - logTime) < 15000;
        });

        const isFailed = !isSuccess || isSilenced;

        let type = isPush ? 'notification' : (isFailed ? 'missed-call' : 'call');
        let icon = isPush ? (isSilenced ? 'silent' : 'bell') : (isFailed ? 'missed' : 'phone');

        let badge = 'İletildi';
        let badgeClass = 'bg-teal-50 dark:bg-[#00BBA7]/10 text-[#0f4c3a] dark:text-[#00BBA7]';
        let sub = isPush ? 'Bildirim iletildi.' : 'Gelen Sesli Arama';
        let redBorder = false;

        if (isSilenced) {
          badge = isPush ? 'Sessize Alındı' : 'Cevapsız';
          badgeClass = 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400';
          sub = isPush ? 'Sessiz saat devrede olduğu için bildirim susturuldu.' : 'Sessiz saat devrede olduğu için arama çalmadı.';
          redBorder = true;
        } else if (!isSuccess) {
          badge = isPush ? 'Başarısız' : 'Cevapsız';
          badgeClass = 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400';
          sub = log.errorMessage || (isPush ? 'Bildirim gönderilemedi.' : 'Cevapsız Sesli Arama');
          redBorder = true;
        }

        return {
          id: log.historyId || log.id,
          group: group,
          type: type,
          name: log.reminder?.title || (isPush ? 'Sistem Bildirimi' : 'Asistan Araması'),
          sub: sub,
          time: dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
          badge: badge,
          badgeClass: badgeClass,
          iconBg: redBorder ? 'bg-red-50 dark:bg-red-900/20' : 'bg-teal-50 dark:bg-[#00BBA7]/10',
          iconColor: redBorder ? 'text-red-500 dark:text-red-400' : 'text-[#0f4c3a] dark:text-[#00BBA7]',
          icon: icon,
          redBorder: redBorder
        };
      });

      setItems(formattedItems);
    } catch (error) {
      console.error("Geçmiş yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, historyId) => {
    e.stopPropagation();
    try {
      await deleteReminderHistory(historyId);
      setItems((prev) => prev.filter((item) => item.id !== historyId));
      showToast('Kayıt başarıyla silindi.');
    } catch (error) {
      showToast('Kayıt silinirken hata oluştu.');
    }
  };

  const filterMap = {
    all: items,
    call: items.filter((i) => i.type === 'call' || i.type === 'missed-call'),
    notification: items.filter((i) => i.type === 'notification'),
  };

  const filtered = (filterMap[activeFilter] || items).filter(
    (i) => i.name.toLowerCase().includes(search.toLowerCase()) ||
            i.sub.toLowerCase().includes(search.toLowerCase())
  );

  const groups = [...new Set(filtered.map((item) => item.group))];

  return (
    <div className="w-full max-w-4xl mx-auto pb-10">
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl bg-[#0f4c3a] dark:bg-[#00BBA7] text-white text-sm font-bold">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {toast.message}
        </div>
      )}

      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-[28px] font-bold text-[#0f4c3a] dark:text-[#00BBA7] mb-1">Geçmiş</h2>
          <p className="text-gray-500 dark:text-[#CBD5E1] text-[15px]">
            Bildirimlerinizi ve arama kayıtlarınızı buradan yönetin.
          </p>
        </div>

        <div className="relative w-64">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#71717A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Geçmişte ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#27272A] border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-800 dark:text-[#F8FAFC] placeholder-gray-400 dark:placeholder-[#71717A] focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 dark:focus:ring-[#00BBA7]/20 shadow-sm transition-all"
          />
        </div>
      </div>

      <div className="flex gap-3 mb-10">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all focus:outline-none cursor-pointer ${
              activeFilter === f.key
                ? 'bg-[#0f4c3a] dark:bg-[#00BBA7] text-white shadow-sm'
                : 'bg-teal-50/50 dark:bg-[#00BBA7]/10 text-[#0f4c3a] dark:text-[#00BBA7] hover:bg-teal-50 dark:hover:bg-[#00BBA7]/20'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {loading ? (
          <div className="text-center text-gray-400 dark:text-[#71717A] py-16 text-sm font-medium">
            Kayıtlar yükleniyor...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-400 dark:text-[#71717A] py-16 text-sm font-medium">
            Sonuç bulunamadı.
          </div>
        ) : (
          groups.map((group) => {
            const groupItems = filtered.filter((i) => i.group === group);
            if (groupItems.length === 0) return null;
            return (
              <div key={group} className="animate-in fade-in duration-300">
                <h3 className="text-xs font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wider mb-4">
                  {group}
                </h3>
                <div className="space-y-3">
                  {groupItems.map((item) => (
                    <div
                      key={item.id}
                      className={`bg-white dark:bg-[#27272A] rounded-2xl p-4 flex items-center justify-between border shadow-sm dark:shadow-none hover:shadow-md transition-shadow cursor-default group relative overflow-hidden ${
                        item.redBorder
                          ? 'border-red-200 dark:border-red-900/50'
                          : 'border-gray-100 dark:border-white/10'
                      }`}
                    >
                      {item.redBorder && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400 dark:bg-red-500" />
                      )}
                      <div className={`flex items-center gap-4 ${item.redBorder ? 'pl-2' : ''}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.iconBg} ${item.iconColor}`}>
                          {ICON_MAP[item.icon] || ICON_MAP.bell}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 dark:text-[#F8FAFC] text-[15px]">{item.name}</h4>
                          <p className="text-[13px] text-gray-500 dark:text-[#CBD5E1] mt-0.5 max-w-sm truncate">{item.sub}</p>
                        </div>
                      </div>
                      
                      <div className="text-right flex items-center gap-3">
                        <div className="flex flex-col items-end">
                          <div className="text-xs font-medium text-gray-500 dark:text-[#71717A] mb-1.5">{item.time}</div>
                          <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${item.badgeClass}`}>
                            {item.badge}
                          </span>
                        </div>
                        <button 
                          onClick={(e) => handleDelete(e, item.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                          title="Kaydı Sil"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}