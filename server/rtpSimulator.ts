import { produceSpin } from "./slotLogic";
import crypto from "crypto";

export async function runRTPSimulation(rounds: number = 10_000_000) {
  console.log(`Starting Bounty Hunter's Call RTP Simulation...`);
  console.log(`Running ${rounds.toLocaleString()} spins...`);
  
  let totalBet = 0;
  let totalPayout = 0;
  let bonusTriggers = 0;
  const betPerSpin = 1;
  
  const startTime = Date.now();
  
  for (let i = 0; i < rounds; i++) {
    // Use cryptographically random seeds for accurate simulation
    const serverSeed = crypto.randomBytes(32).toString('hex');
    const clientSeed = crypto.randomBytes(16).toString('hex');
    
    const outcome = produceSpin(serverSeed, clientSeed);
    
    totalBet += betPerSpin;
    totalPayout += outcome.totalMultiplier * betPerSpin;
    
    if (outcome.bonusTriggered) {
      bonusTriggers++;
    }
    
    // Log progress every million spins
    if ((i + 1) % 1_000_000 === 0) {
      console.log(`...simulated ${(i + 1).toLocaleString()} spins...`);
    }
  }
  
  const endTime = Date.now();
  const durationSeconds = (endTime - startTime) / 1000;
  
  // Calculate results
  const baseGameRTP = (totalPayout / totalBet) * 100;
  const bonusFrequency = rounds / bonusTriggers;
  
  const results = {
    totalSpins: rounds,
    totalBet,
    totalPayout,
    durationSeconds: Math.round(durationSeconds * 100) / 100,
    baseGameRTP: Math.round(baseGameRTP * 10000) / 10000,
    bonusFrequency: Math.round(bonusFrequency * 100) / 100,
    bonusTriggers
  };
  
  console.log("\n--- Simulation Complete ---");
  console.log(`Total Spins: ${results.totalSpins.toLocaleString()}`);
  console.log(`Total Bet: ${results.totalBet.toLocaleString()}`);
  console.log(`Total Payout (Base Game): ${results.totalPayout.toLocaleString()}`);
  console.log(`Duration: ${results.durationSeconds} seconds`);
  console.log("---------------------------");
  console.log(`BASE GAME RTP: ${results.baseGameRTP}%`);
  console.log(`Bonus Frequency: 1 in ${results.bonusFrequency} spins`);
  console.log(`Bonus Triggers: ${results.bonusTriggers}`);
  console.log("---------------------------");
  console.log("NOTE: Total RTP will be higher when bonus rounds are included.");
  
  return results;
}
