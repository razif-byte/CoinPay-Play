import React, { useState } from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  // Direct Google Drive thumbnail link
  const logoUrl = "https://lh3.googleusercontent.com/d/1GRbF08VdeH6C9VeZ79IyApJEYmAQ6kwJ";

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-lg',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`relative ${sizeClasses[size]} rounded-2xl overflow-hidden flex items-center justify-center p-0.5 shadow-md bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex-shrink-0`}>
        {!imgError ? (
          <img
            src={logoUrl}
            alt="CoinPay Play™ Logo"
            className="w-full h-full object-cover rounded-[14px]"
            onError={() => setImgError(true)}
            loading="eager"
          />
        ) : (
          <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-blue-400 font-extrabold tracking-tight">
            CP
          </div>
        )}
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-lg md:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              CoinPay Play
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
              ™
            </span>
          </div>
          <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">
            E-Wallet & Arked Rewards
          </span>
        </div>
      )}
    </div>
  );
};
