import crypto from "crypto";

// Symbol definitions with weights and payouts
export const SYMBOLS = [
  { id: "WHISKEY", weight: 30, payout3: 5, payout4: 10, payout5: 25 },
  { id: "BOOTS",   weight: 25, payout3: 5, payout4: 12, payout5: 30 },
  { id: "BADGE",   weight: 20, payout3: 10, payout4: 25, payout5: 75 },
  { id: "GOLD",    weight: 15, payout3: 15, payout4: 50, payout5: 150 },
  { id: "WANTED",  weight: 10, payout3: 25, payout4: 100, payout5: 500 },
  { id: "WILD",    weight: 5,  payout3: 50, payout4: 150, payout5: 1000 },
  { id: "SCATTER", weight: 8,  payout3: 0, payout4: 0, payout5: 0 }
];

export const REELS_COUNT = 5;
export const VISIBLE_ROWS = 3;

// Payline definitions (row indices for each reel)
export const PAYLINES = [
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

// Build weighted reel strips
function buildReelStrip(weightedSymbols: typeof SYMBOLS, stripLength = 100): string[] {
  const pool: string[] = [];
  
  weightedSymbols.forEach(symbol => {
    for (let i = 0; i < symbol.weight; i++) {
      pool.push(symbol.id);
    }
  });
  
  const strip: string[] = [];
  for (let i = 0; i < stripLength; i++) {
    strip.push(pool[crypto.randomInt(0, pool.length)]);
  }
  
  return strip;
}

// Generate reel strips
export const REEL_STRIPS = Array.from({ length: REELS_COUNT }, () => buildReelStrip(SYMBOLS));

export function symbolMeta(id: string) {
  return SYMBOLS.find(s => s.id === id);
}

// Cryptographic functions for provable fairness
function hmacSha256Bytes(serverSeed: string, clientSeed: string, nonce: number): Buffer {
  const hmac = crypto.createHmac("sha256", Buffer.from(serverSeed, "hex"));
  hmac.update(clientSeed + ":" + nonce);
  return hmac.digest();
}

function bytesToInt(buf: Buffer, n: number): number {
  let val = 0n;
  for (let i = 0; i < 6; i++) {
    val = (val << 8n) + BigInt(buf[i]);
  }
  return Number(val % BigInt(n));
}

// Core spin logic
export function produceSpin(serverSeed: string, clientSeed: string) {
  const grid: string[][] = Array.from({ length: VISIBLE_ROWS }, () => Array(REELS_COUNT).fill(null));
  let nonce = 0;

  // Generate reel positions using cryptographic randomness
  for (let reel = 0; reel < REELS_COUNT; reel++) {
    const strip = REEL_STRIPS[reel];
    const stopIndex = bytesToInt(hmacSha256Bytes(serverSeed, clientSeed, nonce++), strip.length);
    
    for (let row = 0; row < VISIBLE_ROWS; row++) {
      grid[row][reel] = strip[(stopIndex + row) % strip.length];
    }
  }

  // Calculate wins
  let totalMultiplier = 0;
  const wins: Array<{
    payline: number;
    symbol: string;
    length: number;
    multiplier: number;
  }> = [];

  let scatterCount = 0;
  grid.flat().forEach(symbolId => {
    if (symbolId === 'SCATTER') scatterCount++;
  });

  // Check each payline for wins
  for (let p = 0; p < PAYLINES.length; p++) {
    const line = PAYLINES[p];
    const symbolsOnLine = line.map((row, reel) => grid[row][reel]);
    const firstSymbol = symbolsOnLine.find(s => s !== 'WILD') || symbolsOnLine[0];
    
    if (firstSymbol === 'SCATTER') continue; // Scatters don't form paylines

    let matchLength = 0;
    for (const symbol of symbolsOnLine) {
      if (symbol === firstSymbol || symbol === 'WILD') {
        matchLength++;
      } else {
        break;
      }
    }

    if (matchLength >= 3) {
      const meta = symbolMeta(firstSymbol);
      const payoutKey = `payout${matchLength}` as keyof typeof meta;
      
      if (meta && meta[payoutKey]) {
        const multiplier = meta[payoutKey] as number;
        totalMultiplier += multiplier;
        wins.push({
          payline: p,
          symbol: firstSymbol,
          length: matchLength,
          multiplier
        });
      }
    }
  }

  const bonusTriggered = scatterCount >= 3;

  return {
    grid,
    wins,
    totalMultiplier,
    scatterCount,
    bonusTriggered
  };
}

// Commitment system for provable fairness
const pendingCommits = new Map<string, { serverSeed: string; serverHash: string }>();

function createCommit() {
  const serverSeed = crypto.randomBytes(32).toString("hex");
  const serverHash = crypto.createHash("sha256").update(serverSeed).digest("hex");
  const id = crypto.randomBytes(8).toString("hex");
  
  pendingCommits.set(id, { serverSeed, serverHash });
  return { id, serverHash };
}

function revealCommit(id: string): string | null {
  const record = pendingCommits.get(id);
  if (!record) return null;
  
  pendingCommits.delete(id);
  return record.serverSeed;
}

// API functions
export function getServerHash() {
  const commit = createCommit();
  return {
    commitId: commit.id,
    serverHash: commit.serverHash
  };
}

export function performSpin(commitId: string, clientSeed: string, bet: number) {
  const serverSeed = revealCommit(commitId);
  if (!serverSeed) return null;

  const outcome = produceSpin(serverSeed, clientSeed);
  const payout = outcome.totalMultiplier * bet;

  return {
    grid: outcome.grid,
    wins: outcome.wins,
    multiplier: outcome.totalMultiplier,
    payout,
    scatterCount: outcome.scatterCount,
    bonusTriggered: outcome.bonusTriggered,
    serverSeed
  };
}

// Export for RTP simulator
export { runRTPSimulation } from "./rtpSimulator";
