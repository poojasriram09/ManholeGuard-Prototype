import { type RiskLevel } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  level: RiskLevel;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  pulse?: boolean;
}

const config = {
  safe: { label: "Safe", icon: "🟢", bg: "bg-risk-safe/15", text: "text-risk-safe", border: "border-risk-safe/30" },
  caution: { label: "Caution", icon: "🟡", bg: "bg-risk-caution/15", text: "text-risk-caution", border: "border-risk-caution/30" },
  danger: { label: "Danger", icon: "🔴", bg: "bg-risk-danger/15", text: "text-risk-danger", border: "border-risk-danger/30" },
};

const sizes = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-3 py-1",
  lg: "text-base px-4 py-1.5",
};

export default function RiskBadge({ level, size = "md", showLabel = true, pulse = false }: RiskBadgeProps) {
  const c = config[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold",
        c.bg, c.text, c.border,
        sizes[size],
        pulse && level === "danger" && "animate-pulse-risk"
      )}
    >
      <span>{c.icon}</span>
      {showLabel && <span>{c.label}</span>}
    </span>
  );
}
