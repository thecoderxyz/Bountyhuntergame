import { useState, useEffect, useRef } from "react";
import { ReelSymbol } from "./ReelSymbol";
import { PaylineDisplay } from "./PaylineDisplay";
import { ControlPanel } from "./ControlPanel";
import { useSlotMachine } from "../hooks/useSlotMachine";

export function SlotMachine() {
  const {
    grid,
    spinning,
    wins,
    payout,
    multiplier,
    scatterCount,
    bonusTriggered,
    balance,
    bet,
    setBet,
    spin,
    isSpinning,
    lastServerSeed
  } = useSlotMachine();

  const [animationPhase, setAnimationPhase] = useState<'idle' | 'spinning' | 'stopping'>('idle');
  const symbolRefs = useRef<(HTMLDivElement | null)[][]>(
    Array.from({ length: 3 }, () => Array(5).fill(null))
  );

  useEffect(() => {
    if (spinning) {
      setAnimationPhase('spinning');
    } else if (animationPhase === 'spinning') {
      setAnimationPhase('stopping');
      // Reset to idle after stop animation
      const timer = setTimeout(() => setAnimationPhase('idle'), 1000);
      return () => clearTimeout(timer);
    }
  }, [spinning, animationPhase]);

  return (
    <div className="w-full bg-gradient-to-b from-amber-700 to-amber-900 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border-4 sm:border-6 lg:border-8 border-amber-600 p-3 sm:p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Slot Machine Frame */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 md:p-6 shadow-inner">
        
        {/* Info Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 mb-4 sm:mb-6 bg-black bg-opacity-50 rounded-lg p-3 sm:p-4">
          <div className="text-amber-100">
            <span className="text-sm sm:text-base md:text-lg font-bold">Balance: ${balance}</span>
          </div>
          <div className="text-amber-100">
            <span className="text-sm sm:text-base md:text-lg font-bold">Bet: ${bet}</span>
          </div>
          {payout > 0 && (
            <div className="text-green-400 animate-pulse">
              <span className="text-base sm:text-lg md:text-xl font-bold">Win: ${payout}!</span>
            </div>
          )}
        </div>

        {/* Reels Container */}
        <div className="relative bg-black rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 mb-4 sm:mb-6" id="reels-container">
          <div className="grid grid-cols-5 gap-1 sm:gap-2 md:gap-3">
            {Array.from({ length: 5 }).map((_, reelIndex) => (
              <div key={reelIndex} className="flex flex-col gap-1 sm:gap-2 md:gap-3">
                {Array.from({ length: 3 }).map((_, rowIndex) => (
                  <div 
                    key={`${reelIndex}-${rowIndex}`} 
                    className="relative"
                    ref={(el) => {
                      if (symbolRefs.current[rowIndex]) {
                        symbolRefs.current[rowIndex][reelIndex] = el;
                      }
                    }}
                  >
                    <ReelSymbol
                      symbol={grid[rowIndex]?.[reelIndex] || 'WHISKEY'}
                      isSpinning={animationPhase === 'spinning'}
                      delay={reelIndex * 200}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Payline Overlay */}
          {wins.length > 0 && animationPhase === 'idle' && (
            <PaylineDisplay wins={wins} symbolRefs={symbolRefs.current} />
          )}

          {/* Bonus Trigger Effect */}
          {bonusTriggered && (
            <div className="absolute inset-0 bg-yellow-500 bg-opacity-20 rounded-lg sm:rounded-xl animate-pulse flex items-center justify-center">
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-yellow-300 drop-shadow-lg animate-bounce px-2 text-center">
                🎯 DUEL BONUS! 🎯
              </div>
            </div>
          )}
        </div>

        {/* Win Information */}
        {wins.length > 0 && (
          <div className="mb-3 sm:mb-4 bg-green-800 bg-opacity-50 rounded-lg p-3 sm:p-4">
            <h3 className="text-amber-100 font-bold text-base sm:text-lg mb-2">Winning Lines:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {wins.map((win, index) => (
                <div key={index} className="text-green-300 text-xs sm:text-sm">
                  Line {win.payline + 1}: {win.length}x {win.symbol} = {win.multiplier}x
                </div>
              ))}
            </div>
            {scatterCount >= 3 && (
              <div className="text-yellow-300 font-bold mt-2 text-sm sm:text-base">
                {scatterCount} Scatter symbols found!
              </div>
            )}
          </div>
        )}

        {/* Control Panel */}
        <ControlPanel
          bet={bet}
          setBet={setBet}
          onSpin={spin}
          canSpin={!isSpinning && balance >= bet}
          balance={balance}
        />

        {/* Provably Fair Info */}
        {lastServerSeed && (
          <div className="mt-3 sm:mt-4 text-[0.625rem] sm:text-xs text-amber-300 bg-black bg-opacity-30 rounded p-2">
            <div className="font-mono break-all text-[0.625rem] sm:text-xs">
              Last Server Seed: {lastServerSeed.slice(0, 16)}...
            </div>
            <div className="text-amber-400 mt-1 text-[0.625rem] sm:text-xs">
              ✓ Provably Fair - Cryptographically Secure
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
