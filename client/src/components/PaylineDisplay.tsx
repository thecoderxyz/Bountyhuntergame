interface PaylineDisplayProps {
  wins: Array<{
    payline: number;
    symbol: string;
    length: number;
    multiplier: number;
  }>;
  symbolRefs: (HTMLDivElement | null)[][];
}

const PAYLINE_COLORS = [
  'border-red-500',
  'border-blue-500', 
  'border-green-500',
  'border-yellow-500',
  'border-purple-500',
  'border-pink-500',
  'border-orange-500',
  'border-cyan-500',
  'border-lime-500',
  'border-indigo-500'
];

// Payline patterns (row indices for each reel)
const PAYLINES = [
  [1, 1, 1, 1, 1], // Middle Row
  [0, 0, 0, 0, 0], // Top Row
  [2, 2, 2, 2, 2], // Bottom Row
  [0, 1, 2, 1, 0], // V-shape
  [2, 1, 0, 1, 2], // Inverted V
  [0, 0, 1, 2, 2],
  [2, 2, 1, 0, 0],
  [0, 1, 0, 1, 0],
  [1, 0, 1, 0, 1],
  [1, 2, 1, 2, 1]
];

import { useState, useLayoutEffect } from 'react';

export function PaylineDisplay({ wins, symbolRefs }: PaylineDisplayProps) {
  const [winPositions, setWinPositions] = useState<Map<number, Array<{ x: number; y: number }>>>(new Map());
  
  // Measure and update positions after layout changes
  useLayoutEffect(() => {
    const measurePositions = () => {
      const containerRef = document.getElementById('reels-container');
      if (!containerRef) return;
      
      requestAnimationFrame(() => {
        const containerRect = containerRef.getBoundingClientRect();
        const newPositions = new Map<number, Array<{ x: number; y: number }>>();
        
        wins.forEach((win, index) => {
          const payline = PAYLINES[win.payline];
          const positions = Array.from({ length: win.length }).map((_, reelIndex) => {
            const row = payline[reelIndex];
            const symbolElement = symbolRefs[row]?.[reelIndex];
            
            if (!symbolElement) return null;
            
            const rect = symbolElement.getBoundingClientRect();
            const x = rect.left - containerRect.left + rect.width / 2;
            const y = rect.top - containerRect.top + rect.height / 2;
            
            return { x, y };
          }).filter(Boolean) as Array<{ x: number; y: number }>;
          
          if (positions.length > 0) {
            newPositions.set(index, positions);
          }
        });
        
        setWinPositions(newPositions);
      });
    };
    
    // Measure immediately
    measurePositions();
    
    // Re-measure on window resize
    window.addEventListener('resize', measurePositions);
    
    // Use ResizeObserver for more responsive updates
    const containerRef = document.getElementById('reels-container');
    let resizeObserver: ResizeObserver | null = null;
    
    if (containerRef && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(measurePositions);
      resizeObserver.observe(containerRef);
    }
    
    return () => {
      window.removeEventListener('resize', measurePositions);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [wins, symbolRefs]);
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {wins.map((win, index) => {
        const positions = winPositions.get(index);
        if (!positions || positions.length === 0) return null;
        
        const color = PAYLINE_COLORS[win.payline] || 'border-white';
        
        return (
          <div key={index} className="absolute inset-0">
            {/* Draw dots at winning symbol centers */}
            {positions.map((pos, reelIndex) => (
              <div
                key={reelIndex}
                className={`absolute w-3 h-3 sm:w-4 sm:h-4 rounded-full ${color.replace('border', 'bg').replace('-500', '-400')} animate-pulse`}
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${reelIndex * 100}ms`
                }}
              />
            ))}
            
            {/* Line connecting the dots */}
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
              <polyline
                points={positions.map(pos => `${pos.x},${pos.y}`).join(' ')}
                fill="none"
                stroke={color.replace('border-', '').replace('-500', '')}
                strokeWidth="2"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
