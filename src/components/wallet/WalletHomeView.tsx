import React, { useState } from 'react';
import { UserProfile, LedgerEntry, Mission } from '../../types';
import { sounds } from '../../utils/audio';
import {
  Wallet,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  QrCode,
  History,
  Send,
  PlusCircle,
  Sparkles,
  Calendar,
  CheckCircle,
  Eye,
  EyeOff,
  Search,
  Filter,
  FileText,
  X,
  CreditCard,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface WalletHomeViewProps {
  user: UserProfile;
  ledger: LedgerEntry[];
  missions: Mission[];
  onNavigateTab: (tab: 'home' | 'wallet' | 'topup' | 'games' | 'rewards' | 'profile' | 'admin') => void;
  onTransfer: (recipientPhone: string, amountCents: number, note: string) => void;
  onClaimDailyCheckIn: () => void;
  isDark: boolean;
}

export const WalletHomeView: React.FC<WalletHomeViewProps> = ({
  user,
  ledger,
  missions,
  onNavigateTab,
  onTransfer,
  onClaimDailyCheckIn,
  isDark,
}) => {
  const [showBalance, setShowBalance] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<LedgerEntry | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [transferPhone, setTransferPhone] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferNote, setTransferNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredLedger = ledger.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.refNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.recipient && entry.recipient.includes(searchTerm));
    if (filterType === 'ALL') return matchesSearch;
    return matchesSearch && entry.type === filterType;
  });

  const handleSendTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const cents = Math.round(parseFloat(transferAmount) * 100);
    if (!cents || cents <= 0) {
      alert('Sila masukkan jumlah sah.');
      return;
    }
    if (cents > user.cashBalanceCents) {
      alert('Baki wang tunai tidak mencukupi.');
      return;
    }
    if (!transferPhone.trim()) {
      alert('Sila masukkan nombor telefon atau ID penerima.');
      return;
    }

    sounds.playCoinChime();
    onTransfer(transferPhone.trim(), cents, transferNote.trim() || 'Pindahan peribadi');
    setShowTransferModal(false);
    setTransferPhone('');
    setTransferAmount('');
    setTransferNote('');
  };

  const handleSimulateScanPay = () => {
    sounds.playCoinChime();
    const merchantCostCents = 1500; // RM 15.00
    if (user.cashBalanceCents < merchantCostCents) {
      alert('Baki tidak mencukupi untuk bayaran peniaga RM 15.00.');
      return;
    }
    onTransfer('Merchant: NASADEF Cafe & Store', merchantCostCents, 'Bayaran Imbas DuitNow QR Peniaga');
    setShowScanModal(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Balance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Real Cash Wallet (MYR) */}
        <div className="relative overflow-hidden rounded-3xl p-6 md:p-7 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white shadow-2xl border border-blue-400/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-blue-200">
                Baki Tunai Sebenar (Cash Wallet)
              </span>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1.5 rounded-full hover:bg-white/10 transition"
              aria-label="Papar/Sembunyi Baki"
            >
              {showBalance ? <EyeOff className="w-4 h-4 text-blue-200" /> : <Eye className="w-4 h-4 text-blue-200" />}
            </button>
          </div>

          <div className="my-3">
            <span className="text-xs font-semibold text-blue-200 block">Jumlah Baki Tersedia</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-bold text-blue-200">RM</span>
              <span className="text-4xl md:text-5xl font-black tracking-tight tabular-nums">
                {showBalance ? (user.cashBalanceCents / 100).toFixed(2) : '••••••'}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/15 flex items-center justify-between text-xs text-blue-100">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Lejar Selamat • ID: usr_{user.phone.slice(-4)}
            </span>
            <span className="font-semibold text-blue-200">
              Tier: <strong className="text-white">{user.memberTier}</strong>
            </span>
          </div>
        </div>

        {/* Card 2: Reward Coins Wallet */}
        <div className="relative overflow-hidden rounded-3xl p-6 md:p-7 bg-gradient-to-br from-amber-600 via-amber-700 to-purple-900 text-white shadow-2xl border border-amber-400/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                <Coins className="w-4 h-4 text-amber-200" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-200">
                Reward Coins Maya (Game & Misi)
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('rewards')}
              className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 transition text-white"
            >
              Pusat Ganjaran &gt;
            </button>
          </div>

          <div className="my-3">
            <span className="text-xs font-semibold text-amber-200 block">Baki Coin Terkumpul</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-4xl md:text-5xl font-black tracking-tight tabular-nums text-amber-300">
                {user.rewardCoins.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">Coins</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/15 flex items-center justify-between text-xs text-amber-100">
            <span>Maya • Boleh ditebus untuk diskaun & baucar</span>
            <span className="text-amber-200 font-semibold">Tiada tarikh luput</span>
          </div>
        </div>
      </div>

      {/* Primary Action Buttons (3D Tactile Buttons) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        {/* Button 1: Top Up */}
        <button
          onClick={() => {
            sounds.playClick();
            onNavigateTab('topup');
          }}
          className="btn-3d btn-3d-primary p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-white shadow-lg group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <PlusCircle className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xs tracking-wide">Top Up Wang</span>
          <span className="text-[10px] text-blue-200">CIMB & DuitNow</span>
        </button>

        {/* Button 2: Transfer */}
        <button
          onClick={() => {
            sounds.playClick();
            setShowTransferModal(true);
          }}
          className="btn-3d btn-3d-purple p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-white shadow-lg group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Send className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xs tracking-wide">Pindah Wang</span>
          <span className="text-[10px] text-purple-200">P2P Antara Pengguna</span>
        </button>

        {/* Button 3: Scan & Pay */}
        <button
          onClick={() => {
            sounds.playClick();
            setShowScanModal(true);
          }}
          className="btn-3d btn-3d-gold p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-950 shadow-lg group"
        >
          <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <QrCode className="w-5 h-5 text-slate-950" />
          </div>
          <span className="font-extrabold text-xs tracking-wide">Scan & Pay</span>
          <span className="text-[10px] text-amber-900 font-semibold">DuitNow QR</span>
        </button>

        {/* Button 4: Mini Games Shortcut */}
        <button
          onClick={() => {
            sounds.playClick();
            onNavigateTab('games');
          }}
          className="btn-3d btn-3d-green p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-white shadow-lg group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xs tracking-wide">Mini Games</span>
          <span className="text-[10px] text-emerald-200">30 Slot + 3D Plow</span>
        </button>
      </div>

      {/* Daily Check-In & Streak Banner */}
      <div className="p-5 md:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm text-white">Daftar Masuk Harian (Streak: {user.dailyStreak} Hari)</h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                +15 Coins
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Check-in setiap hari secara berturut-turut untuk ganjaran bonus mingguan berganda!
            </p>
          </div>
        </div>

        <button
          onClick={onClaimDailyCheckIn}
          className="w-full sm:w-auto btn-3d btn-3d-gold py-2.5 px-6 rounded-xl font-bold text-xs text-slate-950 flex-shrink-0"
        >
          Tuntut Ganjaran Hari Ini
        </button>
      </div>

      {/* Complete Transaction History Ledger Section */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <History className="w-5 h-5 text-blue-400" />
              <span>Sejarah Transaksi & Lejar Kewangan</span>
            </h3>
            <p className="text-xs text-slate-400">
              Rekod audit rasmi baki tunai e-wallet dengan resit digital terperinci.
            </p>
          </div>

          {/* Filter and Search Bar */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari rujukan/nama..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 w-36 sm:w-44"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Semua Jenis</option>
              <option value="TOPUP">Tambah Nilai</option>
              <option value="TRANSFER">Pindahan</option>
              <option value="SCAN_PAY">Bayaran QR</option>
            </select>
          </div>
        </div>

        {/* Ledger Entries List */}
        {filteredLedger.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            Tiada rekod transaksi dijumpai mengikut tapisan semasa.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filteredLedger.map((item) => {
              const isIncome = item.type === 'TOPUP' || item.type === 'GAME_REWARD';
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedReceipt(item);
                  }}
                  className="py-3.5 px-2 flex items-center justify-between hover:bg-slate-800/50 rounded-2xl transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        isIncome
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {isIncome ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="font-mono">{item.refNumber}</span>
                        <span>•</span>
                        <span>{item.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-sm font-black tabular-nums block ${
                        isIncome ? 'text-emerald-400' : 'text-slate-100'
                      }`}
                    >
                      {isIncome ? '+' : '-'} RM {(item.amountCents / 100).toFixed(2)}
                    </span>
                    <span
                      className={`inline-block text-[9px] font-bold px-2 py-0.2 rounded-full ${
                        item.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : item.status === 'UNDER_REVIEW'
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Digital Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl p-6 bg-slate-900 border border-slate-700 text-white shadow-2xl relative">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-4 border-b border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto mb-2">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black tracking-tight">Resit Digital Transaksi</h3>
              <p className="text-[11px] text-slate-400">CoinPay Play™ • Lejar Sah Pelayan</p>
            </div>

            <div className="py-4 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="font-extrabold text-emerald-400">{selectedReceipt.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Jumlah</span>
                <span className="font-black text-white text-sm">
                  RM {(selectedReceipt.amountCents / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Jenis Transaksi</span>
                <span className="font-semibold text-slate-200">{selectedReceipt.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nombor Rujukan</span>
                <span className="font-mono font-bold text-amber-300">{selectedReceipt.refNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tarikh & Masa</span>
                <span className="text-slate-200">{selectedReceipt.timestamp}</span>
              </div>
              {selectedReceipt.recipient && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Penerima</span>
                  <span className="text-slate-200 font-medium">{selectedReceipt.recipient}</span>
                </div>
              )}
              {selectedReceipt.adminAuditNote && (
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <span className="font-bold text-slate-300 block mb-0.5">Nota Audit Pentadbir:</span>
                  {selectedReceipt.adminAuditNote}
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="mt-2 w-full btn-3d btn-3d-subtle py-2.5 rounded-xl font-bold text-xs text-slate-200"
            >
              Tutup Resit
            </button>
          </div>
        </div>
      )}

      {/* Transfer Money Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleSendTransfer}
            className="w-full max-w-md rounded-3xl p-6 bg-slate-900 border border-slate-700 text-white shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setShowTransferModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black">Pindahan Baki Tunai P2P</h3>
                <p className="text-xs text-slate-400">Hantar wang segera ke akaun pengguna lain</p>
              </div>
            </div>

            <div className="space-y-3.5 mb-5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nombor Telefon / ID Penerima
                </label>
                <input
                  type="text"
                  required
                  value={transferPhone}
                  onChange={(e) => setTransferPhone(e.target.value)}
                  placeholder="Contoh: 012-3456789 atau usr_9921"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Jumlah (MYR)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    RM
                  </span>
                  <input
                    type="number"
                    min="1"
                    max={user.cashBalanceCents / 100}
                    step="0.10"
                    required
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Baki tunai semasa anda: RM {(user.cashBalanceCents / 100).toFixed(2)}
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nota Transaksi (Pilihan)</label>
                <input
                  type="text"
                  value={transferNote}
                  onChange={(e) => setTransferNote(e.target.value)}
                  placeholder="Contoh: Duit makan tengah hari"
                  className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowTransferModal(false)}
                className="w-1/2 btn-3d btn-3d-subtle py-2.5 rounded-xl text-xs font-semibold text-slate-300"
              >
                Batal
              </button>
              <button
                type="submit"
                className="w-1/2 btn-3d btn-3d-purple py-2.5 rounded-xl text-xs font-bold text-white shadow-lg"
              >
                Sahkan & Hantar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Scan & Pay Modal */}
      {showScanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl p-6 bg-slate-900 border border-slate-700 text-white shadow-2xl relative text-center">
            <button
              onClick={() => setShowScanModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black">Scan & Pay DuitNow QR</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Halakan kamera ke mana-mana kod QR DuitNow untuk membuat pembayaran pantas.
            </p>

            <div className="w-48 h-48 mx-auto my-2 rounded-2xl border-2 border-dashed border-amber-400/50 bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
              <div className="w-full h-0.5 bg-amber-400 absolute top-1/2 left-0 -translate-y-1/2 animate-pulse" />
              <QrCode className="w-20 h-20 text-slate-600" />
              <span className="text-[10px] text-slate-400 mt-2">Mencari kod QR peniaga...</span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={handleSimulateScanPay}
                className="w-full btn-3d btn-3d-gold py-2.5 rounded-xl font-bold text-xs text-slate-950"
              >
                Simulasi Imbas QR Peniaga (RM 15.00)
              </button>
              <button
                onClick={() => setShowScanModal(false)}
                className="w-full btn-3d btn-3d-subtle py-2 rounded-xl text-xs font-semibold text-slate-400"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
