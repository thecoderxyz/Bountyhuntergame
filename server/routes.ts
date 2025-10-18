import type { Express } from "express";
import { createServer, type Server } from "http";
import { 
  getServerHash, 
  performSpin, 
  runRTPSimulation 
} from "./slotLogic";

export async function registerRoutes(app: Express): Promise<Server> {
  // Slot machine API routes
  app.get("/api/get-server-hash", (req, res) => {
    try {
      const result = getServerHash();
      res.json(result);
    } catch (error) {
      console.error('Error getting server hash:', error);
      res.status(500).json({ error: 'Failed to generate server hash' });
    }
  });

  app.post("/api/spin", (req, res) => {
    try {
      const { commitId, clientSeed = "default-client-seed", bet = 1 } = req.body;
      
      if (!commitId) {
        return res.status(400).json({ error: "missing commitId" });
      }

      if (bet <= 0 || bet > 50) {
        return res.status(400).json({ error: "invalid bet amount" });
      }

      const result = performSpin(commitId, clientSeed, bet);
      
      if (!result) {
        return res.status(400).json({ error: "invalid or expired commitId" });
      }

      res.json(result);
    } catch (error) {
      console.error('Error performing spin:', error);
      res.status(500).json({ error: 'Failed to perform spin' });
    }
  });

  // RTP Simulation endpoint (for testing/development)
  app.post("/api/simulate-rtp", async (req, res) => {
    try {
      const { rounds = 1000000 } = req.body;
      
      console.log(`Starting RTP simulation with ${rounds} rounds...`);
      const result = await runRTPSimulation(rounds);
      
      res.json(result);
    } catch (error) {
      console.error('Error running RTP simulation:', error);
      res.status(500).json({ error: 'Failed to run RTP simulation' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
