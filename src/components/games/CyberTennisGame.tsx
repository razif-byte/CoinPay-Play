import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../../utils/audio';
import { Trophy, Play, RotateCcw, Zap, ArrowLeft, ArrowRight } from 'lucide-react';

interface CyberTennisGameProps {
  onEarnCoins: (coins: number, gameTitle: string) => void;
  isDark: boolean;
}

export const CyberTennisGame: React.FC<CyberTennisGameProps> = ({ onEarnCoins }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [rally, setRally] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const stateRef = useRef({
    playerX: 150,
    aiX: 150,
    ballX: 150,
    ballY: 200,
    ballVx: 3,
    ballVy: 4,
    paddleWidth: 70,
    paddleHeight: 12,
    courtWidth: 320,
    courtHeight: 420,
  });

  const handleStart = () => {
    sounds.playClick();
    setPlayerScore(0);
    setAiScore(0);
    setRally(0);
    setWinner(null);
    setIsPlaying(true);
    resetBall(1);
  };

  const resetBall = (direction: number) => {
    const s = stateRef.current;
    s.ballX = s.courtWidth / 2;
    s.ballY = s.courtHeight / 2;
    const speed = difficulty === 'hard' ? 5 : difficulty === 'medium' ? 4 : 3;
    s.ballVx = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 2);
    s.ballVy = direction * speed;
    setRally(0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const loop = () => {
      animId = requestAnimationFrame(loop);
      const s = stateRef.current;

      if (isPlaying && !winner) {
        // Move Ball
        s.ballX += s.ballVx;
        s.ballY += s.ballVy;

        // Bounce walls
        if (s.ballX <= 8 || s.ballX >= s.courtWidth - 8) {
          s.ballVx = -s.ballVx;
          sounds.playClick();
        }

        // AI Movement
        const aiSpeed = difficulty === 'hard' ? 4.2 : difficulty === 'medium' ? 3.0 : 2.0;
        if (s.ballVy < 0) {
          if (s.aiX + s.paddleWidth / 2 < s.ballX - 4) {
            s.aiX = Math.min(s.courtWidth - s.paddleWidth, s.aiX + aiSpeed);
          } else if (s.aiX + s.paddleWidth / 2 > s.ballX + 4) {
            s.aiX = Math.max(0, s.aiX - aiSpeed);
          }
        }

        // Check Player Paddle Collision (Bottom)
        if (
          s.ballY >= s.courtHeight - 35 &&
          s.ballY <= s.courtHeight - 20 &&
          s.ballX >= s.playerX &&
          s.ballX <= s.playerX + s.paddleWidth &&
          s.ballVy > 0
        ) {
          sounds.playClick();
          s.ballVy = -Math.abs(s.ballVy) * 1.05; // slight speed increase
          const offset = (s.ballX - (s.playerX + s.paddleWidth / 2)) / (s.paddleWidth / 2);
          s.ballVx += offset * 2.5;
          setRally((r) => r + 1);
        }

        // Check AI Paddle Collision (Top)
        if (
          s.ballY <= 35 &&
          s.ballY >= 20 &&
          s.ballX >= s.aiX &&
          s.ballX <= s.aiX + s.paddleWidth &&
          s.ballVy < 0
        ) {
          sounds.playClick();
          s.ballVy = Math.abs(s.ballVy);
          const offset = (s.ballX - (s.aiX + s.paddleWidth / 2)) / (s.paddleWidth / 2);
          s.ballVx += offset * 2;
          setRally((r) => r + 1);
        }

        // Player Scores (Ball passed AI top)
        if (s.ballY < 0) {
          sounds.playCoinChime();
          setPlayerScore((p) => {
            const next = p + 1;
            if (next >= 5) {
              setWinner('Player');
              sounds.playWinFanfare();
              onEarnCoins(25, 'Cyber Tennis 3D');
            } else {
              resetBall(1);
            }
            return next;
          });
        }

        // AI Scores (Ball passed player bottom)
        if (s.ballY > s.courtHeight) {
          setAiScore((a) => {
            const next = a + 1;
            if (next >= 5) {
              setWinner('AI');
            } else {
              resetBall(-1);
            }
            return next;
          });
        }
      }

      // RENDER COURT
      ctx.clearRect(0, 0, s.courtWidth, s.courtHeight);

      // Court background gradient
      const courtGrad = ctx.createLinearGradient(0, 0, 0, s.courtHeight);
      courtGrad.addColorStop(0, '#0f172a');
      courtGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = courtGrad;
      ctx.fillRect(0, 0, s.courtWidth, s.courtHeight);

      // Tennis Court Lines
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, s.courtWidth - 40, s.courtHeight - 40);

      // Net Line
      ctx.beginPath();
      ctx.setLineDash([6, 6]);
      ctx.moveTo(20, s.courtHeight / 2);
      ctx.lineTo(s.courtWidth - 20, s.courtHeight / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Center Circle
      ctx.beginPath();
      ctx.arc(s.courtWidth / 2, s.courtHeight / 2, 35, 0, Math.PI * 2);
      ctx.stroke();

      // AI Paddle (Top)
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.roundRect(s.aiX, 20, s.paddleWidth, s.paddleHeight, 6);
      ctx.fill();

      // Player Paddle (Bottom)
      ctx.fillStyle = '#3b82f6';
      ctx.shadowColor = '#3b82f6';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.roundRect(s.playerX, s.courtHeight - 32, s.paddleWidth, s.paddleHeight, 6);
      ctx.fill();

      // Ball
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(s.ballX, s.ballY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    animId = requestAnimationFrame(loop);

    // Mouse / Touch Drag Control
    const handleMove = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const s = stateRef.current;
      s.playerX = Math.max(0, Math.min(s.courtWidth - s.paddleWidth, x - s.paddleWidth / 2));
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX);
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchmove', onTouchMove);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('touchmove', onTouchMove);
    };
  }, [isPlaying, winner, difficulty]);

  return (
    <div className="max-w-md mx-auto p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">Arked Sukan Klasik</span>
          <h3 className="text-xl font-black text-white">Cyber Tennis 3D</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs text-center">
            <span className="text-slate-400 block text-[9px]">Pemain</span>
            <span className="font-extrabold text-blue-400 tabular-nums">{playerScore}</span>
          </div>
          <span className="text-slate-600 font-bold">-</span>
          <div className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs text-center">
            <span className="text-slate-400 block text-[9px]">Lawan AI</span>
            <span className="font-extrabold text-rose-400 tabular-nums">{aiScore}</span>
          </div>
        </div>
      </div>

      {/* Difficulty selector */}
      <div className="flex items-center justify-center gap-2 mb-3">
        {(['easy', 'medium', 'hard'] as const).map((lvl) => (
          <button
            key={lvl}
            onClick={() => setDifficulty(lvl)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition capitalize ${
              difficulty === lvl
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {lvl === 'easy' ? 'Santai' : lvl === 'medium' ? 'Biasa' : 'Pakar'}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div className="relative mx-auto w-[320px] h-[420px] rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={320}
          height={420}
          className="cursor-crosshair w-full h-full"
        />

        {!isPlaying && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
            <Zap className="w-10 h-10 text-cyan-400 mb-2 animate-bounce" />
            <h4 className="text-lg font-black">Cyber Tennis Smash</h4>
            <p className="text-xs text-slate-300 mt-1 mb-4">
              Gerakkan jari atau tetikus untuk menepis bola. Capai 5 mata dahulu untuk memenangi Reward Coins!
            </p>
            <button
              onClick={handleStart}
              className="btn-3d btn-3d-primary py-2.5 px-6 rounded-xl font-bold text-xs"
            >
              Mula Bertanding
            </button>
          </div>
        )}

        {winner && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white animate-fade-in">
            <Trophy className="w-10 h-10 text-amber-400 mb-2" />
            <h4 className="text-xl font-black">
              {winner === 'Player' ? 'Tahniah, Anda Menang!' : 'Lawan AI Menang!'}
            </h4>
            <p className="text-xs text-slate-300 mt-1 mb-4">
              {winner === 'Player'
                ? 'Pukulan cemerlang! Anda menerima 25 Reward Coins.'
                : 'Teruskan latihan dan cuba lagi!'}
            </p>
            <button
              onClick={handleStart}
              className="btn-3d btn-3d-primary py-2.5 px-6 rounded-xl font-bold text-xs"
            >
              Main Perlawanan Baru
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
        <span>Rally Terkini: <strong className="text-amber-400">{rally} pukulan</strong></span>
        <span>Gerakkan jari/tetikus ke kiri/kanan</span>
      </div>
    </div>
  );
};
