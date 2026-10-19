import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';
import { Play, Sparkles, Trophy, RotateCcw, Flame, CheckCircle, Info, ChevronRight } from 'lucide-react';

interface ArcadeSlotCollectionProps {
  onEarnCoins: (coins: number, gameTitle: string) => void;
  isDark: boolean;
}

interface SlotGameTheme {
  id: number;
  name: string;
  category: string;
  accentColor: string;
  bgGradient: string;
  symbols: string[];
  jackpotMultiplier: number;
}

const ALL_30_SLOT_GAMES: SlotGameTheme[] = [
  { id: 1, name: 'Fruit Spin', category: 'Classic', accentColor: '#ef4444', bgGradient: 'from-red-900/60 to-rose-950/60', symbols: ['🍒', '🍋', '🍇', '🍉', '🔔', '7️⃣'], jackpotMultiplier: 25 },
  { id: 2, name: 'Lucky Stars', category: 'Arcade', accentColor: '#eab308', bgGradient: 'from-amber-900/60 to-yellow-950/60', symbols: ['⭐', '🌟', '✨', '💫', '🌠', '👑'], jackpotMultiplier: 30 },
  { id: 3, name: 'Ocean Treasure', category: 'Adventure', accentColor: '#06b6d4', bgGradient: 'from-cyan-900/60 to-blue-950/60', symbols: ['🐬', '🐙', '🐚', '⚓', '🧜‍♀️', '💎'], jackpotMultiplier: 35 },
  { id: 4, name: 'Space Explorer', category: 'Sci-Fi', accentColor: '#8b5cf6', bgGradient: 'from-purple-900/60 to-indigo-950/60', symbols: ['🚀', '🛸', '🪐', '👽', '🌌', '⭐'], jackpotMultiplier: 40 },
  { id: 5, name: 'Jungle Adventure', category: 'Nature', accentColor: '#10b981', bgGradient: 'from-emerald-900/60 to-green-950/60', symbols: ['🐯', '🐵', '🦜', '🌴', '🍌', '🗿'], jackpotMultiplier: 30 },
  { id: 6, name: 'Candy Wheel', category: 'Sweet', accentColor: '#ec4899', bgGradient: 'from-pink-900/60 to-rose-950/60', symbols: ['🍬', '🍭', '🍫', '🧁', '🍩', '🍧'], jackpotMultiplier: 28 },
  { id: 7, name: 'Golden Bells', category: 'Classic', accentColor: '#f59e0b', bgGradient: 'from-amber-900/60 to-orange-950/60', symbols: ['🔔', '💰', '🪙', '7️⃣', 'BAR', '👑'], jackpotMultiplier: 45 },
  { id: 8, name: 'Magic Garden', category: 'Fantasy', accentColor: '#a855f7', bgGradient: 'from-purple-900/60 to-pink-950/60', symbols: ['🌸', '🍄', '🦋', '🪄', '🧚', '🍀'], jackpotMultiplier: 32 },
  { id: 9, name: 'Crystal Quest', category: 'Mystic', accentColor: '#38bdf8', bgGradient: 'from-sky-900/60 to-cyan-950/60', symbols: ['💎', '🔷', '🔮', '💠', '💍', '✨'], jackpotMultiplier: 50 },
  { id: 10, name: 'Dragon Festival', category: 'Myth', accentColor: '#dc2626', bgGradient: 'from-red-950/70 to-amber-950/60', symbols: ['🐉', '🏮', '🎆', '🥁', '🧧', '🐲'], jackpotMultiplier: 60 },
  { id: 11, name: 'Pirate Voyage', category: 'Adventure', accentColor: '#b45309', bgGradient: 'from-amber-950/70 to-yellow-950/60', symbols: ['🏴‍☠️', '🦜', '🗡️', '🗺️', '🪙', '💎'], jackpotMultiplier: 35 },
  { id: 12, name: 'Neon City', category: 'Cyber', accentColor: '#06b6d4', bgGradient: 'from-cyan-950/70 to-fuchsia-950/60', symbols: ['🏙️', '⚡', '🕶️', '🕹️', '💾', '🤖'], jackpotMultiplier: 42 },
  { id: 13, name: 'Robot Reels', category: 'Sci-Fi', accentColor: '#64748b', bgGradient: 'from-slate-900/80 to-blue-950/60', symbols: ['🤖', '⚙️', '🔋', '📡', '💡', '🦾'], jackpotMultiplier: 33 },
  { id: 14, name: 'Galaxy Spin', category: 'Space', accentColor: '#6366f1', bgGradient: 'from-indigo-950/70 to-purple-950/60', symbols: ['🌌', '🛰️', '☄️', '🌟', '🌍', '🌕'], jackpotMultiplier: 38 },
  { id: 15, name: 'Rainbow Gems', category: 'Fantasy', accentColor: '#14b8a6', bgGradient: 'from-teal-950/70 to-emerald-950/60', symbols: ['🌈', '💎', '🟢', '🟡', '🟣', '🔴'], jackpotMultiplier: 45 },
  { id: 16, name: 'Lucky Lanterns', category: 'Festival', accentColor: '#f43f5e', bgGradient: 'from-rose-950/70 to-amber-950/60', symbols: ['🏮', '🎋', '🥮', '🪭', '💮', '🪙'], jackpotMultiplier: 35 },
  { id: 17, name: 'Desert Treasure', category: 'Adventure', accentColor: '#d97706', bgGradient: 'from-amber-950/70 to-orange-950/60', symbols: ['🐪', '🏺', '🏜️', '🐍', '💎', '🕌'], jackpotMultiplier: 36 },
  { id: 18, name: 'Moonlight Magic', category: 'Mystic', accentColor: '#9333ea', bgGradient: 'from-purple-950/70 to-slate-950/60', symbols: ['🌙', '🦉', '🕯️', '🔮', '📖', '✨'], jackpotMultiplier: 48 },
  { id: 19, name: 'Royal Crown', category: 'Luxury', accentColor: '#eab308', bgGradient: 'from-yellow-950/70 to-amber-950/60', symbols: ['👑', '🏰', '⚜️', '💍', '🍷', '💎'], jackpotMultiplier: 55 },
  { id: 20, name: 'Electric Dreams', category: 'Retro', accentColor: '#3b82f6', bgGradient: 'from-blue-950/70 to-violet-950/60', symbols: ['⚡', '🎸', '🎧', '📻', '📼', '🕺'], jackpotMultiplier: 40 },
  { id: 21, name: 'Bubble Blast', category: 'Casual', accentColor: '#0ea5e9', bgGradient: 'from-sky-950/70 to-teal-950/60', symbols: ['🫧', '🐠', '🌊', '💧', '🪸', '🦪'], jackpotMultiplier: 25 },
  { id: 22, name: 'Cherry Pop', category: 'Classic', accentColor: '#e11d48', bgGradient: 'from-rose-950/70 to-red-950/60', symbols: ['🍒', '🍧', '🍰', '🍓', '🧁', '7️⃣'], jackpotMultiplier: 30 },
  { id: 23, name: 'Treasure Island', category: 'Adventure', accentColor: '#059669', bgGradient: 'from-emerald-950/70 to-teal-950/60', symbols: ['🏝️', '⚓', '🏴‍☠️', '⛵', '🗺️', '💎'], jackpotMultiplier: 38 },
  { id: 24, name: 'Mystic Forest', category: 'Nature', accentColor: '#15803d', bgGradient: 'from-green-950/70 to-emerald-950/60', symbols: ['🌲', '🦌', '🍄', '🌿', '🪵', '✨'], jackpotMultiplier: 32 },
  { id: 25, name: 'Solar System', category: 'Sci-Fi', accentColor: '#ea580c', bgGradient: 'from-orange-950/70 to-amber-950/60', symbols: ['☀️', '🪐', '🌍', '🌕', '☄️', '🌌'], jackpotMultiplier: 45 },
  { id: 26, name: 'Firefly Nights', category: 'Cozy', accentColor: '#84cc16', bgGradient: 'from-lime-950/70 to-green-950/60', symbols: ['✨', '🏮', '🌿', '🌙', '🪷', '🏕️'], jackpotMultiplier: 28 },
  { id: 27, name: 'Winter Wonderland', category: 'Holiday', accentColor: '#38bdf8', bgGradient: 'from-sky-950/70 to-slate-950/60', symbols: ['❄️', '⛄', '🧤', '🎿', '🔔', '🎄'], jackpotMultiplier: 35 },
  { id: 28, name: 'Ancient Temple', category: 'History', accentColor: '#ca8a04', bgGradient: 'from-yellow-950/70 to-stone-950/60', symbols: ['🏛️', '🏺', '🗿', '📜', '🛡️', '💎'], jackpotMultiplier: 50 },
  { id: 29, name: 'Supernova', category: 'Cosmic', accentColor: '#f43f5e', bgGradient: 'from-rose-950/70 to-purple-950/60', symbols: ['💥', '🌟', '☄️', '🪐', '💫', '✨'], jackpotMultiplier: 65 },
  { id: 30, name: 'Coin Carnival', category: 'Carnival', accentColor: '#eab308', bgGradient: 'from-amber-950/70 to-red-950/60', symbols: ['🎪', '🎡', '🍿', '🎈', '🎟️', '🪙'], jackpotMultiplier: 50 },
];

