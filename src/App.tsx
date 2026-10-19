import React, { useState, useEffect } from 'react';
import { AppLogo } from './components/AppLogo';
import { WatermarkFooter, WatermarkBadge } from './components/WatermarkFooter';
import { AutoDownloadModal } from './components/AutoDownloadModal';
import { AuthModal } from './components/auth/AuthModal';
import { AIChatDrawer } from './components/AIChatDrawer';
import { WalletHomeView } from './components/wallet/WalletHomeView';
import { TopUpView } from './components/wallet/TopUpView';
import { SnowPlow3DGame } from './components/games/SnowPlow3DGame';
import { SniperOps3DGame } from './components/games/SniperOps3DGame';
import { ArcadeSlotCollection } from './components/games/ArcadeSlotCollection';
import { CandyPopGame } from './components/games/CandyPopGame';
import { BlockDropGame } from './components/games/BlockDropGame';
import { CyberTennisGame } from './components/games/CyberTennisGame';
import { PianoTapGame } from './components/games/PianoTapGame';
import { LiveStreamView } from './components/live/LiveStreamView';
import { DramaMovieView } from './components/drama/DramaMovieView';
import { RewardsCenterView } from './components/rewards/RewardsCenterView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { UserProfile, LedgerEntry, TopupRequest, Mission, Voucher } from './types';
import { sounds } from './utils/audio';
import {
  Home,
  Wallet,
  PlusCircle,
  Gamepad2,
  Gift,
  User,
  Shield,
  Sun,
  Moon,
  QrCode,
  Sparkles,
  Zap,
  CheckCircle,
  Download,
  Coins,
  Tv,
  Film,
  Target,
  Radio,
} from 'lucide-react';

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<
    'home' | 'wallet' | 'topup' | 'games' | 'live' | 'drama' | 'rewards' | 'profile' | 'admin'
  >('home');
  const [activeGameCategory, setActiveGameCategory] = useState<
    'snowplow' | 'sniper' | 'slots' | 'candypop' | 'blockdrop' | 'tennis' | 'piano'
  >('snowplow');
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // App User State
  const [user, setUser] = useState<UserProfile>({
    id: 'usr_882194',
    name: 'Ahmad Razif',
    email: 'laptoprazif@gmail.com',
    phone: '017-0997196',
    verified: true,
    cashBalanceCents: 15000, // RM 150.00
    rewardCoins: 480,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    memberTier: 'Gold',
    joinedDate: '12 Okt 2026',
    dailyStreak: 4,
  });

  // Top Up Requests
  const [topupRequests, setTopupRequests] = useState<TopupRequest[]>([
    {
      id: 'topup_001',
      userId: 'usr_882194',
      userName: 'Ahmad Razif',
      amountMYR: 100,
      bankName: 'CIMB Bank',
      accountNumber: '7016657934',
      refNumber: '20261018CIMB99182',
      status: 'APPROVED',
      createdAt: '18 Okt 2026, 14:32',
      reviewedBy: 'Super Admin',
      reviewedAt: '18 Okt 2026, 14:38',
    },
    {
      id: 'topup_002',
      userId: 'usr_882194',
      userName: 'Ahmad Razif',
      amountMYR: 50,
      bankName: 'TNG DuitNow',
      accountNumber: '170997196374',
      refNumber: 'TNG99281726',
      status: 'UNDER_REVIEW',
      createdAt: '19 Okt 2026, 09:15',
    },
  ]);

  // Cash Ledger Entries (Immutable Audit Log)
  const [ledger, setLedger] = useState<LedgerEntry[]>([
    {
      id: 'TXN-901',
      userId: 'usr_882194',
      type: 'TOPUP',
      amountCents: 10000,
      feeCents: 0,
      status: 'APPROVED',
      timestamp: '18 Okt 2026, 14:38',
      refNumber: 'CP-20261018-99182',
      title: 'Tambah Nilai CIMB Bank',
      description: 'Pindahan disahkan ke akaun CIMB 7016657934',
      bankAccount: 'CIMB: 7016657934',
    },
    {
      id: 'TXN-902',
      userId: 'usr_882194',
      type: 'SCAN_PAY',
      amountCents: 1500,
      feeCents: 0,
      status: 'APPROVED',
      timestamp: '18 Okt 2026, 17:20',
      refNumber: 'CP-20261018-44219',
      title: 'Bayaran QR NASADEF Cafe',
      description: 'Imbas & Bayar DuitNow QR Peniaga',
      recipient: 'Merchant: NASADEF Cafe',
    },
    {
      id: 'TXN-903',
      userId: 'usr_882194',
      type: 'TRANSFER',
      amountCents: 2000,
      feeCents: 0,
      status: 'APPROVED',
      timestamp: '19 Okt 2026, 08:45',
      refNumber: 'CP-20261019-10821',
      title: 'Pindahan Wang P2P',
      description: 'Pindahan tunai ke 013-8829102',
      recipient: '013-8829102 (Faizal)',
    },
  ]);

  // Daily Missions
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: 'm1',
      title: 'Daftar Masuk Harian',
      description: 'Buka app dan tuntut bonus streak hari ke-4.',
      rewardCoins: 15,
      progress: 1,
      target: 1,
      completed: true,
      claimed: false,
      category: 'DAILY',
    },
    {
      id: 'm2',
      title: 'Bermain Snow Plow 3D',
      description: 'Bersihkan sekurang-kurangnya 10 timbunan salji.',
      rewardCoins: 25,
      progress: 8,
      target: 10,
      completed: false,
      claimed: false,
      category: 'GAME',
    },
    {
      id: 'm3',
      title: 'Putar 3 Permainan Slot Arked',
      description: 'Cuba 3 tema slot yang berlainan dalam arked.',
      rewardCoins: 30,
      progress: 2,
      target: 3,
      completed: false,
      claimed: false,
      category: 'GAME',
    },
    {
      id: 'm4',
      title: 'Lakukan Pindahan / Bayaran',
      description: 'Pindahkan dana atau imbas DuitNow QR.',
      rewardCoins: 40,
      progress: 1,
      target: 1,
      completed: true,
      claimed: true,
      category: 'WALLET',
    },
  ]);

  // Vouchers
  const [vouchers, setVouchers] = useState<Voucher[]>([
    {
      id: 'v1',
      title: 'Diskaun Bil TNB & Utiliti',
      brand: 'TNB / Syabas',
      category: 'BILL',
      discountText: 'Diskaun RM 5.00 Tunai',
      coinCost: 150,
      claimed: false,
      code: 'NASADEF-TNB-50',
      expiryDate: '31 Dis 2026',
    },
    {
      id: 'v2',
      title: 'Baucar Makanan GrabFood',
      brand: 'GrabFood',
      category: 'FOOD',
      discountText: 'Potongan RM 10.00',
      coinCost: 280,
      claimed: false,
      code: 'CP-GRAB-10OFF',
      expiryDate: '15 Nov 2026',
    },
    {
      id: 'v3',
      title: 'Tambah Nilai Prabayar Telco',
      brand: 'Maxis / Celcom / Digi',
      category: 'TELCO',
      discountText: 'Kredit Tambah Nilai RM 10',
      coinCost: 300,
      claimed: false,
      code: 'CP-TELCO-10TOPUP',
      expiryDate: '30 Nov 2026',
    },
    {
      id: 'v4',
      title: 'Pass Akses VIP Permainan 3D',
      brand: 'CoinPay Arked',
      category: 'GAME',
      discountText: 'Pengganda Salji 2x Ganda',
      coinCost: 100,
      claimed: true,
      code: 'VIP-SNOW-2X-BOOST',
      expiryDate: 'Seumur Hidup',
    },
  ]);

  // Claim Daily Check-In
  const handleClaimDailyCheckIn = () => {
    sounds.playCoinChime();
    setUser((u) => ({
      ...u,
      rewardCoins: u.rewardCoins + 15,
      dailyStreak: u.dailyStreak + 1,
    }));
    setMissions((m) =>
      m.map((item) => (item.id === 'm1' ? { ...item, claimed: true, progress: 1 } : item))
    );
    alert('Tahniah! Anda telah menerima 15 Reward Coins untuk daftar masuk harian.');
  };

  // Add Coins from mini-games
  const handleEarnCoins = (coins: number, gameTitle: string) => {
    setUser((u) => ({ ...u, rewardCoins: u.rewardCoins + coins }));
    // Update missions
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === 'm2' && gameTitle.includes('Snow Plow')) {
          const nextP = Math.min(m.progress + 3, m.target);
          return { ...m, progress: nextP, completed: nextP >= m.target };
        }
        if (m.id === 'm3' && gameTitle.includes('Slot')) {
          const nextP = Math.min(m.progress + 1, m.target);
          return { ...m, progress: nextP, completed: nextP >= m.target };
        }
        return m;
      })
    );
  };

  // Submit Topup Request
  const handleSubmitTopup = (req: Omit<TopupRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: TopupRequest = {
      ...req,
      id: `topup_${Date.now()}`,
      createdAt: new Date().toLocaleString('ms-MY', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'UNDER_REVIEW',
    };
    setTopupRequests((prev) => [newReq, ...prev]);
  };

  // Instant API Payment Credit (Google Pay, ShopeePay, GrabPay, DuitNow QR, TNG)
  const handleInstantApiCredit = (amountMYR: number, gatewayName: string, refNumber: string) => {
    const creditCents = Math.round(amountMYR * 100);
    setUser((u) => ({ ...u, cashBalanceCents: u.cashBalanceCents + creditCents }));

    const newEntry: LedgerEntry = {
      id: `TXN-${Date.now().toString().slice(-4)}`,
      userId: user.id,
      type: 'TOPUP',
      amountCents: creditCents,
      feeCents: 0,
      status: 'APPROVED',
      timestamp: new Date().toLocaleString('ms-MY'),
      refNumber,
      title: `Tambah Nilai API (${gatewayName})`,
      description: `Transaksi disahkan serta-merta melalui ${gatewayName} API gateway.`,
      bankAccount: gatewayName.includes('TNG') ? 'TNG: 170997196374' : 'CIMB: 7016657934',
    };
    setLedger((prev) => [newEntry, ...prev]);

    const newReq: TopupRequest = {
      id: `topup_api_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      amountMYR,
      bankName: gatewayName.includes('TNG') ? 'TNG DuitNow' : 'CIMB Bank',
      accountNumber: gatewayName.includes('TNG') ? '170997196374' : '7016657934',
      refNumber,
      status: 'APPROVED',
      createdAt: new Date().toLocaleString('ms-MY', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      reviewedBy: `${gatewayName} API Settlement`,
      reviewedAt: new Date().toLocaleTimeString('ms-MY'),
    };
    setTopupRequests((prev) => [newReq, ...prev]);
  };

  // Admin approves Topup -> atomically credits cash balance and writes to ledger
  const handleApproveTopup = (reqId: string, auditNote: string) => {
    const target = topupRequests.find((t) => t.id === reqId);
    if (!target) return;

    setTopupRequests((prev) =>
      prev.map((t) =>
        t.id === reqId
          ? {
              ...t,
              status: 'APPROVED',
              adminNote: auditNote,
              reviewedBy: 'Super Admin',
              reviewedAt: new Date().toLocaleTimeString('ms-MY'),
            }
          : t
      )
    );

    // Credit Cash Balance
    const creditCents = target.amountMYR * 100;
    setUser((u) => ({ ...u, cashBalanceCents: u.cashBalanceCents + creditCents }));

    // Append to immutable ledger
    const newEntry: LedgerEntry = {
      id: `TXN-${Date.now().toString().slice(-4)}`,
      userId: target.userId,
      type: 'TOPUP',
      amountCents: creditCents,
      feeCents: 0,
      status: 'APPROVED',
      timestamp: new Date().toLocaleString('ms-MY'),
      refNumber: target.refNumber,
      title: `Tambah Nilai ${target.bankName}`,
      description: `Baki disahkan & dikreditkan ke akaun.`,
      adminAuditNote: auditNote,
      bankAccount: `${target.bankName}: ${target.accountNumber}`,
    };
    setLedger((prev) => [newEntry, ...prev]);
  };

  // Admin rejects Topup
  const handleRejectTopup = (reqId: string, reason: string) => {
    setTopupRequests((prev) =>
      prev.map((t) =>
        t.id === reqId
          ? {
              ...t,
              status: 'REJECTED',
              adminNote: reason,
              reviewedBy: 'Finance Admin',
            }
          : t
      )
    );
  };

  // P2P Money Transfer
  const handleTransfer = (recipient: string, amountCents: number, note: string) => {
    setUser((u) => ({ ...u, cashBalanceCents: u.cashBalanceCents - amountCents }));

    const newEntry: LedgerEntry = {
      id: `TXN-${Date.now().toString().slice(-4)}`,
      userId: user.id,
      type: 'TRANSFER',
      amountCents,
      feeCents: 0,
      status: 'APPROVED',
      timestamp: new Date().toLocaleString('ms-MY'),
      refNumber: `CP-${Date.now().toString().slice(-8)}`,
      title: recipient.startsWith('Merchant') ? recipient : `Pindahan Tunai ke ${recipient}`,
      description: note,
      recipient,
    };
    setLedger((prev) => [newEntry, ...prev]);
  };

  // Claim Mission
  const handleClaimMission = (missionId: string) => {
    const target = missions.find((m) => m.id === missionId);
    if (!target || target.claimed) return;

    setUser((u) => ({ ...u, rewardCoins: u.rewardCoins + target.rewardCoins }));
    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, claimed: true } : m))
    );
  };

  // Redeem Voucher
  const handleRedeemVoucher = (voucherId: string) => {
    const v = vouchers.find((item) => item.id === voucherId);
    if (!v || user.rewardCoins < v.coinCost) return;

    setUser((u) => ({ ...u, rewardCoins: u.rewardCoins - v.coinCost }));
    setVouchers((prev) =>
      prev.map((item) => (item.id === voucherId ? { ...item, claimed: true } : item))
    );
  };

  // Send Live Stream Tip
  const handleSendLiveTip = (amountCents: number, giftName: string) => {
    setUser((u) => ({ ...u, cashBalanceCents: u.cashBalanceCents - amountCents }));
    const newEntry: LedgerEntry = {
      id: `TXN-${Date.now().toString().slice(-4)}`,
      userId: user.id,
      type: 'SCAN_PAY',
      amountCents,
      feeCents: 0,
      status: 'APPROVED',
      timestamp: new Date().toLocaleString('ms-MY'),
      refNumber: `LIVE-${Date.now().toString().slice(-8)}`,
      title: `Hadiah Tip Siaran Langsung (${giftName})`,
      description: `Tip saweria dihantar di saluran CoinPay Live TV.`,
      recipient: 'Penyiar Rasmi Live TV3 & Arena',
    };
    setLedger((prev) => [newEntry, ...prev]);
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Application Header */}
      <header
        className={`sticky top-0 z-30 w-full border-b backdrop-blur-md transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Brand Logo & Required Watermark Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('home');
              }}
              className="text-left"
            >
              <AppLogo size="md" />
            </button>
            <div className="hidden sm:block">
              <WatermarkBadge isDark={isDark} />
            </div>
          </div>

          {/* Quick Balance Header Pill (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs">
              <Wallet className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-400">Tunai:</span>
              <span className="font-extrabold text-blue-400 tabular-nums">
                RM {(user.cashBalanceCents / 100).toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">Coins:</span>
              <span className="font-extrabold text-amber-300 tabular-nums">
                {user.rewardCoins.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Header Controls */}
          <div className="flex items-center gap-2">
            {/* Auto Download QR Code Button */}
            <button
              onClick={() => {
                sounds.playClick();
                setIsDownloadModalOpen(true);
              }}
              className="btn-3d btn-3d-subtle px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-1.5"
              title="Auto Download & Install App"
            >
              <QrCode className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Install App</span>
            </button>

            {/* Login / Register Button (Google, ShopeePay, TNG) */}
            <button
              onClick={() => {
                sounds.playClick();
                setAuthInitialMode('login');
                setIsAuthModalOpen(true);
              }}
              className="btn-3d btn-3d-primary px-3 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-md"
              title="Log Masuk / Daftar (Google, ShopeePay, TNG)"
            >
              <div className="w-4 h-4 rounded-full overflow-hidden border border-white/40 flex-shrink-0">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <span className="hidden sm:inline">Log Masuk / Daftar</span>
              <span className="sm:hidden">Akaun</span>
            </button>

            {/* Dark UI Toggle */}
            <button
              onClick={() => {
                sounds.playClick();
                setIsDark(!isDark);
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition shadow-sm"
              title={isDark ? 'Tukar ke Mod Cerah' : 'Tukar ke Mod Gelap'}
              aria-label="Tukar Tema"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

            {/* Admin Switcher Button */}
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab(activeTab === 'admin' ? 'home' : 'admin');
              }}
              className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
                activeTab === 'admin'
                  ? 'bg-rose-600 text-white border-rose-500'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700'
              }`}
              title="Panel Pentadbir"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden lg:inline">Admin</span>
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex max-w-7xl mx-auto px-4 gap-1 border-t border-slate-800/50 py-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'home' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'wallet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Wallet & Lejar
          </button>
          <button
            onClick={() => setActiveTab('topup')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'topup' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Top Up
          </button>
          <button
            onClick={() => setActiveTab('games')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'games' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Game Center
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'live' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Live TV</span>
          </button>
          <button
            onClick={() => setActiveTab('drama')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'drama' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-purple-400" />
            <span>Drama & Filem</span>
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'rewards' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Rewards
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'profile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Profil
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 pb-24 md:pb-12">
        {/* TAB 1: Home View */}
        {activeTab === 'home' && (
          <WalletHomeView
            user={user}
            ledger={ledger}
            missions={missions}
            onNavigateTab={setActiveTab}
            onTransfer={handleTransfer}
            onClaimDailyCheckIn={handleClaimDailyCheckIn}
            isDark={isDark}
          />
        )}

        {/* TAB 2: Wallet Details */}
        {activeTab === 'wallet' && (
          <WalletHomeView
            user={user}
            ledger={ledger}
            missions={missions}
            onNavigateTab={setActiveTab}
            onTransfer={handleTransfer}
            onClaimDailyCheckIn={handleClaimDailyCheckIn}
            isDark={isDark}
          />
        )}

        {/* TAB 3: Top Up View */}
        {activeTab === 'topup' && (
          <TopUpView
            topupRequests={topupRequests}
            onSubmitTopup={handleSubmitTopup}
            onInstantApiCredit={handleInstantApiCredit}
            isDark={isDark}
          />
        )}

        {/* TAB 4: Game Center */}
        {activeTab === 'games' && (
          <div className="space-y-6">
            {/* Game Category Selector Tabs */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-bold">
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveGameCategory('snowplow');
                }}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
                  activeGameCategory === 'snowplow'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>3D Snow Plow</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveGameCategory('sniper');
                }}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
                  activeGameCategory === 'sniper'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Target className="w-4 h-4 text-red-400" />
                <span>🎯 Special Ops Sniper 3D</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveGameCategory('slots');
                }}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
                  activeGameCategory === 'slots'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>30 Slot Mega888</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveGameCategory('candypop');
                }}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
                  activeGameCategory === 'candypop'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>🍬 Candy Pop</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveGameCategory('blockdrop');
                }}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
                  activeGameCategory === 'blockdrop'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>🧱 Block Drop</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveGameCategory('tennis');
                }}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
                  activeGameCategory === 'tennis'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>🎾 Cyber Tennis 3D</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveGameCategory('piano');
                }}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
                  activeGameCategory === 'piano'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>🎹 Piano Tap</span>
              </button>
            </div>

            {/* Active Game Component */}
            {activeGameCategory === 'snowplow' && (
              <SnowPlow3DGame onEarnCoins={handleEarnCoins} isDark={isDark} />
            )}
            {activeGameCategory === 'sniper' && (
              <SniperOps3DGame onEarnCoins={handleEarnCoins} isDark={isDark} />
            )}
            {activeGameCategory === 'slots' && (
              <ArcadeSlotCollection onEarnCoins={handleEarnCoins} isDark={isDark} />
            )}
            {activeGameCategory === 'candypop' && (
              <CandyPopGame onEarnCoins={handleEarnCoins} isDark={isDark} />
            )}
            {activeGameCategory === 'blockdrop' && (
              <BlockDropGame onEarnCoins={handleEarnCoins} isDark={isDark} />
            )}
            {activeGameCategory === 'tennis' && (
              <CyberTennisGame onEarnCoins={handleEarnCoins} isDark={isDark} />
            )}
            {activeGameCategory === 'piano' && (
              <PianoTapGame onEarnCoins={handleEarnCoins} isDark={isDark} />
            )}
          </div>
        )}

        {/* TAB 5: Live Streaming & TV3 */}
        {activeTab === 'live' && (
          <LiveStreamView
            userCashCents={user.cashBalanceCents}
            userRewardCoins={user.rewardCoins}
            onSendTip={handleSendLiveTip}
            isDark={isDark}
          />
        )}

        {/* TAB 6: Drama & Filem Melayu/Korea/China */}
        {activeTab === 'drama' && (
          <DramaMovieView isDark={isDark} />
        )}

        {/* TAB 7: Rewards */}
        {activeTab === 'rewards' && (
          <RewardsCenterView
            user={user}
            missions={missions}
            vouchers={vouchers}
            onClaimMission={handleClaimMission}
            onRedeemVoucher={handleRedeemVoucher}
            isDark={isDark}
          />
        )}

        {/* TAB 6: Profile & Verification */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-3xl overflow-hidden border-2 border-blue-500 shadow-lg">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black">{user.name}</h3>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Disahkan KYC
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{user.email} • {user.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[10px] text-slate-400 block font-semibold">Baki Tunai MYR</span>
                  <span className="text-base font-black text-blue-400">
                    RM {(user.cashBalanceCents / 100).toFixed(2)}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[10px] text-slate-400 block font-semibold">Reward Coins</span>
                  <span className="text-base font-black text-amber-300">{user.rewardCoins} Coins</span>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Tarikh Pendaftaran</span>
                  <span className="font-semibold">{user.joinedDate}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Tahap Keahlian</span>
                  <span className="font-extrabold text-amber-400">{user.memberTier} VIP</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Keselamatan Akaun</span>
                  <span className="font-semibold text-emerald-400">2FA & Lejar Pelayan Aktif</span>
                </div>
              </div>

              {/* Linked SSO Services */}
              <div className="space-y-2.5 pt-3 border-t border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Akaun & Dompet Yang Disambungkan
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Google Akaun
                    </span>
                    <span className="text-[9px] font-bold text-emerald-400">Aktif</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-orange-400" />
                      ShopeePay
                    </span>
                    <span className="text-[9px] font-bold text-orange-400">Bersambung</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      Touch 'n Go
                    </span>
                    <span className="text-[9px] font-bold text-blue-400">DuitNow Sah</span>
                  </div>
                </div>
              </div>

              {/* Account Action 3D Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setAuthInitialMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="flex-1 btn-3d btn-3d-primary py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-md"
                >
                  <User className="w-4 h-4" />
                  <span>Tukar Akaun / Log Masuk Semula</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setIsLoggedIn(false);
                    setAuthInitialMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="btn-3d btn-3d-subtle py-2.5 px-4 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300"
                >
                  Log Keluar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: Admin Panel */}
        {activeTab === 'admin' && (
          <AdminDashboardView
            topupRequests={topupRequests}
            ledger={ledger}
            user={user}
            onApproveTopup={handleApproveTopup}
            onRejectTopup={handleRejectTopup}
            isDark={isDark}
          />
        )}
      </main>

      {/* Live AI Chatbot Support Drawer (Gemini API Integrated) */}
      <AIChatDrawer isDark={isDark} />

      {/* Auto Download & Install Modal */}
      <AutoDownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        isDark={isDark}
      />

      {/* Register / Login Modal with Google, ShopeePay & TNG */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(loggedUser) => {
          sounds.playWinFanfare();
          setUser(loggedUser);
          setIsLoggedIn(true);
        }}
        isDark={isDark}
        initialMode={authInitialMode}
      />

      {/* Watermark & Copyright Footer (Required on every page) */}
      <WatermarkFooter isDark={isDark} />

      {/* Mobile Bottom Responsive Navigation Bar */}
      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-30 border-t backdrop-blur-lg flex items-center justify-around py-2 px-1 transition-colors ${
          isDark ? 'bg-slate-950/95 border-slate-800 text-slate-400' : 'bg-white/95 border-slate-200 text-slate-600'
        }`}
      >
        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('home');
          }}
          className={`flex flex-col items-center gap-1 p-1.5 flex-1 ${
            activeTab === 'home' ? 'text-blue-500 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('topup');
          }}
          className={`flex flex-col items-center gap-1 p-1.5 flex-1 ${
            activeTab === 'topup' ? 'text-blue-500 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <PlusCircle className="w-5 h-5" />
          <span className="text-[10px]">Top Up</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('games');
          }}
          className={`flex flex-col items-center gap-1 p-1.5 flex-1 ${
            activeTab === 'games' ? 'text-blue-500 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <Gamepad2 className="w-5 h-5" />
          <span className="text-[10px]">Games</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('live');
          }}
          className={`flex flex-col items-center gap-1 p-1.5 flex-1 ${
            activeTab === 'live' ? 'text-blue-500 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <Radio className="w-5 h-5 text-red-500 animate-pulse" />
          <span className="text-[10px]">Live</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('drama');
          }}
          className={`flex flex-col items-center gap-1 p-1.5 flex-1 ${
            activeTab === 'drama' ? 'text-blue-500 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <Film className="w-5 h-5 text-purple-400" />
          <span className="text-[10px]">Drama</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('rewards');
          }}
          className={`flex flex-col items-center gap-1 p-1.5 flex-1 ${
            activeTab === 'rewards' ? 'text-blue-500 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <Gift className="w-5 h-5" />
          <span className="text-[10px]">Rewards</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('profile');
          }}
          className={`flex flex-col items-center gap-1 p-1.5 flex-1 ${
            activeTab === 'profile' ? 'text-blue-500 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Profil</span>
        </button>
      </nav>
    </div>
  );
}
