"use client";

import React, { useRef, useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyRegistration, resendRegistrationOtp } from '@/lib/api';

// --- ShaderBackground (Register sayfasındaki ile birebir aynı) ---
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
uniform float u_isDark;

float getAudioAmplitude() { return 0.5 + 0.5 * sin(u_time * 2.0); }

void main() {
    vec2 uv = v_texCoord;
    vec2 centered_uv = uv * 2.0 - 1.0;
    centered_uv.x *= u_resolution.x / u_resolution.y;

    float amp = getAudioAmplitude();
    
    vec3 light_color1 = vec3(0.05, 0.43, 0.36);
    vec3 light_color2 = vec3(0.08, 0.58, 0.48);
    vec3 light_bgColor = vec3(0.98, 0.98, 0.97);

    vec3 dark_color1 = vec3(0.0, 0.73, 0.65);
    vec3 dark_color2 = vec3(0.1, 0.8, 0.7);
    vec3 dark_bgColor = vec3(0.12, 0.12, 0.12);

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
        mouse.x = ((event.clientX - rect.left) / rect.width) * canvas.width;
        mouse.y = (1.0 - (event.clientY - rect.top) / rect.height) * canvas.height;
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

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover z-0" style={{ display: 'block' }} />;
};

// UI için telefonu 0555 111 22 33 formatına çeviren yardımcı fonksiyon
const formatPhoneForUI = (rawNumbers) => {
  const numbers = rawNumbers.replace(/[^\d]/g, "");
  let formatted = numbers;
  if (numbers.length > 4 && numbers.length <= 7) {
    formatted = `${numbers.slice(0, 4)} ${numbers.slice(4)}`;
  } else if (numbers.length > 7 && numbers.length <= 9) {
    formatted = `${numbers.slice(0, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7)}`;
  } else if (numbers.length > 9) {
    formatted = `${numbers.slice(0, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7, 9)} ${numbers.slice(9, 11)}`;
  }
  return formatted;
};

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [identifier, setIdentifier] = useState(() => {
    // Sayfa açıldığında URL'de phone parametresi varsa otomatik alıp formatla
    const phoneParam = searchParams.get('phone') || '';
    return formatPhoneForUI(phoneParam);
  });

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [timer]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // 4-3-2-2 Formatında Telefon Input'u
  const handlePhoneChange = (e) => {
    setIdentifier(formatPhoneForUI(e.target.value));
  };

  // OTP Kutucukları Etkileşimi
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    const digits = pastedData.split('');
    const newOtp = [...otp];
    digits.forEach((digit, i) => { if (i < 6) newOtp[i] = digit; });
    setOtp(newOtp);
    inputRefs.current[Math.min(digits.length, 5)]?.focus();
  };

  // Backend'in beklediği formata çevir (+905551112233)
  const getBackendFormattedPhone = () => {
    let clean = identifier.replace(/\s/g, ''); 
    if (clean.startsWith('0')) clean = '+90' + clean.substring(1);
    else if (!clean.startsWith('+')) clean = '+90' + clean;
    return clean;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);

    const code = otp.join('');
    if (code.length < 6) return setError('Lütfen 6 haneli doğrulama kodunun tamamını girin.');
    if (!identifier.trim()) return setError('Lütfen telefon numaranızı girin.');

    setLoading(true);
    try {
      const payload = {
        code,
        phoneNumber: getBackendFormattedPhone()
      };

      await verifyRegistration(payload);
      showToast('Hesabınız başarıyla doğrulandı!');
      setTimeout(() => { router.push('/login'); }, 1500);
    } catch (err) {
      let backendError = err.message || '';
      if (backendError.includes('Invalid or expired')) setError('Geçersiz veya süresi dolmuş kod. Lütfen tekrar deneyin.');
      else setError(backendError || 'Doğrulama başarısız.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend || resending) return;
    setError(null);
    if (!identifier.trim()) return setError('Lütfen telefon numaranızı belirtin.');

    setResending(true);
    try {
      const payload = { phoneNumber: getBackendFormattedPhone() };
      await resendRegistrationOtp(payload);
      showToast('Doğrulama kodu tekrar gönderildi!');
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || 'Kod gönderilirken bir hata oluştu.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#1A1A1A] font-sans transition-colors duration-500">
      
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl bg-[#0f4c3a] dark:bg-[#00BBA7] text-white text-sm font-bold">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          {toast}
        </div>
      )}

      {/* SOL TARAF: Register Sayfası ile Tamamen Aynı Yapı */}
      <div className="hidden lg:flex w-1/2 relative p-16 flex-col justify-center overflow-hidden bg-gray-50 dark:bg-[#1E1E1E] transition-colors duration-500">
        <ShaderBackground />
        <div className="max-w-md mx-auto w-full relative z-10 backdrop-blur-md bg-white/40 dark:bg-[#1A1A1A]/40 p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-xl dark:shadow-2xl transition-all duration-500">
          <h1 className="text-4xl font-bold text-[#0f4c3a] dark:text-[#00BBA7] mb-2 drop-shadow-sm">Voia</h1>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 drop-shadow-sm">Güvenliğiniz Önceliğimiz</h2>
          <p className="text-gray-800 dark:text-gray-300 font-medium mb-10 text-sm leading-relaxed">
            Hesabınızı korumak için iki adımlı doğrulama kullanıyoruz. Lütfen telefonunuza gönderilen kodu girerek Voia asistanınıza erişimi onaylayın.
          </p>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-white/80 dark:bg-white/10 flex items-center justify-center text-[#0f4c3a] dark:text-[#00BBA7] mr-4 shrink-0 shadow-sm border border-teal-100/50 dark:border-white/5 backdrop-blur-sm transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Doğrulanmış İletişim</h3>
                <p className="text-gray-700 dark:text-gray-400 font-medium text-xs mt-1">Sadece size özel SMS kanalları üzerinden asistanınızla iletişim kurun.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SAĞ TARAF: Form */}
      <div className="w-full lg:w-1/2 bg-white dark:bg-[#1A1A1A] p-6 sm:p-12 flex flex-col justify-center relative transition-colors duration-500">
        <div className="max-w-sm mx-auto w-full">

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-[#F8FAFC] mb-2">Hesabınızı Doğrulayın</h2>
            <p className="text-gray-500 dark:text-[#CBD5E1] text-sm leading-relaxed">
              Lütfen telefonunuza gelen <span className="font-bold text-gray-700 dark:text-white">6 haneli</span> doğrulama kodunu girin.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleVerify} noValidate>
            
            {/* KAYITLI TELEFON NUMARASI (Otomatik Dolacak ve 4-3-2-2 Formatlanacak) */}
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wide mb-1.5">
                Kayıtlı Telefon Numaranız
              </label>
              <input
                type="tel"
                required
                maxLength={14} // 11 rakam + 3 boşluk
                value={identifier}
                onChange={handlePhoneChange}
                placeholder="0555 111 22 33"
                className="w-full bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 text-gray-800 dark:text-[#F8FAFC] placeholder-gray-400 dark:placeholder-[#71717A] px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 dark:focus:ring-[#00BBA7]/20 transition-colors"
              />
            </div>

            {/* 6 Haneli Doğrulama Kodu Alanı */}
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wide mb-2 text-center mt-2">
                DOĞRULAMA KODU
              </label>
              <div className="flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 text-center text-xl font-bold text-gray-800 dark:text-[#F8FAFC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/30 dark:focus:ring-[#00BBA7]/30 transition-all shadow-sm"
                  />
                ))}
              </div>
            </div>

            {/* Hata Mesajı */}
            {error && (
              <div className="flex items-start gap-3 p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 animate-[fadeIn_0.3s_ease-out]">
                <div className="flex-1 font-medium leading-relaxed">{error}</div>
              </div>
            )}

            {/* Tekrar Gönder / Sayaç */}
            <div className="text-center pt-2 pb-2">
              {canResend ? (
                <button type="button" onClick={handleResendCode} disabled={resending} className="text-sm font-bold text-[#0f4c3a] dark:text-[#00BBA7] hover:underline focus:outline-none disabled:opacity-50">
                  {resending ? 'Kod Gönderiliyor...' : 'Kodu Tekrar Gönder'}
                </button>
              ) : (
                <p className="text-sm text-gray-400 dark:text-[#71717A] font-medium">
                  Kodu tekrar göndermek için <span className="font-bold text-[#0f4c3a] dark:text-[#00BBA7]">{timer}s</span> bekleyin.
                </p>
              )}
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#0f4c3a] hover:bg-[#0a3629] dark:bg-[#00BBA7] dark:hover:bg-[#009F8E] text-white font-bold py-3.5 rounded-xl transition-colors mt-2 shadow-sm flex items-center justify-center disabled:opacity-60">
              {loading ? 'Doğrulanıyor...' : 'Hesabı Doğrula'}
            </button>
          </form>

          <div className="text-center mt-8">
            <Link href="/login" className="inline-flex items-center text-sm font-bold text-gray-500 dark:text-[#71717A] hover:text-[#0f4c3a] dark:hover:text-[#00BBA7] transition-colors">
              Farklı Bir Hesaba Giriş Yap
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500 font-medium dark:bg-[#1A1A1A]">Sayfa Yükleniyor...</div>}>
      <VerifyForm />
    </Suspense>
  );
}