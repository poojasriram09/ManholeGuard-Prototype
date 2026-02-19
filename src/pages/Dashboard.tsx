import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Clock,
  Users,
  Shield,
  CheckCircle,
  Bell,
} from "lucide-react";
import { ACTIVE_ENTRIES, ALERTS, STATS, type Alert } from "@/data/mockData";
import StatCard from "@/components/StatCard";
import RiskBadge from "@/components/RiskBadge";
import CountdownTimer from "@/components/CountdownTimer";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [alerts, setAlerts] = useState<Alert[]>(ALERTS);
  const [wardFilter, setWardFilter] = useState<string>("all");

  const wards = [
    "all",
    "Ward A",
    "Ward B",
    "Ward C",
    "Ward D",
    "Ward E",
    "Ward F",
  ];

  const filteredEntries =
    wardFilter === "all"
      ? ACTIVE_ENTRIES
      : ACTIVE_ENTRIES.filter((e) => e.ward === wardFilter);
  const filteredAlerts =
    wardFilter === "all" ? alerts : alerts.filter((a) => a.ward === wardFilter);

  const resolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true } : a)),
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
            Supervisor Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time monitoring of all manhole operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Ward:</span>
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="rounded-lg border bg-card px-3 py-2 text-sm font-medium text-foreground"
          >
            {wards.map((w) => (
              <option key={w} value={w}>
                {w === "all" ? "All Wards" : w}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Active Workers"
          value={STATS.activeWorkers}
          icon={Users}
          variant="accent"
        />
        <StatCard
          label="Entries Today"
          value={STATS.totalEntriesToday}
          icon={Activity}
        />
        <StatCard
          label="High-Risk Zones"
          value={STATS.highRiskZones}
          icon={AlertTriangle}
          variant="danger"
        />
        <StatCard
          label="Resolved Alerts"
          value={STATS.resolvedAlerts}
          icon={CheckCircle}
          variant="safe"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Active Operations */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border bg-card shadow-stat">
            <div className="flex items-center gap-2 border-b px-5 py-4">
              <Clock className="h-5 w-5 text-accent" />
              <h2 className="text-lg font-bold text-card-foreground">
                Active Operations
              </h2>
              <span className="ml-auto rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">
                {filteredEntries.length} active
              </span>
            </div>
            <div className="divide-y">
              {filteredEntries.map((entry) => (
                <motion.div
                  key={entry.manholeId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-card-foreground truncate">
                        {entry.workerName}
                      </span>
                      <RiskBadge level={entry.riskLevel} size="sm" />
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground truncate">
                      {entry.manholeName} • {entry.ward}
                    </p>
                  </div>
                  <div className="w-full sm:w-48">
                    <CountdownTimer
                      entryTime={entry.entryTime}
                      maxDuration={entry.maxDuration}
                    />
                  </div>
                </motion.div>
              ))}
              {filteredEntries.length === 0 && (
                <p className="px-5 py-8 text-center text-muted-foreground">
                  No active operations in this ward
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Alerts Panel */}
        <div>
          <div className="rounded-xl border bg-card shadow-stat">
            <div className="flex items-center gap-2 border-b px-5 py-4">
              <Bell className="h-5 w-5 text-risk-danger" />
              <h2 className="text-lg font-bold text-card-foreground">Alerts</h2>
              <span className="ml-auto rounded-full bg-risk-danger/10 px-2.5 py-0.5 text-xs font-bold text-risk-danger">
                {filteredAlerts.filter((a) => !a.resolved).length} active
              </span>
            </div>
            <div className="divide-y max-h-[500px] overflow-y-auto">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn("px-5 py-4", alert.resolved && "opacity-50")}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <AlertTriangle
                          className={cn(
                            "h-4 w-4 shrink-0",
                            alert.type === "overstay"
                              ? "text-risk-danger"
                              : "text-risk-caution",
                          )}
                        />
                        <span className="text-xs font-bold uppercase text-muted-foreground">
                          {alert.type}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-card-foreground">
                        {alert.message}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {alert.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {!alert.resolved && (
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="shrink-0 rounded-lg bg-risk-safe/10 px-3 py-1.5 text-xs font-bold text-risk-safe transition-colors hover:bg-risk-safe/20"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
