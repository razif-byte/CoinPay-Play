import React, { useState } from 'react';
import { UserProfile, Mission, Voucher } from '../../types';
import { sounds } from '../../utils/audio';
import confetti from 'canvas-confetti';
import {
  Coins,
  Trophy,
  Gift,
  CheckCircle,
  Sparkles,
  Ticket,
  Zap,
  ShoppingBag,
  Flame,
  Star,
  Copy,
  Check,
} from 'lucide-react';

interface RewardsCenterViewProps {
  user: UserProfile;
  missions: Mission[];
  vouchers: Voucher[];
  onClaimMission: (missionId: string) => void;
  onRedeemVoucher: (voucherId: string) => void;
  isDark: boolean;
}

export const RewardsCenterView: React.FC<RewardsCenterViewProps> = ({
  user,
  missions,
  vouchers,
  onClaimMission,
  onRedeemVoucher,
  isDark,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    sounds.playClick();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleRedeem = (voucher: Voucher) => {
    if (user.rewardCoins < voucher.coinCost) {
      alert(`Baki coin tidak mencukupi! Anda perlukan ${voucher.coinCost} coins.`);
      return;
    }
    sounds.playWinFanfare();
    confetti({ particleCount: 50, spread: 60 });
    onRedeemVoucher(voucher.id);
  };

  const handleClaim = (m: Mission) => {
    sounds.playCoinChime();
    confetti({ particleCount: 40, spread: 50 });
    onClaimMission(m.id);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Top Header Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 border border-purple-500/30 text-white shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Pusat Ganjaran & Misi CoinPay Play™
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              Tebus Baucar & Kumpul Coin Maya
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-lg leading-relaxed">
              Main mini games, selesaikan misi harian, dan gunakan Reward Coins untuk menebus kupon diskaun bil, baucar makanan dan kredit telefon.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-amber-400/40 text-center min-w-[200px] shadow-xl">
            <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wider block">
              Baki Coin Semasa
            </span>
            <div className="flex items-center justify-center gap-1.5 my-1">
              <Coins className="w-7 h-7 text-amber-400" />
              <span className="text-3xl font-black text-amber-300 tabular-nums">
                {user.rewardCoins.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block">
              Status Ahli: <strong className="text-white">{user.memberTier}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Daily Missions Section */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Misi Harian Pemain</span>
            </h3>
            <p className="text-xs text-slate-400">
              Selesaikan cabaran setiap hari untuk mendapatkan coin ganjaran automatik.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {missions.map((m) => {
            const isCompleted = m.progress >= m.target;
            return (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-4"
              >
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-white">{m.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                      +{m.rewardCoins} Coins
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{m.description}</p>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex-1 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((m.progress / m.target) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 tabular-nums">
                      {m.progress}/{m.target}
                    </span>
                  </div>
                </div>

                <div>
                  {m.claimed ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 px-3 py-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      Dituntut
                    </span>
                  ) : isCompleted ? (
                    <button
                      onClick={() => handleClaim(m)}
                      className="btn-3d btn-3d-gold py-1.5 px-4 rounded-xl text-xs font-black text-slate-950 shadow-md"
                    >
                      Tuntut
                    </button>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-500 px-2 py-1 bg-slate-800 rounded-lg">
                      Dalam Proses
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Redeemable Voucher Catalog */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-purple-400" />
            <span>Katalog Penebusan Baucar & Diskaun</span>
          </h3>
          <p className="text-xs text-slate-400">
            Tebus kupon tulen daripada rakan niaga disahkan menggunakan Reward Coins anda.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vouchers.map((v) => (
            <div
              key={v.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                v.claimed
                  ? 'bg-slate-800/40 border-slate-700/40 opacity-90'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 shadow-lg'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    {v.brand}
                  </span>
                  <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" />
                    {v.coinCost} Coins
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-1">{v.title}</h4>
                <p className="text-xs font-extrabold text-emerald-400 mb-2">{v.discountText}</p>
                <span className="text-[10px] text-slate-400 block mb-3">
                  Sah hingga: {v.expiryDate}
                </span>
              </div>

              <div>
                {v.claimed && v.code ? (
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[9px] text-slate-500 block">Kod Baucar Anda:</span>
                      <span className="font-mono font-black text-amber-300">{v.code}</span>
                    </div>
                    <button
                      onClick={() => handleCopyCode(v.code!)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      title="Salin Kod"
                    >
                      {copiedCode === v.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRedeem(v)}
                    disabled={user.rewardCoins < v.coinCost}
                    className="w-full btn-3d btn-3d-purple py-2 rounded-xl text-xs font-bold text-white disabled:opacity-40"
                  >
                    {user.rewardCoins < v.coinCost
                      ? `Kurang ${v.coinCost - user.rewardCoins} Coins`
                      : 'Tebus Sekarang'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
