import { useParams, Link } from "react-router-dom";
import { MANHOLES } from "@/data/mockData";
import RiskBadge from "@/components/RiskBadge";
import { QRCodeSVG } from "qrcode.react";
import { MapPin, ArrowLeft, Wrench, AlertTriangle, Activity } from "lucide-react";

export default function ManholeProfile() {
  const { id } = useParams();
  const manhole = MANHOLES.find((m) => m.id === id);

  if (!manhole) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Manhole Not Found</h2>
          <Link to="/heatmap" className="mt-4 inline-flex items-center gap-2 text-accent hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Heatmap
          </Link>
        </div>
      </div>
    );
  }

  const riskScore = manhole.incidentCount * 2 + manhole.rainfallIndex * 1.5 + manhole.blockageFrequency * 1.2 + manhole.overstayCount * 1.8;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link to="/heatmap" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Heatmap
      </Link>

      <div className="grid gap-6 md:grid-cols-3">
        {/* QR + ID */}
        <div className="rounded-xl border bg-card p-6 shadow-stat text-center">
          <div className="mx-auto mb-4 inline-flex rounded-xl bg-muted p-4">
            <QRCodeSVG value={`safeentry://manhole/${manhole.id}`} size={160} level="H" />
          </div>
          <h2 className="text-xl font-extrabold text-card-foreground">{manhole.id}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{manhole.ward}</p>
          <div className="mt-3">
            <RiskBadge level={manhole.riskLevel} size="lg" pulse />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            {manhole.riskLevel === "danger" ? "🚫 Entry Prohibited" : manhole.riskLevel === "caution" ? "⚠️ Entry with Caution" : "✅ Entry Allowed"}
          </p>
        </div>

        {/* Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Risk meter */}
          <div className="rounded-xl border bg-card p-5 shadow-stat">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-accent" />
              <h3 className="font-bold text-card-foreground">AI Risk Assessment</h3>
            </div>
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min((riskScore / 25) * 100, 100)}%`,
                  background: manhole.riskLevel === "danger" ? "hsl(0 84% 60%)" : manhole.riskLevel === "caution" ? "hsl(38 92% 50%)" : "hsl(142 71% 45%)",
                }}
              />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div className="rounded-lg bg-muted/50 p-2.5">
                <span className="text-muted-foreground">Incidents</span>
                <p className="font-bold text-card-foreground">{manhole.incidentCount}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-2.5">
                <span className="text-muted-foreground">Rainfall</span>
                <p className="font-bold text-card-foreground">{manhole.rainfallIndex}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-2.5">
                <span className="text-muted-foreground">Blockages</span>
                <p className="font-bold text-card-foreground">{manhole.blockageFrequency}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-2.5">
                <span className="text-muted-foreground">Overstays</span>
                <p className="font-bold text-card-foreground">{manhole.overstayCount}</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="rounded-xl border bg-card p-5 shadow-stat">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-accent" />
              <h3 className="font-bold text-card-foreground">Location</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Latitude</span><p className="font-mono font-semibold text-card-foreground">{manhole.lat.toFixed(6)}</p></div>
              <div><span className="text-muted-foreground">Longitude</span><p className="font-mono font-semibold text-card-foreground">{manhole.lng.toFixed(6)}</p></div>
              <div><span className="text-muted-foreground">Depth</span><p className="font-semibold text-card-foreground">{manhole.depth}m</p></div>
              <div><span className="text-muted-foreground">Last Cleaned</span><p className="font-semibold text-card-foreground">{manhole.lastCleaned}</p></div>
            </div>
          </div>

          {/* Cleaning History */}
          <div className="rounded-xl border bg-card p-5 shadow-stat">
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="h-5 w-5 text-accent" />
              <h3 className="font-bold text-card-foreground">Cleaning History</h3>
            </div>
            <div className="space-y-2">
              {manhole.cleaningHistory.map((c, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2 text-sm">
                  <span className="font-mono text-muted-foreground">{c.date}</span>
                  <span className="font-medium text-card-foreground">{c.crew}</span>
                  <span className="text-muted-foreground">{c.notes}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Incidents */}
          {manhole.incidents.length > 0 && (
            <div className="rounded-xl border bg-card p-5 shadow-stat">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-risk-danger" />
                <h3 className="font-bold text-card-foreground">Incident History</h3>
              </div>
              <div className="space-y-2">
                {manhole.incidents.map((inc, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/30 px-3 py-2 text-sm">
                    <span className="font-mono text-muted-foreground">{inc.date}</span>
                    <span className="font-semibold text-card-foreground">{inc.type}</span>
                    <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold ${inc.resolved ? "bg-risk-safe/10 text-risk-safe" : "bg-risk-danger/10 text-risk-danger"}`}>
                      {inc.resolved ? "Resolved" : "Open"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
