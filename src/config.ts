// API Configuration
// ngrok tunnel to local backend for Lovable cloud preview
const BACKEND_URL = 'https://overmournful-yair-sternitic.ngrok-free.dev';

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
