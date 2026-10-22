import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, LedgerEntry } from '../../types';
import { sounds } from '../../utils/audio';
import confetti from 'canvas-confetti';
import {
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  DollarSign,
  Coins,
  BarChart3,
  RefreshCw,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Clock,
  Sparkles,
  Search,
  ExternalLink,
  ChevronDown,
  Activity,
  Zap,
} from 'lucide-react';

interface CurrencyTradingViewProps {
  user: UserProfile;
  ledger: LedgerEntry[];
  onUpdateBalances: (
    deltaCents: number,
    deltaCoins: number,
    title: string,
    description: string
  ) => void;
  isDark: boolean;
}

interface CurrencyRate {
  code: string;
  name: string;
  flag: string;
  rateToMYR: number; // 1 Unit = X MYR
  change24h: number; // in %
  bid: number;
  ask: number;
}

interface TradingPair {
  id: string;
  base: string;
  quote: string;
  name: string;
  category: 'COIN' | 'FOREX' | 'CRYPTO';
  lastPrice: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  decimals: number;
}

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

interface UserTrade {
  id: string;
  pair: string;
  type: 'BUY' | 'SELL';
  price: number;
  amount: number;
  totalMYR: number;
  time: string;
  status: 'FILLED' | 'OPEN';
}

// 10 Official Currency Exchange Rates (Real Benchmark Rates)
const INITIAL_CURRENCY_RATES: CurrencyRate[] = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', rateToMYR: 4.432, change24h: 0.18, bid: 4.430, ask: 4.434 },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬', rateToMYR: 3.328, change24h: -0.05, bid: 3.326, ask: 3.330 },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', rateToMYR: 4.785, change24h: 0.24, bid: 4.781, ask: 4.789 },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', rateToMYR: 5.715, change24h: -0.12, bid: 5.710, ask: 5.720 },
  { code: 'IDR', name: 'Indonesian Rupiah (x10k)', flag: '🇮🇩', rateToMYR: 2.82, change24h: 0.42, bid: 2.81, ask: 2.83 },
  { code: 'THB', name: 'Thai Baht (x100)', flag: '🇹🇭', rateToMYR: 12.86, change24h: -0.22, bid: 12.83, ask: 12.89 },
  { code: 'JPY', name: 'Japanese Yen (x1k)', flag: '🇯🇵', rateToMYR: 29.15, change24h: 0.65, bid: 29.10, ask: 29.20 },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳', rateToMYR: 0.612, change24h: 0.08, bid: 0.610, ask: 0.614 },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', rateToMYR: 2.915, change24h: -0.31, bid: 2.910, ask: 2.920 },
  { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦', rateToMYR: 1.181, change24h: 0.02, bid: 1.179, ask: 1.183 },
];

// Real-Time Trading Pairs
const INITIAL_PAIRS: TradingPair[] = [
  {
    id: 'COIN-MYR',
    base: 'COIN',
    quote: 'MYR',
    name: 'COIN / MYR',
    category: 'COIN',
    lastPrice: 0.00001004, // 100,000 Coin = RM 1.004
    change24h: 1.45,
    high24h: 0.00001015,
    low24h: 0.00000995,
    volume24h: '1,450,200,000 COIN',
    decimals: 8,
  },
  {
    id: 'USD-MYR',
    base: 'USD',
    quote: 'MYR',
    name: 'USD / MYR',
    category: 'FOREX',
    lastPrice: 4.4320,
    change24h: 0.18,
    high24h: 4.4390,
    low24h: 4.4250,
    volume24h: 'RM 14,820,000',
    decimals: 4,
  },
  {
    id: 'SGD-MYR',
    base: 'SGD',
    quote: 'MYR',
    name: 'SGD / MYR',
    category: 'FOREX',
    lastPrice: 3.3280,
    change24h: -0.05,
    high24h: 3.3340,
    low24h: 3.3210,
    volume24h: 'RM 8,450,000',
    decimals: 4,
  },
  {
    id: 'BTC-MYR',
    base: 'BTC',
    quote: 'MYR',
    name: 'BTC / MYR',
    category: 'CRYPTO',
    lastPrice: 312500,
    change24h: 3.25,
    high24h: 316800,
    low24h: 308200,
    volume24h: '14.85 BTC',
    decimals: 2,
  },
  {
    id: 'ETH-MYR',
    base: 'ETH',
    quote: 'MYR',
    name: 'ETH / MYR',
    category: 'CRYPTO',
    lastPrice: 11850,
    change24h: 2.15,
    high24h: 12100,
    low24h: 11600,
    volume24h: '82.40 ETH',
    decimals: 2,
  },
  {
    id: 'USDT-MYR',
    base: 'USDT',
    quote: 'MYR',
    name: 'USDT / MYR',
    category: 'CRYPTO',
    lastPrice: 4.4410,
    change24h: 0.12,
    high24h: 4.4480,
    low24h: 4.4350,
    volume24h: 'RM 25,400,000',
    decimals: 4,
  },
];

