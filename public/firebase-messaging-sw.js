// Firebase kütüphanelerini eski usul (compat) CDN üzerinden çekiyoruz
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

// DİKKAT: public klasöründe process.env çalışmaz! 
// Bu yüzden ayarları doğrudan buraya yazıyoruz (Bu işlem güvenlidir).
firebase.initializeApp({
  apiKey: "AIzaSyBg1ZmY2K3InbD2a2lDpsGfEClT3RBy3d8",
  authDomain: "voice-923e3.firebaseapp.com",
  projectId: "voice-923e3",
  storageBucket: "voice-923e3.firebasestorage.app",
  messagingSenderId: "538901908212",
  appId: "1:538901908212:web:37e9e1712b8fa2b9812ca1"
});

const messaging = firebase.messaging();

// Arka planda (sekme kapalıyken) bildirim geldiğinde çalışacak kod
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Arka plan mesajı alındı: ', payload);
  
  const notificationTitle = payload.notification?.title || 'Yeni Bildirim';
  const notificationOptions = {
    body: payload.notification?.body || 'Asistanınızdan yeni bir mesaj var.',
    icon: '/favicon.ico' // İstersen buraya kendi logunun yolunu (örn: '/logo.png') yazabilirsin
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});