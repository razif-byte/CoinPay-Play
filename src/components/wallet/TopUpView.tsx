import React, { useState } from 'react';
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
} from 'lucide-react';

interface TopUpViewProps {
  topupRequests: TopupRequest[];
  onSubmitTopup: (req: Omit<TopupRequest, 'id' | 'createdAt' | 'status'>) => void;
  isDark: boolean;
}

export const TopUpView: React.FC<TopUpViewProps> = ({
  topupRequests,
  onSubmitTopup,
  isDark,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<'CIMB' | 'TNG'>('CIMB');
  const [refNumber, setRefNumber] = useState('');
  const [slipFileName, setSlipFileName] = useState('');
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const PRESET_AMOUNTS = [10, 20, 50, 100, 200];

  const currentAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  // Generate dynamic DuitNow QR payload
  React.useEffect(() => {
    const acc = selectedMethod === 'CIMB' ? '7016657934' : '170997196374';
    const qrPayload = `https://nasadef.com.my/pay?method=${selectedMethod}&acc=${acc}&amount=${currentAmount}&ref=CP${Date.now()}`;

    QRCode.toDataURL(qrPayload, {
      width: 240,
      margin: 1.5,
      color: { dark: '#0f172a', light: '#ffffff' },
    }).then((url) => setQrDataUrl(url)).catch((e) => console.error(e));
  }, [selectedMethod, currentAmount]);

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

  const handleSubmit = (e: React.FormEvent) => {
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
      bankName: selectedMethod === 'CIMB' ? 'CIMB Bank' : 'TNG DuitNow',
      accountNumber: selectedMethod === 'CIMB' ? '7016657934' : '170997196374',
      refNumber: refNumber.trim().toUpperCase(),
      proofImageUrl: slipFileName ? `slip_${slipFileName}` : undefined,
    });

    setSubmittedSuccess(true);
    setRefNumber('');
    setSlipFileName('');
    setTimeout(() => setSubmittedSuccess(false), 6000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          Tambah Nilai E-Wallet (Top Up)
        </h2>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Pindahkan dana ke akaun rasmi berdaftar untuk menambah baki wang tunai (MYR) e-wallet anda.
        </p>
      </div>

      {submittedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 flex items-center gap-3 animate-slide-up shadow-xl">
          <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-extrabold block text-sm">Permohonan Berjaya Dihantar!</span>
            Permohonan tambah nilai anda kini berstatus <strong>UNDER REVIEW</strong>. Baki tunai akan dikreditkan ke e-wallet anda sebaik sahaja semakan pentadbir disahkan.
          </div>
        </div>
      )}

      {/* Main Topup Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Amount & Method Selection */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Select Amount */}
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
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                  }}
                  placeholder="Contoh: 150"
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Choose Payment Account / Gateway */}
          <div className="p-5 md:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-sm font-extrabold text-white">
              <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-black">
                2
              </span>
              <span>Pilih Saluran Pembayaran Rasmi</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: CIMB Bank */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setSelectedMethod('CIMB');
                }}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  selectedMethod === 'CIMB'
                    ? 'bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-900/20'
                    : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-rose-500" />
                    <span className="font-black text-white text-sm">CIMB Bank</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                    Pindahan Bank
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono tracking-wide font-bold">
                  7016657934
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Pemegang: NASADEF SDN BHD (Disahkan)
                </p>
              </button>

              {/* Option 2: TNG DuitNow */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setSelectedMethod('TNG');
                }}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  selectedMethod === 'TNG'
                    ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-900/20'
                    : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-blue-400" />
                    <span className="font-black text-white text-sm">TNG DuitNow</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    DuitNow QR
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono tracking-wide font-bold">
                  170997196374
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  DuitNow ID: 170997196374 (NASADEF)
                </p>
              </button>
            </div>
          </div>

          {/* Step 3: Verification Submission Form */}
          <form
            onSubmit={handleSubmit}
            className="p-5 md:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4"
          >
            <div className="flex items-center gap-2 text-sm font-extrabold text-white">
              <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-black">
                3
              </span>
              <span>Hantar Bukti & Nombor Rujukan Pindahan</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nombor Rujukan Bank (Wajib)
              </label>
              <input
                type="text"
                required
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                placeholder="Contoh: 20261019CIMB982012 / TNG77218"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Ambil nombor rujukan daripada resit pindahan aplikasi CIMB Clicks atau Touch 'n Go eWallet anda.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Muat Naik Tangkap Layar Resit (Pilihan / Digalakkan)
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
                  {slipFileName || 'Klik untuk pilih fail resit transaksi'}
                </span>
                <span className="text-[10px] text-slate-500">
                  PNG, JPG, PDF (Maks 5MB)
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-3d btn-3d-primary py-3.5 px-6 rounded-2xl font-black text-sm text-white tracking-wide shadow-xl flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Hantar Permohonan Tambah Nilai (RM {currentAmount.toFixed(2)})</span>
            </button>
          </form>
        </div>

        {/* Right Column: Bank Details & DuitNow QR Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Akaun Penerima Rasmi
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Disahkan Pentadbir
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                <span className="text-[10px] text-slate-400 block font-semibold">Nama Bank</span>
                <span className="text-sm font-extrabold text-white">
                  {selectedMethod === 'CIMB' ? 'CIMB Bank Berhad' : "Touch 'n Go DuitNow"}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Nombor Akaun / DuitNow</span>
                  <span className="text-base font-black text-amber-300 font-mono tracking-wider">
                    {selectedMethod === 'CIMB' ? '7016657934' : '170997196374'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(selectedMethod === 'CIMB' ? '7016657934' : '170997196374')}
                  className="btn-3d btn-3d-subtle px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-1.5"
                >
                  {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAccount ? 'Disalin' : 'Salin'}</span>
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                <span className="text-[10px] text-slate-400 block font-semibold">Nama Pemegang Akaun</span>
                <span className="text-xs font-bold text-white">
                  NASADEF SDN BHD / COINPAY PLAY VERIFIED
                </span>
              </div>
            </div>

            {/* DuitNow QR Preview */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-300 mb-2">
                <QrCode className="w-4 h-4 text-pink-400" />
                <span>DuitNow QR Rasmi (RM {currentAmount.toFixed(2)})</span>
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
                Buka mana-mana aplikasi perbankan (CIMB, Maybank, TNG) dan imbas DuitNow QR untuk bayar.
              </p>
            </div>

            {/* Safety & Protocol Notice */}
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Protokol Keselamatan Lejar:</strong> Baki e-wallet hanya akan dikreditkan selepas nombor rujukan disahkan oleh semakan pentadbir bagi mengelakkan kredit berganda.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Topup History Table / Status Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          <span>Status Permohonan Tambah Nilai Terkini</span>
        </h3>

        {topupRequests.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            Tiada permohonan tambah nilai lagi. Hantar permohonan pertama anda di atas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="pb-3 px-2">ID Rujukan</th>
                  <th className="pb-3 px-2">Kaedah Bank</th>
                  <th className="pb-3 px-2">Jumlah</th>
                  <th className="pb-3 px-2">Masa</th>
                  <th className="pb-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {topupRequests.map((req) => {
                  const statusStyles = {
                    PENDING: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                    UNDER_REVIEW: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                    APPROVED: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                    REJECTED: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
                    REFUNDED: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                  };

                  return (
                    <tr key={req.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-2 font-mono text-white font-bold">{req.refNumber}</td>
                      <td className="py-3 px-2 text-slate-300">{req.bankName}</td>
                      <td className="py-3 px-2 font-black text-white">RM {req.amountMYR.toFixed(2)}</td>
                      <td className="py-3 px-2 text-slate-400 text-[11px]">{req.createdAt}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                            statusStyles[req.status] || 'bg-slate-700 text-white'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