export const ArcadeSlotCollection: React.FC<ArcadeSlotCollectionProps> = ({
  onEarnCoins,
  isDark,
}) => {
  const [selectedGame, setSelectedGame] = useState<SlotGameTheme>(ALL_30_SLOT_GAMES[0]);
  const [reels, setReels] = useState<string[]>(['🍒', '7️⃣', '🔔']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResultText, setSpinResultText] = useState<string>('Tekan "Putar Percuma" untuk mencuba nasib arked!');
  const [lastWinCoins, setLastWinCoins] = useState(0);
  const [dailyPlaysLeft, setDailyPlaysLeft] = useState(20);
  const [searchFilter, setSearchFilter] = useState('');

  const filteredGames = ALL_30_SLOT_GAMES.filter((g) =>
    g.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    g.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleSelectGame = (game: SlotGameTheme) => {
    sounds.playClick();
    setSelectedGame(game);
    setReels([game.symbols[0], game.symbols[1], game.symbols[2]]);
    setSpinResultText(`Tema dipilih: ${game.name}. Tekan Putar!`);
    setLastWinCoins(0);
  };

  const handleSpin = () => {
    if (isSpinning || dailyPlaysLeft <= 0) return;

    sounds.playSlotSpin();
    setIsSpinning(true);
    setDailyPlaysLeft((p) => p - 1);
    setLastWinCoins(0);
    setSpinResultText('Sedang memutar gelendong arked...');

    // Simulate multi-step reel spinning animation
    let spins = 0;
    const interval = setInterval(() => {
      sounds.playSlotSpin();
      const s1 = selectedGame.symbols[Math.floor(Math.random() * selectedGame.symbols.length)];
      const s2 = selectedGame.symbols[Math.floor(Math.random() * selectedGame.symbols.length)];
      const s3 = selectedGame.symbols[Math.floor(Math.random() * selectedGame.symbols.length)];
      setReels([s1, s2, s3]);
      spins++;

      if (spins >= 14) {
        clearInterval(interval);
        // Final outcomes
        const symbols = selectedGame.symbols;
        // Bias towards rewarding players fairly in arcade
        const isWin = Math.random() < 0.45;
        let finalReels: string[];

        if (isWin) {
          const matchSym = symbols[Math.floor(Math.random() * symbols.length)];
          finalReels = [matchSym, matchSym, matchSym];
        } else {
          finalReels = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
          ];
          // ensure not all 3 match
          if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
            finalReels[2] = symbols[(symbols.indexOf(finalReels[2]) + 1) % symbols.length];
          }
        }

        setReels(finalReels);
        setIsSpinning(false);

        // Win evaluation
        if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
          // 3-of-a-kind Jackpot
          sounds.playWinFanfare();
          confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
          const reward = selectedGame.jackpotMultiplier;
          setLastWinCoins(reward);
          setSpinResultText(`🎉 TAHNIAH! 3x PADANAN ${finalReels[0]}! Anda menang ${reward} Reward Coins!`);
          onEarnCoins(reward, `Slot: ${selectedGame.name}`);
        } else if (finalReels[0] === finalReels[1] || finalReels[1] === finalReels[2] || finalReels[0] === finalReels[2]) {
          // 2 matching symbols
          sounds.playCoinChime();
          const reward = 5;
          setLastWinCoins(reward);
          setSpinResultText(`✨ BAGUS! 2x Simbol sepadan. Dapat ${reward} Reward Coins!`);
          onEarnCoins(reward, `Slot Mini: ${selectedGame.name}`);
        } else {
          setSpinResultText('Cuba lagi pada putaran seterusnya! Had harian tersedia.');
        }
      }
    }, 90);
  };

  return (
    <div className="space-y-6">
      {/* Notice & Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-start gap-3 text-xs text-blue-200">
        <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <p className="font-bold text-white">
            Pematuhan Hiburan: Permainan Slot Arked Percuma
          </p>
          <p className="opacity-90 leading-relaxed text-[11px]">
            Semua 30 permainan slot di bawah adalah untuk tujuan hiburan & misi ganjaran maya sahaja. Tiada pertaruhan wang sebenar, tiada deposit wang tunai untuk slot, dan coin kemenangan adalah Reward Coins untuk penebusan katalog.
          </p>
        </div>
      </div>

      {/* Main Active Slot Machine Console */}
      <div className={`p-6 md:p-8 rounded-3xl border shadow-2xl bg-gradient-to-br ${selectedGame.bgGradient} border-slate-700/80`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-white">
                Permainan #{selectedGame.id} • {selectedGame.category}
              </span>
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" />
                Jackpot {selectedGame.jackpotMultiplier}x Coins
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white mt-1">
              {selectedGame.name}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs">
              <span className="text-slate-400 block text-[10px]">Had Putaran Hari Ini</span>
              <span className="font-extrabold text-emerald-400 tabular-nums">{dailyPlaysLeft} / 20 Baki</span>
            </div>
          </div>
        </div>

        {/* 3 Reel Display */}
        <div className="max-w-md mx-auto my-6 p-4 rounded-3xl bg-slate-950/90 border-4 border-amber-500/40 shadow-2xl flex items-center justify-center gap-3 md:gap-4">
          {reels.map((symbol, idx) => (
            <div
              key={idx}
              className={`w-24 h-28 md:w-28 md:h-32 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-slate-700 flex items-center justify-center text-5xl md:text-6xl shadow-inner transition-transform duration-100 ${
                isSpinning ? 'scale-95 animate-pulse' : 'scale-100'
              }`}
            >
              {symbol}
            </div>
          ))}
        </div>

        {/* Spin Result Feedback */}
        <div className="text-center min-h-[32px] mb-5">
          <p className="text-xs md:text-sm font-bold text-white tracking-wide">
            {spinResultText}
          </p>
        </div>

        {/* Spin Action CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
          <button
            onClick={handleSpin}
            disabled={isSpinning || dailyPlaysLeft <= 0}
            className="w-full btn-3d btn-3d-gold py-3.5 px-6 rounded-2xl font-black text-slate-950 text-sm tracking-wider flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5 fill-slate-950" />
            <span>{isSpinning ? 'Sedang Memutar...' : 'Putar Percuma (Arked)'}</span>
          </button>
        </div>
      </div>

      {/* 30 Games Selector Grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-lg font-extrabold text-white">
              Koleksi 30 Permainan Slot Arked Penuh
            </h4>
            <p className="text-xs text-slate-400">
              Pilih mana-mana permainan slot di bawah untuk menukar tema gelendong dan simbol secara langsung.
            </p>
          </div>

          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Cari tema permainan..."
            className="bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 w-full sm:w-56"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {filteredGames.map((game) => {
            const isSelected = selectedGame.id === game.id;
            return (
              <button
                key={game.id}
                onClick={() => handleSelectGame(game)}
                className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'bg-blue-600/30 border-blue-400 shadow-lg shadow-blue-500/20'
                    : 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-2xl mb-1.5 flex items-center justify-between">
                  <span>{game.symbols[0]}</span>
                  <span className="text-[10px] font-bold text-slate-400">#{game.id}</span>
                </div>
                <div className="font-bold text-xs text-white group-hover:text-blue-300 truncate">
                  {game.name}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between mt-1">
                  <span>{game.category}</span>
                  <span className="font-semibold text-amber-400">{game.jackpotMultiplier}x</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
