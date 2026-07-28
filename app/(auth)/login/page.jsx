"use client";

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';

// WebGL Animasyon Bileşeni (Arka Plan İçin)
const ShaderBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId;
    let resizeObserver;

    // Canvas boyutunu kapsayıcıya göre ayarla
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

// Simulating audio reaction using time and sine waves
float getAudioAmplitude() {
    return 0.5 + 0.5 * sin(u_time * 2.0);
}

void main() {
    vec2 uv = v_texCoord;
    vec2 centered_uv = uv * 2.0 - 1.0;
    centered_uv.x *= u_resolution.x / u_resolution.y;

    float amp = getAudioAmplitude();
    
    // Voia Brand Color: #0d6e5c (approx vec3(0.05, 0.43, 0.36))
    vec3 color1 = vec3(0.05, 0.43, 0.36);
    vec3 color2 = vec3(0.08, 0.58, 0.48);
    vec3 bgColor = vec3(0.98, 0.98, 0.97); // Surface color

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
    
    // Subtle gradient background
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

    // Bileşen ekrandan kalktığında hafıza sızıntısını önlemek için temizleme (Cleanup)
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
  return (
    <div className="min-h-screen flex bg-white dark:bg-[#0F172A] font-sans">
      
      {/* Sol Taraf: Animasyonlu Arka Plan ve Bilgi Alanı */}
      <div className="w-1/2 relative p-16 flex flex-col justify-center overflow-hidden">
        
        {/* Hareketli Shader Arka Planı (En Altta) */}
        <ShaderBackground />

        {/* İçerik (Animasyonun Üzerinde Durması İçin z-10, relative ve blur kullanıldı) */}
        <div className="max-w-md mx-auto w-full relative z-10 backdrop-blur-md bg-white/40 dark:bg-[#1e293b]/70 p-8 rounded-3xl border border-white/50 dark:border-[#52525B]/50 shadow-xl">
          <h1 className="text-4xl font-bold text-[#0f4c3a] dark:text-[#A78BFA] mb-2 drop-shadow-sm">Voia</h1>
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#F8FAFC] mb-4 drop-shadow-sm">Çok Dilli Kişisel Ses Asistanınız</h2>
          <p className="text-gray-800 dark:text-[#CBD5E1] font-medium mb-10 text-sm leading-relaxed">
            Voia ile hayatınızı sesinizle yönetin. 6 farklı dil desteğiyle notlar alın, hatırlatıcılar kurun ve aramalarınızı sadece konuşarak gerçekleştirin.
          </p>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-white/80 dark:bg-[#3F3F46]/80 flex items-center justify-center text-[#0f4c3a] dark:text-[#A78BFA] mr-4 shrink-0 shadow-sm border border-teal-100/50 dark:border-[#52525B]/50 backdrop-blur-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-[#F8FAFC] text-sm">Akıllı Hatırlatıcılar</h3>
                <p className="text-gray-700 dark:text-[#CBD5E1] font-medium text-xs mt-1">Zamanı sesinizle yönetin.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-white/80 dark:bg-[#3F3F46]/80 flex items-center justify-center text-[#0f4c3a] dark:text-[#A78BFA] mr-4 shrink-0 shadow-sm border border-teal-100/50 dark:border-[#52525B]/50 backdrop-blur-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-[#F8FAFC] text-sm">6 Dil Desteği</h3>
                <p className="text-gray-700 dark:text-[#CBD5E1] font-medium text-xs mt-1">Global iletişim gücü.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-white/80 dark:bg-[#3F3F46]/80 flex items-center justify-center text-[#0f4c3a] dark:text-[#A78BFA] mr-4 shrink-0 shadow-sm border border-teal-100/50 dark:border-[#52525B]/50 backdrop-blur-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-[#F8FAFC] text-sm">Sesli Aramalar</h3>
                <p className="text-gray-700 dark:text-[#CBD5E1] font-medium text-xs mt-1">Eller serbest kontrol.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ Taraf: Giriş Formu */}
      <div className="w-1/2 bg-white dark:bg-[#1e293b] p-16 flex flex-col justify-center relative">
        <div className="max-w-sm mx-auto w-full">
          
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-[#F8FAFC] mb-2">Giriş Yap</h2>
            <p className="text-gray-500 dark:text-[#CBD5E1] text-sm">Devam etmek için bilgilerinizi girin.</p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wide mb-2">
                E-Postan Nedir?
              </label>
              <input
                type="email"
                placeholder="isim@email.com"
                className="w-full bg-gray-50 dark:bg-[#3F3F46] border border-gray-200 dark:border-[#52525B] text-gray-800 dark:text-[#F8FAFC] placeholder-gray-400 dark:placeholder-[#71717A] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 dark:focus:ring-[#A78BFA]/20 transition-colors"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wide">
                  Ve Şifren?
                </label>
                <a href="#" className="text-xs text-gray-400 dark:text-[#71717A] hover:text-[#0f4c3a] dark:hover:text-[#A78BFA] transition-colors">
                  Unuttum
                </a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-gray-50 dark:bg-[#3F3F46] border border-gray-200 dark:border-[#52525B] text-gray-800 dark:text-[#F8FAFC] placeholder-gray-400 dark:placeholder-[#71717A] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 dark:focus:ring-[#A78BFA]/20 transition-colors"
              />
            </div>

            <Link
              href="/"
              className="w-full bg-[#0f4c3a] hover:bg-[#0a3629] dark:bg-[#A78BFA] dark:hover:bg-[#9370f5] text-white font-medium py-3 rounded-xl transition-colors mt-4 shadow-sm flex items-center justify-center"
            >
              Giriş Yap
            </Link>
          </form>

          <div className="my-8 flex items-center">
            <div className="flex-grow border-t border-gray-200 dark:border-[#52525B]"></div>
            <span className="mx-4 text-xs text-gray-400 dark:text-[#71717A] font-medium">VEYA</span>
            <div className="flex-grow border-t border-gray-200 dark:border-[#52525B]"></div>
          </div>

          <button
            type="button"
            className="w-full bg-white dark:bg-[#3F3F46] border border-gray-200 dark:border-[#52525B] hover:bg-gray-50 dark:hover:bg-[#3F3F46]/80 text-gray-700 dark:text-[#F8FAFC] font-medium py-3 rounded-xl flex items-center justify-center transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
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