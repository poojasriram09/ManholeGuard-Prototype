import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  entryTime: Date;
  maxDuration: number; // minutes
  compact?: boolean;
}

export default function CountdownTimer({ entryTime, maxDuration, compact = false }: CountdownTimerProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const elapsedMs = now.getTime() - entryTime.getTime();
  const elapsedMin = elapsedMs / 60000;
  const remainingMs = maxDuration * 60000 - elapsedMs;
  const isOverstay = remainingMs <= 0;
  const absRemaining = Math.abs(remainingMs);
  const minutes = Math.floor(absRemaining / 60000);
  const seconds = Math.floor((absRemaining % 60000) / 1000);
  const progress = Math.min(elapsedMin / maxDuration, 1);

  if (compact) {
    return (
      <span className={cn("font-mono font-semibold", isOverstay ? "text-risk-danger" : elapsedMin > maxDuration * 0.8 ? "text-risk-caution" : "text-risk-safe")}>
        {isOverstay ? "-" : ""}{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Time Remaining</span>
        <span className={cn("font-mono font-bold text-lg", isOverstay ? "text-risk-danger animate-pulse-risk" : "text-foreground")}>
          {isOverstay ? "OVERSTAY -" : ""}{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-1000", isOverstay ? "bg-risk-danger" : progress > 0.8 ? "bg-risk-caution" : "bg-risk-safe")}
          style={{ width: `${Math.min(progress * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}
