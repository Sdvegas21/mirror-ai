import { useState } from 'react';
import { Plus, MessageSquare, Trash2, Edit2, Check, X, ChevronDown, ChevronRight, PanelLeft, PanelLeftClose } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Conversation } from '@/types/conversation';

interface ConversationSidebarProps {
  // Standard AI conversations
  standardConversations: Conversation[];
  activeStandardConversationId: string | null;
  onSelectStandardConversation: (id: string | null) => void;
  onCreateStandardConversation: () => void;
  
  // EOS AI conversations
  eosConversations: Conversation[];
  activeEosConversationId: string | null;
  onSelectEosConversation: (id: string | null) => void;
  onCreateEosConversation: () => void;
  
  // Shared actions
  onDeleteConversation: (mode: 'standard' | 'eos', id: string) => void;
  onRenameConversation: (id: string, title: string) => void;
  
  // State
  isLoading: boolean;
  compareMode: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
  variant: 'standard' | 'eos';
}

function ConversationItem({ 
  conversation, 
  isActive, 
  onSelect, 
  onDelete,
  onRename,
  variant 
}: ConversationItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(conversation.title);

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onRename(editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(conversation.title);
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        'group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors',
        isActive 
          ? variant === 'eos' 
            ? 'bg-primary/20 text-primary-foreground border border-primary/30' 
            : 'bg-muted text-foreground'
          : 'hover:bg-muted/50 text-muted-foreground'
      )}
      onClick={!isEditing ? onSelect : undefined}
    >
      <MessageSquare className={cn(
        'h-4 w-4 shrink-0',
        variant === 'eos' && isActive ? 'text-primary' : ''
      )} />
      
      {isEditing ? (
        <div className="flex-1 flex items-center gap-1">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="flex-1 bg-background border border-border rounded px-2 py-0.5 text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveEdit();
              if (e.key === 'Escape') handleCancelEdit();
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleSaveEdit}>
            <Check className="h-3 w-3" />
          </Button>
          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleCancelEdit}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{conversation.title}</p>
                  {conversation.preview && (
                    <p className="text-xs text-muted-foreground truncate">{conversation.preview}</p>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[300px] bg-popover text-popover-foreground border border-border z-50">
                <p className="font-medium">{conversation.title}</p>
                {conversation.preview && (
                  <p className="text-xs text-muted-foreground mt-1">{conversation.preview}</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="hidden group-hover:flex items-center gap-1">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-6 w-6 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export function ConversationSidebar({
  standardConversations,
  activeStandardConversationId,
  onSelectStandardConversation,
  onCreateStandardConversation,
  eosConversations,
  activeEosConversationId,
  onSelectEosConversation,
  onCreateEosConversation,
  onDeleteConversation,
  onRenameConversation,
  isLoading,
  compareMode,
  isCollapsed = false,
  onToggleCollapse,
}: ConversationSidebarProps) {
  const [standardOpen, setStandardOpen] = useState(true);
  const [eosOpen, setEosOpen] = useState(true);

  if (isCollapsed) {
    return (
      <div className="w-14 min-w-[3.5rem] shrink-0 h-full bg-card border-r border-border flex flex-col items-center py-4 gap-2">
        {onToggleCollapse && (
          <Button
            size="icon"
            variant="ghost"
            onClick={onToggleCollapse}
            title="Expand sidebar"
            className="mb-2"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        )}
        <Button
          size="icon"
          variant="ghost"
          onClick={onCreateEosConversation}
          className="text-primary"
          title="New EOS Chat"
        >
          <Plus className="h-5 w-5" />
        </Button>
        {compareMode && (
          <Button
            size="icon"
            variant="ghost"
            onClick={onCreateStandardConversation}
            title="New Standard Chat"
          >
            <Plus className="h-5 w-5" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="w-64 min-w-[16rem] shrink-0 h-full bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Conversations
        </h2>
        {onToggleCollapse && (
          <Button
            size="icon"
            variant="ghost"
            onClick={onToggleCollapse}
            title="Collapse sidebar"
            className="h-7 w-7"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-4">
          {/* EOS Conversations */}
          <Collapsible open={eosOpen} onOpenChange={setEosOpen}>
            <div className="flex items-center justify-between px-2 mb-2">
              <CollapsibleTrigger className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80">
                {eosOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                EOS-Powered AI
              </CollapsibleTrigger>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={onCreateEosConversation}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <CollapsibleContent className="space-y-1">
              {eosConversations.length === 0 ? (
                <p className="text-xs text-muted-foreground px-3 py-2">No conversations yet</p>
              ) : (
                eosConversations.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conversation={conv}
                    isActive={conv.id === activeEosConversationId}
                    onSelect={() => onSelectEosConversation(conv.id)}
                    onDelete={() => onDeleteConversation('eos', conv.id)}
                    onRename={(title) => onRenameConversation(conv.id, title)}
                    variant="eos"
                  />
                ))
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Standard Conversations - only in compare mode */}
          {compareMode && (
            <Collapsible open={standardOpen} onOpenChange={setStandardOpen}>
              <div className="flex items-center justify-between px-2 mb-2">
                <CollapsibleTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
                  {standardOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  Standard AI
                </CollapsibleTrigger>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={onCreateStandardConversation}
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <CollapsibleContent className="space-y-1">
                {standardConversations.length === 0 ? (
                  <p className="text-xs text-muted-foreground px-3 py-2">No conversations yet</p>
                ) : (
                  standardConversations.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      isActive={conv.id === activeStandardConversationId}
                      onSelect={() => onSelectStandardConversation(conv.id)}
                      onDelete={() => onDeleteConversation('standard', conv.id)}
                      onRename={(title) => onRenameConversation(conv.id, title)}
                      variant="standard"
                    />
                  ))
                )}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </ScrollArea>

      {/* Footer hint */}
      <div className="p-3 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          {isLoading ? 'Loading...' : 'Click + to start a new chat'}
        </p>
      </div>
    </div>
  );
}
