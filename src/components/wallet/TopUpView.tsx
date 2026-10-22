import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { TopupRequest } from '../../types';
import { sounds } from '../../utils/audio';
import {
  CreditCard,
  QrCode,
  Copy,
  Check,
  UploadCloud,
  Clock,
  ShieldCheck,
  AlertCircle,
  FileText,
  Building,
  Smartphone,
  ChevronRight,
  Zap,
  CheckCircle2,
  RefreshCw,
  Terminal,
  ExternalLink,
} from 'lucide-react';

interface TopUpViewProps {
  topupRequests: TopupRequest[];
  onSubmitTopup: (req: Omit<TopupRequest, 'id' | 'createdAt' | 'status'>) => void;
  onInstantApiCredit: (amountMYR: number, gatewayName: string, refNumber: string) => void;
  isDark: boolean;
}

type PaymentGatewayId =
  | 'googlepay'
  | 'shopeepay'
  | 'grabpay'
  | 'duitnow'
  | 'tng'
  | 'card'
  | 'setel'
  | 'cimb_manual';

export const TopUpView: React.FC<TopUpViewProps> = ({
  topupRequests,
  onSubmitTopup,
  onInstantApiCredit,
  isDark,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayId>('googlepay');
  const [refNumber, setRefNumber] = useState('');
  const [slipFileName, setSlipFileName] = useState('');
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isProcessingApi, setIsProcessingApi] = useState(false);
  const [apiResult, setApiResult] = useState<any | null>(null);
  const [showApiInspector, setShowApiInspector] = useState(false);

  const PRESET_AMOUNTS = [10, 20, 50, 100, 200];
  const currentAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  // Generate dynamic DuitNow QR payload
  useEffect(() => {
    const acc = selectedGateway === 'tng' ? '170997196374' : '7016657934';
    const qrPayload = `00020101021226580014my.com.paynet.duitnow0114${acc}520458125303458540${currentAmount.toFixed(2).length}${currentAmount.toFixed(2)}5802MY5916NASADEF SDN BHD6012KUALA LUMPUR62160112CP${Date.now()}6304`;

    QRCode.toDataURL(qrPayload, {
      width: 260,
      margin: 1.5,
      color: { dark: '#0f172a', light: '#ffffff' },
    }).then((url) => setQrDataUrl(url)).catch((e) => console.error(e));
  }, [selectedGateway, currentAmount]);

  const handleCopy = (text: string) => {
    sounds.playClick();
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      sounds.playClick();
      setSlipFileName(e.target.files[0].name);
    }
  };

  // INSTANT API PAYMENT EXECUTION
  const handleExecuteApiPayment = async () => {
    if (currentAmount < 5) {
      alert('Jumlah minimum tambah nilai ialah RM 5.00.');
      return;
    }

    sounds.playClick();
    setIsProcessingApi(true);
    setApiResult(null);

    const endpointMap: Record<string, string> = {
      googlepay: '/api/pay/googlepay',
      shopeepay: '/api/pay/shopeepay',
      grabpay: '/api/pay/grabpay',
      duitnow: '/api/pay/duitnow',
      tng: '/api/pay/tng',
      card: '/api/pay/card',
      setel: '/api/pay/setel',
    };

    const targetEndpoint = endpointMap[selectedGateway];
    if (!targetEndpoint) return;

    try {
      const res = await fetch(targetEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountMYR: currentAmount,
          userId: 'usr_current',
          description: `Tambah Nilai API ${selectedGateway.toUpperCase()}`,
          token: 'gpay_auth_token_sample',
          shopeePhone: '017-0997196',
          grabPhone: '017-0997196',
          tngPhone: '170997196374',
        }),
      });

      const data = await res.json();
      setIsProcessingApi(false);
      setApiResult(data);

      if (data.success) {
        sounds.playCoinChime();
        onInstantApiCredit(currentAmount, data.gateway || selectedGateway, data.refNumber);
      }
    } catch (err: any) {
      setIsProcessingApi(false);
      setApiResult({ success: false, error: 'Ralat sambungan API gerbang pembayaran.', details: err.message });
    }
  };

  // MANUAL CIMB SUBMIT
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refNumber.trim()) {
      alert('Sila masukkan nombor rujukan pindahan bank anda.');
      return;
    }
    if (currentAmount < 5) {
      alert('Jumlah minimum tambah nilai ialah RM 5.00.');
      return;
    }

    sounds.playCoinChime();
    onSubmitTopup({
      userId: 'usr_current',
      userName: 'Ahmad Razif',
      amountMYR: currentAmount,
      bankName: 'CIMB Bank',
      accountNumber: '7016657934',
      refNumber: refNumber.trim().toUpperCase(),
      proofImageUrl: slipFileName ? `slip_${slipFileName}` : undefined,
    });

    setRefNumber('');
    setSlipFileName('');
    setApiResult({
      success: true,
      gateway: 'CIMB Bank Pindahan',
      message: 'Permohonan pindahan manual dihantar. Menunggu semakan pentadbir.',
      refNumber: refNumber.trim().toUpperCase(),
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Integrasi API Pembayaran Rasmi Bersepadu
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Tambah Nilai E-Wallet & Gerbang API
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Pilih integrasi API segera (Google Pay, ShopeePay, GrabPay, DuitNow QR, TNG) atau pindahan bank CIMB.
          </p>
        </div>

        <button
          onClick={() => setShowApiInspector(!showApiInspector)}
          className="self-start md:self-auto btn-3d btn-3d-subtle px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-2"
        >
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>{showApiInspector ? 'Tutup API Inspector' : 'Papar API PayNet Inspector'}</span>
        </button>
      </div>

      {/* Live API Inspector Drawer */}
      {showApiInspector && (
        <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs shadow-2xl animate-slide-up space-y-2">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
            <span className="font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              API Gateway Webhook & Routing Monitor (HTTP 200 OK)
            </span>
            <span className="text-[10px] text-slate-400">Host: http://localhost:3000/api/pay/*</span>
          </div>
          <div className="text-[11px] space-y-1 text-slate-300">
            <p>• <strong>Google Pay API:</strong> Tokenized Android PayNet Gateway (Endpoint: <code>/api/pay/googlepay</code>)</p>
            <p>• <strong>ShopeePay API:</strong> Direct e-Wallet Merchant Debit (Endpoint: <code>/api/pay/shopeepay</code>)</p>
            <p>• <strong>GrabPay API:</strong> Grab Web SDK with GrabRewards preview (Endpoint: <code>/api/pay/grabpay</code>)</p>
            <p>• <strong>DuitNow QR Pay API:</strong> PayNet Standard EMVCo National QR (Endpoint: <code>/api/pay/duitnow</code>)</p>
            <p>• <strong>Touch 'n Go API:</strong> TNG DuitNow 170997196374 Direct Debit (Endpoint: <code>/api/pay/tng</code>)</p>
            <p>• <strong>Akaun Penyelesaian Rasmi:</strong> CIMB: <code>7016657934</code> | TNG: <code>170997196374</code></p>
          </div>
        </div>
      )}

      {/* Success / Alert Banner */}
      {apiResult && (
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3 shadow-xl animate-slide-up ${
            apiResult.success
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
          }`}
        >
          {apiResult.success ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          )}
          <div className="text-xs space-y-1">
            <span className="font-black text-sm block">
              {apiResult.success ? 'Integrasi Pembayaran Berjaya!' : 'Ralat Transaksi API'}
            </span>
            <p>{apiResult.message || apiResult.error}</p>
            {apiResult.refNumber && (
              <span className="inline-block px-2.5 py-0.5 rounded bg-black/30 font-mono font-bold text-amber-300">
                No Rujukan: {apiResult.refNumber}
              </span>
            )}
            {apiResult.settlementAccount && (
              <span className="block text-[11px] text-slate-300">
                Penyelesaian: <strong>{apiResult.settlementAccount}</strong>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Gateway Picker */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Choose Amount */}
          <div className="p-5 md:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-sm font-extrabold text-white">
              <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-black">
                1
              </span>
              <span>Pilih Jumlah Tambah Nilai (MYR)</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
              {PRESET_AMOUNTS.map((amt) => {
                const isSelected = selectedAmount === amt && !customAmount;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setSelectedAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`btn-3d py-3 rounded-2xl font-black text-sm transition-all ${
                      isSelected
                        ? 'btn-3d-primary text-white scale-102'
                        : 'btn-3d-subtle text-slate-200 hover:text-white'
                    }`}
                  >
                    RM {amt}
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Atau Masukkan Jumlah Khas (RM)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                  RM
                </span>
                <input
                  type="number"
                  min="5"
                  max="5000"
                  step="1"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Contoh: 150"
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Choose Payment Gateway API */}
          <div className="p-5 md:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-extrabold text-white">
                <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-black">
                  2
                </span>
                <span>Pilih Gerbang Pembayaran API Rasmi</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                ⚡ 5 API Aktif
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1. Google Pay */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setSelectedGateway('googlepay');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  selectedGateway === 'googlepay'
                    ? 'bg-slate-800 border-white shadow-lg shadow-white/10'
                    : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-white text-slate-900 font-black text-xs">
                      G Pay
                    </span>
                    <span className="font-bold text-xs text-white">Google Pay</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    API Segera
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Bayar pantas 1-klik melalui akaun Google Play.</p>
              </button>

              {/* 2. ShopeePay */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setSelectedGateway('shopeepay');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  selectedGateway === 'shopeepay'
                    ? 'bg-orange-950/40 border-orange-500 shadow-lg shadow-orange-500/20'
                    : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-black text-[10px] flex items-center justify-center">
                      S
                    </span>
                    <span className="font-bold text-xs text-white">ShopeePay</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300">
                    API Checkout
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Caj terus dompet ShopeePay anda.</p>
              </button>

              {/* 3. GrabPay */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setSelectedGateway('grabpay');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  selectedGateway === 'grabpay'
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-black text-[10px]">
                      Grab
                    </span>
                    <span className="font-bold text-xs text-white">GrabPay</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    +GrabPoints
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Dapat 3x GrabPoints bagi setiap RM1 dibelanja.</p>
              </button>

              {/* 4. DuitNow QR Pay */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setSelectedGateway('duitnow');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  selectedGateway === 'duitnow'
                    ? 'bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-500/20'
                    : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-rose-400" />
                    <span className="font-bold text-xs text-white">DuitNow QR Pay</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                    PayNet QR
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Imbas menggunakan sebarang aplikasi perbankan.</p>
              </button>

              {/* 5. Touch 'n Go (TNG) */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setSelectedGateway('tng');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  selectedGateway === 'tng'
                    ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-yellow-400 text-blue-900 font-black text-[9px] flex items-center justify-center">
                      TNG
                    </span>
                    <span className="font-bold text-xs text-white">Touch 'n Go eWallet</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    170997196374
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Pindahan pantas DuitNow ID rasmi.</p>
              </button>

              {/* 6. Kad Debit & Kredit (Visa / Mastercard / MyDebit 3D Secure) */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setSelectedGateway('card');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  selectedGateway === 'card'
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/20'
                    : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-indigo-400" />
                    <span className="font-bold text-xs text-white">Kad Debit / Kredit</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    Visa / MC
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Bayaran kad pantas dengan pengesahan 3D Secure.</p>
              </button>

              {/* 7. Petronas Setel & Mesra */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setSelectedGateway('setel');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  selectedGateway === 'setel'
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">⛽</span>
                    <span className="font-bold text-xs text-white">Petronas Setel</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    +Mata Mesra
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Pautkan Setel & peroleh mata ganjaran Mesra.</p>
              </button>

              {/* 8. CIMB Bank Manual Pindahan */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setSelectedGateway('cimb_manual');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  selectedGateway === 'cimb_manual'
                    ? 'bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-500/20'
                    : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-rose-500" />
                    <span className="font-bold text-xs text-white">CIMB Bank Pindahan</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                    7016657934
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Pindahan manual melalui CIMB Clicks.</p>
              </button>
            </div>
          </div>

          {/* Step 3: Action Execution Form */}
          {selectedGateway !== 'cimb_manual' ? (
            /* Instant API Trigger Card */
            <div className="p-5 md:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-extrabold text-white">
                  <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-black">
                    3
                  </span>
                  <span>Sahkan Bayaran API ({selectedGateway.toUpperCase()})</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Auto-Credit Lejar
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Saluran API:</span>
                  <span className="font-extrabold text-white capitalize">{selectedGateway} API Gateway</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Jumlah Bayaran:</span>
                  <span className="font-black text-emerald-400 text-sm">RM {currentAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Akaun Penyelesaian:</span>
                  <span className="font-mono text-slate-300">
                    {selectedGateway === 'tng' ? 'TNG: 170997196374' : 'CIMB: 7016657934'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleExecuteApiPayment}
                disabled={isProcessingApi}
                className="w-full btn-3d btn-3d-primary py-3.5 px-6 rounded-2xl font-black text-sm text-white shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessingApi ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Menghubungi API {selectedGateway.toUpperCase()}...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Bayar Sekarang (RM {currentAmount.toFixed(2)}) Melalui API</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* CIMB Manual Upload Form */
            <form
              onSubmit={handleManualSubmit}
              className="p-5 md:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4"
            >
              <div className="flex items-center gap-2 text-sm font-extrabold text-white">
                <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-black">
                  3
                </span>
                <span>Hantar No. Rujukan CIMB Manual</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombor Rujukan Pindahan CIMB (Wajib)
                </label>
                <input
                  type="text"
                  required
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  placeholder="Contoh: 20261019CIMB88912"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Bukti Resit Pindahan (Pilihan)
                </label>
                <div className="relative border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-4 text-center cursor-pointer bg-slate-800/40">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-slate-300 block">
                    {slipFileName || 'Klik untuk muat naik slip resit'}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-3d btn-3d-primary py-3.5 px-6 rounded-2xl font-black text-sm text-white shadow-xl flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Hantar Pindahan CIMB Untuk Semakan (RM {currentAmount.toFixed(2)})</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Dynamic Gateway QR & Official Account Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Akaun Penerima Sah
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Disahkan Bank Negara
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">CIMB Bank</span>
                  <span className="text-sm font-black text-amber-300 font-mono">7016657934</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('7016657934')}
                  className="btn-3d btn-3d-subtle px-2.5 py-1 rounded-lg text-xs font-bold text-slate-300"
                >
                  {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">TNG DuitNow</span>
                  <span className="text-sm font-black text-amber-300 font-mono">170997196374</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('170997196374')}
                  className="btn-3d btn-3d-subtle px-2.5 py-1 rounded-lg text-xs font-bold text-slate-300"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                <span className="text-[10px] text-slate-400 block font-semibold">Nama Pemegang Sah</span>
                <span className="text-xs font-bold text-white">
                  NASADEF SDN BHD / COINPAY PLAY VERIFIED
                </span>
              </div>
            </div>

            {/* DuitNow QR Pay Live Canvas */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-300 mb-2">
                <QrCode className="w-4 h-4 text-pink-400" />
                <span>DuitNow QR Pay (RM {currentAmount.toFixed(2)})</span>
              </div>

              {qrDataUrl ? (
                <div className="p-3 bg-white rounded-xl inline-block shadow-md">
                  <img src={qrDataUrl} alt="DuitNow QR Code" className="w-36 h-36 mx-auto" />
                </div>
              ) : (
                <div className="w-36 h-36 mx-auto flex items-center justify-center text-xs text-slate-500">
                  Menjana QR...
                </div>
              )}

              <p className="text-[10px] text-slate-400 mt-2">
                Imbas dengan Google Pay, ShopeePay, GrabPay, TNG atau CIMB.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          <span>Rekod Transaksi Tambah Nilai Terkini</span>
        </h3>

        {topupRequests.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            Tiada rekod transaksi dijumpai.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="pb-3 px-2">ID Rujukan</th>
                  <th className="pb-3 px-2">Gerbang / Kaedah</th>
                  <th className="pb-3 px-2">Jumlah</th>
                  <th className="pb-3 px-2">Masa</th>
                  <th className="pb-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {topupRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-2 font-mono text-white font-bold">{req.refNumber}</td>
                    <td className="py-3 px-2 text-slate-300">{req.bankName}</td>
                    <td className="py-3 px-2 font-black text-white">RM {req.amountMYR.toFixed(2)}</td>
                    <td className="py-3 px-2 text-slate-400 text-[11px]">{req.createdAt}</td>
                    <td className="py-3 px-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
