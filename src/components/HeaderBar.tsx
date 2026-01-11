import { ChevronDown } from "lucide-react";
import { BackendStatus, UserOption } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

interface HeaderBarProps {
  currentUser: UserOption;
  onUserChange: (user: UserOption) => void;
  compareMode: boolean;
  onCompareModeChange: (enabled: boolean) => void;
  backendStatus: BackendStatus;
}

const users: UserOption[] = ["Shawn", "Bob", "Guest"];

export function HeaderBar({
  currentUser,
  onUserChange,
  compareMode,
  onCompareModeChange,
  backendStatus,
}: HeaderBarProps) {
  const statusConfig = {
    disconnected: {
      label: "Disconnected",
      className: "bg-destructive/20 text-destructive border-destructive/30",
    },
    connecting: {
      label: "Connecting...",
      className: "bg-warning/20 text-warning border-warning/30",
    },
    connected: {
      label: "Connected",
      className: "bg-success/20 text-success border-success/30",
    },
  };

  const status = statusConfig[backendStatus];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex h-14 items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-gradient-eos">
            MIRRA EOS
          </h1>
        </div>

        {/* Center - User Selector */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-1.5 text-sm font-medium hover:bg-muted/80 transition-colors">
              <span className="text-muted-foreground">User:</span>
              <span>{currentUser}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              {users.map((user) => (
                <DropdownMenuItem
                  key={user}
                  onClick={() => onUserChange(user)}
                  className={currentUser === user ? "bg-accent" : ""}
                >
                  {user}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right - Compare Mode + Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label
              htmlFor="compare-mode"
              className="text-sm font-medium text-muted-foreground"
            >
              Compare Mode
            </label>
            <Switch
              id="compare-mode"
              checked={compareMode}
              onCheckedChange={onCompareModeChange}
            />
          </div>

          <div
            className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${status.className}`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                backendStatus === "connected"
                  ? "bg-success"
                  : backendStatus === "connecting"
                  ? "bg-warning animate-pulse"
                  : "bg-destructive"
              }`}
            />
            <span>Backend: {status.label}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
