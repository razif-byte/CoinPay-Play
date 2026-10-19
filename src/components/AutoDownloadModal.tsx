import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Smartphone, Apple, Monitor, Download, X, Copy, Check, QrCode, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface AutoDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export const AutoDownloadModal: React.FC<AutoDownloadModalProps> = ({
  isOpen,
  onClose,
  isDark,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [deviceType, setDeviceType] = useState<'android' | 'ios' | 'desktop'>('desktop');
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Detect device
    const ua = navigator.userAgent.toLowerCase();
    if (/android/.test(ua)) {
      setDeviceType('android');
    } else if (/iphone|ipad|ipod/.test(ua)) {
      setDeviceType('ios');
    } else {
      setDeviceType('desktop');
    }

    // Capture install prompt
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Generate QR code for current URL
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://coinpay.nasadef.com.my';
    QRCode.toDataURL(currentUrl, {
      width: 280,
      margin: 1.5,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    }).then((url) => setQrDataUrl(url)).catch((err) => console.error(err));

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    sounds.playClick();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert(
        deviceType === 'ios'
          ? 'Untuk iPhone/iPad: Tekan ikon "Share" (Kongsi) di bar bawah Safari, kemudian pilih "Add to Home Screen" (Tambah ke Skrin Utama).'
          : 'Untuk memasang aplikasi: Tekan menu tiga titik di pelayar anda, kemudian pilih "Install App" atau "Add to Home Screen".'
      );
    }
  };

  const handleCopyLink = () => {
    sounds.playClick();
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className={`relative w-full max-w-md rounded-3xl p-6 shadow-2xl border transition-all ${
          isDark
            ? 'bg-slate-900 border-slate-700 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800/20 text-slate-400 hover:text-white transition"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-500 mb-2 border border-blue-500/30">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black tracking-tight">Auto Download & Pasang</h3>
          <p className="text-xs text-slate-400 mt-1">
            Disesuaikan khas untuk peranti anda: <span className="capitalize font-bold text-blue-400">{deviceType}</span>
          </p>
        </div>

        {/* QR Code Canvas */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 mb-5">
          {qrDataUrl ? (
            <div className="p-3 bg-white rounded-xl shadow-lg">
              <img src={qrDataUrl} alt="QR Code Download CoinPay Play" className="w-48 h-48 mx-auto" />
            </div>
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400">
              Menjana kod QR...
            </div>
          )}
          <span className="text-[11px] text-slate-400 mt-2 text-center font-medium">
            Imbas menggunakan kamera telefon anda untuk membuka dan memasang serta-merta!
          </span>
        </div>

        {/* Device Detection Instructions */}
        <div className={`p-3.5 rounded-xl text-xs mb-5 border ${
          deviceType === 'android'
            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
            : deviceType === 'ios'
            ? 'bg-indigo-950/30 border-indigo-500/30 text-indigo-300'
            : 'bg-blue-950/30 border-blue-500/30 text-blue-300'
        }`}>
          <div className="flex items-center gap-2 font-bold mb-1.5">
            {deviceType === 'android' && <Smartphone className="w-4 h-4" />}
            {deviceType === 'ios' && <Apple className="w-4 h-4" />}
            {deviceType === 'desktop' && <Monitor className="w-4 h-4" />}
            <span>Panduan Pemasangan ({deviceType.toUpperCase()})</span>
          </div>

          {deviceType === 'android' && (
            <ol className="list-decimal list-inside space-y-1 text-[11px] opacity-90">
              <li>Tekan butang <strong>"Pasang Sekarang"</strong> di bawah.</li>
              <li>Atau buka Chrome menu (⋮) &gt; pilih <strong>"Add to Home screen"</strong>.</li>
              <li>Aplikasi sedia digunakan seperti app telefon asli!</li>
            </ol>
          )}

          {deviceType === 'ios' && (
            <ol className="list-decimal list-inside space-y-1 text-[11px] opacity-90">
              <li>Buka pautan ini di penyemak imbas <strong>Safari</strong>.</li>
              <li>Tekan butang <strong>Kongsi (Share)</strong> [ikon petak dengan anak panah ke atas].</li>
              <li>Skrol ke bawah dan pilih <strong>"Add to Home Screen"</strong>.</li>
            </ol>
          )}

          {deviceType === 'desktop' && (
            <ol className="list-decimal list-inside space-y-1 text-[11px] opacity-90">
              <li>Tekan butang pasang pada bar carian browser Chrome/Edge.</li>
              <li>Atau tekan butang di bawah untuk membuka versi PWA kendiri.</li>
            </ol>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleInstallClick}
            className="w-full btn-3d btn-3d-primary py-3 px-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span>Pasang Sekarang ({deviceType.toUpperCase()})</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full btn-3d btn-3d-subtle py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-300 flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Pautan Disalin!' : 'Salin Pautan Pemasangan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
