import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../../utils/audio';
import confetti from 'canvas-confetti';
import {
  Tv,
  Radio,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Users,
  Send,
  Sparkles,
  Heart,
  Flame,
  Gift,
  Coins,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Share2,
} from 'lucide-react';

interface LiveStreamViewProps {
  userCashCents: number;
  userRewardCoins: number;
  onSendTip: (amountCents: number, giftName: string) => void;
  isDark: boolean;
}

interface LiveChannel {
  id: string;
  name: string;
  category: 'TV Kebangsaan' | 'Gaming & Casino' | 'Esports' | 'Berita 24 Jam';
  title: string;
  viewers: number;
  quality: string;
  thumbnail: string;
  videoPlaceholderBg: string;
  channelLogo: string;
  verified: boolean;
  description: string;
}

interface LiveChatMessage {
  id: string;
  user: string;
  badge?: 'VIP' | 'Mod' | 'Top Donor';
  badgeColor?: string;
  message: string;
  time: string;
  gift?: string;
}

const CHANNELS: LiveChannel[] = [
  {
    id: 'ch_tv3',
    name: 'TV3 HD Live Stream',
    category: 'TV Kebangsaan',
    title: 'Buletin Utama & Slot Drama Sangat TV3 (Siaran Langsung)',
    viewers: 58240,
    quality: '1080p 60fps',
    thumbnail: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=600&auto=format&fit=crop&q=80',
    videoPlaceholderBg: 'from-blue-950 via-slate-900 to-indigo-950',
    channelLogo: '📺',
    verified: true,
    description: 'Siaran langsung rasmi TV3 Malaysia membawakan berita terkini, slot Akasia, Samarinda, dan rancangan hiburan terkemuka.',
  },
  {
    id: 'ch_coinpay',
    name: 'CoinPay Arena Live Dealer',
    category: 'Gaming & Casino',
    title: 'Mega888 Jackpot Showcase & Live Host Spin Party',
    viewers: 24190,
    quality: '4K Ultra',
    thumbnail: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
    videoPlaceholderBg: 'from-amber-950 via-purple-950 to-slate-950',
    channelLogo: '🎰',
    verified: true,
    description: 'Saksikan putaran slot Mega888 secara langsung, sesi interaktif bersama hos rasmi, dan cabutan bertuah ganjaran coin!',
  },
  {
    id: 'ch_mpl',
    name: 'MPL Malaysia Esports HD',
    category: 'Esports',
    title: 'Grand Finals Liga Profesional MLBB Malaysia Musim 14',
    viewers: 89450,
    quality: '1080p 60fps',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    videoPlaceholderBg: 'from-red-950 via-slate-950 to-orange-950',
    channelLogo: '⚔️',
    verified: true,
    description: 'Pertarungan sengit antara pasukan terkemuka Malaysia merebut kejuaraan nasional dan slot ke Piala Dunia.',
  },
  {
    id: 'ch_awani',
    name: 'Astro Awani 24 Jam',
    category: 'Berita 24 Jam',
    title: 'Saluran Berita Terkini & Analisis Semasa Negara',
    viewers: 31200,
    quality: '720p HD',
    thumbnail: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80',
    videoPlaceholderBg: 'from-rose-950 via-slate-900 to-slate-950',
    channelLogo: '📰',
    verified: true,
    description: 'Liputan berita sahih, pantas, dan komprehensif tentang ekonomi, sukan, politik, dan antarabangsa.',
  },
];

