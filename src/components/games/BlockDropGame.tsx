import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../../utils/audio';
import { RotateCw, ArrowLeft, ArrowRight, ArrowDown, Play, Pause, RotateCcw, Trophy } from 'lucide-react';

interface BlockDropGameProps {
  onEarnCoins: (coins: number, gameTitle: string) => void;
  isDark: boolean;
}

const COLS = 10;
const ROWS = 18;

const SHAPES = [
  // I
  [[1, 1, 1, 1]],
  // O
  [
    [1, 1],
    [1, 1],
  ],
  // T
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  // L
  [
    [1, 0, 0],
    [1, 1, 1],
  ],
  // J
  [
    [0, 0, 1],
    [1, 1, 1],
  ],
  // S
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  // Z
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
];

const COLORS = ['#38bdf8', '#facc15', '#c084fc', '#fb923c', '#60a5fa', '#4ade80', '#f87171'];

export const BlockDropGame: React.FC<BlockDropGameProps> = ({ onEarnCoins }) => {
  const [board, setBoard] = useState<string[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(''))
  );
  const [currentPiece, setCurrentPiece] = useState<{
    shape: number[][];
    color: string;
    r: number;
    c: number;
  } | null>(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const spawnPiece = () => {
    const idx = Math.floor(Math.random() * SHAPES.length);
    const shape = SHAPES[idx];
    const color = COLORS[idx];
    const piece = {
      shape,
      color,
      r: 0,
      c: Math.floor((COLS - shape[0].length) / 2),
    };

    // check collision on spawn
    if (checkCollision(piece.r, piece.c, piece.shape, board)) {
      setGameOver(true);
      return null;
    }
    return piece;
  };

  const checkCollision = (r: number, c: number, shape: number[][], b: string[][]) => {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newR = r + row;
          const newC = c + col;
          if (newR >= ROWS || newC < 0 || newC >= COLS) return true;
          if (newR >= 0 && b[newR][newC] !== '') return true;
        }
      }
    }
    return false;
  };

  const moveLeft = () => {
    if (!currentPiece || isPaused || gameOver) return;
    if (!checkCollision(currentPiece.r, currentPiece.c - 1, currentPiece.shape, board)) {
      sounds.playClick();
      setCurrentPiece({ ...currentPiece, c: currentPiece.c - 1 });
    }
  };

  const moveRight = () => {
    if (!currentPiece || isPaused || gameOver) return;
    if (!checkCollision(currentPiece.r, currentPiece.c + 1, currentPiece.shape, board)) {
      sounds.playClick();
      setCurrentPiece({ ...currentPiece, c: currentPiece.c + 1 });
    }
  };

  const rotate = () => {
    if (!currentPiece || isPaused || gameOver) return;
    const rotated = currentPiece.shape[0].map((_, index) =>
      currentPiece.shape.map((row) => row[index]).reverse()
    );
    if (!checkCollision(currentPiece.r, currentPiece.c, rotated, board)) {
      sounds.playClick();
      setCurrentPiece({ ...currentPiece, shape: rotated });
    }
  };

  const drop = () => {
    if (!currentPiece || isPaused || gameOver) return;
    if (!checkCollision(currentPiece.r + 1, currentPiece.c, currentPiece.shape, board)) {
      setCurrentPiece({ ...currentPiece, r: currentPiece.r + 1 });
    } else {
      lockPiece();
    }
  };

  const lockPiece = () => {
    if (!currentPiece) return;
    const newBoard = board.map((row) => [...row]);
    currentPiece.shape.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val) {
          const boardR = currentPiece.r + r;
          const boardC = currentPiece.c + c;
          if (boardR >= 0 && boardR < ROWS && boardC >= 0 && boardC < COLS) {
            newBoard[boardR][boardC] = currentPiece.color;
          }
        }
      });
    });

    // Check completed lines
    let cleared = 0;
    const filteredBoard = newBoard.filter((row) => row.some((cell) => cell === ''));
    cleared = ROWS - filteredBoard.length;

    if (cleared > 0) {
      sounds.playCoinChime();
      const emptyRows = Array.from({ length: cleared }, () => Array(COLS).fill(''));
      setBoard([...emptyRows, ...filteredBoard]);
      setScore((s) => s + cleared * 100);
      setLines((l) => l + cleared);
    } else {
      setBoard(newBoard);
    }

    const next = spawnPiece();
    setCurrentPiece(next);
  };

  useEffect(() => {
    if (!hasStarted || isPaused || gameOver) return;
    const interval = setInterval(() => {
      drop();
    }, 650);
    return () => clearInterval(interval);
  }, [currentPiece, board, hasStarted, isPaused, gameOver]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') moveLeft();
      if (e.key === 'ArrowRight') moveRight();
      if (e.key === 'ArrowDown') drop();
      if (e.key === 'ArrowUp') rotate();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentPiece, board, isPaused, gameOver]);

  const handleStart = () => {
    sounds.playClick();
    const freshBoard = Array.from({ length: ROWS }, () => Array(COLS).fill(''));
    setBoard(freshBoard);
    setScore(0);
    setLines(0);
    setGameOver(false);
    setIsPaused(false);
    setHasStarted(true);

    const idx = Math.floor(Math.random() * SHAPES.length);
    setCurrentPiece({
      shape: SHAPES[idx],
      color: COLORS[idx],
      r: 0,
      c: 3,
    });
  };

  const handleClaimAndReset = () => {
    const earned = Math.min(Math.floor(score / 50), 30);
    if (earned > 0) {
      onEarnCoins(earned, 'Block Drop Quest');
      sounds.playWinFanfare();
    }
    handleStart();
  };

  // Render combined grid with falling piece
  const displayGrid = board.map((row) => [...row]);
  if (currentPiece) {
    currentPiece.shape.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val) {
          const br = currentPiece.r + r;
          const bc = currentPiece.c + c;
          if (br >= 0 && br < ROWS && bc >= 0 && bc < COLS) {
            displayGrid[br][bc] = currentPiece.color;
          }
        }
      });
    });
  }

  return (
    <div className="max-w-md mx-auto p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Teka-Teki Blok Arked</span>
          <h3 className="text-xl font-black text-white">Block Drop Quest</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs">
            <span className="text-slate-400 block text-[9px]">Garisan</span>
            <span className="font-extrabold text-blue-400 tabular-nums">{lines}</span>
          </div>
          <div className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs">
            <span className="text-slate-400 block text-[9px]">Skor</span>
            <span className="font-extrabold text-white tabular-nums">{score}</span>
          </div>
        </div>
      </div>

      {/* Tetris Board */}
      <div className="relative mx-auto w-64 h-[360px] p-1.5 rounded-2xl bg-slate-950 border-2 border-slate-800 grid grid-cols-10 gap-0.5 shadow-inner">
        {displayGrid.map((row, r) =>
          row.map((color, c) => (
            <div
              key={`${r}-${c}`}
              className="rounded-sm transition-colors duration-75"
              style={{
                backgroundColor: color || '#1e293b20',
                border: color ? '1px solid rgba(255,255,255,0.2)' : 'none',
              }}
            />
          ))
        )}

        {!hasStarted && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-xs rounded-xl p-4 text-center">
            <h4 className="text-lg font-black text-white mb-2">Sedia Menjatuhkan Blok?</h4>
            <p className="text-xs text-slate-300 mb-4">
              Susun dan padankan barisan penuh untuk mendapatkan markah dan ganjaran coin!
            </p>
            <button
              onClick={handleStart}
              className="btn-3d btn-3d-primary py-2.5 px-6 rounded-xl font-bold text-xs text-white"
            >
              Mula Main
            </button>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          onClick={moveLeft}
          className="btn-3d btn-3d-subtle p-3 rounded-xl text-white active:bg-blue-600"
          aria-label="Kiri"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={rotate}
          className="btn-3d btn-3d-subtle p-3 rounded-xl text-amber-400 active:bg-amber-600"
          aria-label="Putar"
        >
          <RotateCw className="w-5 h-5" />
        </button>
        <button
          onClick={drop}
          className="btn-3d btn-3d-subtle p-3 rounded-xl text-white active:bg-blue-600"
          aria-label="Jatuh"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
        <button
          onClick={moveRight}
          className="btn-3d btn-3d-subtle p-3 rounded-xl text-white active:bg-blue-600"
          aria-label="Kanan"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="btn-3d btn-3d-subtle p-3 rounded-xl text-slate-300"
          aria-label="Jeda"
        >
          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </button>
      </div>

      {/* Game Over Screen */}
      {gameOver && (
        <div className="mt-4 p-4 rounded-2xl bg-slate-800 border border-slate-700 text-center animate-fade-in">
          <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-1" />
          <h4 className="text-base font-extrabold text-white">Permainan Tamat!</h4>
          <p className="text-xs text-slate-300 mt-1">
            Skor: <strong className="text-amber-400">{score}</strong> • Garisan:{' '}
            <strong className="text-blue-400">{lines}</strong>
          </p>
          <button
            onClick={handleClaimAndReset}
            className="mt-3 btn-3d btn-3d-primary py-2 px-6 rounded-xl font-bold text-xs text-white"
          >
            Tuntut Coin & Main Semula
          </button>
        </div>
      )}
    </div>
  );
};
