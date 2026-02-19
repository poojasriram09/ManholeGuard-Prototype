import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  MapPin,
  Clock,
  AlertTriangle,
  QrCode,
  Activity,
} from "lucide-react";
import { STATS } from "@/data/mockData";
import StatCard from "@/components/StatCard";

const features = [
  {
    icon: QrCode,
    title: "QR-Based Identity",
    desc: "Every manhole has a unique QR code linking to its complete digital profile, risk history, and real-time status.",
  },
  {
    icon: Activity,
    title: "AI Risk Prediction",
    desc: "Rule-based risk engine analyzes blockage history, rainfall, and incident data to predict danger levels before entry.",
  },
  {
    icon: Clock,
    title: "Live Time Tracking",
    desc: "Automatic countdown timers track worker duration inside manholes with real-time overstay alerts.",
  },
  {
    icon: AlertTriangle,
    title: "Auto Alert System",
    desc: "Instant notifications to supervisors when a worker exceeds maximum allowed duration — no manual SOS needed.",
  },
  {
    icon: MapPin,
    title: "Risk Heatmap",
    desc: "Interactive Solapur city map with color-coded manhole markers showing live risk status across all wards.",
  },
  {
    icon: Shield,
    title: "Safety Records",
    desc: "Complete audit trail of entries, incidents, and worker safety performance for regulatory compliance.",
  },
];

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(175_60%_40%_/_0.15),_transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
              <Shield className="h-4 w-4" />
              Solapur Municipal Corporation
            </div>
            <h1 className="text-4xl font-black leading-tight text-primary-foreground sm:text-5xl lg:text-6xl">
              Predictive QR-Based Manhole Safety &{" "}
              <span className="text-gradient-hero">Real-Time Monitoring</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-primary-foreground/70 sm:text-xl">
              A digital safety system that tracks sanitation worker entry in
              real time and automatically alerts authorities if a worker does
              not return safely.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground shadow-lg transition-all hover:shadow-xl hover:brightness-110"
              >
                <Activity className="h-4 w-4" />
                View Dashboard
              </Link>
              <Link
                to="/heatmap"
                className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-6 py-3.5 text-sm font-bold text-primary-foreground backdrop-blur-sm transition-all hover:bg-primary-foreground/20"
              >
                <MapPin className="h-4 w-4" />
                Explore Risk Heatmap
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="-mt-10 relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label="Entries Today"
            value={STATS.totalEntriesToday}
            icon={ClipboardList}
            variant="default"
          />
          <StatCard
            label="Active Workers"
            value={STATS.activeWorkers}
            icon={Activity}
            variant="accent"
          />
          <StatCard
            label="High-Risk Zones"
            value={STATS.highRiskZones}
            icon={AlertTriangle}
            variant="danger"
          />
          <StatCard
            label="Alerts Triggered"
            value={STATS.alertsTriggered}
            icon={AlertTriangle}
            variant="default"
          />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Comprehensive Safety Platform
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every feature designed to protect the lives of sanitation workers
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="group rounded-xl border bg-card p-6 shadow-stat transition-all hover:shadow-card-hover"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-card-foreground">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Need this import for the stats section
import { ClipboardList } from "lucide-react";
