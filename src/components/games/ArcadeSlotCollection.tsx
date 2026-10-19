import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';
import {
  Sparkles,
  Trophy,
  RotateCcw,
  Flame,
  Zap,
  Info,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Coins,
  ShieldCheck,
  Star,
  Gift,
  HelpCircle,
  X,
  Dices,
} from 'lucide-react';

interface ArcadeSlotCollectionProps {
  onEarnCoins: (coins: number, gameTitle: string) => void;
  isDark: boolean;
}

interface Mega888Theme {
  id: number;
  name: string;
  tagline: string;
  category: 'Popular Mega' | 'Classic' | 'Adventure' | 'Oriental' | 'Myth';
  accentColor: string;
  bgGradient: string;
  wildSymbol: string;
  wildName: string;
  scatterSymbol: string;
  scatterName: string;
  highSymbols: string[];
  lowSymbols: string[];
  jackpotPool: number;
}

// 30 Authentic Mega888-inspired Casino Slot Themes
const MEGA888_THEMES: Mega888Theme[] = [
  {
    id: 1,
    name: 'Great Blue™',
    tagline: 'Lautan Dalam & Orca Wild 2x',
    category: 'Popular Mega',
    accentColor: '#0ea5e9',
    bgGradient: 'from-sky-950 via-blue-900 to-slate-950',
    wildSymbol: '🐋',
    wildName: 'Orca Wild',
    scatterSymbol: '🦪',
    scatterName: 'Pearl Oyster',
    highSymbols: ['🦈', '🐢', '🐡', '🐚', '⭐'],
    lowSymbols: ['A', 'K', 'Q', 'J', '10'],
    jackpotPool: 88880,
  },
  {
    id: 2,
    name: 'Highway Kings™',
    tagline: 'Trak Gergasi & Ekzos Panas',
    category: 'Popular Mega',
    accentColor: '#ef4444',
    bgGradient: 'from-rose-950 via-red-900 to-slate-950',
    wildSymbol: '🚛',
    wildName: 'Red Truck Wild',
    scatterSymbol: '⚡',
    scatterName: 'Spark Plug',
    highSymbols: ['⛽', '🛞', '🔧', '🪓', '🔥'],
    lowSymbols: ['A', 'K', 'Q', 'J', '9'],
    jackpotPool: 75400,
  },
  {
    id: 3,
    name: 'Safari Heat™',
    tagline: 'Raja Singa & Savana Sunset',
    category: 'Popular Mega',
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-950 via-yellow-900 to-slate-950',
    wildSymbol: '🦁',
    wildName: 'Lion Wild',
    scatterSymbol: '🌅',
    scatterName: 'Savannah Sunset',
    highSymbols: ['🦏', '🦓', '🦩', '🦒', '🐘'],
    lowSymbols: ['A', 'K', 'Q', 'J', '10'],
    jackpotPool: 92150,
  },
  {
    id: 4,
    name: 'Dolphin Reef™',
    tagline: 'Lumba-Lumba Melompat & Respin Laut',
    category: 'Popular Mega',
    accentColor: '#06b6d4',
    bgGradient: 'from-cyan-950 via-teal-900 to-slate-950',
    wildSymbol: '🐬',
    wildName: 'Dolphin Wild',
    scatterSymbol: '🪙',
    scatterName: 'Treasure Chest',
    highSymbols: ['🐠', '🐢', '⭐', '🪸', '🐚'],
    lowSymbols: ['A', 'K', 'Q', 'J', '10'],
    jackpotPool: 68500,
  },
  {
    id: 5,
    name: 'Panther Moon™',
    tagline: 'Harimau Kumbang Bulan Mengambang',
    category: 'Popular Mega',
    accentColor: '#a855f7',
    bgGradient: 'from-purple-950 via-indigo-950 to-slate-950',
    wildSymbol: '🐆',
    wildName: 'Panther Wild',
    scatterSymbol: '🌕',
    scatterName: 'Full Moon',
    highSymbols: ['🦉', '🦋', '🌸', '🍄', '✨'],
    lowSymbols: ['A', 'K', 'Q', 'J', '9'],
    jackpotPool: 84200,
  },
  {
    id: 6,
    name: 'God of Wealth (Cai Shen)™',
    tagline: 'Dewa Kemakmuran & Emas Berkilau',
    category: 'Oriental',
    accentColor: '#eab308',
    bgGradient: 'from-amber-950 via-red-950 to-slate-950',
    wildSymbol: '🏮',
    wildName: 'Cai Shen Wild',
    scatterSymbol: '🧧',
    scatterName: 'Ang Pao',
    highSymbols: ['🐉', '💰', '🪙', '🎆', '🥁'],
    lowSymbols: ['A', 'K', 'Q', 'J', '10'],
    jackpotPool: 99990,
  },
  {
    id: 7,
    name: 'Irish Luck™',
    tagline: 'Periuk Emas & Pelangi Bertuah',
    category: 'Classic',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-950 via-green-900 to-slate-950',
    wildSymbol: '🍀',
    wildName: 'Clover Wild',
    scatterSymbol: '🏺',
    scatterName: 'Gold Pot',
    highSymbols: ['🌈', '🧲', '🪙', '🍺', '🍄'],
    lowSymbols: ['A', 'K', 'Q', 'J', '10'],
    jackpotPool: 64100,
  },
  {
    id: 8,
    name: 'Captain’s Treasure™',
    tagline: 'Lanun Karibia & Harta Karun Laut',
    category: 'Adventure',
    accentColor: '#d97706',
    bgGradient: 'from-amber-950 via-stone-900 to-slate-950',
    wildSymbol: '🏴‍☠️',
    wildName: 'Captain Wild',
    scatterSymbol: '🗡️',
    scatterName: 'Crossed Cutlasses',
    highSymbols: ['🦜', '🗺️', '⚓', '🧭', '💎'],
    lowSymbols: ['A', 'K', 'Q', 'J', '9'],
    jackpotPool: 78900,
  },
  {
    id: 9,
    name: 'Fruit Party Deluxe',
    tagline: 'Buah-buahan Arked 20 Garisan',
    category: 'Classic',
    accentColor: '#ec4899',
    bgGradient: 'from-pink-950 via-rose-900 to-slate-950',
    wildSymbol: '7️⃣',
    wildName: 'Lucky 7 Wild',
    scatterSymbol: '⭐',
    scatterName: 'Golden Star',
    highSymbols: ['🍒', '🍉', '🍇', '🍋', '🔔'],
    lowSymbols: ['A', 'K', 'Q', 'J', '10'],
    jackpotPool: 55000,
  },
  {
    id: 10,
    name: 'Dragon Maiden',
    tagline: 'Naga Purba Api Magik',
    category: 'Myth',
    accentColor: '#dc2626',
    bgGradient: 'from-red-950 via-orange-950 to-slate-950',
    wildSymbol: '🐲',
    wildName: 'Dragon Wild',
    scatterSymbol: '🔮',
    scatterName: 'Dragon Eye',
    highSymbols: ['🗡️', '🛡️', '👑', '💍', '🔥'],
    lowSymbols: ['A', 'K', 'Q', 'J', '10'],
    jackpotPool: 87300,
  },
  { id: 11, name: 'Ocean Treasure', tagline: 'Kekayaan Terumbu Karang', category: 'Adventure', accentColor: '#0284c7', bgGradient: 'from-sky-950 to-blue-900', wildSymbol: '🧜‍♀️', wildName: 'Mermaid', scatterSymbol: '🐚', scatterName: 'Conch', highSymbols: ['🐬', '🐙', '⚓', '💎', '⭐'], lowSymbols: ['A', 'K', 'Q', 'J', '10'], jackpotPool: 62000 },
  { id: 12, name: 'Space Explorer', tagline: 'Penjelajahan Galaksi Nebula', category: 'Popular Mega', accentColor: '#6366f1', bgGradient: 'from-indigo-950 to-slate-950', wildSymbol: '🚀', wildName: 'Rocket', scatterSymbol: '🪐', scatterName: 'Saturn', highSymbols: ['🛸', '👽', '☄️', '🌌', '⭐'], lowSymbols: ['A', 'K', 'Q', 'J', '10'], jackpotPool: 71000 },
  { id: 13, name: 'Jungle Adventure', tagline: 'Hutan Tropika Borneo', category: 'Adventure', accentColor: '#16a34a', bgGradient: 'from-green-950 to-emerald-950', wildSymbol: '🐯', wildName: 'Tiger', scatterSymbol: '🗿', scatterName: 'Totem', highSymbols: ['🐵', '🦜', '🌴', '🍌', '💎'], lowSymbols: ['A', 'K', 'Q', 'J', '10'], jackpotPool: 59000 },
  { id: 14, name: 'Candy Wheel Deluxe', tagline: 'Roda Manisan Bonanza', category: 'Classic', accentColor: '#d946ef', bgGradient: 'from-fuchsia-950 to-pink-950', wildSymbol: '🍭', wildName: 'Lollipop', scatterSymbol: '🧁', scatterName: 'Cupcake', highSymbols: ['🍬', '🍫', '🍩', '🍧', '⭐'], lowSymbols: ['A', 'K', 'Q', 'J', '10'], jackpotPool: 64000 },
  { id: 15, name: 'Golden Bells 88', tagline: 'Loceng Emas Tuah Berganda', category: 'Classic', accentColor: '#ca8a04', bgGradient: 'from-yellow-950 to-amber-950', wildSymbol: '🔔', wildName: 'Bell', scatterSymbol: '💰', scatterName: 'Cash Bag', highSymbols: ['BAR', '7️⃣', '🪙', '👑', '💎'], lowSymbols: ['A', 'K', 'Q', 'J', '10'], jackpotPool: 82000 },
  { id: 16, name: 'Magic Garden', tagline: 'Taman Pari-Pari Berseri', category: 'Myth', accentColor: '#9333ea', bgGradient: 'from-purple-950 to-violet-950', wildSymbol: '🧚', wildName: 'Fairy', scatterSymbol: '🪄', scatterName: 'Wand', highSymbols: ['🌸', '🍄', '🦋', '🍀', '✨'], lowSymbols: ['A', 'K', 'Q', 'J', '10'], jackpotPool: 67000 },
  { id: 17, name: 'Crystal Quest', tagline: 'Kristal Infiniti Bawah Tanah', category: 'Adventure', accentColor: '#38bdf8', bgGradient: 'from-cyan-950 to-sky-950', wildSymbol: '💠', wildName: 'Matrix', scatterSymbol: '💎', scatterName: 'Diamond', highSymbols: ['🔷', '🔮', '💍', '✨', '⭐'], lowSymbols: ['A', 'K', 'Q', 'J', '10'], jackpotPool: 76000 },
  { id: 18, name: 'Dragon Festival', tagline: 'Pesta Tarian Singa & Bunga Api', category: 'Oriental', accentColor: '#e11d48', bgGradient: 'from-rose-950 to-red-950', wildSymbol: '🐉', wildName: 'Dragon', scatterSymbol: '🎆', scatterName: 'Fireworks', highSymbols: ['🏮', '🥁', '🧧', '🐲', '🪙'], lowSymbols: ['A', 'K', 'Q', 'J', '10'], jackpotPool: 93000 },
  { id: 19, name: 'Pirate Voyage', tagline: 'Pelayaran Laut Hitam', category: 'Adventure', accentColor: '#b45309', bgGradient: 'from-amber-950 to-stone-950', wildSymbol: '🏴‍☠️', wildName: 'Jolly Roger', scatterSymbol: '🗺️', scatterName: 'Treasure Map', highSymbols: ['🦜', '🗡️', '🪙', '💎', '🧭'], lowSymbols: ['A', 'K', 'Q', 'J', '10'], jackpotPool: 69000 },
  { id: 20, name: 'Neon City Cyberpunk', tagline: 'Lampu Neon Bandar Masa Depan', category: 'Popular Mega', accentColor: '#06b6d4', bgGradient: 'from-cyan-950 to-fuchsia-950', wildSymbol: '🤖', wildName: 'Cyborg', scatterSymbol: '⚡', scatterName: 'Voltage', highSymbols: ['🕶️', '🕹️', '💾', '🏙️', '✨'], lowSymbols: ['A', 'K', 'Q', 'J', '10'], jackpotPool: 78000 },
  { id: 21, name: 'Robot Reels', tagline: 'Kilang Robotik Automasi', category: 'Classic', accentColor: '#64748b', bgGradient: 'from-slate-900 to-zinc-950', wildSymbol: '🦾', wildName: 'Titan Arm', scatterSymbol: '⚙️', scatterName: 'Gear', highSymbols: ['🤖', '🔋', '📡', '💡', '💎'], lowSymbols: ['A', 'K', 'Q', 'J', '10'], jackpotPool: 58000 },
  { id: 22, name: 'Galaxy Spin Cosmic', tagline: 'Gelendong Kosmik Bintang', category: 'Popular Mega', accentColor: '#4f46e5', bgGradient: 'from-indigo-950 to-blue-950', wildSymbol: '🌌', wildName: 'Nebula', scatterSymbol: '🌟', scatterName: 'Super Star', highSymbols: ['🛰️', '☄️', '🌍', '🌕', '🚀'], lowSymbols: ['A', 'K', 'Q', 'J', '10'], jackpotPool: 81000 },
  { id: 23, name: 'Rainbow Gems', tagline: 'Permata Spektrum Warna', category: 'Classic', accentColor: '#14b8a6', bgGradient: 'from-teal-950 to-slate-950', wildSymbol: '🌈', wildName: 'Rainbow', scatterSymbol: '💎', scatterName: 'Crown Gem', highSymbols: ['🔴', '🟡', '🟢', '🟣', '⭐'], lowSymbols: ['A', 'K', 'Q', 'J', '10'], jackpotPool: 63000 },
  { id: 24, name: 'Lucky Lanterns', tagline: 'Tanglung Cahaya Berkat', category: 'Oriental', accentColor: '#f43f5e', bgGradient: 'from-rose-950 to-pink-950', wildSymbol: '🏮', wildName: 'Lantern', scatterSymbol: '🥮', scatterName: 'Mooncake', highSymbols: ['🎋', '🪭', '💮', '🪙', '✨'], lowSymbols: ['A', 'K', 'Q', 'J', '10'], jackpotPool: 70000 },
  { id: 25, name: 'Desert Treasure', tagline: 'Oasis Padang Pasir Arab', category: 'Adventure', accentColor: '#d97706', bgGradient: 'from-amber-950 to-yellow-950', wildSymbol: '🐪', wildName: 'Camel', scatterSymbol: '🏺', scatterName: 'Urn', highSymbols: ['🏜️', '🐍', '💎', '🕌', '⭐'], lowSymbols: ['A', 'K', 'Q', 'J', '10'], jackpotPool: 74000 },
  { id: 26, name: 'Royal Crown King', tagline: 'Mahkota Di-Raja Emas', category: 'Classic', accentColor: '#eab308', bgGradient: 'from-yellow-950 to-amber-950', wildSymbol: '👑', wildName: 'Crown', scatterSymbol: '🏰', scatterName: 'Castle', highSymbols: ['⚜️', '💍', '🍷', '💎', '💰'], lowSymbols: ['A', 'K', 'Q', 'J', '10'], jackpotPool: 89000 },
  { id: 27, name: 'Winter Wonderland', tagline: 'Salji Musim Sejuk Berkilau', category: 'Classic', accentColor: '#38bdf8', bgGradient: 'from-sky-950 to-slate-900', wildSymbol: '❄️', wildName: 'Snowflake', scatterSymbol: '⛄', scatterName: 'Snowman', highSymbols: ['🧤', '🎿', '🔔', '🎄', '⭐'], lowSymbols: ['A', 'K', 'Q', 'J', '10'], jackpotPool: 61000 },
  { id: 28, name: 'Ancient Temple', tagline: 'Kuil Purba Maya & Inca', category: 'Adventure', accentColor: '#ca8a04', bgGradient: 'from-stone-900 to-amber-950', wildSymbol: '🏛️', wildName: 'Temple', scatterSymbol: '🗿', scatterName: 'Stone Head', highSymbols: ['🏺', '📜', '🛡️', '💎', '✨'], lowSymbols: ['A', 'K', 'Q', 'J', '10'], jackpotPool: 77000 },
  { id: 29, name: 'Supernova Blast', tagline: 'Letupan Bintang Galaktik', category: 'Popular Mega', accentColor: '#f43f5e', bgGradient: 'from-rose-950 to-purple-950', wildSymbol: '💥', wildName: 'Supernova', scatterSymbol: '☄️', scatterName: 'Comet', highSymbols: ['🌟', '🪐', '💫', '✨', '🚀'], lowSymbols: ['A', 'K', 'Q', 'J', '10'], jackpotPool: 95000 },
  { id: 30, name: 'Coin Carnival Mega', tagline: 'Karnival Syiling Emas', category: 'Popular Mega', accentColor: '#eab308', bgGradient: 'from-amber-950 to-red-950', wildSymbol: '🎪', wildName: 'Carnival Tent', scatterSymbol: '🎟️', scatterName: 'Golden Ticket', highSymbols: ['🎡', '🍿', '🎈', '🪙', '👑'], lowSymbols: ['A', 'K', 'Q', 'J', '10'], jackpotPool: 88880 },
];

