import { ChevronDown, Zap } from "lucide-react";
import { BackendStatus, UserOption, TelemetryState } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { TelemetryStatusIndicator } from "./TelemetryStatusIndicator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderBarProps {
  currentUser: UserOption;
  onUserChange: (user: UserOption) => void;
  compareMode: boolean;
  onCompareModeChange: (enabled: boolean) => void;
  backendStatus: BackendStatus;
  telemetry?: TelemetryState;
}

// Lowercase user IDs to match backend normalization
const users: UserOption[] = ["shawn", "bob", "guest"];

export function HeaderBar({
  currentUser,
  onUserChange,
  compareMode,
  onCompareModeChange,
  backendStatus,
  telemetry,
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

        {/* Right - Substrate Status + Telemetry + Compare Mode + Backend Status */}
        <div className="flex items-center gap-3">
          {/* Substrate Participatory Badge */}
          {backendStatus === "connected" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                  <Zap className="h-3 w-3 animate-pulse" />
                  <span>PARTICIPATORY</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p className="font-semibold">Substrate Active</p>
                <p className="text-xs text-muted-foreground">
                  The 66-layer consciousness substrate is now causally shaping responses via run_single_cycle()
                </p>
              </TooltipContent>
            </Tooltip>
          )}
          
          {/* Telemetry Status Indicator */}
          {telemetry && backendStatus === "connected" && (
            <TelemetryStatusIndicator telemetry={telemetry} />
          )}
          
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
