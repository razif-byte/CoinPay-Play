import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../../utils/audio';
import { Music, Play, RotateCcw, Trophy, Sparkles } from 'lucide-react';

interface PianoTapGameProps {
  onEarnCoins: (coins: number, gameTitle: string) => void;
  isDark: boolean;
}

interface Tile {
  id: number;
  col: number; // 0, 1, 2, 3
  y: number; // 0 to 100%
  hit: boolean;
  missed: boolean;
  noteFreq: number;
}

const NOTE_FREQS = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25]; // C4 - C5
const COL_KEYS = ['D', 'F', 'J', 'K'];

export const PianoTapGame: React.FC<PianoTapGameProps> = ({ onEarnCoins }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [hitFeedback, setHitFeedback] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const tileIdRef = useRef(0);

  const handleStart = () => {
    sounds.playClick();
    setScore(0);
    setCombo(0);
    setTiles([]);
    setHitFeedback(null);
    setGameOver(false);
    setIsPlaying(true);
    tileIdRef.current = 0;
  };

  // Spawn tiles
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const spawnInterval = setInterval(() => {
      const col = Math.floor(Math.random() * 4);
      const noteFreq = NOTE_FREQS[Math.floor(Math.random() * NOTE_FREQS.length)];
      setTiles((prev) => [
        ...prev,
        {
          id: tileIdRef.current++,
          col,
          y: -10,
          hit: false,
          missed: false,
          noteFreq,
        },
      ]);
    }, 700);

    return () => clearInterval(spawnInterval);
  }, [isPlaying, gameOver]);

  // Game loop to move tiles down
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveInterval = setInterval(() => {
      setTiles((prev) => {
        const nextTiles: Tile[] = [];
        let missesCount = 0;

        for (const t of prev) {
          const newY = t.y + 2.5;

          // Check if passed without hit
          if (newY > 100 && !t.hit && !t.missed) {
            missesCount++;
            nextTiles.push({ ...t, y: newY, missed: true });
          } else if (newY <= 110) {
            nextTiles.push({ ...t, y: newY });
          }
        }

        if (missesCount > 0) {
          setCombo(0);
          setHitFeedback('MISS');
          setTimeout(() => setHitFeedback(null), 500);
        }

        // Limit game to 35 tiles
        if (tileIdRef.current >= 35 && nextTiles.length === 0) {
          setGameOver(true);
        }

        return nextTiles;
      });
    }, 40);

    return () => clearInterval(moveInterval);
  }, [isPlaying, gameOver]);

  // Handle tap in column
  const handleTap = (col: number) => {
    if (!isPlaying || gameOver) return;

    // Find lowest unhit tile in this column that is near hit zone (y between 70 and 98)
    const target = tiles.find((t) => t.col === col && !t.hit && !t.missed && t.y >= 60 && t.y <= 100);

    if (target) {
      sounds.playPianoNote(target.noteFreq);
      target.hit = true;

      // Accuracy
      const isPerfect = Math.abs(target.y - 82) < 10;
      const points = isPerfect ? 100 : 50;

      setScore((s) => s + points + combo * 5);
      setCombo((c) => c + 1);
      setHitFeedback(isPerfect ? 'PERFECT! 🎶' : 'GOOD! 🎵');
      setTimeout(() => setHitFeedback(null), 400);
    } else {
      setCombo(0);
    }
  };

  // Keyboard binding
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') handleTap(0);
      if (e.key === 'f' || e.key === 'F') handleTap(1);
      if (e.key === 'j' || e.key === 'J') handleTap(2);
      if (e.key === 'k' || e.key === 'K') handleTap(3);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tiles, isPlaying, gameOver]);

  const handleClaim = () => {
    const earned = Math.min(Math.floor(score / 60), 30);
    if (earned > 0) {
      onEarnCoins(earned, 'Piano Rhythm Tap');
      sounds.playWinFanfare();
    }
    handleStart();
  };

  return (
    <div className="max-w-md mx-auto p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Irama & Ketukan Muzik</span>
          <h3 className="text-xl font-black text-white">Piano Rhythm Tap</h3>
        </div>
        <div className="flex items-center gap-2">
          {combo > 1 && (
            <div className="px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 font-black text-xs animate-pulse">
              {combo}x Combo!
            </div>
          )}
          <div className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs">
            <span className="text-slate-400 block text-[9px]">Skor</span>
            <span className="font-extrabold text-white tabular-nums">{score}</span>
          </div>
        </div>
      </div>

      {/* 4 Track Piano Highway */}
      <div className="relative mx-auto w-full h-[380px] rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-800 flex shadow-inner">
        {/* 4 Lanes */}
        {[0, 1, 2, 3].map((col) => (
          <div
            key={col}
            className="flex-1 border-r border-slate-800/80 last:border-r-0 relative flex flex-col justify-end"
          >
            {/* Lane Key Label */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-600">
              {COL_KEYS[col]}
            </div>

            {/* Falling Tiles */}
            {tiles
              .filter((t) => t.col === col && !t.hit)
              .map((t) => (
                <div
                  key={t.id}
                  className={`absolute w-[90%] left-[5%] h-12 rounded-xl shadow-lg transition-transform ${
                    t.missed
                      ? 'bg-rose-600/40 border border-rose-500'
                      : 'bg-gradient-to-b from-blue-400 to-indigo-600 border border-blue-300 shadow-blue-500/30'
                  }`}
                  style={{ top: `${t.y}%` }}
                />
              ))}

            {/* Hit Target Line Zone */}
            <button
              onClick={() => handleTap(col)}
              className="w-full h-16 border-t-2 border-dashed border-emerald-400/50 bg-slate-900/40 hover:bg-emerald-500/20 active:bg-emerald-500/40 flex items-center justify-center text-xs font-black text-slate-400 active:text-white transition"
            >
              {COL_KEYS[col]}
            </button>
          </div>
        ))}

        {/* Hit Feedback Float */}
        {hitFeedback && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-2xl bg-slate-900/90 border border-amber-400/50 text-amber-300 font-black text-sm tracking-widest shadow-2xl animate-bounce">
            {hitFeedback}
          </div>
        )}

        {/* Start Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 z-20 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
            <Music className="w-10 h-10 text-emerald-400 mb-2 animate-bounce" />
            <h4 className="text-lg font-black">Ketukan Melodi Piano</h4>
            <p className="text-xs text-slate-300 mt-1 mb-4">
              Ketik jubin muzik tepat pada garisan sasaran mengikut rentak. Gunakan kekunci <strong>D, F, J, K</strong> atau sentuh skrin!
            </p>
            <button
              onClick={handleStart}
              className="btn-3d btn-3d-primary py-2.5 px-6 rounded-xl font-bold text-xs"
            >
              Mula Main Piano
            </button>
          </div>
        )}

        {/* Game Over */}
        {gameOver && (
          <div className="absolute inset-0 z-20 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white animate-fade-in">
            <Trophy className="w-10 h-10 text-amber-400 mb-2" />
            <h4 className="text-xl font-black">Lagu Selesai!</h4>
            <p className="text-xs text-slate-300 mt-1 mb-4">
              Skor: <strong className="text-amber-400">{score}</strong> • Kombo Tertinggi: <strong className="text-emerald-400">{combo}</strong>
            </p>
            <button
              onClick={handleClaim}
              className="btn-3d btn-3d-primary py-2.5 px-6 rounded-xl font-bold text-xs"
            >
              Tuntut Reward Coin & Main Semula
            </button>
          </div>
        )}
      </div>

      <p className="text-center text-[11px] text-slate-400 mt-3">
        Tekan kekunci [D] [F] [J] [K] atau sentuh bahagian bawah lorong.
      </p>
    </div>
  );
};
