import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompareInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function CompareInput({ onSendMessage, isLoading, disabled }: CompareInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && !disabled) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 p-4 border border-border rounded-lg bg-card/80 backdrop-blur-sm shadow-lg mx-auto w-full max-w-4xl"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="px-2 py-1 rounded bg-muted text-xs font-medium">Compare Mode</span>
        <span>→ Message sent to both AIs</span>
      </div>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message to send to both AIs..."
        disabled={isLoading || disabled}
        className="flex-1 bg-input border border-border rounded-md px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
      />
      <Button
        type="submit"
        size="default"
        disabled={!input.trim() || isLoading || disabled}
        className="bg-primary hover:bg-primary/90 px-6"
      >
        <Send className="h-4 w-4 mr-2" />
        Send
      </Button>
    </form>
  );
}
