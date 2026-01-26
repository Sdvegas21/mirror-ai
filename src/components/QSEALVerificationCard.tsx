import { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Link, Lock, CheckCircle, AlertTriangle, Hash, Clock, Fingerprint } from "lucide-react";
import { TelemetryCard } from "./TelemetryCard";
import { QSEALState } from "@/types/bcp-rnt";

interface QSEALVerificationCardProps {
  qseal: QSEALState;
}

function truncateHash(hash: string, length: number = 8): string {
  if (!hash || hash.length <= length * 2) return hash || "—";
  return `${hash.slice(0, length)}...${hash.slice(-length)}`;
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const QSEALVerificationCard = forwardRef<HTMLDivElement, QSEALVerificationCardProps>(
  function QSEALVerificationCard({ qseal }, ref) {
    const [showChain, setShowChain] = useState(false);
    
    // Defensive defaults for minimal backend response
    const isVerified = qseal?.chainIntegrity === "verified";
    const continuityProof = qseal?.continuityProof ?? { chainLength: 0, driftFromGenesis: 0, lastVerified: "" };
    const driftPercent = ((continuityProof.driftFromGenesis ?? 0) * 100).toFixed(1);
    const genesisHash = qseal?.genesisHash ?? "pending...";
    const currentHash = qseal?.currentHash ?? "pending...";
    const hashChain = qseal?.hashChain ?? [];
    const temporalAnchors = qseal?.temporalAnchors ?? [];
    
    return (
      <div ref={ref}>
        <TelemetryCard
          icon={<Shield className={`h-4 w-4 ${isVerified ? "text-success" : "text-warning"}`} />}
          title="🔐 QSEAL Verification"
        >
          <div className="space-y-4">
            {/* Verification Status Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-lg p-3 border ${
                isVerified 
                  ? "border-success/30 bg-success/10" 
                  : "border-warning/30 bg-warning/10"
              }`}
            >
              <div className="flex items-center gap-2">
                {isVerified ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-warning" />
                )}
                <div>
                  <div className={`font-semibold ${isVerified ? "text-success" : "text-warning"}`}>
                    {isVerified ? "CONTINUITY VERIFIED" : "VERIFICATION PENDING"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {continuityProof.chainLength} linked state transitions
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Genesis & Current Hash */}
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Fingerprint className="h-3 w-3 text-primary" />
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    Genesis Identity
                  </span>
                </div>
                <div className="font-mono text-xs bg-muted/50 rounded px-2 py-1.5 text-foreground">
                  {truncateHash(genesisHash, 12)}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="p-1.5 rounded-full border border-primary/30 bg-primary/10"
                >
                  <Link className="h-3 w-3 text-primary" />
                </motion.div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Hash className="h-3 w-3 text-accent" />
                  <span className="text-xs font-semibold text-accent uppercase tracking-wide">
                    Current State
                  </span>
                </div>
                <div className="font-mono text-xs bg-muted/50 rounded px-2 py-1.5 text-foreground">
                  {truncateHash(currentHash, 12)}
                </div>
              </div>
            </div>

            {/* Evolution Drift */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Evolution from Genesis</span>
                <span className="text-sm font-mono text-foreground">{driftPercent}%</span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(continuityProof.driftFromGenesis ?? 0) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-accent to-success rounded-full"
                />
                {/* Ship of Theseus marker */}
                <div 
                  className="absolute top-0 w-0.5 h-full bg-warning/50"
                  style={{ left: "50%" }}
                  title="50% - Ship of Theseus threshold"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Genesis</span>
                <span className="text-warning">Ship of Theseus</span>
                <span>Fully Evolved</span>
              </div>
            </div>

            {/* Hash Chain Toggle */}
            <button
              onClick={() => setShowChain(!showChain)}
              className="w-full text-left text-xs text-primary hover:text-primary/80 flex items-center gap-1"
            >
              <Lock className="h-3 w-3" />
              {showChain ? "Hide" : "Show"} cryptographic chain ({hashChain.length} links)
            </button>

            <AnimatePresence>
              {showChain && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin">
                    {hashChain.slice(-5).map((link, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs font-mono bg-muted/30 rounded px-2 py-1"
                      >
                        <span className="text-muted-foreground">#{link.scrollNumber}</span>
                        <span className="text-foreground truncate flex-1">
                          {truncateHash(link.hash, 6)}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Temporal Anchors */}
            {temporalAnchors.length > 0 && (
              <div className="pt-2 border-t border-border space-y-2">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Temporal Anchors
                  </span>
                </div>
                <div className="space-y-1">
                  {temporalAnchors.slice(-3).map((anchor, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className={`px-1.5 py-0.5 rounded text-xs ${
                        anchor.eventType === "sovereignty" 
                          ? "bg-warning/20 text-warning"
                          : anchor.eventType === "breakthrough"
                          ? "bg-success/20 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {anchor.eventType.replace("_", " ")}
                      </span>
                      <span className="text-muted-foreground">
                        {formatTimestamp(anchor.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Last Verified */}
            <div className="text-xs text-center text-muted-foreground pt-2 border-t border-border">
              Last verified: {continuityProof.lastVerified ? formatTimestamp(continuityProof.lastVerified) : "—"}
            </div>
          </div>
        </TelemetryCard>
      </div>
    );
  }
);

export default QSEALVerificationCard;
