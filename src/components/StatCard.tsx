import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  variant?: "default" | "accent" | "danger" | "safe";
  suffix?: string;
}

const variants = {
  default: "border-border",
  accent: "border-accent/30 bg-accent/5",
  danger: "border-risk-danger/30 bg-risk-danger/5",
  safe: "border-risk-safe/30 bg-risk-safe/5",
};

const iconVariants = {
  default: "bg-primary/10 text-primary",
  accent: "bg-accent/15 text-accent",
  danger: "bg-risk-danger/15 text-risk-danger",
  safe: "bg-risk-safe/15 text-risk-safe",
};

export default function StatCard({ label, value, icon: Icon, variant = "default", suffix }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "rounded-xl border bg-card p-5 shadow-stat transition-shadow hover:shadow-card-hover",
        variants[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight text-card-foreground">
            {value}{suffix}
          </p>
        </div>
        <div className={cn("rounded-lg p-2.5", iconVariants[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
