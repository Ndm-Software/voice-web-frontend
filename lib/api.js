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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
  return request("/auth/login", {       // PATH burada statik yazıldı
    method: "POST",
    body: JSON.stringify({ email, password }),
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
  return request("/auth/register", {    // PATH burada statik yazıldı
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
