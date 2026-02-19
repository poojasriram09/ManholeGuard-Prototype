import { useState } from "react";
import { ENTRY_LOGS } from "@/data/mockData";
import RiskBadge from "@/components/RiskBadge";
import { ClipboardList, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Logs() {
  const [search, setSearch] = useState("");

  const filteredLogs = ENTRY_LOGS.filter(
    (log) =>
      log.workerName.toLowerCase().includes(search.toLowerCase()) ||
      log.manholeId.toLowerCase().includes(search.toLowerCase()) ||
      log.ward.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">Entry Logs</h1>
          <p className="mt-1 text-sm text-muted-foreground">Complete record of all manhole entries and exits</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search worker, manhole, ward..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border bg-card py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground sm:w-72"
          />
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border bg-card shadow-stat">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Worker</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Manhole</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Ward</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Entry Time</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Duration</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Risk</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="transition-colors hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-card-foreground">{log.workerName}</td>
                <td className="px-4 py-3 text-muted-foreground">{log.manholeId}</td>
                <td className="px-4 py-3 text-muted-foreground">{log.ward}</td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                  {new Date(log.entryTime).toLocaleString()}
                </td>
                <td className="px-4 py-3 font-mono text-card-foreground">{log.duration} min</td>
                <td className="px-4 py-3"><RiskBadge level={log.riskLevel} size="sm" /></td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-bold",
                    log.overstay ? "bg-risk-danger/10 text-risk-danger" : "bg-risk-safe/10 text-risk-safe"
                  )}>
                    {log.overstay ? "Overstay" : "Normal"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLogs.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <ClipboardList className="h-8 w-8" />
            <p>No logs match your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
