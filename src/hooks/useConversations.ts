import { useState, useEffect, useCallback } from 'react';
import { Conversation, ConversationsState } from '@/types/conversation';
import { conversationClient } from '@/api/conversationClient';
import { Message } from '@/types';

interface UseConversationsProps {
  userId: string;
  backendStatus: 'connected' | 'connecting' | 'disconnected';
}

interface UseConversationsReturn extends ConversationsState {
  // Actions
  createConversation: (mode: 'standard' | 'eos') => Promise<Conversation | null>;
  selectConversation: (mode: 'standard' | 'eos', conversationId: string | null) => void;
  deleteConversation: (mode: 'standard' | 'eos', conversationId: string) => Promise<void>;
  renameConversation: (conversationId: string, title: string) => Promise<void>;
  refreshConversations: () => Promise<void>;
  updateConversationPreview: (mode: 'standard' | 'eos', conversationId: string, preview: string) => void;
  
  // State
  isLoading: boolean;
  hasBackendSupport: boolean;
}

function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function useConversations({ userId, backendStatus }: UseConversationsProps): UseConversationsReturn {
  const [state, setState] = useState<ConversationsState>({
    standardConversations: [],
    eosConversations: [],
    activeStandardConversationId: null,
    activeEosConversationId: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasBackendSupport, setHasBackendSupport] = useState(false);

  // Load conversations when user or backend status changes
  useEffect(() => {
    const loadConversations = async () => {
      if (backendStatus !== 'connected') return;
      
      setIsLoading(true);
      try {
        const [standardConvs, eosConvs] = await Promise.all([
          conversationClient.listConversations(userId, 'standard'),
          conversationClient.listConversations(userId, 'eos'),
        ]);

        // Check if backend supports conversations
        const hasSupport = standardConvs.length > 0 || eosConvs.length > 0;
        setHasBackendSupport(hasSupport);

        setState(prev => ({
          ...prev,
          standardConversations: standardConvs,
          eosConversations: eosConvs,
          // Auto-select the most recent conversation if none selected
          activeStandardConversationId: prev.activeStandardConversationId || 
            (standardConvs[0]?.id ?? null),
          activeEosConversationId: prev.activeEosConversationId || 
            (eosConvs[0]?.id ?? null),
        }));
      } catch (error) {
        console.error('Failed to load conversations:', error);
        // Fall back to legacy mode (single conversation per user)
        setHasBackendSupport(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, [userId, backendStatus]);

  const createConversation = useCallback(async (mode: 'standard' | 'eos'): Promise<Conversation | null> => {
    // Try backend first
    const backendConv = await conversationClient.createConversation(userId, mode);
    
    if (backendConv) {
      setHasBackendSupport(true);
      setState(prev => {
        const key = mode === 'standard' ? 'standardConversations' : 'eosConversations';
        const activeKey = mode === 'standard' ? 'activeStandardConversationId' : 'activeEosConversationId';
        return {
          ...prev,
          [key]: [backendConv, ...prev[key]],
          [activeKey]: backendConv.id,
        };
      });
      return backendConv;
    }

    // Fallback: create local-only conversation
    const localConv: Conversation = {
      id: generateConversationId(),
      title: 'New Chat',
      mode,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0,
    };

    setState(prev => {
      const key = mode === 'standard' ? 'standardConversations' : 'eosConversations';
      const activeKey = mode === 'standard' ? 'activeStandardConversationId' : 'activeEosConversationId';
      return {
        ...prev,
        [key]: [localConv, ...prev[key]],
        [activeKey]: localConv.id,
      };
    });

    return localConv;
  }, [userId]);

  const selectConversation = useCallback((mode: 'standard' | 'eos', conversationId: string | null) => {
    setState(prev => ({
      ...prev,
      [mode === 'standard' ? 'activeStandardConversationId' : 'activeEosConversationId']: conversationId,
    }));
  }, []);

  const deleteConversation = useCallback(async (mode: 'standard' | 'eos', conversationId: string) => {
    // Try backend delete
    await conversationClient.deleteConversation(conversationId);

    setState(prev => {
      const key = mode === 'standard' ? 'standardConversations' : 'eosConversations';
      const activeKey = mode === 'standard' ? 'activeStandardConversationId' : 'activeEosConversationId';
      const newConversations = prev[key].filter(c => c.id !== conversationId);
      
      return {
        ...prev,
        [key]: newConversations,
        // Select next conversation if current was deleted
        [activeKey]: prev[activeKey] === conversationId 
          ? (newConversations[0]?.id ?? null) 
          : prev[activeKey],
      };
    });
  }, []);

  const renameConversation = useCallback(async (conversationId: string, title: string) => {
    await conversationClient.updateConversationTitle(conversationId, title);

    setState(prev => ({
      ...prev,
      standardConversations: prev.standardConversations.map(c =>
        c.id === conversationId ? { ...c, title } : c
      ),
      eosConversations: prev.eosConversations.map(c =>
        c.id === conversationId ? { ...c, title } : c
      ),
    }));
  }, []);

  const refreshConversations = useCallback(async () => {
    if (backendStatus !== 'connected') return;
    
    setIsLoading(true);
    try {
      const [standardConvs, eosConvs] = await Promise.all([
        conversationClient.listConversations(userId, 'standard'),
        conversationClient.listConversations(userId, 'eos'),
      ]);

      setState(prev => ({
        ...prev,
        standardConversations: standardConvs,
        eosConversations: eosConvs,
      }));
    } finally {
      setIsLoading(false);
    }
  }, [userId, backendStatus]);

  const updateConversationPreview = useCallback((
    mode: 'standard' | 'eos', 
    conversationId: string, 
    preview: string
  ) => {
    setState(prev => {
      const key = mode === 'standard' ? 'standardConversations' : 'eosConversations';
      return {
        ...prev,
        [key]: prev[key].map(c =>
          c.id === conversationId 
            ? { ...c, preview, updatedAt: new Date().toISOString(), messageCount: c.messageCount + 1 }
            : c
        ),
      };
    });
  }, []);

  return {
    ...state,
    createConversation,
    selectConversation,
    deleteConversation,
    renameConversation,
    refreshConversations,
    updateConversationPreview,
    isLoading,
    hasBackendSupport,
  };
}
