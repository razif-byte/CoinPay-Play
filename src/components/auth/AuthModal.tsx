import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { sounds } from '../../utils/audio';
import { AppLogo } from '../AppLogo';
import {
  X,
  Lock,
  Mail,
  Phone,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  isDark: boolean;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  isDark,
  initialMode = 'login',
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'otp' | 'shopee_sso' | 'tng_sso' | 'google_sso'>('login');
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [phone, setPhone] = useState('017-0997196');
  const [name, setName] = useState('Ahmad Razif');
  const [email, setEmail] = useState('laptoprazif@gmail.com');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // OTP State
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('882910');
  const [countdown, setCountdown] = useState(60);
  const [otpSentNotice, setOtpSentNotice] = useState(false);

  // SSO specific fields
  const [shopeePhone, setShopeePhone] = useState('017-0997196');
  const [tngPin, setTngPin] = useState(['', '', '', '', '', '']);

  if (!isOpen) return null;

  // 1. GOOGLE LOGIN HANDLER
  const handleGoogleLogin = () => {
    sounds.playClick();
    setAuthMode('google_sso');
  };

  const confirmGoogleAuth = (selectedEmail: string, selectedName: string) => {
    sounds.playCoinChime();
    const googleUser: UserProfile = {
      id: `usr_g_${Date.now().toString().slice(-6)}`,
      name: selectedName,
      email: selectedEmail,
      phone: '017-0997196',
      verified: true,
      cashBalanceCents: 15000,
      rewardCoins: 500,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      memberTier: 'Gold',
      joinedDate: new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' }),
      dailyStreak: 5,
    };
    onLoginSuccess(googleUser);
    onClose();
  };

  // 2. SHOPEEPAY LOGIN HANDLER
  const handleShopeePayLogin = () => {
    sounds.playClick();
    setAuthMode('shopee_sso');
  };

  const confirmShopeePayAuth = () => {
    if (!shopeePhone.trim()) {
      alert('Sila masukkan nombor akaun ShopeePay anda.');
      return;
    }
    sounds.playCoinChime();
    const shopeeUser: UserProfile = {
      id: `usr_sp_${Date.now().toString().slice(-6)}`,
      name: 'Pengguna ShopeePay Rasmi',
      email: `shopeepay_${shopeePhone.replace(/\D/g, '')}@nasadef.com.my`,
      phone: shopeePhone,
      verified: true,
      cashBalanceCents: 18000,
      rewardCoins: 650,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
      memberTier: 'VIP Diamond',
      joinedDate: new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' }),
      dailyStreak: 7,
    };
    onLoginSuccess(shopeeUser);
    onClose();
  };

  // 3. TNG (TOUCH 'N GO) LOGIN HANDLER
  const handleTngLogin = () => {
    sounds.playClick();
    setAuthMode('tng_sso');
  };

  const confirmTngAuth = () => {
    const pinStr = tngPin.join('');
    if (pinStr.length < 6) {
      alert('Sila masukkan 6-digit PIN keselamatan Touch \'n Go anda.');
      return;
    }
    sounds.playCoinChime();
    const tngUser: UserProfile = {
      id: 'usr_tng_170997',
      name: 'Ahmad Razif (TNG eWallet)',
      email: 'laptoprazif@gmail.com',
      phone: '170997196374',
      verified: true,
      cashBalanceCents: 20000,
      rewardCoins: 800,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      memberTier: 'VIP Diamond',
      joinedDate: new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' }),
      dailyStreak: 10,
    };
    onLoginSuccess(tngUser);
    onClose();
  };

  // 4. MANUAL FORM SUBMIT (LOGIN OR REGISTER -> OTP)
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();

    if (!agreeTerms) {
      alert('Sila tandakan persetujuan Terma Perkhidmatan NASADEF™ SDN. BHD.');
      return;
    }

    // Trigger OTP Step
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setOtpSentNotice(true);
    setAuthMode('otp');
  };

  // 5. OTP VERIFICATION
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpCode.join('');
    if (code.length < 6) {
      alert('Sila lengkapkan 6-digit kod OTP.');
      return;
    }

    sounds.playCoinChime();
    const loggedUser: UserProfile = {
      id: `usr_${Date.now().toString().slice(-6)}`,
      name: name || 'Ahmad Razif',
      email: email || 'laptoprazif@gmail.com',
      phone: phone || '017-0997196',
      verified: true,
      cashBalanceCents: 15000,
      rewardCoins: 480,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      memberTier: 'Gold',
      joinedDate: '19 Okt 2026',
      dailyStreak: 4,
    };
    onLoginSuccess(loggedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className={`relative w-full max-w-md rounded-3xl p-6 md:p-7 shadow-2xl border transition-all max-h-[92vh] overflow-y-auto ${
          isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800/30 text-slate-400 hover:text-white transition"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Branding Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <AppLogo size="lg" showText={false} />
          </div>
          <h3 className="text-2xl font-black tracking-tight">
            {authMode === 'login' && 'Log Masuk CoinPay Play™'}
            {authMode === 'register' && 'Daftar Akaun Baharu'}
            {authMode === 'otp' && 'Pengesahan Kod OTP'}
            {authMode === 'google_sso' && 'Log Masuk Akaun Google'}
            {authMode === 'shopee_sso' && 'Penyambungan ShopeePay'}
            {authMode === 'tng_sso' && 'Pengesahan Touch \'n Go eWallet'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Super App E-Wallet & Gaming Rewards Rasmi Malaysia
          </p>
        </div>

        {/* ======================================================== */}
        {/* SUB-VIEW 1: GOOGLE ACCOUNT SSO POPUP                     */}
        {/* ======================================================== */}
        {authMode === 'google_sso' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <div>
                  <h4 className="font-bold text-sm text-white">Pilih Akaun Google</h4>
                  <p className="text-[11px] text-slate-400">Untuk teruskan ke CoinPay Play™</p>
                </div>
              </div>

              {/* Account Choice 1 */}
              <button
                onClick={() => confirmGoogleAuth('laptoprazif@gmail.com', 'Ahmad Razif')}
                className="w-full p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 flex items-center gap-3 transition text-left group"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                  AR
                </div>
                <div className="flex-1 overflow-hidden">
                  <span className="font-bold text-xs text-white group-hover:text-blue-300 block truncate">
                    Ahmad Razif
                  </span>
                  <span className="text-[11px] text-slate-400 block truncate">laptoprazif@gmail.com</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 opacity-80" />
              </button>

              {/* Account Choice 2 */}
              <button
                onClick={() => confirmGoogleAuth('nasadef.official@gmail.com', 'NASADEF Official')}
                className="w-full p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 flex items-center gap-3 transition text-left group"
              >
                <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm">
                  ND
                </div>
                <div className="flex-1 overflow-hidden">
                  <span className="font-bold text-xs text-white group-hover:text-purple-300 block truncate">
                    NASADEF™ Official
                  </span>
                  <span className="text-[11px] text-slate-400 block truncate">nasadef.official@gmail.com</span>
                </div>
              </button>
            </div>

            <button
              onClick={() => setAuthMode('login')}
              className="w-full btn-3d btn-3d-subtle py-2.5 rounded-xl text-xs font-semibold text-slate-300"
            >
              Kembali ke Pilihan Lain
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-VIEW 2: SHOPEEPAY SSO POPUP                          */}
        {/* ======================================================== */}
        {authMode === 'shopee_sso' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-orange-950/30 border border-orange-500/30 space-y-3">
              <div className="flex items-center gap-2.5 text-orange-400">
                <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black text-sm shadow-md">
                  S
                </div>
                <div>
                  <h4 className="font-black text-sm text-white">ShopeePay Auto-Connect</h4>
                  <p className="text-[10px] text-orange-300">Log masuk terus menggunakan dompet ShopeePay</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombor Telefon Berdaftar ShopeePay
                </label>
                <input
                  type="text"
                  value={shopeePhone}
                  onChange={(e) => setShopeePhone(e.target.value)}
                  placeholder="01x-xxxxxxx"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Pengesahan pantas melalui token keselamatan ShopeePay rasmi.</span>
              </div>
            </div>

            <button
              onClick={confirmShopeePayAuth}
              className="w-full btn-3d py-3 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-orange-500 to-amber-600 border-b-4 border-orange-800 shadow-xl"
            >
              Sahkan & Sambung ShopeePay
            </button>

            <button
              onClick={() => setAuthMode('login')}
              className="w-full btn-3d btn-3d-subtle py-2 rounded-xl text-xs font-semibold text-slate-300"
            >
              Kembali
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-VIEW 3: TOUCH 'N GO (TNG) SSO POPUP                  */}
        {/* ======================================================== */}
        {authMode === 'tng_sso' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                  TNG
                </div>
                <div>
                  <h4 className="font-black text-sm text-white">Touch 'n Go eWallet SSO</h4>
                  <p className="text-[10px] text-blue-300">ID DuitNow Rasmi: 170997196374</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 text-center">
                  Masukkan 6-Digit 6-PIN Touch 'n Go Anda
                </label>
                <div className="flex justify-center gap-2">
                  {tngPin.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`tng-pin-${idx}`}
                      type="password"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        const newPin = [...tngPin];
                        newPin[idx] = val;
                        setTngPin(newPin);
                        if (val && idx < 5) {
                          document.getElementById(`tng-pin-${idx + 1}`)?.focus();
                        }
                      }}
                      className="w-10 h-12 text-center text-lg font-black rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                    />
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] text-slate-400 text-center">
                Disulitkan dengan teknologi keselamatan DuitNow & Bank Negara Malaysia.
              </div>
            </div>

            <button
              onClick={confirmTngAuth}
              className="w-full btn-3d btn-3d-primary py-3 rounded-2xl font-black text-sm text-white shadow-xl"
            >
              Sahkan Log Masuk Touch 'n Go
            </button>

            <button
              onClick={() => setAuthMode('login')}
              className="w-full btn-3d btn-3d-subtle py-2 rounded-xl text-xs font-semibold text-slate-300"
            >
              Kembali
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-VIEW 4: OTP VERIFICATION VIEW                        */}
        {/* ======================================================== */}
        {authMode === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 text-center">
              <span className="text-xs text-slate-300 block mb-1">
                Kod keselamatan OTP 6-digit telah dihantar ke:
              </span>
              <strong className="text-sm font-mono text-blue-400">{phone}</strong>
              <div className="mt-3 p-2 rounded-xl bg-blue-600/20 border border-blue-400/30 text-xs text-blue-200">
                ⚡ Demo OTP Automatik: <strong className="font-mono text-amber-300 text-sm">{generatedOtp}</strong>
              </div>
            </div>

            <div>
              <div className="flex justify-center gap-2 my-3">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-box-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      const next = [...otpCode];
                      next[idx] = val;
                      setOtpCode(next);
                      if (val && idx < 5) {
                        document.getElementById(`otp-box-${idx + 1}`)?.focus();
                      }
                    }}
                    className="w-10 h-12 text-center text-lg font-black rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                ))}
              </div>

              {/* Quick auto-fill button for testing */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setOtpCode(generatedOtp.split(''));
                }}
                className="text-[11px] text-blue-400 hover:underline block mx-auto font-medium"
              >
                Isi Kod OTP Automatik ({generatedOtp})
              </button>
            </div>

            <button
              type="submit"
              className="w-full btn-3d btn-3d-primary py-3 rounded-2xl font-black text-sm text-white shadow-xl"
            >
              Sahkan Kod & Masuk
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className="w-full btn-3d btn-3d-subtle py-2 rounded-xl text-xs font-semibold text-slate-300"
            >
              Batal
            </button>
          </form>
        )}

        {/* ======================================================== */}
        {/* SUB-VIEW 5: STANDARD LOGIN & REGISTER FORMS              */}
        {/* ======================================================== */}
        {(authMode === 'login' || authMode === 'register') && (
          <div className="space-y-5 animate-fade-in">
            {/* Social & Wallet SSO Buttons */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
                Pilih Kaedah Log Masuk Pantas
              </span>

              {/* 1. Google Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-3 shadow-md border border-slate-200 transition-transform active:scale-98"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Teruskan dengan Google Akaun</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                {/* 2. ShopeePay Button */}
                <button
                  type="button"
                  onClick={handleShopeePayLogin}
                  className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-98"
                >
                  <span className="w-5 h-5 rounded-full bg-white text-orange-600 font-black text-xs flex items-center justify-center">
                    S
                  </span>
                  <span>ShopeePay</span>
                </button>

                {/* 3. TNG eWallet Button */}
                <button
                  type="button"
                  onClick={handleTngLogin}
                  className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-98"
                >
                  <span className="w-5 h-5 rounded-md bg-yellow-400 text-blue-900 font-black text-[10px] flex items-center justify-center">
                    TNG
                  </span>
                  <span>Touch 'n Go</span>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-700 w-full" />
              <span className="bg-slate-900 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider absolute">
                Atau Guna Nombor Telefon
              </span>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex rounded-xl bg-slate-800/80 p-1 border border-slate-700">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setAuthMode('login');
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                  authMode === 'login' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Log Masuk
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setAuthMode('register');
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                  authMode === 'register' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Daftar Akaun
              </button>
            </div>

            {/* The Form */}
            <form onSubmit={handleManualSubmit} className="space-y-3 text-xs">
              {authMode === 'register' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama Penuh (Seperti IC)</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Ahmad Razif bin Zakaria"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombor Telefon Bimbit</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01x-xxxxxxx"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Alamat E-mel</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="laptoprazif@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Kata Laluan</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Agreement checkbox */}
              <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-400">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-0"
                />
                <label htmlFor="agree">
                  Saya bersetuju dengan{' '}
                  <a
                    href="https://nasadef.com.my"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline font-semibold"
                  >
                    Terma Perkhidmatan & Polisi Privasi NASADEF™ SDN. BHD.
                  </a>
                </label>
              </div>

              {/* Submit 3D Button */}
              <button
                type="submit"
                className="w-full btn-3d btn-3d-primary py-3 px-4 rounded-2xl font-black text-sm text-white shadow-xl flex items-center justify-center gap-2 mt-2"
              >
                <span>{authMode === 'login' ? 'Log Masuk dengan OTP' : 'Hantar Pendaftaran & Dapatkan OTP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
