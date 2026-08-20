// Firebase kütüphanelerini Service Worker'a dahil et
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

// ⚠️ ÖNEMLİ NOT: Bu dosya public klasöründe statik olarak durduğu için
// process.env değişkenleri burada çalışmaz. Backend ekibi sana anahtarları
// verdiğinde, doğrudan bu tırnakların içine yazman gerekecek. (Firebase config
// bilgilerinin public olmasında güvenlik açısından hiçbir sorun yoktur).
const firebaseConfig = {
  apiKey: "ANAHTARLAR_GELINCE_BURAYA",
  authDomain: "ANAHTARLAR_GELINCE_BURAYA",
  projectId: "ANAHTARLAR_GELINCE_BURAYA",
  storageBucket: "ANAHTARLAR_GELINCE_BURAYA",
  messagingSenderId: "ANAHTARLAR_GELINCE_BURAYA",
  appId: "ANAHTARLAR_GELINCE_BURAYA"
};

// Firebase'i Service Worker içinde başlat
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Uygulama arka plandayken gelen mesajları dinle ve ekranda göster
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Arka plan mesajı alındı:', payload);

  const notificationTitle = payload.notification?.title || 'Yeni Hatırlatıcı';
  const notificationOptions = {
    body: payload.notification?.body || 'Detayları görmek için tıklayın.',
    // public klasöründeki ikonunun adını buraya yazabilirsin (örn: '/logo.png')
    icon: '/window.svg', 
    badge: '/window.svg',
    // Kullanıcı bildirime tıkladığında yönlendirilecek sayfa ayarlanabilir
    data: payload.data 
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});