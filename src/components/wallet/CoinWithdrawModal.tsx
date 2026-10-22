import React, { useState } from 'react';
import { sounds } from '../../utils/audio';
import confetti from 'canvas-confetti';
import {
  X,
  Coins,
  ArrowRightLeft,
  Wallet,
  Building2,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface CoinWithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewardCoins: number;
  cashBalanceCents: number;
  onConvertCoinsToCash: (
    coins: number,
    destination: 'WALLET_CASH' | 'CIMB' | 'TNG',
    accountDetails?: string
  ) => void;
  onConvertCashToCoins: (cents: number) => void;
  isDark?: boolean;
}

export const CoinWithdrawModal: React.FC<CoinWithdrawModalProps> = ({
  isOpen,
  onClose,
  rewardCoins,
  cashBalanceCents,
  onConvertCoinsToCash,
  onConvertCashToCoins,
  isDark = true,
}) => {
  const [activeTab, setActiveTab] = useState<'WITHDRAW' | 'DEPOSIT'>('WITHDRAW');
  const [selectedPreset, setSelectedPreset] = useState<number>(100000);
  const [customCoins, setCustomCoins] = useState<string>('100000');
  const [destination, setDestination] = useState<'WALLET_CASH' | 'CIMB' | 'TNG'>('WALLET_CASH');
  const [bankAccount, setBankAccount] = useState<string>('7016657934');
  const [tngPhone, setTngPhone] = useState<string>('170997196374');
  const [depositAmountMYR, setDepositAmountMYR] = useState<number>(10);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Rate: 100,000 Coins = RM 1.00
  // In cents: (coins / 100,000) * 100 = coins / 1,000
  const coinsToProcess = parseInt(customCoins, 10) || 0;
  const calculatedRM = (coinsToProcess / 100000).toFixed(2);
  const calculatedCents = Math.floor(coinsToProcess / 1000);

  // Available cash balance in RM
  const availableCashMYR = (cashBalanceCents / 100).toFixed(2);
  const coinsForDeposit = depositAmountMYR * 100000;

  const handleSelectPreset = (coins: number) => {
    sounds.playClick();
    setSelectedPreset(coins);
    setCustomCoins(coins.toString());
  };

  const handleExecuteWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (coinsToProcess <= 0) {
      alert('Sila masukkan jumlah coin yang sah.');
      return;
    }
    if (coinsToProcess > rewardCoins) {
      alert(`Baki coin tidak mencukupi! Anda mempunyai ${rewardCoins.toLocaleString()} Coin.`);
      return;
    }
    if (coinsToProcess < 10000) {
      alert('Had minimum penukaran adalah 10,000 Coin (RM 0.10).');
      return;
    }

    sounds.playCoinChime();
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });

    let accountDetail = 'Baki Tunai CoinPay Wallet';
    if (destination === 'CIMB') {
      accountDetail = `CIMB Bank: ${bankAccount}`;
    } else if (destination === 'TNG') {
      accountDetail = `TNG DuitNow: ${tngPhone}`;
    }

    onConvertCoinsToCash(coinsToProcess, destination, accountDetail);
    setSuccessMessage(
      `Berjaya! ${coinsToProcess.toLocaleString()} Coin telah ditukarkan kepada RM ${calculatedRM} (${accountDetail}).`
    );

    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 2400);
  };

  const handleExecuteDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const centsRequired = Math.round(depositAmountMYR * 100);
    if (centsRequired <= 0) {
      alert('Sila masukkan jumlah RM yang sah.');
      return;
    }
    if (centsRequired > cashBalanceCents) {
      alert(`Baki tunai tidak mencukupi! Baki anda: RM ${availableCashMYR}`);
      return;
    }

    sounds.playCoinChime();
    confetti({ particleCount: 70, spread: 60 });

    onConvertCashToCoins(centsRequired);
    setSuccessMessage(
      `Berjaya! RM ${depositAmountMYR.toFixed(2)} ditukar kepada ${coinsForDeposit.toLocaleString()} Coin untuk kredit slot game.`
    );

    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border transition-all ${
          isDark
            ? 'bg-slate-900 border-slate-700/80 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header with Gold/Coin Accents */}
        <div className="relative p-5 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 text-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-950/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
              <Coins className="w-6 h-6 text-slate-950 animate-bounce" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight flex items-center gap-1.5">
                <span>Tukar & Withdraw Coin Sebenar</span>
                <Sparkles className="w-4 h-4 text-yellow-200" />
              </h3>
              <p className="text-xs font-bold text-slate-900/80">
                Kadar Tetap Rasmi: <span className="underline">100,000 Coin = RM 1.00 Tunai</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-950/20 hover:bg-slate-950/40 text-slate-950 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Withdraw vs Buy Coins */}
        <div className="grid grid-cols-2 p-2 border-b border-slate-800 bg-slate-950/40 text-xs font-bold">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('WITHDRAW');
            }}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'WITHDRAW'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Withdraw Coin ke Duit (RM)</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('DEPOSIT');
            }}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'DEPOSIT'
                ? 'bg-blue-600 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Tambah Coin Guna Duit (RM)</span>
          </button>
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="p-4 mx-4 mt-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 animate-pulse">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <span className="text-xs font-bold">{successMessage}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-5 max-h-[80vh] overflow-y-auto space-y-4">
          {/* User Balances Summary Card */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
              <span className="text-[11px] text-amber-300 font-bold flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" />
                Baki Coin Sebenar
              </span>
              <p className="text-xl font-black text-amber-400 mt-1 tabular-nums">
                {rewardCoins.toLocaleString()}
              </p>
              <span className="text-[10px] text-amber-200/70 font-semibold">
                Nilai Tunai: ≈ RM {(rewardCoins / 100000).toFixed(2)}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30">
              <span className="text-[11px] text-blue-300 font-bold flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5" />
                Baki Tunai Wallet
              </span>
              <p className="text-xl font-black text-blue-400 mt-1 tabular-nums">
                RM {availableCashMYR}
              </p>
              <span className="text-[10px] text-blue-200/70 font-semibold">
                Setara: {(cashBalanceCents * 1000).toLocaleString()} Coin
              </span>
            </div>
          </div>

          {activeTab === 'WITHDRAW' ? (
            <form onSubmit={handleExecuteWithdraw} className="space-y-4">
              {/* Presets */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-2 block flex items-center justify-between">
                  <span>Pilih Jumlah Coin untuk Dikeluarkan:</span>
                  <span className="text-[11px] text-amber-400 font-extrabold">100,000 Coin = RM 1.00</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { coins: 100000, rm: 'RM 1.00' },
                    { coins: 500000, rm: 'RM 5.00' },
                    { coins: 1000000, rm: 'RM 10.00' },
                    { coins: 2000000, rm: 'RM 20.00' },
                    { coins: 5000000, rm: 'RM 50.00' },
                    { coins: 10000000, rm: 'RM 100.00' },
                  ].map((preset) => (
                    <button
                      type="button"
                      key={preset.coins}
                      onClick={() => handleSelectPreset(preset.coins)}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        selectedPreset === preset.coins && customCoins === preset.coins.toString()
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-black ring-1 ring-amber-400'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-xs font-bold">{preset.coins.toLocaleString()}</div>
                      <div className="text-[11px] text-emerald-400 font-extrabold">{preset.rm}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Coin Input */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 block">
                  Atau Masukkan Jumlah Coin Tersuai:
                </label>
                <div className="relative">
                  <Coins className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
                  <input
                    type="number"
                    min="10000"
                    step="1000"
                    value={customCoins}
                    onChange={(e) => {
                      setCustomCoins(e.target.value);
                      setSelectedPreset(parseInt(e.target.value, 10) || 0);
                    }}
                    placeholder="Contoh: 100000"
                    className="w-full pl-11 pr-24 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white font-extrabold text-sm focus:outline-none focus:border-amber-400"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-amber-300">
                    COIN
                  </div>
                </div>
              </div>

              {/* Calculation Preview Pill */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border border-emerald-500/40 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    Duit Sebenar Yang Akan Diterima:
                  </span>
                  <p className="text-2xl font-black text-emerald-300 tabular-nums">
                    RM {calculatedRM}
                  </p>
                </div>
                <div className="text-right text-[11px] text-slate-400 font-medium">
                  <div>Kadar: 100k Coin = RM1</div>
                  <div className="text-emerald-400 font-bold">Tanpa Caj Tersembunyi (0% Fee)</div>
                </div>
              </div>

              {/* Destination Selector */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-2 block">
                  Pilih Saluran Penerimaan Tunai:
                </label>
                <div className="space-y-2">
                  <label
                    className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition ${
                      destination === 'WALLET_CASH'
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-800/50 border-slate-700 text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="destination"
                      value="WALLET_CASH"
                      checked={destination === 'WALLET_CASH'}
                      onChange={() => setDestination('WALLET_CASH')}
                      className="accent-blue-500"
                    />
                    <Wallet className="w-5 h-5 text-blue-400" />
                    <div className="flex-1">
                      <div className="text-xs font-bold">Kredit Terus ke Baki Tunai Wallet (Serta-Merta)</div>
                      <div className="text-[11px] text-slate-400">
                        Boleh digunakan untuk bayaran bil, imbas QR, pindahan tunai
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition ${
                      destination === 'CIMB'
                        ? 'bg-rose-600/20 border-rose-500 text-white'
                        : 'bg-slate-800/50 border-slate-700 text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="destination"
                      value="CIMB"
                      checked={destination === 'CIMB'}
                      onChange={() => setDestination('CIMB')}
                      className="accent-rose-500"
                    />
                    <Building2 className="w-5 h-5 text-rose-400" />
                    <div className="flex-1">
                      <div className="text-xs font-bold">Pindahan Akaun Bank CIMB Malaysia</div>
                      <div className="text-[11px] text-slate-400">
                        Akaun Rasmi: <span className="font-mono text-white">7016657934</span>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition ${
                      destination === 'TNG'
                        ? 'bg-sky-600/20 border-sky-500 text-white'
                        : 'bg-slate-800/50 border-slate-700 text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="destination"
                      value="TNG"
                      checked={destination === 'TNG'}
                      onChange={() => setDestination('TNG')}
                      className="accent-sky-500"
                    />
                    <Smartphone className="w-5 h-5 text-sky-400" />
                    <div className="flex-1">
                      <div className="text-xs font-bold">Pindahan TNG DuitNow E-Wallet</div>
                      <div className="text-[11px] text-slate-400">
                        No DuitNow: <span className="font-mono text-white">170997196374</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={coinsToProcess <= 0 || coinsToProcess > rewardCoins}
                className={`w-full py-3.5 rounded-2xl font-black text-sm tracking-wide shadow-lg transition flex items-center justify-center gap-2 btn-3d ${
                  coinsToProcess > 0 && coinsToProcess <= rewardCoins
                    ? 'btn-3d-gold text-slate-950'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
                }`}
              >
                <Coins className="w-4 h-4 text-slate-950" />
                <span>
                  Sahkan Pengeluaran Tunai RM {calculatedRM} (
                  {coinsToProcess.toLocaleString()} Coin)
                </span>
              </button>
            </form>
          ) : (
            /* DEPOSIT TAB: Buy Coins using cash balance */
            <form onSubmit={handleExecuteDeposit} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-blue-900/30 border border-blue-500/40 text-blue-200 text-xs">
                <p className="font-bold">
                  Beli kredit coin sebenar untuk bermain slot game mega888:
                </p>
                <p className="text-[11px] text-blue-300/80 mt-0.5">
                  Setiap RM 1.00 dari tunai wallet anda akan memberikan 100,000 Coin secara automatik.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-2 block">
                  Pilih Pakej Tambah Coin:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { rm: 5, coins: '500,000' },
                    { rm: 10, coins: '1,000,000' },
                    { rm: 20, coins: '2,000,000' },
                    { rm: 50, coins: '5,000,000' },
                    { rm: 100, coins: '10,000,000' },
                    { rm: 200, coins: '20,000,000' },
                  ].map((pkg) => (
                    <button
                      type="button"
                      key={pkg.rm}
                      onClick={() => {
                        sounds.playClick();
                        setDepositAmountMYR(pkg.rm);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        depositAmountMYR === pkg.rm
                          ? 'bg-blue-600/30 border-blue-400 text-blue-300 font-black ring-1 ring-blue-400'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-xs font-extrabold text-white">RM {pkg.rm}</div>
                      <div className="text-[10px] text-amber-400 font-bold">{pkg.coins} Coin</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold">Coin Diperoleh:</span>
                  <p className="text-2xl font-black text-amber-400 tabular-nums">
                    {coinsForDeposit.toLocaleString()} Coin
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 font-semibold">Ditolak Dari Tunai:</span>
                  <p className="text-lg font-bold text-rose-400 tabular-nums">
                    -RM {depositAmountMYR.toFixed(2)}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={depositAmountMYR * 100 > cashBalanceCents}
                className={`w-full py-3.5 rounded-2xl font-black text-sm tracking-wide shadow-lg transition flex items-center justify-center gap-2 btn-3d ${
                  depositAmountMYR * 100 <= cashBalanceCents
                    ? 'btn-3d-primary text-white'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
                }`}
              >
                <Zap className="w-4 h-4 text-white" />
                <span>
                  Beli {coinsForDeposit.toLocaleString()} Coin (Tolak RM {depositAmountMYR.toFixed(2)})
                </span>
              </button>
            </form>
          )}

          {/* Security & Audit footer banner */}
          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Audit Lejar Terkawal
            </span>
            <span>Kadar Rasmi: 100,000 Coin / RM 1.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};
