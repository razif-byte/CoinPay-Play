import React, { useState } from 'react';
import { UserProfile, LedgerEntry } from '../../types';
import { sounds } from '../../utils/audio';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  Smartphone,
  Sparkles,
  Zap,
  CheckCircle2,
  Plus,
  Trash2,
  RefreshCw,
  Fuel,
  Coins,
  Wallet,
  ShieldCheck,
  Award,
  ArrowRightLeft,
  Lock,
  Wifi,
  ChevronRight,
  ExternalLink,
  Gift,
} from 'lucide-react';

interface SavedCard {
  id: string;
  type: 'DEBIT' | 'CREDIT';
  brand: 'VISA' | 'MASTERCARD' | 'MYDEBIT' | 'AMEX';
  bankName: string;
  cardholderName: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  colorGradient: string;
  isDefault: boolean;
}

interface LoyaltyAccount {
  id: string;
  name: string;
  category: 'PETROL' | 'SHOPPING' | 'RIDE' | 'TRAVEL';
  pointsName: string;
  pointsBalance: number;
  rateToRM: number; // 100 pts = X RM
  iconBg: string;
  iconText: string;
  accountRef: string;
  isConnected: boolean;
}

interface CardsAndLoyaltyViewProps {
  user: UserProfile;
  onUpdateBalances: (
    deltaCents: number,
    deltaCoins: number,
    title: string,
    description: string
  ) => void;
  isDark: boolean;
}

