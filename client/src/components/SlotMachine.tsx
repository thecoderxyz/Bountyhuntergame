import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ReelSymbol } from "./ReelSymbol";
import { PaylineDisplay } from "./PaylineDisplay";
import { ControlPanel } from "./ControlPanel";
import { useSlotMachine } from "../hooks/useSlotMachine";
import { useAudio } from "../hooks/useAudio";
import { AudioControls } from "./AudioControls";

export default function SlotMachine() {
  const {
    grid,
    spinning,
    wins,
    payout,
    scatterCount,
    bonusTriggered,
    balance,
    bet,
    setBet,
    spin,
    isSpinning,
    lastServerSeed,
    setWins,
  } = useSlotMachine();

  const {
    isMuted,
    volume,
    toggleMute,
    setVolume,
    playSpin,
    playWin,
    playClick,
    initializeAudio,
  } = useAudio();

  const [animationPhase, setAnimationPhase] = useState<'idle' | 'spinning' | 'stopping'>('idle');
  const symbolRefs = useRef<(HTMLDivElement | null)[][]>(
    Array.from({ length: 3 }, () => Array(5).fill(null))
  );

  useEffect(() => {
    if (spinning) {
      setAnimationPhase('spinning');
    } else if (animationPhase === 'spinning') {
      setAnimationPhase('stopping');
      const timer = setTimeout(() => setAnimationPhase('idle'), 1000);
      return () => clearTimeout(timer);
    }
  }, [spinning, animationPhase]);

  useEffect(() => {
    if (wins.length > 0 && animationPhase === 'idle') {
      playWin();
      const timer = setTimeout(() => {
        setWins([]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [wins, animationPhase, setWins, playWin]);

  const handleSpin = () => {
    initializeAudio();
    playSpin();
    spin();
  };

  return (
    <div className="w-full bg-gradient-to-b from-amber-700 to-amber-900 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border-4 sm:border-6 lg:border-8 border-amber-600 p-3 sm:p-4 md:p-6 lg:p-8 max-w-6xl mx-auto h-full">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 md:p-6 shadow-inner flex flex-col h-full">

        <header className="flex-shrink-0">
          {/*
            FIX 1: AudioControls have been REMOVED from this header section.
          */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 mb-4 sm:mb-6 bg-black bg-opacity-50 rounded-lg p-3 sm:p-4">
            <div className="text-amber-100 text-center">
              <span className="text-sm sm:text-base md:text-lg font-bold">Balance: ${balance}</span>
            </div>
            <div className="text-amber-100 text-center">
              <span className="text-xs sm:text-base md:text-lg font-bold">Bet: ${bet}</span>
            </div>
            {payout > 0 && !isSpinning && (
              <div className="text-green-400 animate-pulse text-center">
                <span className="text-base sm:text-lg md:text-xl font-bold">Win: ${payout}!</span>
              </div>
            )}
          </div>
        </header>

        <main className="flex-grow overflow-y-auto">
          <div className="relative bg-black rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4" id="reels-container">
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

            <PaylineDisplay wins={wins} symbolRefs={symbolRefs.current} />

            {bonusTriggered && (
              <div className="absolute inset-0 bg-yellow-500 bg-opacity-20 rounded-lg sm:rounded-xl animate-pulse flex items-center justify-center z-10">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-yellow-300 drop-shadow-lg animate-bounce px-2 text-center">
                  🎯 DUEL BONUS! 🎯
                </div>
              </div>
            )}

            <AnimatePresence>
              {wins.length > 0 && animationPhase === 'idle' && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 z-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="bg-green-800 bg-opacity-80 rounded-lg p-4 w-full max-w-md shadow-lg border-2 border-green-500"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, transition: { delay: 0.1 } }}
                    exit={{ scale: 0.7, opacity: 0 }}
                  >
                    <h3 className="text-amber-100 font-bold text-center text-xl sm:text-2xl mb-3">
                      Total Win: ${payout}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {wins.map((win, index) => (
                        <div key={index} className="text-green-300 text-sm sm:text-base">
                          Line {win.payline + 1}: {win.length}x {win.symbol} = {win.multiplier}x
                        </div>
                      ))}
                    </div>
                    {scatterCount >= 3 && (
                      <div className="text-yellow-300 font-bold mt-2 text-center text-sm sm:text-base">
                        {scatterCount} Scatter symbols found!
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        <footer className="flex-shrink-0 pt-4 sm:pt-6">
          <ControlPanel
            bet={bet}
            setBet={setBet}
            onSpin={handleSpin}
            canSpin={!isSpinning && balance >= bet}
            balance={balance}
            playClick={playClick}
            initializeAudio={initializeAudio}
          />

          {/*
            FIX 2: This new container organizes the bottom row.
            - 'flex justify-between items-center': Pushes items to each side.
          */}
          <div className="mt-3 sm:mt-4 flex justify-between items-center gap-4">
            {/* Provably Fair Info (stays on the left) */}
            {lastServerSeed && (
              <div className="text-[0.625rem] sm:text-xs text-amber-300 bg-black bg-opacity-30 rounded p-2">
                <div className="font-mono break-all text-[0.625rem] sm:text-xs">
                  Last Server Seed: {lastServerSeed.slice(0, 16)}...
                </div>
                <div className="text-amber-400 mt-1 text-[0.625rem] sm:text-xs">
                  ✓ Provably Fair - Cryptographically Secure
                </div>
              </div>
            )}

            {/*
              FIX 3: AudioControls are now here, on the bottom-right.
              - 'flex-shrink-0': Prevents it from shrinking on small screens.
            */}
            <div className="flex-shrink-0">
              <AudioControls
                isMuted={isMuted}
                volume={volume}
                toggleMute={toggleMute}
                setVolume={setVolume}
                playClick={playClick}
                initializeAudio={initializeAudio}
              />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}