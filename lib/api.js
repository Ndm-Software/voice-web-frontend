/**
 * lib/api.js
 *
 * Merkezi API yardımcısı.
 *
 * KURAL:
 * - API'nin ANA ADRESİ .env.local dosyasından okunur (NEXT_PUBLIC_API_URL).
 * - Endpoint PATH'LERİ (/api/auth/login gibi) burada statik metin olarak yazılır,
 * asla .env dosyasına eklenmez.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"; // Backend'in ana adresi

// NOT: Token yönetimi frontend'in sorumluluğunda değildir.
// Backend, başarılı login sonrasında accessToken'ı HttpOnly cookie olarak
// yazar. Tarayıcı bu cookie'yi sonraki isteklerde otomatik gönderir.
// Bu nedenle tüm isteklere credentials: 'include' eklenir.

// ─── Yardımcı: Ham fetch sarmalayıcı ─────────────────────────────────────────
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    // HttpOnly cookie'nin her istekte otomatik gönderilmesi için zorunludur.
    credentials: "include",
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  // Başarısız yanıtlar için hata fırlat
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const err = new Error(errorData.message || `HTTP ${response.status}`);
    err.status = response.status;
    throw err;
  }

  return response.json();
}

// ─── Yardımcı: 401'de bir kez refresh deneyen sarmalayıcı ────────────────────
// Korumalı tüm isteklerde bu fonksiyonu kullanın.
// accessToken süresi dolmuşsa /api/auth/refresh ile yeniler ve isteği tekrarlar.
// Refresh da başarısız olursa hata fırlatır; çağıran katman kullanıcıyı logout etmelidir.
// lib/api.js

// lib/api.js içindeki requestWithRefresh yerine yapıştırın:
let refreshPromise = null;

async function requestWithRefresh(path, options = {}) {
  try {
    return await request(path, options);
  } catch (err) {
    // Sadece 401 aldığında ve auth istekleri değilken refresh dene
    if (
      err.status === 401 &&
      path !== "/api/auth/refresh" &&
      path !== "/api/auth/login" &&
      path !== "/api/auth/register"
    ) {
      if (!refreshPromise) {
        refreshPromise = request("/api/auth/refresh", { method: "POST" })
          .catch((refreshErr) => {
            throw refreshErr;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      try {
        await refreshPromise;
        return await request(path, options);
      } catch (refreshError) {
        throw refreshError;
      }
    }
    throw err;
  }
}

// ─── AUTH İŞLEMLERİ & CİHAZ KİMLİĞİ YÖNETİMİ ─────────────────────────────────

/**
 * Tarayıcı için tekil ve kalıcı cihaz kimliği üretir/döner.
 * Sayfa yenilense veya logout olunsa bile aynı tarayıcıda yeni cihaz oluşturulmasını engeller.
 */
export function getOrCreateInstallationId(email = '') {
  if (typeof window === 'undefined') return 'server-id';

  // 1. Standart anahtara bak
  let id = localStorage.getItem('voia_installation_id');

  // 2. Yoksa e-posta özelindeki anahtara bak
  if (!id && email) {
    id = localStorage.getItem(`voia_device_${email}`);
  }

  // 3. Hiç yoksa kalıcı UUID üret
  if (!id) {
    id = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : 'device-' + Date.now();
  }

  // 4. Anahtarları sabitle
  localStorage.setItem('voia_installation_id', id);
  if (email) {
    localStorage.setItem(`voia_device_${email}`, id);
  }

  return id;
}

export async function login(email, password) {
  const installationId = getOrCreateInstallationId(email);

  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password,
      installationId: installationId,
      platform: "WEB",
      deviceName: window.navigator.userAgent.substring(0, 99) || "Web Browser"
    }),
  });
}

export async function logout() {
  // Çıkış yapıldığında installationId silinmez; böylece tekrar girişte aynı cihaz tanınır ve klonlanmaz
  return request("/api/auth/logout", { method: "POST" });
}

/**
 * Kullanıcı kaydı.
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} email
 * @param {string} phoneNumber
 * @param {string} password
 * @returns {Promise<object>}
 */
export async function register(firstName, lastName, email, phoneNumber, password) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ firstName, lastName, email, phoneNumber, password }),
  });
}

/**
 * Oturumu açık kullanıcının bilgilerini çek.
 * Token manuel olarak gönderilmez; HttpOnly cookie tarayıcı tarafından
 * otomatik eklenir (credentials: 'include' sayesinde).
 * @returns {Promise<object>}  - Kullanıcı nesnesi
 */
export async function getMe() {
  return requestWithRefresh("/api/users/me", { method: "GET" });
}

