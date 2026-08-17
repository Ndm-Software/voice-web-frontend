/**
 * lib/api.js
 *
 * Merkezi API yardımcısı.
 *
 * KURAL:
 *  - API'nin ANA ADRESİ .env.local dosyasından okunur (NEXT_PUBLIC_API_URL).
 *  - Endpoint PATH'LERİ (/api/auth/login gibi) burada statik metin olarak yazılır,
 *    asla .env dosyasına eklenmez.
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
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// ─── AUTH İŞLEMLERİ ──────────────────────────────────────────────────────────

/**
 * Kullanıcı girişi.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ token: string, user: object }>}
 */
export async function login(email, password) {
  // 1. Tarayıcıda güvenli bir UUID oluştur (Modern tarayıcıların hepsinde çalışır)
  const installationId = crypto.randomUUID 
    ? crypto.randomUUID() 
    : '123e4567-e89b-12d3-a456-426614174000'; // Fallback

  // 2. Eksik olan cihaz bilgilerini backend'in istediği formatta gönder
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

/**
 * Kullanıcı kaydı.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ token: string, user: object }>}
 */
export async function register(name, email, password) {
  return request("/api/auth/register", {    // PATH burada statik yazıldı
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

/**
 * Oturumu açık kullanıcının bilgilerini çek.
 * Token manuel olarak gönderilmez; HttpOnly cookie tarayıcı tarafından
 * otomatik eklenir (credentials: 'include' sayesinde).
 * @returns {Promise<object>}  - Kullanıcı nesnesi
 */
export async function getMe() {
  return request("/users/me", {         // PATH burada statik yazıldı
    method: "GET",
  });
}

export const getLanguages = async () => {
  const response = await fetch(`${BASE_URL}/api/languages`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', 
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Diller yüklenirken bir hata oluştu.');
  }
  return data;
};

export const getUserSettings = async () => {
  const response = await fetch(`${BASE_URL}/api/user-settings/me`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  
  if (!response.ok && response.status !== 404) {
    throw new Error(data.message || 'Kullanıcı ayarları alınamadı.');
  }
  
  return response.status === 404 ? null : data;
};

// Kullanıcının kendi profil bilgilerini çeken fonksiyon
export const getUserProfile = async () => {
  const response = await fetch(`${BASE_URL}/api/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', 
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Kullanıcı bilgileri alınamadı');
  }

  return data;
};

/**
 * Oturum açmış kullanıcının hesabını siler.
 * @returns {Promise<{ message: string }>}
 */
// Oturum açmış kullanıcının hesabını siler
export async function deleteAccount() {
  return request("/api/users/me", { method: "DELETE" });
}

// Kullanıcı ayarlarını kaydeder veya günceller (PUT /api/user-settings/me)
export const updateUserSettings = async (settingsData) => {
  const response = await fetch(`${BASE_URL}/api/user-settings/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(settingsData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Ayarlar kaydedilemedi.');
  }
  return data;
};