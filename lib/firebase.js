import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, isSupported, deleteToken } from 'firebase/messaging';
import { onMessage } from 'firebase/messaging';

// Veriler artık güvenli bir şekilde .env.local dosyasından okunuyor
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const requestPushPermissionAndGetToken = async () => {
  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn('Bu tarayıcı bildirimleri desteklemiyor.');
      return null;
    }

    const messaging = getMessaging(app);
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      console.log('Bildirim izni verildi.');
      
      // ÇÖZÜM BURADA: Firebase'in kafası karışmasın diye Service Worker'ı biz manuel kaydediyoruz
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration // <--- EN KRİTİK DOKUNUŞ
      });

      console.log('FCM Token alındı:', token);
      return token;
    } else {
      console.warn('Bildirim izni reddedildi.');
      return null;
    }
  } catch (error) {
    console.error('Bildirim izni istenirken veya token alınırken hata:', error);
    return null;
  }
};

export const onForegroundMessage = (callback) => {
  try {
    const messaging = getMessaging(app);
    // onMessage fonksiyonu, sekme açıkken tetiklenir
    return onMessage(messaging, (payload) => {
      console.log('Ön planda bildirim geldi:', payload);
      callback(payload);
    });
  } catch (error) {
    console.error('Ön plan mesaj dinleyicisi başlatılamadı:', error);
  }
};

// Çıkış yapıldığında tarayıcıdaki Firebase token'ını siler
export const removePushToken = async () => {
  try {
    const supported = await isSupported();
    if (!supported) return;
    
    const messaging = getMessaging(app);
    await deleteToken(messaging);
    console.log("Firebase Push Token başarıyla silindi.");
  } catch (error) {
    console.error("Firebase token silinirken hata:", error);
  }
};