/**
 * Kullanıcının kayıt sonrası OTP kodunu doğrular.
 * POST /api/auth/register/verify
 * Backend'in tam olarak hangi parametreleri (email mi, phoneNumber mı) beklediğini
 * DTO dosyasına göre dinamik gönderebilmek için data objesi alıyoruz.
 */
export async function verifyRegistration(data) {
  return request("/api/auth/register/verify", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Doğrulama kodunu tekrar gönderir.
 * POST /api/auth/register/resend
 */
export async function resendRegistrationOtp(data) {
  return request("/api/auth/register/resend", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ─── LANGUAGES ENDPOİNTLERİ ──────────────────────────────────────────────────

/**
 * Tüm dil seçeneklerini listeler. Kimlik doğrulama gerektirmez.
 * Frontend kullanımı: onboarding ve ayarlar ekranındaki dil listesi.
 * ÖNEMLİ: Ekranda lang.name göster; kaydetmek için lang.languageId kullan.
 * @returns {Promise<Array<{languageId: number, code: string, name: string, voiceName: string}>>}
 */
export async function getLanguages() {
  return request("/api/languages");
}

/**
 * Sayısal ID ile tek bir dil kaydını getirir. Kimlik doğrulama gerektirmez.
 * Frontend kullanımı: tek bir dil detayını doğrulamak gerektiğinde.
 * Hata 400: ID sayı değil. Hata 404: Bu ID'de dil yok.
 * @param {number} languageId
 * @returns {Promise<{languageId: number, code: string, name: string, voiceName: string}>}
 */
export async function getLanguageById(languageId) {
  return request(`/api/languages/${languageId}`);
}

/**
 * Dil koduyla kayıt getirir. Kod backend'de büyük harfe normalize edilir (tr → TR).
 * Kimlik doğrulama gerektirmez.
 * Frontend kullanımı: URL/cihaz locale kodunu backend dil kaydıyla eşlemek.
 * Hata 404: Desteklenmeyen dil.
 * @param {string} code  - Örn: 'tr', 'TR', 'en'
 * @returns {Promise<{languageId: number, code: string, name: string, voiceName: string}>}
 */
export async function getLanguageByCode(code) {
  return request(`/api/languages/code/${code}`);
}

/**
 * YENİ DİL EKLER. Şu an açık endpoint — yalnızca admin/operasyon aracıdır.
 * UYARI: Normal kullanıcı akışından çağrılmamalıdır.
 * Production öncesi admin yetkisiyle korunmalıdır.
 * Hata 400: Eksik alan veya yanlış tip. Hata 409: Bu code zaten var.
 * @param {{ code: string, name: string, voiceName: string }} payload
 * @returns {Promise<{languageId: number, code: string, name: string, voiceName: string}>}
 */
export async function createLanguage(payload) {
  return request("/api/languages", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Dil alanlarını kısmi günceller. Yalnızca body'de gönderilen alanlar değişir.
 * UYARI: Yalnızca admin/yönetim ekranı içindir.
 * Production öncesi admin yetkisiyle korunmalıdır.
 * Hata 400: Geçersiz ID/body. Hata 404: Dil bulunamadı. Hata 409: code çakışması.
 * @param {number} languageId
 * @param {{ code?: string, name?: string, voiceName?: string }} payload
 * @returns {Promise<{languageId: number, code: string, name: string, voiceName: string}>}
 */
export async function updateLanguage(languageId, payload) {
  return request(`/api/languages/${languageId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/**
 * Dili siler. Bir kullanıcı ayarında kullanılıyorsa 409 döner.
 * UYARI: Yalnızca admin/yönetim ekranı içindir. Normal kullanıcı görmemeli.
 * Production öncesi admin yetkisiyle korunmalıdır.
 * Hata 404: Dil yok. Hata 409: Dil user settings'te kullanılıyor (önce bağımlılıkları kaldırın).
 * @param {number} languageId
 * @returns {Promise<{ message: string }>}
 */
export async function deleteLanguage(languageId) {
  return request(`/api/languages/${languageId}`, { method: "DELETE" });
}

// Kullanıcının ayarlarını getirir. 404 → null döner (yeni kullanıcı = henüz ayar yok).
export async function getUserSettings() {
  try {
    return await requestWithRefresh("/api/user-settings/me");
  } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
}

// Kullanıcının tam profil bilgilerini getirir (GET /api/users/me).
// Döküman: GET /api/auth/me yalnızca JWT'deki temel veriyi (userId, email) döner;
// firstName, lastName, telefon gibi tam profil için /api/users/me kullanılır.
export async function getUserProfile() {
  return requestWithRefresh("/api/users/me");
}

/**
 * Oturum açmış kullanıcının hesabını siler.
 * @returns {Promise<{ message: string }>}
 */
export async function deleteAccount() {
  return request("/api/users/me", { method: "DELETE" });
}

// Kullanıcı ayarlarını kaydeder veya günceller (PUT /api/user-settings/me)
export async function updateUserSettings(settingsData) {
  return requestWithRefresh("/api/user-settings/me", {
    method: "PUT",
    body: JSON.stringify(settingsData),
  });
}

// Oturum açmış kullanıcının profil bilgilerini kısmi günceller (PATCH /api/users/me)
export async function updateUserProfile(profileData) {
  return requestWithRefresh("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(profileData),
  });
}

// Oturum açmış kullanıcının bağlı cihazlarını getirir (GET /api/devices)
export async function getDevices() {
  return requestWithRefresh("/api/devices");
}

/**
 * Yeni bir cihaz kaydeder veya mevcut cihazı günceller (PUT /api/devices).
 * Bu endpoint FCM token'ını (pushToken) backend'e iletmek için kullanılır.
 * @param {{ installationId: string, platform: string, deviceName: string, pushToken?: string }} data
 */
export async function updateDevice(data) {
  return requestWithRefresh("/api/devices", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ─── USER SETTINGS — PATCH ───────────────────────────────────────────────────

/**
 * Kullanıcının ayarlarını kısmi günceller (PATCH /api/user-settings/me).
 * Yalnızca body'de gönderilen alanlar değişir; gönderilmeyenler aynı kalır.
 * Ayar kaydı yoksa 404 döner (önce PUT ile oluşturun).
 * @param {{ languageId?: string, timezone?: string, province?: string, notificationsEnabled?: boolean, defaultPushBefore?: number, defaultCallBefore?: number }} data
 */
export async function patchUserSettings(data) {
  return requestWithRefresh("/api/user-settings/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// ─── REMINDERS ───────────────────────────────────────────────────────────────

/**
 * Oturum açmış kullanıcının tüm hatırlatıcılarını listeler (GET /api/reminders).
 * @returns {Promise<Array>}
 */
export async function getReminders() {
  return requestWithRefresh("/api/reminders");
}

/**
 * Tek bir hatırlatıcıyı ID ile getirir (GET /api/reminders/:id).
 * Hata 404: Hatırlatıcı bulunamadı veya başka kullanıcıya ait.
 * @param {string} id - UUID
 */
export async function getReminderById(id) {
  return requestWithRefresh(`/api/reminders/${id}`);
}

/**
 * Yeni hatırlatıcı oluşturur (POST /api/reminders).
 * @param {{
 * title: string,
 * description?: string,
 * eventDatetime: string,   // ISO 8601 — örn: "2026-08-19T14:30:00.000Z"
 * repeatType: 'ONCE'|'DAILY'|'WEEKLY',
 * repeatUntil?: string,    // ISO 8601, opsiyonel
 * isUrgent?: boolean,
 * pushMinutesBefore?: number,  // 0 = zamanında
 * voiceMinutesBefore?: number  // 0 = zamanında, undefined = arama yok
 * }} data
 * @returns {Promise<object>} Oluşturulan hatırlatıcı
 */
export async function createReminder(data) {
  return requestWithRefresh("/api/reminders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Hatırlatıcıyı kısmi günceller (PATCH /api/reminders/:id).
 * Yalnızca body'deki alanlar değişir.
 * @param {string} id
 * @param {Partial<CreateReminderDto>} data
 */
export async function updateReminder(id, data) {
  return requestWithRefresh(`/api/reminders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Hatırlatıcıyı siler (DELETE /api/reminders/:id).
 * @param {string} id
 */
export async function deleteReminder(id) {
  return requestWithRefresh(`/api/reminders/${id}`, { method: "DELETE" });
}

// ─── PUSH NOTIFICATION SETTINGS ──────────────────────────────────────────────

/**
 * Kullanıcının tüm push bildirim ayarlarını listeler.
 * GET /api/push-notification-settings
 */
export async function getPushNotificationSettings() {
  return requestWithRefresh("/api/push-notification-settings");
}

/**
 * Tek bir push bildirim ayarını ID ile getirir.
 * GET /api/push-notification-settings/:id
 * @param {string} id - UUID
 */
export async function getPushNotificationSettingById(id) {
  return requestWithRefresh(`/api/push-notification-settings/${id}`);
}

/**
 * Bir hatırlatıcı için push bildirim ayarı oluşturur.
 * POST /api/push-notification-settings
 * @param {{ reminderId: string, minutesBefore: number }} data
 */
export async function createPushNotificationSetting(data) {
  return requestWithRefresh("/api/push-notification-settings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Push bildirim ayarını kısmi günceller.
 * PATCH /api/push-notification-settings/:id
 * @param {string} id
 * @param {{ minutesBefore?: number, enabled?: boolean }} data
 */
export async function updatePushNotificationSetting(id, data) {
  return requestWithRefresh(`/api/push-notification-settings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Push bildirim ayarını siler.
 * DELETE /api/push-notification-settings/:id
 * @param {string} id
 */
export async function deletePushNotificationSetting(id) {
  return requestWithRefresh(`/api/push-notification-settings/${id}`, { method: "DELETE" });
}

// ─── VOICE CALL SETTINGS ─────────────────────────────────────────────────────

/**
 * Sesli arama ayarlarını listeler.
 * GET /api/voice-call-settings
 * NOT: Bu endpoint kullanıcıya göre filtreleme yapmıyor (backend tasarımı).
 */
export async function getVoiceCallSettings() {
  return requestWithRefresh("/api/voice-call-settings");
}

/**
 * Tek bir sesli arama ayarını ID ile getirir.
 * GET /api/voice-call-settings/:id
 * @param {string} id - UUID
 */
export async function getVoiceCallSettingById(id) {
  return requestWithRefresh(`/api/voice-call-settings/${id}`);
}

/**
 * Bir hatırlatıcı için sesli arama ayarı oluşturur.
 * POST /api/voice-call-settings
 * @param {{ reminderId: string, minutesBefore: number, enabled: boolean }} data
 */
export async function createVoiceCallSetting(data) {
  return requestWithRefresh("/api/voice-call-settings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Sesli arama ayarını kısmi günceller.
 * PATCH /api/voice-call-settings/:id
 * @param {string} id
 * @param {{ reminderId?: string, minutesBefore?: number, enabled?: boolean }} data
 */
export async function updateVoiceCallSetting(id, data) {
  return requestWithRefresh(`/api/voice-call-settings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Sesli arama ayarını siler.
 * DELETE /api/voice-call-settings/:id
 * @param {string} id
 */
export async function deleteVoiceCallSetting(id) {
  return requestWithRefresh(`/api/voice-call-settings/${id}`, { method: "DELETE" });
}

// ─── REMINDER HISTORY (GEÇMİŞ) ───────────────────────────────────────────────

/**
 * Hatırlatıcı geçmişini ve arama loglarını çeker.
 * GET /api/reminder-history
 */
export async function getReminderHistory(reminderId = '') {
  const url = reminderId ? `/api/reminder-history?reminderId=${reminderId}` : '/api/reminder-history';
  return requestWithRefresh(url);
}

/**
 * Belirli bir geçmiş kaydını ID ile getirir.
 * GET /api/reminder-history/:id
 */
export async function getReminderHistoryById(id) {
  return requestWithRefresh(`/api/reminder-history/${id}`);
}

/**
 * Belirli bir geçmiş kaydını siler.
 * DELETE /api/reminder-history/:id
 */
export async function deleteReminderHistory(id) {
  return requestWithRefresh(`/api/reminder-history/${id}`, { method: "DELETE" });
}

// ─── SILENT HOURS (SESSİZ SAATLER) ──────────────────────────────────────────

/**
 * Kullanıcıya ait tüm sessiz saat ayarlarını getirir.
 * GET /api/silent-hours
 */
export async function getSilentHours() {
  try {
    const res = await requestWithRefresh("/api/silent-hours");
    return Array.isArray(res) ? res : (res?.data || []);
  } catch (error) {
    console.warn("Sessiz saatler alınamadı:", error);
    return [];
  }
}

/**
 * Belirli bir sessiz saat ayarını ID ile getirir.
 * GET /api/silent-hours/:id
 * @param {string} id
 */
export async function getSilentHourById(id) {
  return requestWithRefresh(`/api/silent-hours/${id}`);
}

/**
 * Yeni bir sessiz saat aralığı oluşturur.
 * POST /api/silent-hours
 * @param {{ dayOfWeek: string, silentStart: string, silentEnd: string }} data
 */
export async function createSilentHour(data) {
  return requestWithRefresh("/api/silent-hours", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Mevcut bir sessiz saat ayarını günceller.
 * PATCH /api/silent-hours/:id
 * @param {string} id 
 * @param {{ dayOfWeek?: string, silentStart?: string, silentEnd?: string }} data
 */
export async function updateSilentHour(id, data) {
  return requestWithRefresh(`/api/silent-hours/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Belirtilen sessiz saat ayarını siler.
 * DELETE /api/silent-hours/:id
 * @param {string} id
 */
export async function deleteSilentHour(id) {
  return requestWithRefresh(`/api/silent-hours/${id}`, { method: "DELETE" });
}