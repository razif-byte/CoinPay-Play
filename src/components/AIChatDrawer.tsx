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
    'Cara Top Up CIMB 7016657934?',
    'Bagaimana dapatkan Reward Coin?',
    'Apakah jenis 30 permainan slot?',
    'Cara pindah baki e-wallet?',
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

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => {
            sounds.playClick();
            setIsOpen(true);
          }}
          className="fixed bottom-20 md:bottom-6 right-5 z-40 btn-3d btn-3d-primary flex items-center gap-2.5 px-4 py-3 rounded-full text-white shadow-2xl group"
          aria-label="Buka Live AI Chatbot"
        >
          <div className="relative">
            <Bot className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-blue-600 animate-ping" />
          </div>
          <span className="text-xs font-bold tracking-wide">Live AI Support</span>
        </button>
      )}

      {/* Slide-in Chat Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm sm:max-w-md h-[550px] max-h-[85vh] rounded-3xl shadow-2xl border flex flex-col overflow-hidden animate-slide-up bg-slate-900 border-slate-700 text-white">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 flex items-center justify-between border-b border-white/10 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center border border-white/25 shadow-inner">
                <Bot className="w-5 h-5 text-blue-200" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-sm leading-tight">CoinPay Play™ AI</h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                    Live
                  </span>
                </div>
                <p className="text-[10px] text-blue-200/80">Dikuasakan oleh Gemini API • NASADEF™</p>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                setIsOpen(false);
              }}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition"
              aria-label="Tutup Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="p-2.5 bg-slate-800/60 border-b border-slate-700/50 flex items-center gap-2 overflow-x-auto text-[11px] whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 ml-1" />
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="px-2.5 py-1 rounded-full bg-slate-700/60 hover:bg-blue-600/60 border border-slate-600/60 text-slate-300 hover:text-white transition text-[11px] font-medium"
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
                  <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-blue-400" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  <span className="block text-[9px] text-right mt-1 opacity-60">{m.time}</span>
                </div>

                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-indigo-300" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-blue-400 p-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>CoinPay AI sedang menaip respons...</span>
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
            className="p-3 bg-slate-800/80 border-t border-slate-700/80 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya soalan tentang e-wallet, topup, atau games..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
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
