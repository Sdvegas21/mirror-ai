// API Configuration
// Uses VITE_BACKEND_URL environment variable if set (for ngrok/cloud deployment)
// Falls back to localhost:5001 for local development
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

export const API_CONFIG = {
  BASE_URL: BACKEND_URL,
  WEBSOCKET_URL: BACKEND_URL,
  ENDPOINTS: {
    HEALTH: '/health',
    CHAT: '/chat',
    TELEMETRY: '/telemetry',
    EXPORT: '/export',
    IMPORT: '/import',
    HISTORY: '/history',
    CONVERSATIONS: '/conversations',
  }
};
