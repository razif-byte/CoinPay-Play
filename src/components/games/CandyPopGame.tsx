import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, RotateCcw, Play, Heart } from 'lucide-react';

interface CandyPopGameProps {
  onEarnCoins: (coins: number, gameTitle: string) => void;
  isDark: boolean;
}

const CANDY_TYPES = ['🍬', '🍭', '🍫', '🍩', '🧁', '🍓'];
const GRID_SIZE = 7;

export const CandyPopGame: React.FC<CandyPopGameProps> = ({ onEarnCoins }) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(20);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(2400);

  // Initialize random grid
  const initBoard = () => {
    sounds.playClick();
    const newGrid: string[][] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      const row: string[] = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        row.push(CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)]);
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setScore(0);
    setMovesLeft(20);
    setGameOver(false);
    setSelectedCell(null);
  };

  useEffect(() => {
    initBoard();
  }, []);

  const handleCellClick = (r: number, c: number) => {
    if (gameOver || movesLeft <= 0) return;

    if (!selectedCell) {
      sounds.playClick();
      setSelectedCell({ r, c });
    } else {
      const dr = Math.abs(selectedCell.r - r);
      const dc = Math.abs(selectedCell.c - c);

      // Check if adjacent
      if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
        swapCells(selectedCell.r, selectedCell.c, r, c);
      } else {
        sounds.playClick();
        setSelectedCell({ r, c });
      }
    }
  };

  const swapCells = (r1: number, c1: number, r2: number, c2: number) => {
    const newGrid = grid.map((row) => [...row]);
    const temp = newGrid[r1][c1];
    newGrid[r1][c1] = newGrid[r2][c2];
    newGrid[r2][c2] = temp;

    setSelectedCell(null);
    setMovesLeft((m) => {
      const nextMoves = m - 1;
      if (nextMoves <= 0) {
        setGameOver(true);
      }
      return nextMoves;
    });

    // Check matches
    const matches = findMatches(newGrid);
    if (matches.length > 0) {
      sounds.playCoinChime();
      const points = matches.length * 30;
      setScore((s) => s + points);
      if (matches.length >= 5) {
        confetti({ particleCount: 40, spread: 50 });
      }

      // Clear matches and refill
      matches.forEach(({ r, c }) => {
        newGrid[r][c] = '';
      });

      // Drop down candies
      for (let c = 0; c < GRID_SIZE; c++) {
        let emptySpot = GRID_SIZE - 1;
        for (let r = GRID_SIZE - 1; r >= 0; r--) {
          if (newGrid[r][c] !== '') {
            newGrid[emptySpot][c] = newGrid[r][c];
            if (emptySpot !== r) newGrid[r][c] = '';
            emptySpot--;
          }
        }
        for (let r = emptySpot; r >= 0; r--) {
          newGrid[r][c] = CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)];
        }
      }

      setGrid(newGrid);
    } else {
      // Revert if no match
      setGrid(newGrid);
    }
  };

  const findMatches = (g: string[][]) => {
    const matchedCoords: { r: number; c: number }[] = [];

    // Check rows
    for (let r = 0; r < GRID_SIZE; r++) {
      let count = 1;
      for (let c = 1; c < GRID_SIZE; c++) {
        if (g[r][c] && g[r][c] === g[r][c - 1]) {
          count++;
        } else {
          if (count >= 3) {
            for (let k = 1; k <= count; k++) matchedCoords.push({ r, c: c - k });
          }
          count = 1;
        }
      }
      if (count >= 3) {
        for (let k = 0; k < count; k++) matchedCoords.push({ r, c: GRID_SIZE - 1 - k });
      }
    }

    // Check columns
    for (let c = 0; c < GRID_SIZE; c++) {
      let count = 1;
      for (let r = 1; r < GRID_SIZE; r++) {
        if (g[r][c] && g[r][c] === g[r - 1][c]) {
          count++;
        } else {
          if (count >= 3) {
            for (let k = 1; k <= count; k++) matchedCoords.push({ r: r - k, c });
          }
          count = 1;
        }
      }
      if (count >= 3) {
        for (let k = 0; k < count; k++) matchedCoords.push({ r: GRID_SIZE - 1 - k, c });
      }
    }

    return matchedCoords;
  };

  const handleEndGameClaim = () => {
    const earned = Math.min(Math.floor(score / 50), 30);
    if (earned > 0) {
      onEarnCoins(earned, 'Candy Pop Rush');
      sounds.playWinFanfare();
    }
    initBoard();
  };

  return (
    <div className="max-w-md mx-auto p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider block">Padanan 3 Arked</span>
          <h3 className="text-xl font-black text-white">Candy Pop Rush</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs">
            <span className="text-slate-400 block text-[9px]">Langkah</span>
            <span className="font-extrabold text-amber-400 tabular-nums">{movesLeft} Baki</span>
          </div>
          <div className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs">
            <span className="text-slate-400 block text-[9px]">Skor</span>
            <span className="font-extrabold text-white tabular-nums">{score}</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1.5 p-3 rounded-2xl bg-slate-950 border border-slate-800 mb-4 select-none">
        {grid.map((row, r) =>
          row.map((candy, c) => {
            const isSelected = selectedCell?.r === r && selectedCell?.c === c;
            return (
              <button
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                className={`w-full aspect-square rounded-xl flex items-center justify-center text-2xl transition-all duration-150 ${
                  isSelected
                    ? 'bg-pink-600/40 border-2 border-pink-400 scale-105 shadow-md'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50'
                }`}
              >
                {candy}
              </button>
            );
          })
        )}
      </div>

      {/* Footer controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={initBoard}
          className="btn-3d btn-3d-subtle px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Mula Semula</span>
        </button>

        <span className="text-[11px] text-slate-400">
          Padankan 3 atau lebih objek sepadan
        </span>
      </div>

      {/* Game Over Modal */}
      {gameOver && (
        <div className="mt-4 p-4 rounded-2xl bg-slate-800/90 border border-slate-700 text-center animate-fade-in">
          <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-1" />
          <h4 className="text-base font-extrabold text-white">Permainan Selesai!</h4>
          <p className="text-xs text-slate-300 mt-1">
            Skor akhir: <strong className="text-amber-400">{score}</strong> • Ganjaran:{' '}
            <strong className="text-emerald-400">+{Math.min(Math.floor(score / 50), 30)} Coins</strong>
          </p>
          <button
            onClick={handleEndGameClaim}
            className="mt-3 btn-3d btn-3d-primary py-2 px-6 rounded-xl font-bold text-xs text-white"
          >
            Tuntut Coin & Main Semula
          </button>
        </div>
      )}
    </div>
  );
};
