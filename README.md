# 📌 Voia Web Frontend - Geliştirme Notları & Yapılacaklar Listesi (Roadmap)

> Bu bölüm, projenin mevcut durumu ve sonraki aşamalarda geliştirilmesi planlanan öncelikli frontend görevlerini içermektedir.

---

### 1. 🌐 Çoklu Dil Desteği (İngilizce Sayfa Tasarımları)
* **Mevcut Durum:** Dil seçeneği altyapısı ve backend bağlantısı (`languageId`) hazırlandı.
* **Yapılacaklar:** 
  * Uygulama genelinde (Panel, Takvim, Geçmiş, Profil vb.) `i18n` veya `next-intl` entegrasyonu tamamlanarak tüm statik metinlerin İngilizce (EN) karşılıkları eklenmeli.
  * Dil değiştirildiğinde UI anlık olarak ilgili dilde render edilmeli.

---

### 2. 📱 Bağlı Cihazlar Yönetimi (Cihazdan Çıkış Yap Butonu)
* **Mevcut Durum:** Profil sayfasında kullanıcının aktif ve diğer bağlı cihazları listelenmektedir.
* **Yapılacaklar:**
  * Cihaz listesindeki her bir cihaz kartının sağ tarafına **"Cihazdan Çıkış Yap / Oturumu Kapat"** butonu eklenmeli.
  * Backend'deki ilgili cihaz oturum sonlandırma endpoint'ine (`DELETE /api/devices/:id` veya benzeri) bağlanarak kullanıcının diğer cihazlardaki oturumlarını uzaktan kapatabilmesi sağlanmalı.

---

### 3. 🔔 Sistem Bildirimleri & Toast Standardizasyonu
* **Mevcut Durum:** Bazı işlemler yerel toast bildirimleri ile gösterilmektedir.
* **Yapılacaklar:**
  * Hatırlatıcı silme, güncelleme ve diğer kritik CRUD işlemlerinde kullanıcıya gösterilen tüm geri bildirimler merkezi bir **Sistem Mesajı / Bildirim** standardına oturtulmalı.
  * İşlem sonrasında anlık sistem logları veya bilgilendirme bildirimlerinin arayüzde tutarlı görünmesi sağlanmalı.

---

### 4. 📅 Tekrarlayan Hatırlatıcıların Takvim Görünümü (Recurring Reminders)
* **Mevcut Durum:** Hatırlatıcı oluştururken/düzenlerken `repeatType` (`DAILY`, `WEEKLY`, `MONTHLY`) backend'e başarıyla iletilmektedir. Ancak takvim arayüzünde etkinlik yalnızca tek bir günde görünmektedir.
* **Yapılacaklar:**
  * Takvim bileşeninde (Aylık/Haftalık görünüm), `repeatType` değerine göre tekrarlayan günleri hesaplayan bir frontend algoritması yazılmalı.
  * Örneğin; *Her Hafta Salı* seçildiyse ilgili ayın tüm Salı günlerine, *Her Ay* seçildiyse her ayın aynı gününe etkinlik kartı dinamik olarak yerleştirilmeli.

---

### 5. ⏱️ Çoklu Bildirim & Arama Zamanlaması Seçimi (Multi-Select Timing)
* **Mevcut Durum:** Bildirim ve Sesli Arama zamanlamasında tekil seçim yapılmaktadır.
* **Yapılacaklar:**
  * Backend mimarisinde (`pushNotifications` ve `voiceCallSettings` dizileri) birden fazla zaman kuralı desteklenmektedir.
  * Frontend tarafındaki butonlar tekil seçim yerine **çoklu seçim (multi-select / toggle)** mantığına dönüştürülmeli.
  * Kullanıcı aynı anda hem *15 dk önce*, hem *10 dk önce*, hem de *5 dk önce* butonlarını seçebilmeli ve backend'e dizi halinde gönderilerek hatırlatıcının belirtilen tüm dakikalarda kullanıcıyı uyarması sağlanmalı.