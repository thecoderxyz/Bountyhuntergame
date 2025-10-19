import { Button } from "./ui/button";

// FIX: Add the new audio function props
interface ControlPanelProps {
  bet: number;
  setBet: (bet: number) => void;
  onSpin: () => void;
  canSpin: boolean;
  balance: number;
  playClick: () => void;
  initializeAudio: () => void;
}

const BET_OPTIONS = [0.25, 0.50, 1, 2, 5, 10, 25, 50];

export function ControlPanel({ 
  bet, 
  setBet, 
  onSpin, 
  canSpin, 
  balance,
  // FIX: Destructure the new props
  playClick,
  initializeAudio
}: ControlPanelProps) {

  // FIX: All handler functions now initialize audio and play a click sound
  const handleBetChange = (amount: number) => {
    initializeAudio();
    playClick();
    setBet(amount);
  };

  const handleBetHalf = () => {
    initializeAudio();
    playClick();
    const newBet = Math.max(0.25, bet / 2);
    setBet(newBet);
  };

  const handleBetDouble = () => {
    initializeAudio();
    playClick();
    const newBet = Math.min(50, bet * 2);
    setBet(newBet);
  };

  const handleMaxBet = () => {
    initializeAudio();
    playClick();
    const newBet = Math.min(50, balance);
    setBet(newBet);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Bet Selection */}
      <div className="bg-amber-800 bg-opacity-50 rounded-lg p-3 sm:p-4">
        <h3 className="text-amber-100 font-bold mb-2 sm:mb-3 text-sm sm:text-base">Select Your Bet:</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {BET_OPTIONS.map((amount) => (
            <Button
              key={amount}
              onClick={() => handleBetChange(amount)}
              variant={bet === amount ? "default" : "outline"}
              disabled={amount > balance || !canSpin} // FIX: Also disable if spinning
              className={`
                text-xs sm:text-sm
                ${bet === amount 
                  ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                  : 'bg-amber-900 hover:bg-amber-800 text-amber-100 border-amber-600'
                }
                ${(amount > balance || !canSpin) ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              ${amount}
            </Button>
          ))}
        </div>
      </div>

      {/* Spin Controls */}
      <div className="flex items-center justify-center">
        <Button
          onClick={onSpin} // The 'onSpin' prop from SlotMachine already handles audio
          disabled={!canSpin}
          size="lg"
          className={`
            w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl font-bold rounded-xl
            ${canSpin 
              ? 'bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white shadow-lg transform hover:scale-105' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }
            transition-all duration-200
          `}
        >
          {canSpin ? '🎰 SPIN! 🎰' : 'SPINNING...'}
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
        <Button
          onClick={handleBetHalf}
          variant="outline"
          disabled={!canSpin} // FIX: Also disable if spinning
          className="flex-1 sm:flex-none bg-amber-900 hover:bg-amber-800 text-amber-100 border-amber-600 text-xs sm:text-sm disabled:opacity-50"
        >
          Bet ½
        </Button>
        <Button
          onClick={handleBetDouble}
          variant="outline"
          disabled={bet * 2 > balance || !canSpin} // FIX: Also disable if spinning
          className="flex-1 sm:flex-none bg-amber-900 hover:bg-amber-800 text-amber-100 border-amber-600 text-xs sm:text-sm disabled:opacity-50"
        >
          Bet 2x
        </Button>
        <Button
          onClick={handleMaxBet}
          variant="outline"
          disabled={balance <= 0 || !canSpin} // FIX: Also disable if spinning
          className="flex-1 sm:flex-none bg-amber-900 hover:bg-amber-800 text-amber-100 border-amber-600 text-xs sm:text-sm disabled:opacity-50"
        >
          Max Bet
        </Button>
      </div>
    </div>
  );
}