import { useState, useEffect, useCallback } from 'react';
import { Conversation, ConversationsState } from '@/types/conversation';
import { conversationClient } from '@/api/conversationClient';
import { Message } from '@/types';

// localStorage keys for persisting active conversation IDs
const STORAGE_KEY_STANDARD = 'eos_active_standard_conversation';
const STORAGE_KEY_EOS = 'eos_active_eos_conversation';

function getPersistedConversationId(mode: 'standard' | 'eos', userId: string): string | null {
  try {
    const key = mode === 'standard' ? STORAGE_KEY_STANDARD : STORAGE_KEY_EOS;
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Only return if it's for the same user
      if (parsed.userId === userId) {
        return parsed.conversationId;
      }
    }
  } catch (e) {
    console.warn('Failed to read persisted conversation ID:', e);
  }
  return null;
}

function persistConversationId(mode: 'standard' | 'eos', userId: string, conversationId: string | null): void {
  try {
    const key = mode === 'standard' ? STORAGE_KEY_STANDARD : STORAGE_KEY_EOS;
    if (conversationId) {
      localStorage.setItem(key, JSON.stringify({ userId, conversationId }));
    } else {
      localStorage.removeItem(key);
    }
  } catch (e) {
    console.warn('Failed to persist conversation ID:', e);
  }
}

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
  // Initialize state with persisted conversation IDs
  const [state, setState] = useState<ConversationsState>(() => {
    const persistedStandard = getPersistedConversationId('standard', userId);
    const persistedEos = getPersistedConversationId('eos', userId);
    console.log('🔄 useConversations INIT:', { 
      userId, 
      persistedStandard, 
      persistedEos,
      localStorage_standard: localStorage.getItem('eos_active_standard_conversation'),
      localStorage_eos: localStorage.getItem('eos_active_eos_conversation')
    });
    return {
      standardConversations: [],
      eosConversations: [],
      activeStandardConversationId: persistedStandard,
      activeEosConversationId: persistedEos,
    };
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

        console.log('📋 Loaded conversations:', {
          standard: standardConvs.map(c => ({ id: c.id, title: c.title })),
          eos: eosConvs.map(c => ({ id: c.id, title: c.title }))
        });

        // Check if backend supports conversations
        const hasSupport = standardConvs.length > 0 || eosConvs.length > 0;
        setHasBackendSupport(hasSupport);

        setState(prev => {
          // Use persisted IDs if they exist in the loaded conversations, otherwise fall back to first
          const persistedStandardId = getPersistedConversationId('standard', userId);
          const persistedEosId = getPersistedConversationId('eos', userId);
          
          const standardExists = standardConvs.some(c => c.id === persistedStandardId);
          const eosExists = eosConvs.some(c => c.id === persistedEosId);
          
          const validStandardId = persistedStandardId && standardExists
            ? persistedStandardId
            : (standardConvs[0]?.id ?? null);
          
          const validEosId = persistedEosId && eosExists
            ? persistedEosId
            : (eosConvs[0]?.id ?? null);

          console.log('🎯 Conversation ID resolution:', {
            persistedStandardId,
            persistedEosId,
            standardExists,
            eosExists,
            validStandardId,
            validEosId
          });

          // Persist the resolved IDs
          persistConversationId('standard', userId, validStandardId);
          persistConversationId('eos', userId, validEosId);

          return {
            ...prev,
            standardConversations: standardConvs,
            eosConversations: eosConvs,
            activeStandardConversationId: validStandardId,
            activeEosConversationId: validEosId,
          };
        });
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
      // Persist the new conversation ID
      persistConversationId(mode, userId, backendConv.id);
      
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

    // Persist the new local conversation ID
    persistConversationId(mode, userId, localConv.id);

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
    // Persist the selection
    persistConversationId(mode, userId, conversationId);
    
    setState(prev => ({
      ...prev,
      [mode === 'standard' ? 'activeStandardConversationId' : 'activeEosConversationId']: conversationId,
    }));
  }, [userId]);

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
