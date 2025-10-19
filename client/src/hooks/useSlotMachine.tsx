// FIX: Added imports for 'useState' and 'useCallback' from React.
import { useState, useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

// --- Types (Good practice for TS) ---
interface Win {
  payline: number;
  length: number;
  symbol: string;
  multiplier: number;
}

interface SpinOutcome {
  grid: string[][];
  wins: Win[];
  payout: number;
  multiplier: number;
  scatterCount: number;
  bonusTriggered: boolean;
  serverSeed: string;
}

interface ServerHash {
  commitId: string;
  serverHash: string;
}

// --- Mock API Functions (Adjust your API paths) ---
const API_URL = '/api'; // Or your Replit/server URL

const fetchServerHash = async (): Promise<ServerHash> => {
  const res = await fetch(`${API_URL}/get-server-hash`);
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
};

const postSpin = async (variables: {
  commitId: string;
  clientSeed: string;
  bet: number;
}): Promise<SpinOutcome> => {
  const res = await fetch(`${API_URL}/spin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(variables),
  });
  if (!res.ok) throw new Error("Spin request failed");
  return res.json();
};


// --- The Custom Hook ---
export function useSlotMachine() {
  // --- State Management ---
  const [balance, setBalance] = useState(5000);
  const [bet, setBet] = useState(1);
  const [clientSeed, setClientSeed] = useState("bounty-hunter-session-123");
  const [grid, setGrid] = useState<string[][]>(
    Array.from({ length: 3 }, () => Array(5).fill('BOOTS')) // Default grid
  );
  const [wins, setWins] = useState<Win[]>([]);
  const [payout, setPayout] = useState(0);
  const [scatterCount, setScatterCount] = useState(0);
  const [bonusTriggered, setBonusTriggered] = useState(false);
  const [lastServerSeed, setLastServerSeed] = useState<string | null>(null);

  // --- Data Fetching ---
  const { data: serverCommit, refetch: getNewHash } = useQuery({
    queryKey: ["serverHash"],
    queryFn: fetchServerHash,
  });

  const spinMutation = useMutation({
    mutationFn: postSpin,
    onSuccess: (data) => {
      // Update state with results from the server
      setBalance((prev) => prev + data.payout);
      setGrid(data.grid);
      setWins(data.wins);
      setPayout(data.payout);
      setScatterCount(data.scatterCount);
      setBonusTriggered(data.bonusTriggered);
      setLastServerSeed(data.serverSeed);
      getNewHash(); // Fetch the next server hash automatically
    },
    onError: (error) => {
      console.error("Spin mutation failed:", error);
      setBalance((prev) => prev + bet); // Refund bet on error
      getNewHash(); // Get a new hash to try again
    },
  });

  // --- The Spin Function ---
  const spin = useCallback(() => {
    if (!serverCommit || spinMutation.isPending) {
      return;
    }

    // Reset previous spin results
    setWins([]);
    setPayout(0);
    setScatterCount(0);
    setBonusTriggered(false);

    // Deduct bet before sending request
    setBalance((prev) => prev - bet);

    spinMutation.mutate({
      commitId: serverCommit.commitId,
      clientSeed,
      bet,
    });
  }, [serverCommit, spinMutation, bet, clientSeed]);

  // --- Return all the values the component needs ---
  return {
    grid,
    wins,
    payout,
    multiplier: wins.reduce((acc, w) => acc + w.multiplier, 0), // Calculate multiplier
    balance,
    bet,
    scatterCount,
    bonusTriggered,
    lastServerSeed,
    setBet,
    spin,
    isSpinning: spinMutation.isPending,
    spinning: spinMutation.isPending, // Alias

    // FIX: Expose 'setWins' so the component can clear the overlay
    setWins, 
  };
}