// Standard 20 Paylines for 5x3 Video Slot
const PAYLINES: number[][] = [
  [1, 1, 1, 1, 1], // Line 1: Middle
  [0, 0, 0, 0, 0], // Line 2: Top
  [2, 2, 2, 2, 2], // Line 3: Bottom
  [0, 1, 2, 1, 0], // Line 4: V
  [2, 1, 0, 1, 2], // Line 5: Inverted V
  [0, 0, 1, 2, 2], // Line 6
  [2, 2, 1, 0, 0], // Line 7
  [1, 0, 0, 0, 1], // Line 8
  [1, 2, 2, 2, 1], // Line 9
  [0, 1, 1, 1, 0], // Line 10
  [2, 1, 1, 1, 2], // Line 11
  [1, 0, 1, 2, 1], // Line 12
  [1, 2, 1, 0, 1], // Line 13
  [0, 1, 0, 1, 0], // Line 14
  [2, 1, 2, 1, 2], // Line 15
  [1, 1, 0, 1, 1], // Line 16
  [1, 1, 2, 1, 1], // Line 17
  [0, 0, 2, 0, 0], // Line 18
  [2, 2, 0, 2, 2], // Line 19
  [0, 2, 0, 2, 0], // Line 20
];

const PAYLINE_COLORS = [
  '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
  '#14b8a6', '#eab308', '#d946ef', '#0284c7', '#dc2626',
  '#16a34a', '#ca8a04', '#9333ea', '#059669', '#be123c',
];

