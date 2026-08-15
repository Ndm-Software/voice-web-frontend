"use client";

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';

// WebGL Animasyon Bileşeni (Açık/Koyu Moda Duyarlı)
const ShaderBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId;
    let resizeObserver;

    function syncSize() {
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(canvas);
    }
    syncSize();

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_isDark; // 0.0: Açık Mod, 1.0: Koyu Mod

float getAudioAmplitude() {
    return 0.5 + 0.5 * sin(u_time * 2.0);
}

void main() {
    vec2 uv = v_texCoord;
    vec2 centered_uv = uv * 2.0 - 1.0;
    centered_uv.x *= u_resolution.x / u_resolution.y;

    float amp = getAudioAmplitude();
    
    // AÇIK MOD RENKLERİ (Orijinal)
    vec3 light_color1 = vec3(0.05, 0.43, 0.36);
    vec3 light_color2 = vec3(0.08, 0.58, 0.48);
    vec3 light_bgColor = vec3(0.98, 0.98, 0.97);

    // KOYU MOD RENKLERİ (Parlak Turkuaz ve #1E1E1E Nötr Koyu Gri Arka Plan)
    vec3 dark_color1 = vec3(0.0, 0.73, 0.65); // #00BBA7
    vec3 dark_color2 = vec3(0.1, 0.8, 0.7);
    vec3 dark_bgColor = vec3(0.12, 0.12, 0.12);

    // Temaya göre renk geçişi (mix)
    vec3 color1 = mix(light_color1, dark_color1, u_isDark);
    vec3 color2 = mix(light_color2, dark_color2, u_isDark);
    vec3 bgColor = mix(light_bgColor, dark_bgColor, u_isDark);

    float wave = 0.0;
    for(float i = 0.0; i < 5.0; i++) {
        float speed = 1.5 + i * 0.2;
        float freq = 2.0 + i * 0.5;
        float offset = i * 1.0;
        wave += sin(centered_uv.x * freq + u_time * speed + offset) * (0.1 + 0.05 * amp);
    }
    
    float dist = abs(centered_uv.y - wave * 0.5);
    float glow = exp(-dist * mix(15.0, 10.0, u_isDark));
    
    vec3 finalColor = mix(bgColor, mix(color1, color2, sin(u_time + uv.x) * 0.5 + 0.5), glow);
    
    finalColor = mix(finalColor, bgColor, mix(0.3, 0.1, u_isDark));

    gl_FragColor = vec4(finalColor, 1.0);
}`;

    function cs(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uIsDark = gl.getUniformLocation(prog, 'u_isDark');

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    function render(t) {
      if (typeof ResizeObserver === 'undefined') syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);

      const isDark = document.documentElement.classList.contains('dark') ? 1.0 : 0.0;

      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      if (uIsDark) gl.uniform1f(uIsDark, isDark);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover z-0"
      style={{ display: 'block' }}
    />
  );
};

export default function LoginPage() {
  const router = useRouter();
  const [toast, setToast] = React.useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // --- KULLANICI DOSTU FRONTEND DOĞRULAMALARI (BURAYI EKLEDİK) ---
    if (!email) {
      setError("Lütfen e-posta adresinizi girin.");
      return; // Hata varsa kodu burada durdur, backend'e gitme
    }

    // E-posta format kontrolü (içinde @ ve . var mı?)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Lütfen geçerli bir e-posta adresi formatı (örneğin: isim@mail.com) girin.");
      return;
    }

    if (!password) {
      setError("Lütfen şifrenizi girin.");
      return;
    }

    if (password.length < 8) {
      setError("Güvenliğiniz için şifreniz en az 8 karakter uzunluğunda olmalıdır.");
      return;
    }
    // ---------------------------------------------------------------

    setLoading(true);
    try {
      await login(email, password);
      // Token backend tarafından HttpOnly cookie olarak yazılır.
      // Frontend token'ı görmez veya saklamaz; tarayıcı sonraki isteklerde
      // cookie'yi otomatik gönderir (credentials: 'include' sayesinde).
      router.push('/panel');
    } catch (err) {
      // Backend'den gelen orijinal hata metni
      let backendError = err.message;

      // Sık karşılaşılan İngilizce hataları Türkçeye çeviriyoruz
      if (backendError === 'Invalid email or password.' || backendError === 'Unauthorized') {
        setError('E-posta adresi veya şifre hatalı. Lütfen bilgilerinizi kontrol edin.');
      } else if (backendError.includes('not found')) {
        setError('Bu e-posta adresiyle kayıtlı bir kullanıcı bulunamadı.');
      } else {
        // Bilinmeyen başka bir hata gelirse varsayılan Türkçe mesajı göster
        setError('Giriş yapılamadı. Lütfen bağlantınızı ve bilgilerinizi kontrol edin.');
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#1A1A1A] font-sans transition-colors duration-500">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl bg-[#0f4c3a] dark:bg-[#00BBA7] text-white text-sm font-bold">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {toast}
        </div>
      )}

      {/* SOL TARAF: Açık modda bg-gray-50, Koyu modda bg-[#1E1E1E] */}
      <div className="w-1/2 relative p-16 flex flex-col justify-center overflow-hidden bg-gray-50 dark:bg-[#1E1E1E] transition-colors duration-500">

        {/* Hareketli Shader Arka Planı (Açık/Koyu Moda Otomatik Uyar) */}
        <ShaderBackground />

        {/* İçerik Kartı */}
        <div className="max-w-md mx-auto w-full relative z-10 backdrop-blur-md bg-white/40 dark:bg-[#1A1A1A]/40 p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-xl dark:shadow-2xl transition-all duration-500">
          <h1 className="text-4xl font-bold text-[#0f4c3a] dark:text-[#00BBA7] mb-2 drop-shadow-sm">Voia</h1>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 drop-shadow-sm">Çok Dilli Kişisel Ses Asistanınız</h2>
          <p className="text-gray-800 dark:text-gray-300 font-medium mb-10 text-sm leading-relaxed">
            Voia ile hayatınızı sesinizle yönetin. 6 farklı dil desteğiyle notlar alın, hatırlatıcılar kurun ve aramalarınızı sadece konuşarak gerçekleştirin.
          </p>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-white/80 dark:bg-white/10 flex items-center justify-center text-[#0f4c3a] dark:text-[#00BBA7] mr-4 shrink-0 shadow-sm border border-teal-100/50 dark:border-white/5 backdrop-blur-sm transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Akıllı Hatırlatıcılar</h3>
                <p className="text-gray-700 dark:text-gray-400 font-medium text-xs mt-1">Zamanı sesinizle yönetin.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-white/80 dark:bg-white/10 flex items-center justify-center text-[#0f4c3a] dark:text-[#00BBA7] mr-4 shrink-0 shadow-sm border border-teal-100/50 dark:border-white/5 backdrop-blur-sm transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">6 Dil Desteği</h3>
                <p className="text-gray-700 dark:text-gray-400 font-medium text-xs mt-1">Global iletişim gücü.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-white/80 dark:bg-white/10 flex items-center justify-center text-[#0f4c3a] dark:text-[#00BBA7] mr-4 shrink-0 shadow-sm border border-teal-100/50 dark:border-white/5 backdrop-blur-sm transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Sesli Aramalar</h3>
                <p className="text-gray-700 dark:text-gray-400 font-medium text-xs mt-1">Eller serbest kontrol.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SAĞ TARAF: Giriş Formu (Yumuşatılmış Antrasit Gri #1A1A1A) */}
      <div className="w-1/2 bg-white dark:bg-[#1A1A1A] p-16 flex flex-col justify-center relative transition-colors duration-500">
        <div className="max-w-sm mx-auto w-full">

          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-[#F8FAFC] mb-2">Giriş Yap</h2>
            <p className="text-gray-500 dark:text-[#CBD5E1] text-sm">Devam etmek için bilgilerinizi girin.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wide mb-2">
                E-Posta adresi
              </label>
              <input
                type="email"
                placeholder="isim@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-50 dark:bg-[#27272A] border border-gray-200 dark:border-white/10 text-gray-800 dark:text-[#F8FAFC] placeholder-gray-400 dark:placeholder-[#71717A] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 dark:focus:ring-[#00BBA7]/20 transition-colors"
              />
            </div>
            <div>

              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wide">
                  ŞİFRE
                </label>
                <Link href="/forgot-password" className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  Unuttum
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 text-gray-800 dark:text-[#F8FAFC] placeholder-gray-400 dark:placeholder-[#71717A] pl-4 pr-11 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 dark:focus:ring-[#00BBA7]/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#71717A] hover:text-gray-600 dark:hover:text-[#CBD5E1] transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"></path></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  )}
                </button>
              </div>
            </div>
            
            {/* Hata Mesajı */}
            {error && (
              <div className="flex items-start gap-3 p-4 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 animate-[fadeIn_0.3s_ease-out]">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1 font-medium leading-relaxed">
                  {error}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0f4c3a] hover:bg-[#0a3629] dark:bg-[#00BBA7] dark:hover:bg-[#009F8E] text-white font-medium py-3 rounded-xl transition-colors mt-4 shadow-sm flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <div className="my-8 flex items-center">
            <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
            <span className="mx-4 text-xs text-gray-400 dark:text-[#71717A] font-medium">VEYA</span>
            <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
          </div>

          <button
            type="button"
            onClick={() => showToast('Google ile giriş yakında aktif olacak.')}
            className="w-full bg-white dark:bg-[#27272A] border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#323235] text-gray-700 dark:text-[#F8FAFC] font-medium py-3 rounded-xl flex items-center justify-center transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google ile Devam Et
          </button>

          <p className="text-center text-sm text-gray-500 dark:text-[#CBD5E1] mt-10">
            Hesabınız yok mu?{' '}
            <Link href="/register" className="text-gray-800 dark:text-[#F8FAFC] font-bold hover:underline">
              Kayıt Ol
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}