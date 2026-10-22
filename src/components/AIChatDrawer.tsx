import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, User, RefreshCw, MessageSquare } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

interface AIChatDrawerProps {
  isDark: boolean;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({ isDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Salam sejahtera! Saya Pembantu AI Rasmi CoinPay Play™. Ada sebarang soalan mengenai baki e-wallet, tambah nilai akaun CIMB: 7016657934 / TNG DuitNow: 170997196374, atau cara menebus ganjaran coin?',
      time: 'Terkini',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Cara Top Up CIMB 7016657934 / TNG?',
    'Integrasi API Google Pay, ShopeePay, GrabPay?',
    'Koleksi 30 Slot Casino Mega888?',
    'Bagaimana dapatkan Reward Coin & Baucar?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    sounds.playClick();
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend.trim(), history }),
      });

      const data = await res.json();
      const botReply = data.reply || 'Maaf, sistem tidak dapat membalas pada saat ini.';

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'Ralat sambungan AI. Sila pastikan pelayan sedang aktif atau rujuk panduan pentadbir.',
          time: new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Female 3D operator avatar
  const OPERATOR_AVATAR =
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=180&auto=format&fit=crop&q=80';

  return (
    <>
      {/* Floating 3D Round Button with Female Operator Avatar */}
      {!isOpen && (
        <div className="fixed bottom-20 md:bottom-6 right-3.5 md:right-6 z-40 flex items-center gap-2 group">
          {/* Desktop Tooltip Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-[11px] font-bold shadow-xl border border-blue-500/30 backdrop-blur-md animate-fade-in pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Live AI Support • Sara</span>
          </div>

          {/* 3D Round Button (Bulat Kecil) */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsOpen(true);
            }}
            className="relative w-14 h-14 md:w-16 md:h-16 rounded-full p-1 bg-gradient-to-tr from-blue-700 via-indigo-600 to-purple-600 shadow-2xl border-2 border-white/50 ring-4 ring-blue-500/20 active:translate-y-1 hover:scale-105 transition-all flex items-center justify-center cursor-pointer group-hover:shadow-blue-500/40"
            aria-label="Buka Live AI Support - Operator Wanita 3D"
            title="Sara — Pegawai Sokongan AI 3D (24/7)"
          >
            {/* Operator Image inside Round 3D Frame */}
            <div className="w-full h-full rounded-full overflow-hidden border border-white/40 shadow-inner bg-slate-900 relative">
              <img
                src={OPERATOR_AVATAR}
                alt="Sara Operator AI Support"
                className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Glowing Active Online Beacon */}
            <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center shadow-md shadow-emerald-500/50">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </span>

            {/* Mobile Mini Badge */}
            <span className="md:hidden absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-blue-600 text-[8px] font-black uppercase text-white shadow tracking-tighter border border-white/30 whitespace-nowrap">
              LIVE AI
            </span>
          </button>
        </div>
      )}

      {/* Slide-in Chat Drawer / Modal - Fully Adjusted for Mobile */}
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-4 sm:right-4 z-50 w-full sm:max-w-md h-[88vh] sm:h-[580px] max-h-[92vh] rounded-t-3xl sm:rounded-3xl shadow-2xl border flex flex-col overflow-hidden animate-slide-up bg-slate-900 border-slate-700 text-white">
          {/* Header with 3D Female Operator Avatar */}
          <div className="p-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 flex items-center justify-between border-b border-white/10 shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-yellow-200 border border-white/40 shadow-lg flex-shrink-0">
                <img
                  src={OPERATOR_AVATAR}
                  alt="Sara Operator"
                  className="w-full h-full object-cover object-top rounded-full"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-sm leading-tight text-white">
                    Sara • Pegawai AI 3D
                  </h4>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 font-black border border-emerald-400/30 uppercase">
                    Aktif 24/7
                  </span>
                </div>
                <p className="text-[10px] text-blue-200/90 font-medium">
                  Sokongan Pelanggan CoinPay Play™ • NASADEF™
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                setIsOpen(false);
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition"
              aria-label="Tutup Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="p-2.5 bg-slate-800/80 border-b border-slate-700/60 flex items-center gap-2 overflow-x-auto text-[11px] whitespace-nowrap scrollbar-none">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 ml-1" />
            {[
              'Withdraw Coin 100k = RM1?',
              'Top Up CIMB 7016657934 / TNG?',
              'Sistem Currency & Coin Trading?',
              'Slot Mega888 & Sniper Ops 3D?',
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="px-2.5 py-1 rounded-full bg-slate-700/70 hover:bg-blue-600/70 border border-slate-600/60 text-slate-200 hover:text-white transition text-[11px] font-semibold"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-900/95">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-blue-400/40 flex-shrink-0 mt-0.5 shadow">
                    <img
                      src={OPERATOR_AVATAR}
                      alt="Sara"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-800/90 text-slate-100 border border-slate-700 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  <span className="block text-[9px] text-right mt-1 opacity-60">{m.time}</span>
                </div>

                {m.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-indigo-300" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-blue-400 p-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Sara sedang menaip respons...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-800/90 border-t border-slate-700 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya Sara tentang currency, trading, top up..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="btn-3d btn-3d-primary p-2.5 rounded-xl text-white disabled:opacity-50 flex items-center justify-center"
              aria-label="Hantar"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
