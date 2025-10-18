import { useEffect, useState } from "react";

interface ReelSymbolProps {
  symbol: string;
  isSpinning: boolean;
  delay: number;
}

const SYMBOL_ICONS: Record<string, string> = {
  'WHISKEY': '🥃',
  'BOOTS': '🥾', 
  'BADGE': '⭐',
  'GOLD': '💰',
  'WANTED': '📋',
  'WILD': '🃏',
  'SCATTER': '🎯'
};

const SYMBOL_COLORS: Record<string, string> = {
  'WHISKEY': 'from-amber-600 to-amber-800',
  'BOOTS': 'from-amber-700 to-amber-900',
  'BADGE': 'from-yellow-500 to-yellow-700',
  'GOLD': 'from-yellow-400 to-yellow-600',
  'WANTED': 'from-red-600 to-red-800',
  'WILD': 'from-purple-600 to-purple-800',
  'SCATTER': 'from-green-600 to-green-800'
};

export function ReelSymbol({ symbol, isSpinning, delay }: ReelSymbolProps) {
  const [displaySymbol, setDisplaySymbol] = useState(symbol);
  const [spinClass, setSpinClass] = useState('');

  useEffect(() => {
    if (isSpinning) {
      // Start spinning animation with delay
      const startTimer = setTimeout(() => {
        setSpinClass('animate-spin');
        
        // Cycle through random symbols while spinning
        const symbolKeys = Object.keys(SYMBOL_ICONS);
        const cycleInterval = setInterval(() => {
          setDisplaySymbol(symbolKeys[Math.floor(Math.random() * symbolKeys.length)]);
        }, 100);

        // Stop after random duration
        const stopTimer = setTimeout(() => {
          clearInterval(cycleInterval);
          setSpinClass('');
          setDisplaySymbol(symbol);
        }, 1500 + Math.random() * 1000);

        return () => {
          clearInterval(cycleInterval);
          clearTimeout(stopTimer);
        };
      }, delay);

      return () => clearTimeout(startTimer);
    } else {
      setDisplaySymbol(symbol);
      setSpinClass('');
    }
  }, [isSpinning, symbol, delay]);

  const bgGradient = SYMBOL_COLORS[displaySymbol] || 'from-gray-600 to-gray-800';
  const icon = SYMBOL_ICONS[displaySymbol] || '❓';

  return (
    <div 
      className={`
        w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24
        bg-gradient-to-b ${bgGradient} 
        rounded-md sm:rounded-lg border-2 border-amber-500 
        flex items-center justify-center 
        shadow-lg transform transition-transform 
        ${spinClass} 
        ${isSpinning ? 'scale-110' : 'hover:scale-105'}
      `}
    >
      <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl drop-shadow-lg">
        {icon}
      </div>
      
      {/* Symbol name */}
      <div className="absolute bottom-0 left-0 right-0 text-[0.5rem] sm:text-xs text-center text-white bg-black bg-opacity-50 rounded-b-md sm:rounded-b-lg py-0.5 sm:py-1">
        {displaySymbol}
      </div>
    </div>
  );
}
