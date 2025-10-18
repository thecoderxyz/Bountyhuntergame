import { Button } from "./ui/button";

interface ControlPanelProps {
  bet: number;
  setBet: (bet: number) => void;
  onSpin: () => void;
  canSpin: boolean;
  balance: number;
}

const BET_OPTIONS = [0.25, 0.50, 1, 2, 5, 10, 25, 50];

export function ControlPanel({ bet, setBet, onSpin, canSpin, balance }: ControlPanelProps) {
  const handleBetChange = (amount: number) => {
    console.log('Bet button clicked:', amount);
    setBet(amount);
  };

  const handleBetHalf = () => {
    const newBet = Math.max(0.25, bet / 2);
    console.log('Bet ½ clicked:', bet, '->', newBet);
    setBet(newBet);
  };

  const handleBetDouble = () => {
    const newBet = Math.min(50, bet * 2);
    console.log('Bet 2x clicked:', bet, '->', newBet);
    setBet(newBet);
  };

  const handleMaxBet = () => {
    const newBet = Math.min(50, balance);
    console.log('Max Bet clicked:', balance, '->', newBet);
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
              disabled={amount > balance}
              className={`
                text-xs sm:text-sm
                ${bet === amount 
                  ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                  : 'bg-amber-900 hover:bg-amber-800 text-amber-100 border-amber-600'
                }
                ${amount > balance ? 'opacity-50 cursor-not-allowed' : ''}
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
          onClick={onSpin}
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
          className="flex-1 sm:flex-none bg-amber-900 hover:bg-amber-800 text-amber-100 border-amber-600 text-xs sm:text-sm"
        >
          Bet ½
        </Button>
        <Button
          onClick={handleBetDouble}
          variant="outline"
          disabled={bet * 2 > balance}
          className="flex-1 sm:flex-none bg-amber-900 hover:bg-amber-800 text-amber-100 border-amber-600 text-xs sm:text-sm"
        >
          Bet 2x
        </Button>
        <Button
          onClick={handleMaxBet}
          variant="outline"
          disabled={balance <= 0}
          className="flex-1 sm:flex-none bg-amber-900 hover:bg-amber-800 text-amber-100 border-amber-600 text-xs sm:text-sm"
        >
          Max Bet
        </Button>
      </div>
    </div>
  );
}