export const LiveStreamView: React.FC<LiveStreamViewProps> = ({
  userCashCents,
  userRewardCoins,
  onSendTip,
  isDark,
}) => {
  const [selectedChannel, setSelectedChannel] = useState<LiveChannel>(CHANNELS[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentQuality, setCurrentQuality] = useState('1080p');
  const [liveViewers, setLiveViewers] = useState(selectedChannel.viewers);
  const [chatInput, setChatInput] = useState('');
  const [activeGiftModal, setActiveGiftModal] = useState(false);
  const [recentTipAlert, setRecentTipAlert] = useState<string | null>(null);

  // Initial Chat stream
  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([
    {
      id: 'c1',
      user: 'Hakim_Kajang',
      badge: 'VIP',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
      message: 'Mantap siaran HD TV3 lancar gila tiada lag! 👍',
      time: '14:22',
    },
    {
      id: 'c2',
      user: 'Siti_Norfadzilah',
      message: 'Tak sabar nak tunggu episod malam ni pukul 10',
      time: '14:23',
    },
    {
      id: 'c3',
      user: 'Razif_NASADEF',
      badge: 'Mod',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      message: 'Selamat datang ke saluran siaran langsung rasmi CoinPay Play™!',
      time: '14:23',
    },
    {
      id: 'c4',
      user: 'Danial_Gamer',
      message: 'Tadi slot Great Blue baru kena Mega Win! 🔥🔥',
      time: '14:24',
    },
  ]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [chatMessages]);

  // Gentle fluctuating viewers
  useEffect(() => {
    setLiveViewers(selectedChannel.viewers);
    const interval = setInterval(() => {
      setLiveViewers((v) => v + Math.floor((Math.random() - 0.48) * 12));
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedChannel]);

  // Periodic simulated live chat chatter
  useEffect(() => {
    const randomUsers = ['Faizal_JB', 'Ainaa_Penang', 'Zack_Ipoh', 'Nadia_KL', 'Farid_ShahAlam', 'Shahrul_Kuantan'];
    const randomChats = [
      'Gempak betul kualiti 1080p ni!',
      'Siapa kat sini sokong pasukan biru? 🙌',
      'Min, ada diskaun top up CIMB ke hari ni?',
      'Guna DuitNow QR tadi laju terus masuk baki wallet!',
      'Jom tebus baucar makanan kat Rewards Center!',
      'Terbaik NASADEF™ SDN. BHD.!',
    ];

    const timer = setInterval(() => {
      if (Math.random() > 0.4) {
        const u = randomUsers[Math.floor(Math.random() * randomUsers.length)];
        const m = randomChats[Math.floor(Math.random() * randomChats.length)];
        const newMsg: LiveChatMessage = {
          id: Date.now().toString(),
          user: u,
          message: m,
          time: new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages((prev) => [...prev.slice(-35), newMsg]);
      }
    }, 3800);

    return () => clearInterval(timer);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    sounds.playClick();
    const userMsg: LiveChatMessage = {
      id: Date.now().toString(),
      user: 'Ahmad Razif (Anda)',
      badge: 'VIP',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      message: chatInput.trim(),
      time: new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
  };

  const handleSendReaction = (emoji: string) => {
    sounds.playClick();
    confetti({
      particleCount: 15,
      spread: 40,
      origin: { x: 0.85, y: 0.7 },
    });
    const userMsg: LiveChatMessage = {
      id: Date.now().toString(),
      user: 'Ahmad Razif',
      message: `${emoji} ${emoji} ${emoji}`,
      time: new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, userMsg]);
  };

  // Saweria Tipping Gifts
  const GIFTS = [
    { name: 'Kopi Hangat', icon: '☕', priceMYR: 2, priceCents: 200 },
    { name: 'Mawar Bertuah', icon: '🌹', priceMYR: 5, priceCents: 500 },
    { name: 'Roket Angkasa', icon: '🚀', priceMYR: 20, priceCents: 2000 },
    { name: 'Mahkota Di-Raja', icon: '👑', priceMYR: 50, priceCents: 5000 },
  ];

  const handleSendGift = (gift: typeof GIFTS[0]) => {
    if (userCashCents < gift.priceCents) {
      alert(`Baki tunai e-wallet tidak mencukupi (Perlu RM ${gift.priceMYR.toFixed(2)}). Sila tambah nilai di tab Top Up melalui CIMB 7016657934 atau TNG 170997196374.`);
      return;
    }

    sounds.playWinFanfare();
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    onSendTip(gift.priceCents, gift.name);

    // Broadcast in chat
    const tipMsg: LiveChatMessage = {
      id: Date.now().toString(),
      user: 'Ahmad Razif',
      badge: 'Top Donor',
      badgeColor: 'bg-amber-500 text-slate-950 font-black',
      message: `Menghantar hadiah ${gift.icon} ${gift.name} bernilai RM ${gift.priceMYR.toFixed(2)}!`,
      time: new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' }),
      gift: `${gift.icon} RM ${gift.priceMYR}`,
    };

    setChatMessages((prev) => [...prev, tipMsg]);
    setRecentTipAlert(`🎉 Ahmad Razif menghadiahkan ${gift.icon} ${gift.name} (RM ${gift.priceMYR.toFixed(2)})!`);
    setActiveGiftModal(false);

    setTimeout(() => {
      setRecentTipAlert(null);
    }, 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header Info Banner */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-black uppercase">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                SIARAN LANGSUNG RASMI
              </span>
              <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
                TV3 HD, Live Casino Arena, Esports & Berita Malaysia
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mt-0.5">
              CoinPay Live TV & Penstriman Bersepadu
            </h2>
          </div>
        </div>

        {/* Quick Channel Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold w-full md:w-auto">
          {CHANNELS.map((ch) => (
            <button
              key={ch.id}
              onClick={() => {
                sounds.playClick();
                setSelectedChannel(ch);
              }}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedChannel.id === ch.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{ch.channelLogo}</span>
              <span>{ch.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Live Player (Left 8 Cols) & Live Chat (Right 4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: LIVE VIDEO SCREEN */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-black relative flex flex-col">
            {/* Live Screen Canvas Container */}
            <div
              className={`relative h-[340px] sm:h-[420px] md:h-[480px] w-full bg-gradient-to-br ${selectedChannel.videoPlaceholderBg} flex items-center justify-center overflow-hidden`}
            >
              {/* Background Broadcast Image */}
              <img
                src={selectedChannel.thumbnail}
                alt={selectedChannel.title}
                className={`w-full h-full object-cover opacity-60 transition-opacity duration-300 ${
                  isPlaying ? 'scale-100' : 'scale-102 filter blur-xs'
                }`}
              />

              {/* Broadcast Watermark overlay */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-xl bg-red-600 text-white font-black text-xs flex items-center gap-1.5 shadow-lg animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  LIVE
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white font-bold text-xs border border-white/10 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>{liveViewers.toLocaleString()} penonton</span>
                </span>
              </div>

              {/* Quality & Channel Tag */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold text-amber-300">
                  {currentQuality} 60FPS
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-blue-600/80 backdrop-blur-md text-white font-bold text-[10px]">
                  {selectedChannel.category}
                </span>
              </div>

              {/* Recent Saweria Tip Banner Animation */}
              {recentTipAlert && (
                <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-red-600 text-slate-950 font-black text-xs shadow-2xl animate-bounce flex items-center gap-2">
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>{recentTipAlert}</span>
                </div>
              )}

              {/* Center Play/Pause Indicator if paused */}
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-10">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setIsPlaying(true);
                    }}
                    className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-2xl transition transform hover:scale-110"
                  >
                    <Play className="w-8 h-8 fill-white ml-1" />
                  </button>
                </div>
              )}

              {/* Animated Live Graphic lower-third bar */}
              <div className="absolute bottom-14 left-4 right-4 z-10 p-3 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-base flex-shrink-0">
                    {selectedChannel.channelLogo}
                  </div>
                  <div className="truncate">
                    <h4 className="font-extrabold text-white truncate">{selectedChannel.title}</h4>
                    <p className="text-[10px] text-slate-300 truncate">{selectedChannel.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveGiftModal(true)}
                  className="btn-3d py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md flex-shrink-0"
                >
                  <Gift className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Hantar Tip</span>
                </button>
              </div>

              {/* Bottom Video Controls Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex items-center justify-between z-10 text-white text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setIsPlaying(!isPlaying);
                    }}
                    className="hover:text-blue-400 transition"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      setIsMuted(!isMuted);
                    }}
                    className="hover:text-blue-400 transition"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    Penstriman Langsung Bitrate Stabil (Ultra HD)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={currentQuality}
                    onChange={(e) => setCurrentQuality(e.target.value)}
                    className="bg-slate-800/90 border border-slate-700 rounded-lg px-2 py-0.5 text-[10px] font-bold text-slate-300 focus:outline-none"
                  >
                    <option value="1080p">1080p 60fps</option>
                    <option value="720p">720p HD</option>
                    <option value="4K">4K HDR</option>
                    <option value="Auto">Auto (Adaptif)</option>
                  </select>

                  <button
                    onClick={() => sounds.playClick()}
                    className="hover:text-blue-400 transition"
                    title="Skrin Penuh"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Channel Description & Host Info */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-2xl">
                  {selectedChannel.channelLogo}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">{selectedChannel.name}</h3>
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-xs text-slate-400">{selectedChannel.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveGiftModal(true)}
                  className="btn-3d btn-3d-gold py-2 px-4 rounded-xl text-xs font-black text-slate-950 flex items-center gap-1.5 shadow-md"
                >
                  <Gift className="w-4 h-4 fill-slate-950" />
                  <span>Saweria Tip</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedChannel.description}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE LIVE CHAT & SUPER CHAT GIFTS */}
        <div className="lg:col-span-4 flex flex-col h-[520px] lg:h-[620px] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
          {/* Chat Header */}
          <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-black text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sembang Langsung ({liveViewers.toLocaleString()})</span>
            </div>
            <span className="text-[10px] text-slate-400">Mod Perlindungan 24/7</span>
          </div>

          {/* Chat Messages Scrolling Area */}
          <div ref={chatContainerRef} className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded-xl transition ${
                  msg.gift
                    ? 'bg-amber-500/15 border border-amber-500/30 shadow-md'
                    : 'bg-slate-800/40 border border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1.5">
                    {msg.badge && (
                      <span className={`text-[9px] font-black px-1.5 py-0.2 rounded border ${msg.badgeColor}`}>
                        {msg.badge}
                      </span>
                    )}
                    <span className="font-extrabold text-slate-200 text-[11px]">{msg.user}</span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono">{msg.time}</span>
                </div>
                <p className={`text-[11px] leading-relaxed ${msg.gift ? 'text-amber-300 font-bold' : 'text-slate-300'}`}>
                  {msg.message}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Emoji Reaction Bar */}
          <div className="p-2 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-around text-lg">
            {['🔥', '👏', '❤️', '🚀', '💰', '👍'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleSendReaction(emoji)}
                className="hover:scale-125 transition active:scale-95 p-1"
                title={`Kirim ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Tulis komen siaran langsung..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="btn-3d btn-3d-primary p-2 rounded-xl text-white shadow-md"
              title="Kirim Komen"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* SAWERIA TIP / GIFT MODAL */}
      {activeGiftModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black">Hantar Hadiah Tip Siaran Langsung</h3>
              </div>
              <button
                onClick={() => setActiveGiftModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Hadiah tip akan disiarkan di layar skrin penstriman secara langsung. Bayaran ditolak terus daripada baki e-wallet anda.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {GIFTS.map((g) => (
                <button
                  key={g.name}
                  onClick={() => handleSendGift(g)}
                  className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 hover:border-amber-400 transition text-center space-y-1 group"
                >
                  <span className="text-3xl block group-hover:scale-110 transition">{g.icon}</span>
                  <div className="font-extrabold text-xs text-white">{g.name}</div>
                  <div className="text-[11px] font-mono font-bold text-amber-400">
                    RM {g.priceMYR.toFixed(2)}
                  </div>
                </button>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-blue-950/30 border border-blue-500/30 text-[11px] text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span>Baki Tunai Wallet:</span>
                <strong className="text-blue-400">RM {(userCashCents / 100).toFixed(2)}</strong>
              </div>
              <p className="text-[10px] text-slate-400">
                Tambah nilai segera di akaun CIMB: <strong>7016657934</strong> atau TNG DuitNow: <strong>170997196374</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
