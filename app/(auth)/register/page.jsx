"use client";

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
    syncSize(); 3

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
    vec3 dark_bgColor = vec3(0.12, 0.12, 0.12); // #1E1E1E'ye yakın shader karşılığı

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

      // Temanın dark modda olup olmadığını dinamik kontrol et
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

export default function RegisterPage() {
  const router = useRouter();

  // Backend'in beklediği tüm alanlar için State'ler eklendi
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const handlePhoneChange = (e) => {
    // Sadece rakamları al (harf veya özel karakter girişini engelle)
    const numbers = e.target.value.replace(/[^\d]/g, "");

    let formatted = numbers;
    if (numbers.length > 4 && numbers.length <= 7) {
      formatted = `${numbers.slice(0, 4)} ${numbers.slice(4)}`;
    } else if (numbers.length > 7 && numbers.length <= 9) {
      formatted = `${numbers.slice(0, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7)}`;
    } else if (numbers.length > 9) {
      formatted = `${numbers.slice(0, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7, 9)} ${numbers.slice(9, 11)}`;
    }

    setPhoneNumber(formatted);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const isPasswordMatch = confirmPassword.length > 0 && password === confirmPassword;
  const isPasswordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  // Gerçek API Gönderim Fonksiyonu
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // --- KULLANICI DOSTU FRONTEND DOĞRULAMALARI ---
    if (!firstName.trim() || !lastName.trim()) {
      setError("Lütfen adınızı ve soyadınızı girin.");
      return;
    }

    if (!email) {
      setError("Lütfen e-posta adresinizi girin.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Lütfen geçerli bir e-posta adresi formatı (örneğin: isim@mail.com) girin.");
      return;
    }

    if (!phoneNumber) {
      setError("Lütfen telefon numaranızı girin.");
      return;
    }

    if (!password) {
      setError("Lütfen bir şifre belirleyin.");
      return;
    }

    if (password.length < 8) {
      setError("Güvenliğiniz için şifreniz en az 8 karakter uzunluğunda olmalıdır.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Şifreler birbiriyle eşleşmiyor. Lütfen kontrol edin.");
      return;
    }
    // ----------------------------------------------

    setLoading(true);
    try {
      // Backend'e gönderirken boşlukları temizle
      const cleanPhoneNumber = phoneNumber.replace(/\s/g, '');

      // Backend'e kayıt isteği atılıyor
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNumber: cleanPhoneNumber, // Temizlenmiş hali gönderiliyor
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // NestJS DTO hataları bazen dizi (array) olarak gelir. 
        // Eğer diziyse ilk hatayı alıyoruz, değilse direkt mesajı alıyoruz.
        const errorMsg = Array.isArray(data.message) ? data.message[0] : data.message;
        throw new Error(errorMsg || 'Kayıt başarısız.');
      }

      // Kayıt başarılıysa kullanıcıyı giriş sayfasına yönlendir
      showToast('Kayıt başarılı! Giriş yapabilirsiniz.');
      setTimeout(() => {
        router.push('/login');
      }, 1500);

    } catch (err) {
      // BACKEND'DEN GELEN GERÇEK HATAYI KONSOLA YAZDIRIYORUZ
      console.log("Backend'den Dönen Gerçek Hata:", err.message);

      let backendError = (err.message || '').toLowerCase();

      // İhtimalleri genişletiyoruz: Hem İngilizce hem de olası Türkçe backend hatalarını kapsar
      if (
        backendError.includes('already exists') ||
        backendError.includes('unique constraint') ||
        backendError.includes('in use') ||
        backendError.includes('duplicate') ||
        backendError.includes('kayıtlı') ||
        backendError.includes('mevcut') ||
        backendError.includes('kullanımda')
      ) {
        setError('Bu e-posta adresi veya telefon numarası zaten sistemde kayıtlı.');
      } else if (backendError.includes('password must be longer')) {
        setError('Şifreniz en az 8 karakter uzunluğunda olmalıdır.');
      } else if (backendError.includes('email must be an email') || backendError.includes('invalid email')) {
        setError('Lütfen geçerli bir e-posta adresi girin.');
      } else if (backendError.includes('phone number') && backendError.includes('invalid')) {
        setError('Lütfen geçerli bir telefon numarası girin.');
      } else {
        // Yakalanamayan diğer backend hataları
        setError('Kayıt işlemi başarısız oldu. Lütfen bilgilerinizi kontrol edip tekrar deneyin.');
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

      {/* SOL TARAF */}
      <div className="w-1/2 relative p-16 flex flex-col justify-center overflow-hidden bg-gray-50 dark:bg-[#1E1E1E] transition-colors duration-500">
        <ShaderBackground />
        <div className="max-w-md mx-auto w-full relative z-10 backdrop-blur-md bg-white/40 dark:bg-[#1A1A1A]/40 p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-xl dark:shadow-2xl transition-all duration-500">
          <h1 className="text-4xl font-bold text-[#0f4c3a] dark:text-[#00BBA7] mb-2 drop-shadow-sm">Voia</h1>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 drop-shadow-sm">Aramıza Katılın</h2>
          <p className="text-gray-800 dark:text-gray-300 font-medium mb-10 text-sm leading-relaxed">
            Kişisel ses asistanınızla tanışmaya çok az kaldı. Saniyeler içinde hesabınızı oluşturun ve hayatınızı sesinizle yönetmeye başlayın.
          </p>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-white/80 dark:bg-white/10 flex items-center justify-center text-[#0f4c3a] dark:text-[#00BBA7] mr-4 shrink-0 shadow-sm border border-teal-100/50 dark:border-white/5 backdrop-blur-sm transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Hızlı Kurulum</h3>
                <p className="text-gray-700 dark:text-gray-400 font-medium text-xs mt-1">Anında kişiselleştirilmiş deneyim.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-white/80 dark:bg-white/10 flex items-center justify-center text-[#0f4c3a] dark:text-[#00BBA7] mr-4 shrink-0 shadow-sm border border-teal-100/50 dark:border-white/5 backdrop-blur-sm transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Üst Düzey Gizlilik</h3>
                <p className="text-gray-700 dark:text-gray-400 font-medium text-xs mt-1">Verileriniz güvende ve şifreli.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SAĞ TARAF */}
      <div className="w-1/2 bg-white dark:bg-[#1A1A1A] p-12 flex flex-col justify-center relative transition-colors duration-500">
        <div className="max-w-sm mx-auto w-full">

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-[#F8FAFC] mb-2">Hesap Oluştur</h2>
            <p className="text-gray-500 dark:text-[#CBD5E1] text-sm">Voia dünyasına adım atmak için bilgilerinizi girin.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-xs font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wide mb-1.5">
                  Ad
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Adınız"
                  className="w-full bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 text-gray-800 dark:text-[#F8FAFC] placeholder-gray-400 dark:placeholder-[#71717A] px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 dark:focus:ring-[#00BBA7]/20 transition-colors"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-xs font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wide mb-1.5">
                  Soyad
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Soyadınız"
                  className="w-full bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 text-gray-800 dark:text-[#F8FAFC] placeholder-gray-400 dark:placeholder-[#71717A] px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 dark:focus:ring-[#00BBA7]/20 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wide mb-1.5">
                E-Posta Adresi
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="isim@email.com"
                className="w-full bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 text-gray-800 dark:text-[#F8FAFC] placeholder-gray-400 dark:placeholder-[#71717A] px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 dark:focus:ring-[#00BBA7]/20 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wide mb-1.5">
                Telefon Numarası
              </label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="0555 111 22 33"
                maxLength={14} // 11 rakam + 3 boşluk
                className="w-full bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 text-gray-800 dark:text-[#F8FAFC] placeholder-gray-400 dark:placeholder-[#71717A] px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 dark:focus:ring-[#00BBA7]/20 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wide mb-1.5">
                Şifre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="En az 8 karakter"
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

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wide">
                  Şifre Tekrar
                </label>
                {isPasswordMismatch && (
                  <span className="text-xs font-bold text-red-500">Şifreler eşleşmiyor</span>
                )}
                {isPasswordMatch && (
                  <span className="text-xs font-bold text-teal-600 dark:text-[#34D399] flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Şifreler eşleşti
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Şifrenizi tekrar girin"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full bg-gray-50 dark:bg-[#1E1E1E] border px-4 py-2.5 rounded-xl text-gray-800 dark:text-[#F8FAFC] placeholder-gray-400 dark:placeholder-[#71717A] focus:outline-none focus:ring-2 transition-colors ${isPasswordMismatch
                      ? 'border-red-300 focus:ring-red-200'
                      : isPasswordMatch
                        ? 'border-teal-300 dark:border-[#34D399] focus:ring-teal-200 dark:focus:ring-[#34D399]/20'
                        : 'border-gray-200 dark:border-white/10 focus:ring-[#0f4c3a]/20 dark:focus:ring-[#00BBA7]/20'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#71717A] hover:text-gray-600 dark:hover:text-[#CBD5E1] transition-colors"
                >
                  {showConfirmPassword ? (
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
              className="w-full bg-[#0f4c3a] hover:bg-[#0a3629] dark:bg-[#00BBA7] dark:hover:bg-[#009F8E] text-white font-bold py-3 rounded-xl transition-colors mt-6 shadow-sm flex items-center justify-center disabled:opacity-60"
            >
              {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
            <span className="mx-4 text-xs text-gray-400 dark:text-[#71717A] font-medium">VEYA</span>
            <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-[#CBD5E1] mt-8">
            Zaten hesabınız var mı?{' '}
            <Link href="/login" className="text-[#0f4c3a] dark:text-[#00BBA7] font-bold hover:underline">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}