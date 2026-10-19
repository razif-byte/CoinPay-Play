import React from 'react';
import { ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';

interface WatermarkFooterProps {
  className?: string;
  isDark?: boolean;
}

export const WatermarkBadge: React.FC<{ isDark?: boolean }> = ({ isDark = true }) => {
  return (
    <a
      href="https://nasadef.com.my"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide transition-all shadow-sm ${
        isDark
          ? 'bg-slate-800/90 hover:bg-slate-700/90 text-blue-400 border border-blue-500/30 hover:border-blue-400 shadow-blue-500/10'
          : 'bg-white/90 hover:bg-slate-100 text-blue-600 border border-blue-200 shadow-slate-200'
      }`}
      title="RazifApps@nasadef® - Lawati nasadef.com.my"
    >
      <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
      <span>RazifApps@nasadef®</span>
      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
    </a>
  );
};

export const WatermarkFooter: React.FC<WatermarkFooterProps> = ({
  className = '',
  isDark = true,
}) => {
  return (
    <footer
      className={`w-full border-t py-6 px-4 text-center transition-colors ${
        isDark
          ? 'bg-slate-950/80 border-slate-800/80 text-slate-400'
          : 'bg-slate-50 border-slate-200 text-slate-600'
      } ${className}`}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* Left: Watermark Badge */}
        <div className="flex items-center gap-3">
          <WatermarkBadge isDark={isDark} />
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Sistem Lejar Selamat Terjamin
          </span>
        </div>

        {/* Center/Right: Required Copyright Footer & Link */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <a
            href="https://nasadef.com.my"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold tracking-wide text-xs transition-colors hover:underline flex items-center gap-1 text-slate-300 hover:text-blue-400"
          >
            ©COPYRIGHT BY NASADEF™ SDN. BHD.®
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <span className="hidden sm:inline opacity-40">|</span>
          <span className="text-[11px] opacity-75">
            Semua Hak Cipta Terpelihara • Kuala Lumpur, Malaysia
          </span>
        </div>
      </div>
    </footer>
  );
};
