import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { slotApi } from "../lib/slotApi";

export function useSlotMachine() {
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(1);
  const [grid, setGrid] = useState<string[][]>([
    ['WHISKEY', 'BOOTS', 'BADGE', 'GOLD', 'WANTED'],
    ['BOOTS', 'BADGE', 'GOLD', 'WANTED', 'WHISKEY'], 
    ['BADGE', 'GOLD', 'WANTED', 'WHISKEY', 'BOOTS']
  ]);
  const [wins, setWins] = useState<Array<{
    payline: number;
    symbol: string;
    length: number;
    multiplier: number;
  }>>([]);
  const [payout, setPayout] = useState(0);
  const [multiplier, setMultiplier] = useState(0);
  const [scatterCount, setScatterCount] = useState(0);
  const [bonusTriggered, setBonusTriggered] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [lastServerSeed, setLastServerSeed] = useState<string>('');

  const spinMutation = useMutation({
    mutationFn: async () => {
      // First get server hash commitment
      const hashResponse = await slotApi.getServerHash();
      
      // Generate client seed (in real implementation, user could provide this)
      const clientSeed = Math.random().toString(36).substring(2, 15);
      
      // Perform spin
      return await slotApi.spin({
        commitId: hashResponse.commitId,
        clientSeed,
        bet
      });
    },
    onSuccess: (result) => {
      setGrid(result.grid);
      setWins(result.wins || []);
      setPayout(result.payout || 0);
      setMultiplier(result.multiplier || 0);
      setScatterCount(result.scatterCount || 0);
      setBonusTriggered(result.bonusTriggered || false);
      setLastServerSeed(result.serverSeed || '');
      
      // Update balance
      setBalance(prev => prev - bet + (result.payout || 0));
      
      setSpinning(false);
    },
    onError: (error) => {
      console.error('Spin failed:', error);
      setSpinning(false);
    }
  });

  const spin = useCallback(() => {
    if (spinning || balance < bet) return;
    
    setSpinning(true);
    setPayout(0);
    setWins([]);
    setBonusTriggered(false);
    
    spinMutation.mutate();
  }, [spinning, balance, bet, spinMutation]);

  return {
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
    isSpinning: spinning || spinMutation.isPending,
    lastServerSeed
  };
}
