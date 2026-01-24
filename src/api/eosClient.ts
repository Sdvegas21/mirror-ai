import { API_CONFIG } from '../config';
import { TelemetryState } from '../types';

export interface ChatRequest {
  message: string;
  user_id: string;
  mode: 'standard' | 'eos';
  conversation_id?: string; // Optional: for multi-conversation support
}

export interface ChatResponse {
  response: string;
  telemetry?: TelemetryState;
  timestamp: string;
}

class EOSClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  async healthCheck(): Promise<{ status: string; timestamp: string; eos_backend: string }> {
    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.HEALTH}`);
    if (!response.ok) throw new Error('Backend health check failed');
    return response.json();
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    let response: Response;
    
    try {
      response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.CHAT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
    } catch (networkError) {
      // Network error (backend unreachable, CORS, etc.)
      throw new Error('Backend is unreachable. Please check if the server is running.');
    }

    if (!response.ok) {
      let errorMessage = 'Chat request failed';
      try {
        const error = await response.json();
        errorMessage = error.error || errorMessage;
      } catch {
        // Response body is not JSON
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getTelemetry(userId: string): Promise<TelemetryState> {
    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.TELEMETRY}?user_id=${userId}`);
    if (!response.ok) throw new Error('Telemetry request failed');
    return response.json();
  }

  async getHistory(userId: string, limit: number = 50): Promise<{ success: boolean; user_id: string; eos_messages: Array<{ role: string; content: string; timestamp: string }>; standard_messages: Array<{ role: string; content: string; timestamp: string }>; total_count: number }> {
    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.HISTORY}?user_id=${userId}&limit=${limit}`);
    if (!response.ok) throw new Error('History request failed');
    return response.json();
  }
}

export const eosClient = new EOSClient();
