import { API_CONFIG } from '../config';
import { 
  Conversation, 
  ConversationListResponse, 
  ConversationCreateResponse,
  ConversationMessagesResponse 
} from '../types/conversation';

/**
 * Conversation API Client
 * 
 * NOTE: These endpoints need to be implemented on your Flask backend.
 * See docs/CONVERSATION_API_SPEC.md for implementation details.
 */
class ConversationClient {
  private baseURL: string;
  
  // Headers to bypass ngrok's browser warning interstitial
  private defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  };

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  /**
   * List all conversations for a user
   * GET /conversations?user_id={userId}&mode={mode}
   */
  async listConversations(userId: string, mode: 'standard' | 'eos'): Promise<Conversation[]> {
    try {
      const response = await fetch(
        `${this.baseURL}/conversations?user_id=${userId}&mode=${mode}`,
        { headers: this.defaultHeaders }
      );
      
      if (!response.ok) {
        console.warn('Conversations endpoint not available, falling back to empty list');
        return [];
      }
      
      const data: ConversationListResponse = await response.json();
      return data.conversations || [];
    } catch (error) {
      console.warn('Failed to fetch conversations:', error);
      return [];
    }
  }

  /**
   * Create a new conversation
   * POST /conversations
   */
  async createConversation(userId: string, mode: 'standard' | 'eos', title?: string): Promise<Conversation | null> {
    try {
      const response = await fetch(`${this.baseURL}/conversations`, {
        method: 'POST',
        headers: this.defaultHeaders,
        body: JSON.stringify({
          user_id: userId,
          mode,
          title: title || 'New Chat',
        }),
      });
      
      if (!response.ok) {
        console.warn('Create conversation endpoint not available');
        return null;
      }
      
      const data: ConversationCreateResponse = await response.json();
      return data.conversation;
    } catch (error) {
      console.warn('Failed to create conversation:', error);
      return null;
    }
  }

  /**
   * Get messages for a specific conversation
   * GET /conversations/{conversationId}/messages
   */
  async getConversationMessages(conversationId: string): Promise<ConversationMessagesResponse | null> {
    try {
      const response = await fetch(
        `${this.baseURL}/conversations/${conversationId}/messages`,
        { headers: this.defaultHeaders }
      );
      
      if (!response.ok) {
        console.warn('Get conversation messages endpoint not available');
        return null;
      }
      
      return response.json();
    } catch (error) {
      console.warn('Failed to get conversation messages:', error);
      return null;
    }
  }

  /**
   * Delete a conversation
   * DELETE /conversations/{conversationId}
   */
  async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: this.defaultHeaders,
      });
      
      return response.ok;
    } catch (error) {
      console.warn('Failed to delete conversation:', error);
      return false;
    }
  }

  /**
   * Update conversation title
   * PATCH /conversations/{conversationId}
   */
  async updateConversationTitle(conversationId: string, title: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: this.defaultHeaders,
        body: JSON.stringify({ title }),
      });
      
      return response.ok;
    } catch (error) {
      console.warn('Failed to update conversation title:', error);
      return false;
    }
  }
}

export const conversationClient = new ConversationClient();