export const ArcadeSlotCollection: React.FC<ArcadeSlotCollectionProps> = ({
  onEarnCoins,
  isDark,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<Mega888Theme>(MEGA888_THEMES[0]);

  // 5 Reels x 3 Rows Matrix
  const [grid, setGrid] = useState<string[][]>([
    ['🐋', '🦈', 'A'],
    ['A', '🦪', 'K'],
    ['🐢', '🐋', 'Q'],
    ['J', '🐡', '⭐'],
    ['10', 'A', '🐚'],
  ]);

  const [isSpinning, setIsSpinning] = useState(false);
  const [autoSpinCount, setAutoSpinCount] = useState<number>(0);
  const [isTurbo, setIsTurbo] = useState(false);
  const [betPerLine, setBetPerLine] = useState<number>(1); // In Free Arcade Coins
  const activePaylines = 20;
  const totalBet = betPerLine * activePaylines;

  // Free Spins Feature State (The coveted Mega888 10 Free Spins + 3x Multiplier!)
  const [freeSpinsRemaining, setFreeSpinsRemaining] = useState<number>(0);
  const [freeSpinsTotalWin, setFreeSpinsTotalWin] = useState<number>(0);

  // Progressive 4-Tier Jackpot Tickers (Grand, Major, Minor, Mini)
  const [grandJackpot, setGrandJackpot] = useState(88880);
  const [majorJackpot, setMajorJackpot] = useState(18250);
  const [minorJackpot, setMinorJackpot] = useState(3450);
  const [miniJackpot, setMiniJackpot] = useState(680);

  // Win Feedback & Presentation
  const [lastWinAmount, setLastWinAmount] = useState<number>(0);
  const [winTitle, setWinTitle] = useState<string | null>(null);
  const [winningLines, setWinningLines] = useState<number[]>([]);
  const [arcadeCredit, setArcadeCredit] = useState<number>(3000); // Free game credits
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modals for Mega888 Real Casino Experience
  const [isPaytableOpen, setIsPaytableOpen] = useState(false);
  const [isGambleOpen, setIsGambleOpen] = useState(false);
  const [gambleCurrentCard, setGambleCurrentCard] = useState<string>('🂠');
  const [gambleHistory, setGambleHistory] = useState<string[]>(['♥️', '♠️', '♦️', '♣️']);
  const [gamblePot, setGamblePot] = useState<number>(0);
  const [gambleStatus, setGambleStatus] = useState<string | null>(null);

  // Gently increment progressive jackpots in real-time
  useEffect(() => {
    const timer = setInterval(() => {
      setGrandJackpot((prev) => prev + Math.floor(Math.random() * 3) + 1);
      setMajorJackpot((prev) => prev + (Math.random() > 0.4 ? 1 : 0));
      setMinorJackpot((prev) => prev + (Math.random() > 0.6 ? 1 : 0));
      setMiniJackpot((prev) => prev + (Math.random() > 0.8 ? 1 : 0));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  // Trigger win sounds and visual tiers
  const triggerWinTier = (win: number) => {
    if (win >= totalBet * 20) {
      setWinTitle('🔥 SUPER MEGA WIN! 🔥');
      sounds.playJackpotSirens();
      sounds.playWinFanfare();
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
    } else if (win >= totalBet * 10) {
      setWinTitle('⭐ MEGA WIN! ⭐');
      sounds.playWinFanfare();
      confetti({ particleCount: 70, spread: 70 });
    } else if (win >= totalBet * 3) {
      setWinTitle('🎉 BIG WIN! 🎉');
      sounds.playCoinChime();
    } else if (win > 0) {
      setWinTitle('NICE WIN!');
      sounds.playCoinChime();
    }
  };

  // 5x3 SPIN ENGINE WITH PAYLINE EVALUATION
  const executeSpin = (isFreeSpin = false) => {
    if (isSpinning) return;
    if (!isFreeSpin && arcadeCredit < totalBet) {
      alert('Kredit arked percuma tidak mencukupi! Tambah kredit percuma di butang +Tambah Percuma.');
      return;
    }

    sounds.playSlotSpin();
    setIsSpinning(true);
    setWinningLines([]);
    setWinTitle(null);

    if (!isFreeSpin) {
      setArcadeCredit((c) => c - totalBet);
    }

    // Available symbols pool for selected theme
    const pool = [
      selectedTheme.wildSymbol, // WILD
      selectedTheme.scatterSymbol, // SCATTER
      ...selectedTheme.highSymbols,
      ...selectedTheme.highSymbols,
      ...selectedTheme.lowSymbols,
      ...selectedTheme.lowSymbols,
    ];

    const spinDuration = isTurbo ? 350 : 900;
    const intervalTime = 60;
    let elapsed = 0;

    const spinInterval = setInterval(() => {
      sounds.playSlotSpin();
      // Randomize 5 columns x 3 rows
      const interim: string[][] = [];
      for (let col = 0; col < 5; col++) {
        interim.push([
          pool[Math.floor(Math.random() * pool.length)],
          pool[Math.floor(Math.random() * pool.length)],
          pool[Math.floor(Math.random() * pool.length)],
        ]);
      }
      setGrid(interim);
      elapsed += intervalTime;

      if (elapsed >= spinDuration) {
        clearInterval(spinInterval);

        // Reel stop thud
        sounds.playReelStop();

        // Calculate Final 5x3 Outcome
        const finalGrid: string[][] = [];
        for (let col = 0; col < 5; col++) {
          finalGrid.push([
            pool[Math.floor(Math.random() * pool.length)],
            pool[Math.floor(Math.random() * pool.length)],
            pool[Math.floor(Math.random() * pool.length)],
          ]);
        }

        // Feature: 40% chance to bias a winning payline
        if (Math.random() < 0.45) {
          const luckyLine = PAYLINES[Math.floor(Math.random() * PAYLINES.length)];
          const luckySym = selectedTheme.highSymbols[Math.floor(Math.random() * selectedTheme.highSymbols.length)];
          const matchLen = Math.random() < 0.3 ? 5 : Math.random() < 0.6 ? 4 : 3;
          for (let col = 0; col < matchLen; col++) {
            const row = luckyLine[col];
            finalGrid[col][row] = col === 1 && Math.random() < 0.5 ? selectedTheme.wildSymbol : luckySym;
          }
        }

        // Scatter Feature check (3 or more Scatters anywhere triggers Free Spins!)
        let scatterCount = 0;
        finalGrid.forEach((col) => {
          col.forEach((sym) => {
            if (sym === selectedTheme.scatterSymbol) scatterCount++;
          });
        });

        // Evaluate 20 Paylines
        let totalWinCoins = 0;
        const hitLines: number[] = [];

        PAYLINES.forEach((line, lineIdx) => {
          const firstSym = finalGrid[0][line[0]];
          let matchCount = 1;
          let hasWild = firstSym === selectedTheme.wildSymbol;

          for (let col = 1; col < 5; col++) {
            const currentSym = finalGrid[col][line[col]];
            const isMatch =
              currentSym === firstSym ||
              currentSym === selectedTheme.wildSymbol ||
              (firstSym === selectedTheme.wildSymbol && currentSym !== selectedTheme.scatterSymbol);

            if (isMatch) {
              matchCount++;
              if (currentSym === selectedTheme.wildSymbol) hasWild = true;
            } else {
              break;
            }
          }

          if (matchCount >= 3) {
            hitLines.push(lineIdx + 1);
            // Payout calculation
            const baseMultiplier = matchCount === 5 ? 60 : matchCount === 4 ? 18 : 5;
            const wildBoost = hasWild ? 2 : 1; // Mega888 2x Wild multiplier
            const freeSpinBoost = isFreeSpin ? 3 : 1; // 3x in Free Spins
            totalWinCoins += betPerLine * baseMultiplier * wildBoost * freeSpinBoost;
          }
        });

        // Scatter Pay (Scatters pay anywhere)
        if (scatterCount >= 3) {
          const scatterPayout = totalBet * (scatterCount === 5 ? 50 : scatterCount === 4 ? 20 : 5);
          totalWinCoins += scatterPayout;
        }

        setGrid(finalGrid);
        setIsSpinning(false);
        setWinningLines(hitLines);
        setLastWinAmount(totalWinCoins);

        if (totalWinCoins > 0) {
          setArcadeCredit((c) => c + totalWinCoins);
          triggerWinTier(totalWinCoins);

          // Credit Reward Coins for player's wallet center
          const walletReward = Math.min(Math.floor(totalWinCoins / 10), 50);
          if (walletReward > 0) {
            onEarnCoins(walletReward, `Mega888: ${selectedTheme.name}`);
          }
        }

        // Trigger Free Spins Feature if 3+ Scatters hit!
        if (scatterCount >= 3 && !isFreeSpin) {
          sounds.playWinFanfare();
          sounds.playJackpotSirens();
          confetti({ particleCount: 90, spread: 80 });
          setFreeSpinsRemaining(10); // 10 Free Spins
          setWinTitle('🎉 BONUS! 10 FREE SPINS TERPILIH (3X MULTIPLIER)! 🎉');
        } else if (isFreeSpin) {
          setFreeSpinsTotalWin((prev) => prev + totalWinCoins);
          setFreeSpinsRemaining((r) => {
            const next = r - 1;
            if (next <= 0) {
              triggerWinTier(freeSpinsTotalWin + totalWinCoins);
            }
            return next;
          });
        }
      }
    }, intervalTime);
  };

  // Handle Free Spins Auto Chain
  useEffect(() => {
    if (freeSpinsRemaining > 0 && !isSpinning) {
      const timer = setTimeout(() => {
        executeSpin(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [freeSpinsRemaining, isSpinning]);

  // Handle Auto Spin
  useEffect(() => {
    if (autoSpinCount > 0 && !isSpinning && freeSpinsRemaining === 0) {
      const timer = setTimeout(() => {
        setAutoSpinCount((c) => c - 1);
        executeSpin(false);
      }, isTurbo ? 400 : 1000);
      return () => clearTimeout(timer);
    }
  }, [autoSpinCount, isSpinning, freeSpinsRemaining]);

  const handleSelectTheme = (theme: Mega888Theme) => {
    sounds.playClick();
    setSelectedTheme(theme);
    setWinningLines([]);
    setWinTitle(null);
    setLastWinAmount(0);
    // Initialize random 5x3 for this theme
    setGrid([
      [theme.wildSymbol, theme.highSymbols[0], 'A'],
      [theme.highSymbols[1], theme.scatterSymbol, 'K'],
      [theme.highSymbols[2], theme.wildSymbol, 'Q'],
      ['J', theme.highSymbols[3], theme.highSymbols[0]],
      ['10', 'A', theme.highSymbols[1]],
    ]);
  };

  const handleTopupFreeCredits = () => {
    sounds.playCoinChime();
    setArcadeCredit((c) => c + 1500);
  };

  // Open Gamble Double-Up Feature
  const handleOpenGamble = () => {
    if (lastWinAmount <= 0) return;
    sounds.playClick();
    setGamblePot(lastWinAmount);
    setGambleStatus(null);
    setGambleCurrentCard('🂠');
    setIsGambleOpen(true);
  };

  // Execute Gamble Guess (Color: Red/Black 2x, or Suit: 4x)
  const handlePlayGamble = (guess: 'red' | 'black' | 'heart' | 'diamond' | 'spade' | 'club') => {
    sounds.playGambleFlip();
    const suits = ['♥️', '♦️', '♠️', '♣️'];
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    const isRed = randomSuit === '♥️' || randomSuit === '♦️';

    setGambleCurrentCard(randomSuit);
    setGambleHistory((prev) => [randomSuit, ...prev.slice(0, 5)]);

    let won = false;
    let multiplier = 2;

    if (guess === 'red' && isRed) won = true;
    else if (guess === 'black' && !isRed) won = true;
    else if (
      (guess === 'heart' && randomSuit === '♥️') ||
      (guess === 'diamond' && randomSuit === '♦️') ||
      (guess === 'spade' && randomSuit === '♠️') ||
      (guess === 'club' && randomSuit === '♣️')
    ) {
      won = true;
      multiplier = 4;
    }

    if (won) {
      sounds.playCoinChime();
      const newPot = gamblePot * multiplier;
      setGamblePot(newPot);
      setGambleStatus(`MENANG! Pot sekarang ${newPot} Coins!`);
      // Update arcade credit difference
      const gain = newPot - gamblePot;
      setArcadeCredit((c) => c + gain);
      setLastWinAmount(newPot);
    } else {
      sounds.playClick();
      setGambleStatus('Kalah! Pot hangus.');
      setArcadeCredit((c) => Math.max(0, c - gamblePot));
      setLastWinAmount(0);
      setGamblePot(0);
      setTimeout(() => {
        setIsGambleOpen(false);
      }, 1500);
    }
  };

  const filteredThemes = MEGA888_THEMES.filter(
    (t) => categoryFilter === 'ALL' || t.category === categoryFilter
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      {/* Mega888 Regulatory & Arcade Notice */}
      <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex items-start gap-3 text-xs text-amber-200">
        <ShieldCheck className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <p className="font-extrabold text-white flex items-center gap-1.5 flex-wrap">
            <span>Mega888 Casino Slot Engine — 30 Tema Video Slot Arked</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              100% Kredit Percuma Arked & Ganjaran Sah
            </span>
          </p>
          <p className="opacity-90 leading-relaxed text-[11px]">
            Diinspirasikan oleh enjin permainan slot kasino Mega888 yang paling popular (Great Blue, Highway Kings, Safari Heat, Dolphin Reef, Panther Moon) lengkap dengan 20 garisan bayaran, WILD 2X, SCATTER 10 Pusingan Percuma (3x Pengganda), Progressive 4-Tier Jackpots, dan Ciri Double/Gamble.
          </p>
        </div>
      </div>

      {/* Main Mega888 Casino Cabinet Screen */}
      <div
        className={`p-4 md:p-6 rounded-3xl border-2 shadow-2xl bg-gradient-to-br ${selectedTheme.bgGradient} border-amber-500/40 relative overflow-hidden`}
      >
        {/* Top Cabinet Bar: Game Name, 4-Tier Jackpots, Free Spins Badge */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-black/60 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-xl shadow-amber-500/10">
              {selectedTheme.wildSymbol}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  {selectedTheme.category} • 20 Garisan
                </span>
                <span className="text-[10px] text-slate-300 hidden sm:inline">WILD: {selectedTheme.wildName} (2x)</span>
                <span className="text-[10px] text-slate-300 hidden sm:inline">SCATTER: {selectedTheme.scatterName}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                <span>{selectedTheme.name}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-red-600/60 text-red-200 border border-red-400/30 font-bold uppercase tracking-wider">
                  Mega888 Edition
                </span>
              </h3>
            </div>
          </div>

          {/* Mega888 4-Tier Progressive Jackpots Ticker Display */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full lg:w-auto">
            {/* Grand */}
            <div className="p-2 rounded-xl bg-slate-950/90 border border-amber-400/50 text-center shadow-md">
              <span className="text-[8px] font-black tracking-widest text-amber-400 block uppercase animate-pulse">
                GRAND
              </span>
              <span className="text-xs md:text-sm font-black text-amber-300 font-mono tabular-nums">
                {grandJackpot.toLocaleString()}
              </span>
            </div>
            {/* Major */}
            <div className="p-2 rounded-xl bg-slate-950/90 border border-purple-400/40 text-center shadow-md">
              <span className="text-[8px] font-black tracking-widest text-purple-400 block uppercase">
                MAJOR
              </span>
              <span className="text-xs md:text-sm font-black text-purple-300 font-mono tabular-nums">
                {majorJackpot.toLocaleString()}
              </span>
            </div>
            {/* Minor */}
            <div className="p-2 rounded-xl bg-slate-950/90 border border-blue-400/40 text-center shadow-md">
              <span className="text-[8px] font-black tracking-widest text-blue-400 block uppercase">
                MINOR
              </span>
              <span className="text-xs md:text-sm font-black text-blue-300 font-mono tabular-nums">
                {minorJackpot.toLocaleString()}
              </span>
            </div>
            {/* Mini */}
            <div className="p-2 rounded-xl bg-slate-950/90 border border-emerald-400/40 text-center shadow-md">
              <span className="text-[8px] font-black tracking-widest text-emerald-400 block uppercase">
                MINI
              </span>
              <span className="text-xs md:text-sm font-black text-emerald-300 font-mono tabular-nums">
                {miniJackpot.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Free Spins Banner Active */}
        {freeSpinsRemaining > 0 && (
          <div className="mb-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 text-white font-black text-xs md:text-sm shadow-xl flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 fill-white text-yellow-300" />
              <span>FREE SPINS BONUS MODE: 3X MULTIPLIER AKTIF!</span>
            </div>
            <div className="font-mono bg-black/40 px-3 py-1 rounded-xl">
              {freeSpinsRemaining} PUSINGAN BAKI (Menang: {freeSpinsTotalWin} Coins)
            </div>
          </div>
        )}

        {/* 5 REELS X 3 ROWS VIDEO SLOT MATRIX WITH LEFT & RIGHT PAYLINE MARKERS */}
        <div className="my-3 p-2 md:p-4 rounded-3xl bg-slate-950/95 border-4 border-amber-500/60 shadow-2xl relative flex items-center gap-2">
          {/* Left Payline Markers (1 to 10) */}
          <div className="hidden sm:flex flex-col justify-between gap-1 py-1">
            {Array.from({ length: 10 }).map((_, idx) => {
              const lineNum = idx + 1;
              const isHit = winningLines.includes(lineNum);
              return (
                <div
                  key={lineNum}
                  style={{ backgroundColor: isHit ? PAYLINE_COLORS[idx] : undefined }}
                  className={`w-6 h-5 rounded flex items-center justify-center text-[10px] font-black transition-all ${
                    isHit
                      ? 'text-white shadow-lg shadow-amber-500/40 scale-110 font-bold border border-white'
                      : 'bg-slate-900 border border-slate-800 text-slate-500'
                  }`}
                  title={`Payline #${lineNum}`}
                >
                  {lineNum}
                </div>
              );
            })}
          </div>

          {/* 5 Reel Columns */}
          <div className="grid grid-cols-5 gap-1.5 md:gap-3 flex-1">
            {grid.map((column, colIdx) => (
              <div
                key={colIdx}
                className={`flex flex-col gap-1.5 md:gap-2.5 p-1 md:p-2 rounded-2xl bg-slate-900/95 border border-slate-800 transition-all duration-100 ${
                  isSpinning ? 'scale-98 opacity-90' : 'scale-100'
                }`}
              >
                {column.map((symbol, rowIdx) => {
                  const isWild = symbol === selectedTheme.wildSymbol;
                  const isScatter = symbol === selectedTheme.scatterSymbol;

                  return (
                    <div
                      key={rowIdx}
                      className={`h-20 sm:h-24 md:h-28 rounded-xl flex flex-col items-center justify-center relative select-none transition-transform shadow-inner ${
                        isWild
                          ? 'bg-amber-500/25 border-2 border-amber-400 shadow-amber-500/40 animate-pulse'
                          : isScatter
                          ? 'bg-purple-500/25 border-2 border-purple-400 shadow-purple-500/40'
                          : 'bg-slate-800/90 border border-slate-700/70 hover:border-slate-500'
                      }`}
                    >
                      <span className="text-3xl sm:text-4xl md:text-5xl">{symbol}</span>
                      {isWild && (
                        <span className="text-[7px] md:text-[9px] font-black uppercase tracking-wider text-amber-300 mt-1">
                          WILD 2X
                        </span>
                      )}
                      {isScatter && (
                        <span className="text-[7px] md:text-[9px] font-black uppercase tracking-wider text-purple-300 mt-1">
                          SCATTER
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Right Payline Markers (11 to 20) */}
          <div className="hidden sm:flex flex-col justify-between gap-1 py-1">
            {Array.from({ length: 10 }).map((_, idx) => {
              const lineNum = idx + 11;
              const isHit = winningLines.includes(lineNum);
              return (
                <div
                  key={lineNum}
                  style={{ backgroundColor: isHit ? PAYLINE_COLORS[idx + 10] : undefined }}
                  className={`w-6 h-5 rounded flex items-center justify-center text-[10px] font-black transition-all ${
                    isHit
                      ? 'text-white shadow-lg shadow-amber-500/40 scale-110 font-bold border border-white'
                      : 'bg-slate-900 border border-slate-800 text-slate-500'
                  }`}
                  title={`Payline #${lineNum}`}
                >
                  {lineNum}
                </div>
              );
            })}
          </div>

          {/* Win Tier Overlay Alert */}
          {winTitle && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20 animate-slide-up rounded-2xl">
              <span className="text-2xl sm:text-4xl md:text-5xl font-black text-amber-300 drop-shadow-xl tracking-wider animate-bounce">
                {winTitle}
              </span>
              <span className="text-3xl sm:text-5xl md:text-6xl font-black text-white font-mono mt-1 tabular-nums drop-shadow-md">
                +{lastWinAmount} COINS
              </span>
              {winningLines.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
                  <span className="text-xs text-slate-300 font-semibold mr-1">
                    Mengena Garisan:
                  </span>
                  {winningLines.map((l) => (
                    <span
                      key={l}
                      className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500 text-slate-950"
                    >
                      Line #{l}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Status Win Bar & Credit Controller */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-white/10 text-xs font-bold text-slate-300 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Garisan:</span>
            <span className="font-extrabold text-white">20 Lines (Tetap)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Taruhan Baris:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 5, 10, 20].map((bet) => (
                <button
                  key={bet}
                  onClick={() => setBetPerLine(bet)}
                  disabled={isSpinning}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition ${
                    betPerLine === bet
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {bet}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Jumlah Taruhan:</span>
            <span className="font-black text-amber-300 tabular-nums font-mono text-sm">
              {totalBet} Coins
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Kredit Arkad:</span>
            <span className="font-black text-emerald-400 tabular-nums font-mono text-sm">
              {arcadeCredit.toLocaleString()}
            </span>
            <button
              onClick={handleTopupFreeCredits}
              className="text-[10px] text-blue-400 underline hover:text-blue-300 ml-1"
            >
              +Tambah Percuma
            </button>
          </div>
        </div>

        {/* Real Mega888-Style Console Controls & 3D Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Paytable (Jadual Bayaran) Info Button */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsPaytableOpen(true);
            }}
            className="btn-3d btn-3d-subtle py-3 px-4 rounded-2xl text-xs font-black flex items-center gap-1.5 text-slate-300"
            title="Buka Jadual Bayaran Mega888"
          >
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span>Paytable</span>
          </button>

          {/* Gamble (Double-Up) Feature Button */}
          <button
            onClick={handleOpenGamble}
            disabled={lastWinAmount <= 0 || isSpinning}
            className={`btn-3d py-3 px-4 rounded-2xl text-xs font-black flex items-center gap-1.5 transition ${
              lastWinAmount > 0
                ? 'btn-3d-purple text-white animate-bounce'
                : 'btn-3d-subtle text-slate-500 opacity-50 cursor-not-allowed'
            }`}
            title="Gandakan Kemenangan dengan Teka Kad"
          >
            <Dices className="w-4 h-4 text-amber-400" />
            <span>Gamble 2X</span>
          </button>

          {/* Turbo Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsTurbo(!isTurbo);
            }}
            className={`btn-3d py-3 px-4 rounded-2xl text-xs font-black flex items-center gap-1.5 ${
              isTurbo ? 'btn-3d-purple text-white' : 'btn-3d-subtle text-slate-300'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Turbo {isTurbo ? 'ON' : 'OFF'}</span>
          </button>

          {/* Auto Spin Trigger */}
          <button
            onClick={() => {
              sounds.playClick();
              if (autoSpinCount > 0) {
                setAutoSpinCount(0);
              } else {
                setAutoSpinCount(25);
              }
            }}
            className={`btn-3d py-3 px-4 rounded-2xl text-xs font-black flex items-center gap-1.5 ${
              autoSpinCount > 0 ? 'bg-rose-600 text-white' : 'btn-3d-subtle text-slate-300'
            }`}
          >
            {autoSpinCount > 0 ? <Pause className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
            <span>{autoSpinCount > 0 ? `Auto: ${autoSpinCount}` : 'Auto (25)'}</span>
          </button>

          {/* Big Golden Mega888 SPIN Button */}
          <button
            onClick={() => executeSpin(false)}
            disabled={isSpinning || freeSpinsRemaining > 0}
            className="btn-3d btn-3d-gold py-3.5 px-10 rounded-2xl font-black text-slate-950 text-base tracking-wider flex items-center justify-center gap-2.5 shadow-2xl disabled:opacity-50 min-w-[200px]"
          >
            <Sparkles className="w-5 h-5 fill-slate-950" />
            <span>{isSpinning ? 'MEMUTAR...' : 'SPIN (PUTAR)'}</span>
          </button>
        </div>
      </div>

      {/* 30 Mega888 Slot Themes Selection Gallery */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-lg font-black text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Koleksi 30 Permainan Slot Mega888</span>
            </h4>
            <p className="text-xs text-slate-400">
              Pilih mana-mana tema kegemaran anda untuk menukar gelendong 5x3 dan ciri pusingan bonus.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
            {['ALL', 'Popular Mega', 'Classic', 'Adventure', 'Oriental', 'Myth'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                  categoryFilter === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'ALL' ? 'Semua (30)' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* 30 Themes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {filteredThemes.map((theme) => {
            const isSelected = selectedTheme.id === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => handleSelectTheme(theme)}
                className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-2xl">{theme.wildSymbol}</span>
                  <span className="text-[9px] font-mono text-slate-400">#{theme.id}</span>
                </div>
                <div className="font-extrabold text-xs text-white group-hover:text-amber-300 truncate">
                  {theme.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{theme.tagline}</div>
                <div className="text-[9px] font-bold text-amber-400 mt-1 flex items-center justify-between">
                  <span>20 Lines</span>
                  <span>{theme.category}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MODAL 1: PAYTABLE & JADUAL BAYARAN */}
      {isPaytableOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border border-amber-500/50 rounded-3xl p-6 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black">{selectedTheme.name} — Jadual Bayaran</h3>
              </div>
              <button
                onClick={() => setIsPaytableOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wild & Scatter Rules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                <div className="flex items-center gap-2 font-black text-amber-300">
                  <span className="text-2xl">{selectedTheme.wildSymbol}</span>
                  <span>WILD: {selectedTheme.wildName} (2x)</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Menggantikan semua simbol kecuali SCATTER. Setiap kombinasi kemenangan yang mengandungi simbol WILD akan digandakan sebanyak <strong>2X GANDA</strong>!
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-1">
                <div className="flex items-center gap-2 font-black text-purple-300">
                  <span className="text-2xl">{selectedTheme.scatterSymbol}</span>
                  <span>SCATTER: {selectedTheme.scatterName}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  3 atau lebih simbol SCATTER di mana-mana kedudukan akan mencetuskan <strong>10 Pusingan Percuma (Free Spins)</strong> dengan <strong>3X GANDA</strong> untuk semua kemenangan!
                </p>
              </div>
            </div>

            {/* Payout Matrix */}
            <div>
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2">
                Kadar Bayaran Simbol (Taruhan x Pengganda)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {selectedTheme.highSymbols.map((sym, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between"
                  >
                    <span className="text-3xl">{sym}</span>
                    <div className="text-right text-[11px] text-slate-300">
                      <div>5x: <strong className="text-amber-400">60x</strong></div>
                      <div>4x: <strong className="text-amber-400">18x</strong></div>
                      <div>3x: <strong className="text-amber-400">5x</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 20 Paylines Diagrams Info */}
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-white block">Sistem 20 Garisan Bayaran Tetap:</span>
              <p className="text-[11px] text-slate-400">
                Kemenangan dibayar dari kiri ke kanan bermula dari gelendong 1. Bayaran tertinggi bagi setiap garisan akan dikreditkan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: GAMBLE / DOUBLE-UP FEATURE */}
      {isGambleOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500 rounded-3xl p-6 shadow-2xl text-white space-y-5 text-center">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Dices className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black">Mega888 Double-Up Gamble</h3>
              </div>
              <button
                onClick={() => setIsGambleOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pot Amount */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30">
              <span className="text-xs text-amber-300 font-bold uppercase tracking-wider block">
                Jumlah Pot Kemenangan
              </span>
              <span className="text-3xl font-black text-amber-300 font-mono tabular-nums">
                {gamblePot} Coins
              </span>
            </div>

            {/* Card Display */}
            <div className="py-4">
              <div className="w-28 h-40 mx-auto rounded-2xl bg-slate-800 border-2 border-white/20 shadow-2xl flex items-center justify-center text-7xl select-none animate-pulse">
                {gambleCurrentCard}
              </div>
              {gambleStatus && (
                <p className="mt-3 text-sm font-black text-amber-300 animate-bounce">
                  {gambleStatus}
                </p>
              )}
            </div>

            {/* History strip */}
            <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
              <span className="text-xs">Sejarah:</span>
              {gambleHistory.map((s, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                  {s}
                </span>
              ))}
            </div>

            {/* Guess Options: Red / Black (2x) */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 block uppercase">
                Teka Warna (2X Gandakan Pot)
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handlePlayGamble('red')}
                  disabled={gamblePot <= 0}
                  className="btn-3d py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm shadow-md"
                >
                  ♥️ MERAH (2X)
                </button>
                <button
                  onClick={() => handlePlayGamble('black')}
                  disabled={gamblePot <= 0}
                  className="btn-3d py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-sm border border-slate-600 shadow-md"
                >
                  ♠️ HITAM (2X)
                </button>
              </div>
            </div>

            {/* Guess Suit (4x) */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-400 block uppercase">
                Atau Teka Daun (4X Gandakan Pot)
              </span>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handlePlayGamble('heart')}
                  disabled={gamblePot <= 0}
                  className="btn-3d py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-red-500 font-bold text-lg border border-slate-700"
                >
                  ♥️
                </button>
                <button
                  onClick={() => handlePlayGamble('diamond')}
                  disabled={gamblePot <= 0}
                  className="btn-3d py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-red-500 font-bold text-lg border border-slate-700"
                >
                  ♦️
                </button>
                <button
                  onClick={() => handlePlayGamble('spade')}
                  disabled={gamblePot <= 0}
                  className="btn-3d py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg border border-slate-700"
                >
                  ♠️
                </button>
                <button
                  onClick={() => handlePlayGamble('club')}
                  disabled={gamblePot <= 0}
                  className="btn-3d py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg border border-slate-700"
                >
                  ♣️
                </button>
              </div>
            </div>

            {/* Collect Button */}
            <button
              onClick={() => {
                sounds.playCoinChime();
                setIsGambleOpen(false);
              }}
              className="w-full btn-3d btn-3d-gold py-2.5 rounded-xl font-black text-slate-950 text-xs"
            >
              Simpan & Kutip ({gamblePot} Coins)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