export const CardsAndLoyaltyView: React.FC<CardsAndLoyaltyViewProps> = ({
  user,
  onUpdateBalances,
  isDark,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'CARDS' | 'TNG_NFC' | 'SETEL' | 'LOYALTY'>('CARDS');

  // Saved Debit & Credit Cards
  const [cards, setCards] = useState<SavedCard[]>([
    {
      id: 'crd_1',
      type: 'DEBIT',
      brand: 'MYDEBIT',
      bankName: 'CIMB Bank',
      cardholderName: 'AHMAD RAZIF',
      last4: '7934',
      expiryMonth: '08',
      expiryYear: '29',
      colorGradient: 'from-rose-900 via-red-800 to-slate-900',
      isDefault: true,
    },
    {
      id: 'crd_2',
      type: 'CREDIT',
      brand: 'VISA',
      bankName: 'Maybank Visa Platinum',
      cardholderName: 'AHMAD RAZIF',
      last4: '4242',
      expiryMonth: '11',
      expiryYear: '30',
      colorGradient: 'from-amber-700 via-yellow-600 to-slate-900',
      isDefault: false,
    },
  ]);

  // Card Modal Form
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardholder, setNewCardholder] = useState('');
  const [newExpiry, setNewExpiry] = useState('');
  const [newCvv, setNewCvv] = useState('');
  const [newCardType, setNewCardType] = useState<'DEBIT' | 'CREDIT'>('DEBIT');
  const [newBankName, setNewBankName] = useState('Maybank');

  // NFC Touch 'n Go Card State
  const [tngCardNumber, setTngCardNumber] = useState('1088 2910 4421 9918');
  const [tngCardBalanceMYR, setTngCardBalanceMYR] = useState(48.50);
  const [isScanningNFC, setIsScanningNFC] = useState(false);
  const [nfcReloadAmount, setNfcReloadAmount] = useState('20');

  // Setel & Petronas Mesra Points
  const [setelConnected, setSetelConnected] = useState(true);
  const [setelPhone, setSetelPhone] = useState('017-0997196');
  const [mesraPoints, setMesraPoints] = useState(3850);
  const [setelCashbackMYR, setSetelCashbackMYR] = useState(12.40);

  // Other Loyalty Point Programs
  const [loyaltyPrograms, setLoyaltyPrograms] = useState<LoyaltyAccount[]>([
    {
      id: 'setel',
      name: 'Petronas Setel & Mesra',
      category: 'PETROL',
      pointsName: 'Mata Mesra',
      pointsBalance: 3850,
      rateToRM: 1.0, // 100 Mesra pts = RM 1.00
      iconBg: 'bg-emerald-600',
      iconText: '⛽ Setel',
      accountRef: '017-0997196',
      isConnected: true,
    },
    {
      id: 'bonuslink',
      name: 'BonusLink Malaysia (Shell & Parkson)',
      category: 'SHOPPING',
      pointsName: 'BonusLink Pts',
      pointsBalance: 4200,
      rateToRM: 1.0, // 100 BL pts = RM 1.00
      iconBg: 'bg-blue-600',
      iconText: 'BL BonusLink',
      accountRef: '6018 2918 4401',
      isConnected: true,
    },
    {
      id: 'grab',
      name: 'GrabRewards Points',
      category: 'RIDE',
      pointsName: 'GrabPoints',
      pointsBalance: 6150,
      rateToRM: 0.8, // 100 Grab pts = RM 0.80
      iconBg: 'bg-green-600',
      iconText: 'Grab Pts',
      accountRef: '017-0997196',
      isConnected: true,
    },
    {
      id: 'shopee',
      name: 'Shopee Coins Hub',
      category: 'SHOPPING',
      pointsName: 'Shopee Coins',
      pointsBalance: 2400,
      rateToRM: 1.0, // 100 coins = RM 1.00
      iconBg: 'bg-orange-600',
      iconText: 'Shopee Coin',
      accountRef: 'razif_nasadef',
      isConnected: true,
    },
    {
      id: 'sunway',
      name: 'Sunway Pals Loyalty',
      category: 'SHOPPING',
      pointsName: 'Pals Points',
      pointsBalance: 1800,
      rateToRM: 1.0,
      iconBg: 'bg-rose-600',
      iconText: 'Sunway Pals',
      accountRef: 'PALS-99182',
      isConnected: false,
    },
    {
      id: 'airasia',
      name: 'AirAsia BIG Rewards',
      category: 'TRAVEL',
      pointsName: 'BIG Points',
      pointsBalance: 5000,
      rateToRM: 0.5,
      iconBg: 'bg-red-600',
      iconText: 'BIG Pts',
      accountRef: 'BIG-882194',
      isConnected: true,
    },
  ]);

  // Handle Add New Card
  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardNumber.trim() || newCardNumber.replace(/\s+/g, '').length < 16) {
      alert('Sila masukkan nombor kad 16-digit yang sah.');
      return;
    }
    if (!newCardholder.trim()) {
      alert('Sila masukkan nama pemegang kad.');
      return;
    }

    const cleanNum = newCardNumber.replace(/\s+/g, '');
    let brand: 'VISA' | 'MASTERCARD' | 'MYDEBIT' | 'AMEX' = 'VISA';
    if (cleanNum.startsWith('5')) brand = 'MASTERCARD';
    else if (cleanNum.startsWith('4')) brand = 'VISA';
    else if (cleanNum.startsWith('9')) brand = 'MYDEBIT';

    const [m, y] = newExpiry.split('/');

    const newCard: SavedCard = {
      id: `crd_${Date.now()}`,
      type: newCardType,
      brand,
      bankName: newBankName,
      cardholderName: newCardholder.toUpperCase(),
      last4: cleanNum.slice(-4),
      expiryMonth: m || '12',
      expiryYear: y || '28',
      colorGradient:
        brand === 'VISA'
          ? 'from-blue-900 via-indigo-900 to-slate-900'
          : brand === 'MASTERCARD'
          ? 'from-amber-900 via-red-900 to-slate-900'
          : 'from-emerald-900 via-teal-900 to-slate-900',
      isDefault: cards.length === 0,
    };

    sounds.playCoinChime();
    confetti({ particleCount: 60, spread: 60 });
    setCards([newCard, ...cards]);
    setShowAddCardModal(false);
    setNewCardNumber('');
    setNewCardholder('');
    setNewExpiry('');
    setNewCvv('');
    alert(`Kad ${brand} (${newBankName}) berjaya disimpan dengan selamat (Penyulitan PCI-DSS).`);
  };

  // Handle NFC Tap TNG Card
  const handleScanNFC = () => {
    sounds.playClick();
    setIsScanningNFC(true);
    setTimeout(() => {
      setIsScanningNFC(false);
      sounds.playCoinChime();
      alert(`NFC Berjaya Dikesan! Kad Touch 'n Go (${tngCardNumber}) Baki Semasa: RM ${tngCardBalanceMYR.toFixed(2)}`);
    }, 1500);
  };

  // Reload TNG Card from Wallet
  const handleReloadTngFromWallet = () => {
    const amt = parseFloat(nfcReloadAmount) || 0;
    const cents = Math.round(amt * 100);
    if (cents <= 0) {
      alert('Sila masukkan jumlah tambah nilai yang sah.');
      return;
    }
    if (cents > user.cashBalanceCents) {
      alert(`Baki tunai wallet anda (RM ${(user.cashBalanceCents / 100).toFixed(2)}) tidak mencukupi.`);
      return;
    }

    sounds.playCoinChime();
    confetti({ particleCount: 70, spread: 70 });
    setTngCardBalanceMYR((b) => b + amt);
    onUpdateBalances(
      -cents,
      0,
      "Tambah Nilai Kad Touch 'n Go NFC",
      `Pindahan RM ${amt.toFixed(2)} dari baki tunai ke Kad TNG ${tngCardNumber}`
    );
    alert(`Berjaya! Baki kad TNG kini RM ${(tngCardBalanceMYR + amt).toFixed(2)}.`);
  };

  // Convert Loyalty Points to Wallet Cash or Coins
  const handleConvertPoints = (program: LoyaltyAccount, target: 'CASH' | 'COINS') => {
    if (program.pointsBalance <= 0) {
      alert('Baki mata ganjaran tidak mencukupi untuk ditebus.');
      return;
    }

    const valueRM = (program.pointsBalance / 100) * program.rateToRM;
    const centsGained = Math.round(valueRM * 100);
    // Rate: 100,000 Coin = RM 1.00 -> 1 RM = 100,000 coins
    const coinsGained = Math.round(valueRM * 100000);

    sounds.playCoinChime();
    confetti({ particleCount: 90, spread: 80 });

    if (target === 'CASH') {
      onUpdateBalances(
        centsGained,
        0,
        `Tebus Mata Ganjaran: ${program.name}`,
        `Tukar ${program.pointsBalance.toLocaleString()} ${program.pointsName} kepada RM ${valueRM.toFixed(2)} tunai.`
      );
      alert(`Tahniah! ${program.pointsBalance.toLocaleString()} ${program.pointsName} ditukar kepada RM ${valueRM.toFixed(2)} baki tunai.`);
    } else {
      onUpdateBalances(
        0,
        coinsGained,
        `Tebus Mata Ganjaran ke Coin: ${program.name}`,
        `Tukar ${program.pointsBalance.toLocaleString()} ${program.pointsName} kepada ${coinsGained.toLocaleString()} Coin (100k=RM1).`
      );
      alert(`Tahniah! ${program.pointsBalance.toLocaleString()} ${program.pointsName} ditukar kepada ${coinsGained.toLocaleString()} Coin!`);
    }

    // Reset points
    setLoyaltyPrograms((prev) =>
      prev.map((p) => (p.id === program.id ? { ...p, pointsBalance: 0 } : p))
    );
    if (program.id === 'setel') {
      setMesraPoints(0);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      {/* Top Header Card */}
      <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold mb-2">
            <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
            Integrasi Kad Bank, TNG NFC, Setel & Mata Ganjaran
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Kad Bank & Hab Mata Ganjaran Malaysia
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Hubungkan Kad Debit/Kredit, imbas Kad Touch &apos;n Go NFC, pautkan akaun Petronas Setel, dan tebus semua mata ganjaran (Mesra, BonusLink, GrabRewards, Shopee Coins) kepada tunai atau coin.
          </p>
        </div>

        {/* Total Points Worth Badge */}
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-right w-full md:w-auto">
          <span className="text-[10px] text-amber-400 block font-bold uppercase">
            Jumlah Mata Ganjaran Terkumpul:
          </span>
          <span className="text-2xl font-black text-amber-300 font-mono tabular-nums">
            {loyaltyPrograms.reduce((acc, p) => acc + p.pointsBalance, 0).toLocaleString()} PTS
          </span>
          <span className="text-[11px] text-emerald-400 font-bold block mt-0.5">
            Nilai Penebusan: ≈ RM{' '}
            {loyaltyPrograms
              .reduce((acc, p) => acc + (p.pointsBalance / 100) * p.rateToRM, 0)
              .toFixed(2)}
          </span>
        </div>
      </div>

      {/* Sub Tabs: Cards vs TNG NFC vs Setel vs Loyalty Hub */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold shadow-lg">
        <button
          onClick={() => {
            sounds.playClick();
            setActiveSubTab('CARDS');
          }}
          className={`py-3 rounded-xl transition flex items-center justify-center gap-2 ${
            activeSubTab === 'CARDS'
              ? 'bg-blue-600 text-white shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Kad Debit & Kredit</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveSubTab('TNG_NFC');
          }}
          className={`py-3 rounded-xl transition flex items-center justify-center gap-2 ${
            activeSubTab === 'TNG_NFC'
              ? 'bg-sky-600 text-white shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Wifi className="w-4 h-4" />
          <span>Kad TNG NFC</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveSubTab('SETEL');
          }}
          className={`py-3 rounded-xl transition flex items-center justify-center gap-2 ${
            activeSubTab === 'SETEL'
              ? 'bg-emerald-600 text-white shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Fuel className="w-4 h-4" />
          <span>Setel & Mesra</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveSubTab('LOYALTY');
          }}
          className={`py-3 rounded-xl transition flex items-center justify-center gap-2 ${
            activeSubTab === 'LOYALTY'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Hab Bonus & Point</span>
        </button>
      </div>

      {/* 1. DEBIT & CREDIT CARDS SECTION */}
      {activeSubTab === 'CARDS' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-400" />
              <span>Kad Bank Anda Terpaut ({cards.length})</span>
            </h3>
            <button
              onClick={() => {
                sounds.playClick();
                setShowAddCardModal(true);
              }}
              className="btn-3d btn-3d-primary px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>+ Pautkan Kad Baharu</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cards.map((c) => (
              <div
                key={c.id}
                className={`relative p-6 rounded-3xl bg-gradient-to-br ${c.colorGradient} text-white shadow-2xl border border-white/20 overflow-hidden transform hover:-translate-y-1 transition-all duration-300 group`}
              >
                {/* Chip & Wireless Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    {/* Metallic Chip */}
                    <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-yellow-300 via-amber-400 to-yellow-200 border border-yellow-500 shadow-inner flex items-center justify-center">
                      <div className="w-7 h-4 border border-amber-600/60 rounded-sm" />
                    </div>
                    <Wifi className="w-5 h-5 text-white/60 rotate-90" />
                  </div>
                  <span className="font-black text-sm tracking-wider uppercase opacity-90">
                    {c.bankName}
                  </span>
                </div>

                {/* Card Number */}
                <div className="my-4 font-mono text-lg font-black tracking-widest text-slate-100">
                  •••• •••• •••• {c.last4}
                </div>

                {/* Bottom Row */}
                <div className="flex items-end justify-between pt-2 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-[9px] text-white/60 block uppercase font-bold">PEMEGANG KAD</span>
                    <span className="font-extrabold tracking-wider">{c.cardholderName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-white/60 block uppercase font-bold">LUPUT</span>
                    <span className="font-extrabold font-mono">{c.expiryMonth}/{c.expiryYear}</span>
                  </div>
                  <div className="font-black text-base italic tracking-tight">{c.brand}</div>
                </div>

                {/* Badge if default */}
                {c.isDefault && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 text-[9px] font-black uppercase">
                    Kad Utama
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* PCI-DSS Security Guarantee */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              Pematuhan Standard Keselamatan Antarabangsa PCI-DSS Level 1 & 3D Secure
            </span>
            <span className="text-[11px]">Enkripsi 256-bit AES</span>
          </div>
        </div>
      )}

      {/* 2. TOUCH 'N GO NFC SECTION */}
      {activeSubTab === 'TNG_NFC' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Wifi className="w-5 h-5 text-sky-400" />
                <span>Kad Touch &apos;n Go Enhanced NFC</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Imbas cip NFC kad Touch &apos;n Go fizikal di bahagian belakang peranti telefon pintar anda.
              </p>
            </div>
            <button
              onClick={handleScanNFC}
              disabled={isScanningNFC}
              className="btn-3d btn-3d-primary px-4 py-2.5 rounded-2xl text-xs font-bold text-white flex items-center gap-2 shadow"
            >
              <RefreshCw className={`w-4 h-4 ${isScanningNFC ? 'animate-spin' : ''}`} />
              <span>{isScanningNFC ? 'Mengimbas Kad NFC...' : 'Imbas Kad NFC Sekarang'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Visual 3D TNG Card Mock */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-700 via-sky-600 to-indigo-900 text-white shadow-2xl border border-sky-400/30 space-y-5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black tracking-widest uppercase">Touch &apos;n Go Enhanced NFC</span>
                <Wifi className="w-6 h-6 text-yellow-300" />
              </div>
              <div className="my-4 font-mono font-black text-xl tracking-wider text-yellow-200">
                {tngCardNumber}
              </div>
              <div className="flex items-end justify-between pt-3 border-t border-white/20">
                <div>
                  <span className="text-[10px] text-blue-200 block font-bold">BAKI KAD FIZIKAL</span>
                  <span className="text-2xl font-black tabular-nums text-white">
                    RM {tngCardBalanceMYR.toFixed(2)}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-white/20 text-xs font-bold text-yellow-300">
                  NFC Aktif
                </span>
              </div>
            </div>

            {/* Direct Wallet Reload Form */}
            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-4">
              <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">
                Tambah Nilai Kad TNG dari Baki Tunai Wallet
              </h4>
              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-bold">Pilih Jumlah Tambah Nilai (RM):</label>
                <div className="grid grid-cols-4 gap-2">
                  {['10', '20', '50', '100'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setNfcReloadAmount(amt)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        nfcReloadAmount === amt
                          ? 'bg-sky-500 text-white border-sky-400 font-black'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      RM {amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-slate-800 text-xs flex items-center justify-between">
                <span className="text-slate-400">Baki Tunai Wallet Anda:</span>
                <span className="font-bold text-blue-400 font-mono">RM {(user.cashBalanceCents / 100).toFixed(2)}</span>
              </div>

              <button
                type="button"
                onClick={handleReloadTngFromWallet}
                className="w-full btn-3d btn-3d-primary py-3 rounded-xl text-xs font-black text-white flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-yellow-300" />
                <span>Pindahkan RM {nfcReloadAmount} ke Kad TNG NFC</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. SETEL & PETRONAS MESRA SECTION */}
      {activeSubTab === 'SETEL' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-xl shadow">
                ⛽
              </div>
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>Petronas Setel & Mata Ganjaran Mesra</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                    Terhubung
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  No Akaun Setel Paut: <span className="font-mono text-white">{setelPhone}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                alert('Akaun Setel anda telah disahkan dan diselaraskan secara automatik.');
              }}
              className="btn-3d btn-3d-subtle px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kemaskini Status</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Mesra Points Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/70 via-slate-900 to-emerald-950/70 border border-emerald-500/40 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-emerald-400 uppercase">Mata Mesra Petronas</span>
                <span className="text-xs font-bold text-slate-400">100 Pts = RM 1.00</span>
              </div>
              <div>
                <div className="text-3xl font-black text-white font-mono tabular-nums">
                  {mesraPoints.toLocaleString()} <span className="text-xs font-bold text-emerald-400">MATA</span>
                </div>
                <span className="text-xs text-emerald-300 font-semibold">
                  Nilai Tunai: ≈ RM {(mesraPoints / 100).toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-500/20">
                <button
                  type="button"
                  onClick={() => {
                    const prog = loyaltyPrograms.find((p) => p.id === 'setel');
                    if (prog) handleConvertPoints(prog, 'CASH');
                  }}
                  className="btn-3d btn-3d-primary py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Tukar ke Tunai</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const prog = loyaltyPrograms.find((p) => p.id === 'setel');
                    if (prog) handleConvertPoints(prog, 'COINS');
                  }}
                  className="btn-3d btn-3d-gold py-2.5 rounded-xl text-xs font-bold text-slate-950 flex items-center justify-center gap-1.5"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>Tukar ke Coins</span>
                </button>
              </div>
            </div>

            {/* Setel Fuel Cashback */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-950/70 via-slate-900 to-teal-950/70 border border-teal-500/40 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-teal-400 uppercase">Pulangan Tunai Petrol (Cashback)</span>
                <span className="text-xs font-bold text-emerald-400">Siap Dituntut</span>
              </div>
              <div>
                <div className="text-3xl font-black text-teal-300 font-mono tabular-nums">
                  RM {setelCashbackMYR.toFixed(2)}
                </div>
                <span className="text-xs text-slate-400 font-semibold">
                  Ganjaran daripada pembelian minyak Petronas Primax
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  sounds.playCoinChime();
                  confetti({ particleCount: 70, spread: 60 });
                  const cents = Math.round(setelCashbackMYR * 100);
                  onUpdateBalances(
                    cents,
                    0,
                    'Tuntutan Cashback Setel',
                    `Tuntut RM ${setelCashbackMYR.toFixed(2)} pulangan tunai Petronas Setel.`
                  );
                  setSetelCashbackMYR(0);
                  alert(`Berjaya! RM ${setelCashbackMYR.toFixed(2)} telah dikreditkan ke baki tunai anda.`);
                }}
                disabled={setelCashbackMYR <= 0}
                className="w-full btn-3d btn-3d-primary py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Pindahkan Cashback RM {setelCashbackMYR.toFixed(2)} ke Baki Wallet</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. UNIFIED LOYALTY POINTS HUB SECTION */}
      {activeSubTab === 'LOYALTY' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Hab Mata Ganjaran & Bonus Malaysia</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tukar mata ganjaran daripada pelbagai jenama terkemuka terus kepada baki tunai atau coin slot.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loyaltyPrograms.map((prog) => {
              const valueRM = ((prog.pointsBalance / 100) * prog.rateToRM).toFixed(2);
              const coinsValue = Math.round(parseFloat(valueRM) * 100000);
              return (
                <div
                  key={prog.id}
                  className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3.5 hover:border-slate-600 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`px-2 py-1 rounded-lg ${prog.iconBg} text-white font-black text-xs`}>
                        {prog.iconText}
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                        prog.isConnected
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {prog.isConnected ? 'Terhubung' : 'Belum Paut'}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-white">{prog.name}</h4>
                    <span className="text-[11px] text-slate-400">ID / Tel: {prog.accountRef}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-slate-800 flex justify-between items-center font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block">Baki Mata:</span>
                      <span className="text-lg font-black text-amber-300 tabular-nums">
                        {prog.pointsBalance.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-sans block">Nilai Tunai:</span>
                      <span className="text-sm font-extrabold text-emerald-400 tabular-nums">
                        ≈ RM {valueRM}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleConvertPoints(prog, 'CASH')}
                      disabled={prog.pointsBalance <= 0}
                      className="btn-3d btn-3d-primary py-2 rounded-xl text-[11px] font-bold text-white flex items-center justify-center gap-1 disabled:opacity-40"
                    >
                      <Wallet className="w-3 h-3" />
                      <span>Tukar RM</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConvertPoints(prog, 'COINS')}
                      disabled={prog.pointsBalance <= 0}
                      className="btn-3d btn-3d-gold py-2 rounded-xl text-[11px] font-bold text-slate-950 flex items-center justify-center gap-1 disabled:opacity-40"
                    >
                      <Coins className="w-3 h-3" />
                      <span>Tukar Coins</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                <span>Pautkan Kad Debit / Kredit Baharu</span>
              </h3>
              <button
                onClick={() => setShowAddCardModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCardSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Jenis Kad:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCardType('DEBIT')}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      newCardType === 'DEBIT'
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Kad Debit (MyDebit / Visa)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCardType('CREDIT')}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      newCardType === 'CREDIT'
                        ? 'bg-purple-600 text-white border-purple-500'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Kad Kredit
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Nama Bank Pengeluar:</label>
                <select
                  value={newBankName}
                  onChange={(e) => setNewBankName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-xs focus:outline-none"
                >
                  <option value="Maybank">Maybank</option>
                  <option value="CIMB Bank">CIMB Bank</option>
                  <option value="Public Bank">Public Bank</option>
                  <option value="RHB Bank">RHB Bank</option>
                  <option value="Hong Leong Bank">Hong Leong Bank</option>
                  <option value="AmBank">AmBank</option>
                  <option value="Bank Islam">Bank Islam</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Nombor Kad (16 Digit):</label>
                <input
                  type="text"
                  maxLength={19}
                  value={newCardNumber}
                  onChange={(e) => setNewCardNumber(e.target.value)}
                  placeholder="4242 •••• •••• 4242"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Nama Pemegang Kad:</label>
                <input
                  type="text"
                  value={newCardholder}
                  onChange={(e) => setNewCardholder(e.target.value)}
                  placeholder="AHMAD RAZIF"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Tarikh Luput (MM/YY):</label>
                  <input
                    type="text"
                    maxLength={5}
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    placeholder="12/29"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">CVV (3 Digit):</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={newCvv}
                    onChange={(e) => setNewCvv(e.target.value)}
                    placeholder="•••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Data kad disulitkan dan dilindungi dengan protokol keselamatan 3D Secure.</span>
              </div>

              <button
                type="submit"
                className="w-full btn-3d btn-3d-primary py-3 rounded-xl font-black text-xs text-white"
              >
                Sahkan & Simpan Kad Bank
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
