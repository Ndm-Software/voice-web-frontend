"use client";

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

// WebGL Animasyon Bileşeni (Arka Plan)
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

float getAudioAmplitude() {
    return 0.5 + 0.5 * sin(u_time * 2.0);
}

void main() {
    vec2 uv = v_texCoord;
    vec2 centered_uv = uv * 2.0 - 1.0;
    centered_uv.x *= u_resolution.x / u_resolution.y;

    float amp = getAudioAmplitude();
    
    vec3 color1 = vec3(0.05, 0.43, 0.36);
    vec3 color2 = vec3(0.08, 0.58, 0.48);
    vec3 bgColor = vec3(0.98, 0.98, 0.97);

    float wave = 0.0;
    for(float i = 0.0; i < 5.0; i++) {
        float speed = 1.5 + i * 0.2;
        float freq = 2.0 + i * 0.5;
        float offset = i * 1.0;
        wave += sin(centered_uv.x * freq + u_time * speed + offset) * (0.1 + 0.05 * amp);
    }
    
    float dist = abs(centered_uv.y - wave * 0.5);
    float glow = exp(-dist * 15.0);
    
    vec3 finalColor = mix(bgColor, mix(color1, color2, sin(u_time + uv.x) * 0.5 + 0.5), glow);
    finalColor = mix(finalColor, bgColor, 0.3);

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
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
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
  // Form State'leri
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Şifre Göster/Gizle State'leri
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Şifre Eşleşme Durumu
  const isPasswordMatch = confirmPassword.length > 0 && password === confirmPassword;
  const isPasswordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* Sol Taraf: Animasyonlu Arka Plan ve Bilgi Alanı */}
      <div className="w-1/2 relative p-16 flex flex-col justify-center overflow-hidden">
        <ShaderBackground />

        <div className="max-w-md mx-auto w-full relative z-10 backdrop-blur-md bg-white/40 p-8 rounded-3xl border border-white/50 shadow-xl">
          <h1 className="text-4xl font-bold text-[#0f4c3a] mb-2 drop-shadow-sm">Voia</h1>
          <h2 className="text-xl font-bold text-gray-900 mb-4 drop-shadow-sm">Aramıza Katılın</h2>
          <p className="text-gray-800 font-medium mb-10 text-sm leading-relaxed">
            Kişisel ses asistanınızla tanışmaya çok az kaldı. Saniyeler içinde hesabınızı oluşturun ve hayatınızı sesinizle yönetmeye başlayın.
          </p>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-[#0f4c3a] mr-4 shrink-0 shadow-sm border border-teal-100/50 backdrop-blur-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Hızlı Kurulum</h3>
                <p className="text-gray-700 font-medium text-xs mt-1">Anında kişiselleştirilmiş deneyim.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-[#0f4c3a] mr-4 shrink-0 shadow-sm border border-teal-100/50 backdrop-blur-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Üst Düzey Gizlilik</h3>
                <p className="text-gray-700 font-medium text-xs mt-1">Verileriniz güvende ve şifreli.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ Taraf: Kayıt Formu */}
      <div className="w-1/2 bg-white p-12 flex flex-col justify-center relative">
        <div className="max-w-sm mx-auto w-full">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Hesap Oluştur</h2>
            <p className="text-gray-500 text-sm">Voia dünyasına adım atmak için bilgilerinizi girin.</p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">
                Ad Soyad
              </label>
              <input
                type="text"
                placeholder="Örn: Selin Aydın"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">
                E-Posta Adresi
              </label>
              <input
                type="email"
                placeholder="isim@email.com"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 transition-colors"
              />
            </div>

            {/* Şifre Alanı */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">
                Şifre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="En az 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 pl-4 pr-11 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 transition-colors"
                />
                {/* Göz İkonu */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    /* Açık Göz İkonu (Gizle) */
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"></path></svg>
                  ) : (
                    /* Kapalı Göz İkonu (Göster) */
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Şifre Tekrar Alanı */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Şifre Tekrar
                </label>
                {/* Uyum Durumu Bildirimi */}
                {isPasswordMismatch && (
                  <span className="text-xs font-bold text-red-500">Şifreler eşleşmiyor</span>
                )}
                {isPasswordMatch && (
                  <span className="text-xs font-bold text-teal-600 flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Şifreler eşleşti
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Şifrenizi tekrar girin"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full bg-gray-50 border px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                    isPasswordMismatch 
                      ? 'border-red-300 focus:ring-red-200' 
                      : isPasswordMatch 
                      ? 'border-teal-300 focus:ring-teal-200' 
                      : 'border-gray-200 focus:ring-[#0f4c3a]/20'
                  }`}
                />
                {/* Göz İkonu */}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"></path></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  )}
                </button>
              </div>
            </div>

            <Link
              href="/"
              className="w-full bg-[#0f4c3a] hover:bg-[#0a3629] text-white font-bold py-3 rounded-xl transition-colors mt-6 shadow-sm flex items-center justify-center"
            >
              Kayıt Ol
            </Link>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 text-xs text-gray-400 font-medium">VEYA</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <button
            type="button"
            className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl flex items-center justify-center transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google ile Kayıt Ol
          </button>

          <p className="text-center text-sm text-gray-500 mt-8">
            Zaten hesabınız var mı?{' '}
            <Link href="/login" className="text-[#0f4c3a] font-bold hover:underline">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
      
    </div>
  );
}