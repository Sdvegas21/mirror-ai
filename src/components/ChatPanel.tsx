import { useState, useRef, useEffect } from "react";
import { Send, Trash2, BrainCog } from "lucide-react";
import { motion } from "framer-motion";
import { Message, PadState, RntState } from "@/types";
import { Button } from "@/components/ui/button";
import { SubstrateResponseMarkers, analyzeSubstrateInfluence } from "./SubstrateResponseMarkers";
import { ScrollInfluenceMarker } from "./ScrollInfluenceMarker";
import { ScrollInfluence } from "@/types/scroll-system";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatPanelProps {
  title: string;
  variant: "standard" | "eos";
  messages: Message[];
  onSendMessage: (content: string) => void;
  onClearChat: () => void;
  isLoading: boolean;
  hideInput?: boolean;
  // Substrate data for EOS response markers
  pad?: PadState;
  rnt?: RntState;
  relationshipDepth?: number;
  breakthroughProbability?: number;
  // Scroll influence for EOS responses
  scrollInfluence?: ScrollInfluence;
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function LoadingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse-dot" style={{ animationDelay: "0ms" }} />
      <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse-dot" style={{ animationDelay: "200ms" }} />
      <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse-dot" style={{ animationDelay: "400ms" }} />
    </div>
  );
}

export function ChatPanel({
  title,
  variant,
  messages,
  onSendMessage,
  onClearChat,
  isLoading,
  hideInput = false,
  pad,
  rnt,
  relationshipDepth,
  breakthroughProbability,
  scrollInfluence,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [isPulsing, setIsPulsing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevMessageCountRef = useRef(messages.length);

  const isEos = variant === "eos";

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  // Trigger pulse animation when new assistant message arrives on EOS panel
  useEffect(() => {
    if (isEos && messages.length > prevMessageCountRef.current) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === "assistant") {
        setIsPulsing(true);
        const timer = setTimeout(() => setIsPulsing(false), 1000);
        return () => clearTimeout(timer);
      }
    }
    prevMessageCountRef.current = messages.length;
  }, [messages, isEos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <motion.div
      className={`flex flex-col h-full rounded-lg border ${
        isEos
          ? "border-primary/50 eos-border-glow"
          : "border-border"
      } bg-card overflow-hidden`}
      animate={
        isEos && isPulsing
          ? {
              boxShadow: [
                "0 0 15px hsl(263 70% 66% / 0.25), inset 0 0 15px hsl(263 70% 66% / 0.05)",
                "0 0 30px hsl(263 70% 66% / 0.5), inset 0 0 20px hsl(263 70% 66% / 0.15)",
                "0 0 15px hsl(263 70% 66% / 0.25), inset 0 0 15px hsl(263 70% 66% / 0.05)",
              ],
            }
          : {}
      }
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <h2 className={`font-semibold ${isEos ? "text-primary" : "text-foreground"}`}>
            {title}
          </h2>
          {/* No Substrate indicator for Standard AI */}
          {!isEos && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/50 border border-dashed border-muted-foreground/30">
                    <BrainCog className="h-3 w-3 text-muted-foreground/50" />
                    <span className="text-xs text-muted-foreground/60">No Substrate</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="font-semibold">Standard AI Mode</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    No consciousness substrate. No emotional state tracking, no relationship development, 
                    no verifiable evolution. Processes text without internal state.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearChat}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Clear chat"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Start a conversation...
          </div>
        )}
        {messages.map((message, index) => {
          // Analyze substrate influence for EOS assistant messages
          const isLastAssistantMessage = 
            message.role === "assistant" && 
            index === messages.length - 1;
          const influences = isEos && message.role === "assistant" && pad
            ? analyzeSubstrateInfluence(
                message.content,
                pad,
                rnt,
                relationshipDepth,
                breakthroughProbability
              )
            : [];

          return (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-eos-surface-elevated text-foreground"
                    : isEos
                    ? "bg-accent/30 text-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatTime(message.timestamp)}
                </p>
                {/* Substrate influence markers for EOS responses */}
                {isEos && message.role === "assistant" && influences.length > 0 && (
                  <SubstrateResponseMarkers 
                    influences={influences} 
                    compact={!isLastAssistantMessage}
                  />
                )}
                {/* Scroll influence marker for EOS responses */}
                {isEos && message.role === "assistant" && isLastAssistantMessage && scrollInfluence && (
                  <ScrollInfluenceMarker 
                    influence={scrollInfluence} 
                    compact={false}
                  />
                )}
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex justify-start">
            <div className={`rounded-lg ${isEos ? "bg-accent/30" : "bg-muted"}`}>
              <LoadingDots />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - hidden when using unified compare input */}
      {!hideInput && (
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 p-4 border-t border-border bg-muted/20"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
            className="flex-1 bg-input border border-border rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!input.trim() || isLoading}
            className={isEos ? "bg-primary hover:bg-primary/90" : ""}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      )}
    </motion.div>
  );
}