export const CurrencyTradingView: React.FC<CurrencyTradingViewProps> = ({
  user,
  ledger,
  onUpdateBalances,
  isDark,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'EXCHANGER' | 'TRADING'>('EXCHANGER');

  // Currency Exchanger State
  const [currencyRates, setCurrencyRates] = useState<CurrencyRate[]>(INITIAL_CURRENCY_RATES);
  const [exchangeFrom, setExchangeFrom] = useState<string>('MYR');
  const [exchangeTo, setExchangeTo] = useState<string>('USD');
  const [exchangeAmount, setExchangeAmount] = useState<string>('100');
  const [isSwapping, setIsSwapping] = useState(false);
  const [exchangeSuccess, setExchangeSuccess] = useState<string | null>(null);

  // Trading State
  const [pairs, setPairs] = useState<TradingPair[]>(INITIAL_PAIRS);
  const [selectedPair, setSelectedPair] = useState<TradingPair>(INITIAL_PAIRS[0]);
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [tradeAction, setTradeAction] = useState<'BUY' | 'SELL'>('BUY');
  const [tradeAmount, setTradeAmount] = useState<string>('100000');
  const [limitPrice, setLimitPrice] = useState<string>(INITIAL_PAIRS[0].lastPrice.toString());
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '15m' | '1h' | '1D'>('15m');
  const [userTrades, setUserTrades] = useState<UserTrade[]>([
    {
      id: 'TRD-881',
      pair: 'COIN-MYR',
      type: 'BUY',
      price: 0.00001000,
      amount: 500000,
      totalMYR: 5.00,
      time: '19 Okt, 10:24',
      status: 'FILLED',
    },
    {
      id: 'TRD-882',
      pair: 'COIN-MYR',
      type: 'SELL',
      price: 0.00001002,
      amount: 200000,
      totalMYR: 2.00,
      time: '20 Okt, 14:15',
      status: 'FILLED',
    },
  ]);

  // Live Chart Points Simulation
  const [chartPoints, setChartPoints] = useState<number[]>(() => {
    const base = INITIAL_PAIRS[0].lastPrice;
    const pts: number[] = [];
    let cur = base * 0.98;
    for (let i = 0; i < 30; i++) {
      cur += (Math.random() - 0.48) * (base * 0.01);
      pts.push(cur);
    }
    pts.push(base);
    return pts;
  });

  // Dynamic order book generation
  const orderBook = useMemo(() => {
    const mid = selectedPair.lastPrice;
    const asks: OrderBookEntry[] = [];
    const bids: OrderBookEntry[] = [];

    const isCoin = selectedPair.id === 'COIN-MYR';
    const step = isCoin ? 0.00000002 : mid * 0.001;

    for (let i = 5; i >= 1; i--) {
      const p = mid + i * step;
      const amt = isCoin ? Math.floor(Math.random() * 200000) + 50000 : Math.floor(Math.random() * 1000) + 100;
      asks.push({ price: p, amount: amt, total: p * amt });
    }

    for (let i = 1; i <= 5; i++) {
      const p = mid - i * step;
      const amt = isCoin ? Math.floor(Math.random() * 200000) + 50000 : Math.floor(Math.random() * 1000) + 100;
      bids.push({ price: p, amount: amt, total: p * amt });
    }

    return { asks, bids };
  }, [selectedPair]);

  // Periodic Micro-Tick Updates for Live Market Feel
  useEffect(() => {
    const timer = setInterval(() => {
      setPairs((prev) =>
        prev.map((p) => {
          const delta = (Math.random() - 0.49) * (p.lastPrice * 0.0015);
          const newPrice = Math.max(0.000001, p.lastPrice + delta);
          return {
            ...p,
            lastPrice: newPrice,
            high24h: Math.max(p.high24h, newPrice),
            low24h: Math.min(p.low24h, newPrice),
          };
        })
      );

      // Append chart point for current pair
      setChartPoints((prev) => {
        const last = prev[prev.length - 1];
        const next = last + (Math.random() - 0.49) * (last * 0.002);
        return [...prev.slice(1), next];
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // Update limit price input when pair changes
  const handleSelectPair = (pair: TradingPair) => {
    sounds.playClick();
    setSelectedPair(pair);
    setLimitPrice(pair.lastPrice.toString());
    if (pair.id === 'COIN-MYR') {
      setTradeAmount('100000');
    } else {
      setTradeAmount('100');
    }
  };

  // Convert Calculation for Exchanger
  const calculateExchangeResult = () => {
    const amt = parseFloat(exchangeAmount) || 0;
    if (amt <= 0) return { result: '0.00', rate: 0 };

    if (exchangeFrom === 'MYR') {
      const targetRate = currencyRates.find((c) => c.code === exchangeTo)?.rateToMYR || 1;
      const converted = amt / targetRate;
      return { result: converted.toFixed(2), rate: 1 / targetRate };
    } else if (exchangeTo === 'MYR') {
      const sourceRate = currencyRates.find((c) => c.code === exchangeFrom)?.rateToMYR || 1;
      const converted = amt * sourceRate;
      return { result: converted.toFixed(2), rate: sourceRate };
    } else {
      // Cross rate
      const fromRate = currencyRates.find((c) => c.code === exchangeFrom)?.rateToMYR || 1;
      const toRate = currencyRates.find((c) => c.code === exchangeTo)?.rateToMYR || 1;
      const converted = (amt * fromRate) / toRate;
      return { result: converted.toFixed(2), rate: fromRate / toRate };
    }
  };

  // Execute Real Currency Swap
  const handleExecuteCurrencyExchange = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(exchangeAmount) || 0;
    if (amt <= 0) {
      alert('Sila masukkan jumlah sah untuk pertukaran mata wang.');
      return;
    }

    if (exchangeFrom === 'MYR') {
      const centsNeeded = Math.round(amt * 100);
      if (centsNeeded > user.cashBalanceCents) {
        alert(
          `Baki tunai RM ${(user.cashBalanceCents / 100).toFixed(
            2
          )} tidak mencukupi untuk pertukaran RM ${amt.toFixed(2)}.`
        );
        return;
      }

      const { result } = calculateExchangeResult();
      sounds.playCoinChime();
      confetti({ particleCount: 80, spread: 70 });

      // Deduct MYR cash from wallet
      onUpdateBalances(
        -centsNeeded,
        0,
        `Pertukaran Mata Wang: MYR ke ${exchangeTo}`,
        `Tukar RM ${amt.toFixed(2)} kepada ${result} ${exchangeTo} pada kadar pasaran.`
      );

      setExchangeSuccess(
        `Berjaya! RM ${amt.toFixed(2)} telah ditukarkan kepada ${result} ${exchangeTo} ke dalam lejar akaun anda.`
      );
    } else {
      // Selling foreign currency to MYR
      const { result } = calculateExchangeResult();
      const centsGained = Math.round(parseFloat(result) * 100);

      sounds.playCoinChime();
      confetti({ particleCount: 80, spread: 70 });

      // Credit MYR cash into wallet
      onUpdateBalances(
        centsGained,
        0,
        `Penukaran Mata Wang: ${exchangeFrom} ke MYR`,
        `Tukar ${amt} ${exchangeFrom} kepada RM ${parseFloat(result).toFixed(2)} tunai.`
      );

      setExchangeSuccess(
        `Berjaya! ${amt} ${exchangeFrom} telah ditukarkan kepada RM ${parseFloat(
          result
        ).toFixed(2)} baki tunai.`
      );
    }

    setTimeout(() => setExchangeSuccess(null), 3000);
  };

  // Execute Real Trade in Trading Terminal (COIN / MYR or FOREX)
  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(tradeAmount) || 0;
    if (amt <= 0) {
      alert('Sila masukkan kuantiti yang sah.');
      return;
    }

    const price = orderType === 'MARKET' ? selectedPair.lastPrice : parseFloat(limitPrice) || selectedPair.lastPrice;
    const totalCostMYR = amt * price;
    const totalCostCents = Math.round(totalCostMYR * 100);

    if (selectedPair.id === 'COIN-MYR') {
      if (tradeAction === 'BUY') {
        // Buying COIN using MYR Cash
        if (totalCostCents > user.cashBalanceCents) {
          alert(
            `Baki tunai RM ${(user.cashBalanceCents / 100).toFixed(
              2
            )} tidak mencukupi untuk beli ${amt.toLocaleString()} COIN bernilai RM ${totalCostMYR.toFixed(
              2
            )}.`
          );
          return;
        }

        sounds.playCoinChime();
        confetti({ particleCount: 90, spread: 80 });

        onUpdateBalances(
          -totalCostCents,
          amt,
          `Beli COIN Pasaran (${selectedPair.name})`,
          `Beli ${amt.toLocaleString()} COIN pada harga RM ${price.toFixed(8)} (Jumlah RM ${totalCostMYR.toFixed(2)})`
        );

        const newTrade: UserTrade = {
          id: `TRD-${Date.now().toString().slice(-4)}`,
          pair: selectedPair.id,
          type: 'BUY',
          price,
          amount: amt,
          totalMYR: totalCostMYR,
          time: new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' }),
          status: 'FILLED',
        };
        setUserTrades((prev) => [newTrade, ...prev]);

        alert(`Pesanan Beli Berjaya! +${amt.toLocaleString()} COIN ditambah ke wallet anda.`);
      } else {
        // Selling COIN for MYR Cash
        if (amt > user.rewardCoins) {
          alert(`Baki COIN anda (${user.rewardCoins.toLocaleString()}) tidak mencukupi untuk jual ${amt.toLocaleString()} COIN.`);
          return;
        }

        sounds.playCoinChime();
        confetti({ particleCount: 90, spread: 80 });

        onUpdateBalances(
          totalCostCents,
          -amt,
          `Jual COIN Pasaran (${selectedPair.name})`,
          `Jual ${amt.toLocaleString()} COIN pada harga RM ${price.toFixed(8)} (Terima RM ${totalCostMYR.toFixed(2)})`
        );

        const newTrade: UserTrade = {
          id: `TRD-${Date.now().toString().slice(-4)}`,
          pair: selectedPair.id,
          type: 'SELL',
          price,
          amount: amt,
          totalMYR: totalCostMYR,
          time: new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' }),
          status: 'FILLED',
        };
        setUserTrades((prev) => [newTrade, ...prev]);

        alert(`Pesanan Jual Berjaya! +RM ${totalCostMYR.toFixed(2)} dikreditkan ke baki tunai wallet anda.`);
      }
    } else {
      // General Forex or Crypto trade simulation with real cash deduction
      if (tradeAction === 'BUY') {
        if (totalCostCents > user.cashBalanceCents) {
          alert(`Baki tunai tidak mencukupi untuk membeli ${amt} ${selectedPair.base}.`);
          return;
        }

        sounds.playCoinChime();
        confetti({ particleCount: 70, spread: 60 });

        onUpdateBalances(
          -totalCostCents,
          0,
          `Beli Pasaran ${selectedPair.name}`,
          `Beli ${amt} ${selectedPair.base} pada harga RM ${price.toFixed(selectedPair.decimals)}`
        );

        const newTrade: UserTrade = {
          id: `TRD-${Date.now().toString().slice(-4)}`,
          pair: selectedPair.id,
          type: 'BUY',
          price,
          amount: amt,
          totalMYR: totalCostMYR,
          time: new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' }),
          status: 'FILLED',
        };
        setUserTrades((prev) => [newTrade, ...prev]);
        alert(`Pesanan Beli ${amt} ${selectedPair.base} berjaya dipadankan!`);
      } else {
        sounds.playCoinChime();
        onUpdateBalances(
          totalCostCents,
          0,
          `Jual Pasaran ${selectedPair.name}`,
          `Jual ${amt} ${selectedPair.base} dan terima RM ${totalCostMYR.toFixed(2)} tunai.`
        );

        const newTrade: UserTrade = {
          id: `TRD-${Date.now().toString().slice(-4)}`,
          pair: selectedPair.id,
          type: 'SELL',
          price,
          amount: amt,
          totalMYR: totalCostMYR,
          time: new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' }),
          status: 'FILLED',
        };
        setUserTrades((prev) => [newTrade, ...prev]);
        alert(`Pesanan Jual berjaya! +RM ${totalCostMYR.toFixed(2)} dikreditkan ke akaun anda.`);
      }
    }
  };

  const exchangeCalc = calculateExchangeResult();

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      {/* Top Header Card */}
      <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950/80 to-slate-900 border border-blue-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
              Sistem Kewangan Antarabangsa
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Ticker
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Currency Exchanger & Coin Trading Sebenar</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Tukar mata wang asing (USD, SGD, EUR, IDR, THB) secara langsung, dan dagangkan Coin & Forex dengan carta candlestick, buku pesanan (order book), dan pelaksanaan serta-merta.
          </p>
        </div>

        {/* User Balance Quick Status */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="p-3 rounded-2xl bg-black/60 border border-white/10 text-right">
            <span className="text-[10px] text-slate-400 block font-bold">BAKI TUNAI MYR</span>
            <span className="text-lg font-black text-blue-400 tabular-nums">
              RM {(user.cashBalanceCents / 100).toFixed(2)}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-black/60 border border-white/10 text-right">
            <span className="text-[10px] text-amber-400 block font-bold">BAKI REWARD COIN</span>
            <span className="text-lg font-black text-amber-300 tabular-nums">
              {user.rewardCoins.toLocaleString()}
            </span>
            <span className="text-[9px] text-slate-400 block">≈ RM {(user.rewardCoins / 100000).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Main Mode Tabs: Currency Exchanger vs Live Trading Terminal */}
      <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold shadow-lg">
        <button
          onClick={() => {
            sounds.playClick();
            setActiveSubTab('EXCHANGER');
          }}
          className={`py-3 rounded-xl transition flex items-center justify-center gap-2 ${
            activeSubTab === 'EXCHANGER'
              ? 'bg-blue-600 text-white shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Pengurup Mata Wang (Currency Exchanger)</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveSubTab('TRADING');
          }}
          className={`py-3 rounded-xl transition flex items-center justify-center gap-2 ${
            activeSubTab === 'TRADING'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Platform Dagangan (Coin & Forex Trading)</span>
        </button>
      </div>

      {/* SUB-TAB 1: REAL CURRENCY EXCHANGER */}
      {activeSubTab === 'EXCHANGER' && (
        <div className="space-y-6">
          {/* Success Banner */}
          {exchangeSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-3 animate-pulse">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>{exchangeSuccess}</span>
            </div>
          )}

          {/* Currency Calculator & Converter Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-blue-400" />
                  <span>Kalkulator & Tukar Mata Wang Serta-Merta</span>
                </h3>
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Kadar Pasaran Sah (0% Caj Tambahan)
                </span>
              </div>

              <form onSubmit={handleExecuteCurrencyExchange} className="space-y-4">
                {/* FROM CURRENCY */}
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                    <span>Anda Bayar / Hantar</span>
                    <span>
                      Baki: {exchangeFrom === 'MYR' ? `RM ${(user.cashBalanceCents / 100).toFixed(2)}` : 'Akaun Asing'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      step="any"
                      min="1"
                      value={exchangeAmount}
                      onChange={(e) => setExchangeAmount(e.target.value)}
                      placeholder="0.00"
                      className="flex-1 bg-transparent text-2xl font-black text-white focus:outline-none tabular-nums"
                    />
                    <select
                      value={exchangeFrom}
                      onChange={(e) => setExchangeFrom(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-white font-black text-sm px-3 py-2 rounded-xl focus:outline-none"
                    >
                      <option value="MYR">🇲🇾 MYR</option>
                      {currencyRates.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Swap Direction Button */}
                <div className="flex justify-center -my-2 relative z-10">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      const temp = exchangeFrom;
                      setExchangeFrom(exchangeTo);
                      setExchangeTo(temp);
                    }}
                    className="p-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg border-2 border-slate-900 transition hover:scale-110"
                    title="Tukar Arah"
                  >
                    <ArrowRightLeft className="w-4 h-4 rotate-90" />
                  </button>
                </div>

                {/* TO CURRENCY */}
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                    <span>Anda Terima (Anggaran)</span>
                    <span className="text-emerald-400">Kadar Semasa: 1 {exchangeFrom} ≈ {exchangeCalc.rate.toFixed(4)} {exchangeTo}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 text-2xl font-black text-emerald-400 tabular-nums">
                      {exchangeCalc.result}
                    </div>
                    <select
                      value={exchangeTo}
                      onChange={(e) => setExchangeTo(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-white font-black text-sm px-3 py-2 rounded-xl focus:outline-none"
                    >
                      {exchangeFrom !== 'MYR' && <option value="MYR">🇲🇾 MYR</option>}
                      {currencyRates.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Rate Details Pill */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-slate-800 text-xs space-y-1.5 text-slate-400">
                  <div className="flex justify-between">
                    <span>Kadar Pertukaran Bersepadu:</span>
                    <span className="text-white font-bold font-mono">
                      1 {exchangeFrom} = {exchangeCalc.rate.toFixed(4)} {exchangeTo}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Yuran Transaksi Pertukaran:</span>
                    <span className="text-emerald-400 font-bold">RM 0.00 (Percuma)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pelaksanaan:</span>
                    <span className="text-blue-400 font-bold">Serta-Merta (Real-time Settlement)</span>
                  </div>
                </div>

                {/* Submit Swap Button */}
                <button
                  type="submit"
                  className="w-full btn-3d btn-3d-primary py-3.5 rounded-2xl font-black text-sm text-white shadow-xl flex items-center justify-center gap-2"
                >
                  <ArrowRightLeft className="w-4 h-4 text-white" />
                  <span>
                    Sahkan Pertukaran {exchangeAmount} {exchangeFrom} &gt; {exchangeCalc.result} {exchangeTo}
                  </span>
                </button>
              </form>
            </div>

            {/* Live Exchange Rate Board */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="font-black text-sm text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Papan Kadar Mata Wang Utama (vs MYR)</span>
                </h4>
                <span className="text-[10px] text-slate-400">Kemas kini langsung</span>
              </div>

              <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
                {currencyRates.map((c) => {
                  const isPositive = c.change24h >= 0;
                  return (
                    <div
                      key={c.code}
                      onClick={() => {
                        sounds.playClick();
                        setExchangeTo(c.code);
                      }}
                      className="p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{c.flag}</span>
                        <div>
                          <div className="font-extrabold text-xs text-white group-hover:text-blue-400 transition flex items-center gap-1">
                            <span>{c.code}</span>
                            <span className="text-[10px] font-normal text-slate-400">/ MYR</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block">{c.name}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-xs text-white tabular-nums">
                          RM {c.rateToMYR.toFixed(3)}
                        </div>
                        <div
                          className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${
                            isPositive ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isPositive ? (
                            <TrendingUp className="w-2.5 h-2.5" />
                          ) : (
                            <TrendingDown className="w-2.5 h-2.5" />
                          )}
                          <span>{isPositive ? `+${c.change24h}%` : `${c.change24h}%`}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: REAL TRADING TERMINAL */}
      {activeSubTab === 'TRADING' && (
        <div className="space-y-6">
          {/* Pair Selector Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {pairs.map((p) => {
              const isSelected = selectedPair.id === p.id;
              const isUp = p.change24h >= 0;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPair(p)}
                  className={`p-3 rounded-2xl border text-left transition flex-shrink-0 min-w-[170px] ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 ring-1 ring-amber-400'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-black">
                    <span className="text-white">{p.name}</span>
                    <span
                      className={`text-[10px] font-bold ${
                        isUp ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isUp ? `+${p.change24h}%` : `${p.change24h}%`}
                    </span>
                  </div>
                  <div className="text-sm font-mono font-black text-amber-300 mt-1 tabular-nums">
                    {p.id === 'COIN-MYR' ? p.lastPrice.toFixed(8) : p.lastPrice.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5">Vol: {p.volume24h}</div>
                </button>
              );
            })}
          </div>

          {/* Active Terminal Grid: Chart + Order Book + Order Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Col (8/12): Live Chart & Pair Stats */}
            <div className="lg:col-span-8 space-y-4">
              {/* Pair Stats Header */}
              <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center font-black text-amber-400 text-sm">
                    {selectedPair.base === 'COIN' ? '🪙' : selectedPair.base.slice(0, 3)}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <span>{selectedPair.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                        {selectedPair.category}
                      </span>
                    </h3>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-black text-xl text-amber-300 tabular-nums">
                        {selectedPair.id === 'COIN-MYR'
                          ? selectedPair.lastPrice.toFixed(8)
                          : selectedPair.lastPrice.toLocaleString()}{' '}
                        MYR
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          selectedPair.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {selectedPair.change24h >= 0 ? `+${selectedPair.change24h}%` : `${selectedPair.change24h}%`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 24h Stats */}
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">24h Tertinggi:</span>
                    <span className="text-emerald-400 font-bold tabular-nums">
                      {selectedPair.high24h.toFixed(selectedPair.decimals)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">24h Terendah:</span>
                    <span className="text-rose-400 font-bold tabular-nums">
                      {selectedPair.low24h.toFixed(selectedPair.decimals)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Candlestick / Line Chart Container */}
              <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    {(['1m', '5m', '15m', '1h', '1D'] as const).map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`px-2.5 py-1 rounded-lg font-bold transition ${
                          timeframe === tf
                            ? 'bg-amber-500 text-slate-950 shadow'
                            : 'text-slate-400 hover:text-white bg-slate-800/60'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">
                    MA(7): <strong className="text-amber-400">0.00001002</strong> • MA(25): <strong className="text-purple-400">0.00000998</strong>
                  </span>
                </div>

                {/* SVG Visual Price Graph */}
                <div className="h-64 w-full bg-slate-950/80 rounded-2xl p-3 border border-slate-800/80 relative overflow-hidden flex flex-col justify-between">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none opacity-15">
                    <div className="border-b border-dashed border-slate-500 w-full" />
                    <div className="border-b border-dashed border-slate-500 w-full" />
                    <div className="border-b border-dashed border-slate-500 w-full" />
                    <div className="border-b border-dashed border-slate-500 w-full" />
                  </div>

                  {/* SVG Line & Gradient Area */}
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 400 150" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Generate SVG Path from chartPoints */}
                    {(() => {
                      const min = Math.min(...chartPoints);
                      const max = Math.max(...chartPoints);
                      const range = max - min || 1;
                      const coords = chartPoints.map((val, idx) => {
                        const x = (idx / (chartPoints.length - 1)) * 400;
                        const y = 140 - ((val - min) / range) * 120;
                        return { x, y };
                      });

                      const pathD = coords.reduce(
                        (acc, curr, idx) => (idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`),
                        ''
                      );

                      const areaD = `${pathD} L 400 150 L 0 150 Z`;

                      return (
                        <>
                          <path d={areaD} fill="url(#chartGrad)" />
                          <path d={pathD} fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                          {/* Pulsing Last Point Marker */}
                          {coords.length > 0 && (
                            <circle
                              cx={coords[coords.length - 1].x}
                              cy={coords[coords.length - 1].y}
                              r="4"
                              fill="#f59e0b"
                              className="animate-ping"
                            />
                          )}
                        </>
                      );
                    })()}
                  </svg>

                  {/* Bottom Chart Footer */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono z-10">
                    <span>10:00</span>
                    <span>11:00</span>
                    <span>12:00</span>
                    <span>13:00</span>
                    <span>Sekarang (Live)</span>
                  </div>
                </div>
              </div>

              {/* Order Book / Kedalaman Pasaran (Depth) */}
              <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
                <h4 className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center justify-between">
                  <span>Buku Pesanan Langsung (Order Book Depth)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Spread: 0.00000002 MYR</span>
                </h4>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  {/* ASKS (SELLERS) */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-sans pb-1 border-b border-slate-800">
                      <span>Harga Jual (MYR)</span>
                      <span>Kuantiti</span>
                    </div>
                    {orderBook.asks.map((a, i) => (
                      <div key={i} className="flex justify-between text-rose-400 hover:bg-rose-950/20 px-1 rounded">
                        <span>{a.price.toFixed(selectedPair.decimals)}</span>
                        <span className="text-slate-300">{a.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* BIDS (BUYERS) */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-sans pb-1 border-b border-slate-800">
                      <span>Harga Beli (MYR)</span>
                      <span>Kuantiti</span>
                    </div>
                    {orderBook.bids.map((b, i) => (
                      <div key={i} className="flex justify-between text-emerald-400 hover:bg-emerald-950/20 px-1 rounded">
                        <span>{b.price.toFixed(selectedPair.decimals)}</span>
                        <span className="text-slate-300">{b.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col (4/12): Order Placement Console */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="font-black text-sm text-white">Borang Pesanan Dagangan</h4>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setOrderType('MARKET')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition ${
                        orderType === 'MARKET' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Pasaran (Market)
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('LIMIT')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition ${
                        orderType === 'LIMIT' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Had (Limit)
                    </button>
                  </div>
                </div>

                {/* BUY / SELL Switcher */}
                <div className="grid grid-cols-2 p-1 rounded-2xl bg-black/50 border border-slate-800 text-xs font-black">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setTradeAction('BUY');
                    }}
                    className={`py-2 rounded-xl transition ${
                      tradeAction === 'BUY'
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    BELI (BUY)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setTradeAction('SELL');
                    }}
                    className={`py-2 rounded-xl transition ${
                      tradeAction === 'SELL'
                        ? 'bg-rose-500 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    JUAL (SELL)
                  </button>
                </div>

                <form onSubmit={handleExecuteTrade} className="space-y-3.5">
                  {/* Limit Price Input if LIMIT */}
                  {orderType === 'LIMIT' && (
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 mb-1 block">
                        Harga Tempahan (MYR):
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={limitPrice}
                        onChange={(e) => setLimitPrice(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  )}

                  {/* Amount Input */}
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
                      <span>Kuantiti ({selectedPair.base}):</span>
                      <span>
                        Baki:{' '}
                        {selectedPair.base === 'COIN'
                          ? user.rewardCoins.toLocaleString()
                          : `RM ${(user.cashBalanceCents / 100).toFixed(2)}`}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(e.target.value)}
                        placeholder="0"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-400"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        {selectedPair.base}
                      </span>
                    </div>
                  </div>

                  {/* Percentage Presets (25%, 50%, 75%, 100%) */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {[25, 50, 75, 100].map((pct) => (
                      <button
                        type="button"
                        key={pct}
                        onClick={() => {
                          sounds.playClick();
                          if (selectedPair.base === 'COIN') {
                            if (tradeAction === 'BUY') {
                              const maxCoinsAffordable = Math.floor(
                                (user.cashBalanceCents / 100) / selectedPair.lastPrice
                              );
                              setTradeAmount(Math.floor((maxCoinsAffordable * pct) / 100).toString());
                            } else {
                              setTradeAmount(Math.floor((user.rewardCoins * pct) / 100).toString());
                            }
                          } else {
                            setTradeAmount((pct * 10).toString());
                          }
                        }}
                        className="py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 border border-slate-700 transition"
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>

                  {/* Total Value Summary */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-slate-800 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Nilai Jumlah Transaksi:</span>
                      <span className="font-mono font-bold text-white tabular-nums">
                        RM{' '}
                        {(
                          (parseFloat(tradeAmount) || 0) *
                          (orderType === 'MARKET' ? selectedPair.lastPrice : parseFloat(limitPrice) || 0)
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Caj Transaksi:</span>
                      <span className="text-emerald-400 font-bold">0% (Percuma)</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    type="submit"
                    className={`w-full py-3.5 rounded-2xl font-black text-sm tracking-wide shadow-lg transition btn-3d ${
                      tradeAction === 'BUY'
                        ? 'btn-3d-primary text-white'
                        : 'bg-rose-600 hover:bg-rose-500 text-white border-b-4 border-rose-800'
                    }`}
                  >
                    {tradeAction === 'BUY'
                      ? `BELI ${selectedPair.base} SEGERA`
                      : `JUAL ${selectedPair.base} SEGERA`}
                  </button>
                </form>
              </div>

              {/* User Trade History Widget */}
              <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2.5">
                <h4 className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center justify-between">
                  <span>Sejarah Transaksi Anda</span>
                  <span className="text-[10px] text-emerald-400">Auto Terakam</span>
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {userTrades.map((t) => (
                    <div
                      key={t.id}
                      className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-black ${
                              t.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {t.type}
                          </span>
                          <span className="font-bold text-white text-[11px]">{t.pair}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block">{t.time}</span>
                      </div>
                      <div className="text-right font-mono">
                        <div className="font-bold text-slate-200">{t.amount.toLocaleString()}</div>
                        <div className="text-[10px] text-amber-300">RM {t.totalMYR.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
