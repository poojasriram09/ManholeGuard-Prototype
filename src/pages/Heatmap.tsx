import { useEffect, useRef, useState } from "react";
import { MANHOLES, SOLAPUR_CENTER, type Manhole } from "@/data/mockData";
import RiskBadge from "@/components/RiskBadge";
import { MapPin, X } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const riskColors = { safe: "#22c55e", caution: "#f59e0b", danger: "#ef4444" };

export default function Heatmap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [selected, setSelected] = useState<Manhole | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const counts = {
    safe: MANHOLES.filter(m => m.riskLevel === "safe").length,
    caution: MANHOLES.filter(m => m.riskLevel === "caution").length,
    danger: MANHOLES.filter(m => m.riskLevel === "danger").length,
  };

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current).setView(SOLAPUR_CENTER, 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker) map.removeLayer(layer);
    });

    const filtered = filter === "all" ? MANHOLES : MANHOLES.filter(m => m.riskLevel === filter);

    filtered.forEach((m) => {
      const marker = L.circleMarker([m.lat, m.lng], {
        radius: m.riskLevel === "danger" ? 10 : m.riskLevel === "caution" ? 8 : 6,
        fillColor: riskColors[m.riskLevel],
        fillOpacity: 0.8,
        color: riskColors[m.riskLevel],
        weight: 2,
        opacity: 1,
      }).addTo(map);

      marker.on("click", () => setSelected(m));
      marker.bindTooltip(`${m.id} - ${m.riskLevel.toUpperCase()}`, { direction: "top" });
    });
  }, [filter]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">Solapur Risk Heatmap</h1>
          <p className="mt-1 text-sm text-muted-foreground">Interactive map of all {MANHOLES.length} manholes with live risk status</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {(["all", "safe", "caution", "danger"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
                filter === f
                  ? f === "all" ? "bg-primary text-primary-foreground" : `bg-risk-${f}/15 text-risk-${f} border border-risk-${f}/30`
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f === "all" ? `All (${MANHOLES.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${counts[f]})`}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-6">
        <div ref={mapRef} className="h-[600px] w-full rounded-xl border shadow-stat" />

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-[1000] rounded-lg border bg-card/95 p-3 shadow-lg backdrop-blur-sm">
          <p className="text-xs font-bold text-card-foreground mb-2">Risk Level</p>
          <div className="space-y-1.5">
            {Object.entries(riskColors).map(([level, color]) => (
              <div key={level} className="flex items-center gap-2 text-xs">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="capitalize text-muted-foreground">{level}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected manhole detail */}
        {selected && (
          <div className="absolute right-4 top-4 z-[1000] w-80 rounded-xl border bg-card shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                <span className="font-bold text-card-foreground">{selected.id}</span>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-md p-1 hover:bg-muted">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Risk Status</span>
                <RiskBadge level={selected.riskLevel} pulse />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Ward</span>
                  <p className="font-semibold text-card-foreground">{selected.ward}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Depth</span>
                  <p className="font-semibold text-card-foreground">{selected.depth}m</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Incidents</span>
                  <p className="font-semibold text-card-foreground">{selected.incidentCount}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Cleaned</span>
                  <p className="font-semibold text-card-foreground">{selected.lastCleaned}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Blockages</span>
                  <p className="font-semibold text-card-foreground">{selected.blockageFrequency}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Rainfall Idx</span>
                  <p className="font-semibold text-card-foreground">{selected.rainfallIndex}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
