const API_BASE = '/api';

export interface ServerHashResponse {
  commitId: string;
  serverHash: string;
}

export interface SpinRequest {
  commitId: string;
  clientSeed: string;
  bet: number;
}

export interface SpinResponse {
  grid: string[][];
  wins: Array<{
    payline: number;
    symbol: string;
    length: number;
    multiplier: number;
  }>;
  multiplier: number;
  payout: number;
  scatterCount: number;
  bonusTriggered: boolean;
  serverSeed: string;
}

export const slotApi = {
  async getServerHash(): Promise<ServerHashResponse> {
    const response = await fetch(`${API_BASE}/get-server-hash`);
    if (!response.ok) {
      throw new Error('Failed to get server hash');
    }
    return response.json();
  },

  async spin(request: SpinRequest): Promise<SpinResponse> {
    const response = await fetch(`${API_BASE}/spin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Spin failed');
    }
    
    return response.json();
  }
};
