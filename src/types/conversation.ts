// Conversation types for multi-chat support

export interface Conversation {
  id: string;
  title: string;
  mode: 'standard' | 'eos';
  userId: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  preview?: string; // First message or summary
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ConversationsState {
  standardConversations: Conversation[];
  eosConversations: Conversation[];
  activeStandardConversationId: string | null;
  activeEosConversationId: string | null;
}

// API response types
export interface ConversationListResponse {
  success: boolean;
  conversations: Conversation[];
}

export interface ConversationCreateResponse {
  success: boolean;
  conversation: Conversation;
}

export interface ConversationMessagesResponse {
  success: boolean;
  messages: ConversationMessage[];
  conversation: Conversation;
}
