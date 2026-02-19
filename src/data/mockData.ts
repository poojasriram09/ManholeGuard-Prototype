// Solapur coordinates center
export const SOLAPUR_CENTER: [number, number] = [17.6599, 75.9064];

export type RiskLevel = "safe" | "caution" | "danger";

export interface Manhole {
  id: string;
  name: string;
  lat: number;
  lng: number;
  ward: string;
  depth: number;
  lastCleaned: string;
  riskLevel: RiskLevel;
  incidentCount: number;
  blockageFrequency: number;
  rainfallIndex: number;
  overstayCount: number;
  cleaningHistory: { date: string; crew: string; notes: string }[];
  incidents: { date: string; type: string; description: string; resolved: boolean }[];
}

export interface Worker {
  id: string;
  name: string;
  phone: string;
  badge: string;
  photo: string;
  activeEntry: ActiveEntry | null;
}

export interface ActiveEntry {
  manholeId: string;
  manholeName: string;
  workerId: string;
  workerName: string;
  supervisorId: string;
  entryTime: Date;
  maxDuration: number; // minutes
  ward: string;
  riskLevel: RiskLevel;
}

export interface Alert {
  id: string;
  type: "overstay" | "high-risk" | "incident" | "sos";
  workerId: string;
  workerName: string;
  manholeId: string;
  manholeName: string;
  timestamp: Date;
  message: string;
  resolved: boolean;
  ward: string;
}

export interface EntryLog {
  id: string;
  workerId: string;
  workerName: string;
  manholeId: string;
  manholeName: string;
  entryTime: string;
  exitTime: string | null;
  duration: number | null;
  maxDuration: number;
  riskLevel: RiskLevel;
  ward: string;
  overstay: boolean;
}

const wards = ["Ward A", "Ward B", "Ward C", "Ward D", "Ward E", "Ward F"];
const crewNames = ["Crew Alpha", "Crew Beta", "Crew Gamma", "Crew Delta"];
const workerNames = [
  "Ramesh Jadhav", "Sunil Patil", "Mahesh Kamble", "Rajesh Mane",
  "Vikram Shinde", "Anil Deshmukh", "Sanjay Gaikwad", "Pravin Pawar",
  "Deepak Sonawane", "Ganesh Bhosale", "Sachin Kale", "Nilesh Thorat"
];

function randomBetween(a: number, b: number) {
  return Math.random() * (b - a) + a;
}

function randomRisk(): RiskLevel {
  const r = Math.random();
  if (r < 0.5) return "safe";
  if (r < 0.8) return "caution";
  return "danger";
}

function predictRisk(m: { incidentCount: number; rainfallIndex: number; blockageFrequency: number; overstayCount: number }): RiskLevel {
  const score = m.incidentCount * 2 + m.rainfallIndex * 1.5 + m.blockageFrequency * 1.2 + m.overstayCount * 1.8;
  if (score > 15) return "danger";
  if (score > 8) return "caution";
  return "safe";
}

export function generateManholes(count: number = 120): Manhole[] {
  const manholes: Manhole[] = [];
  for (let i = 1; i <= count; i++) {
    const incidentCount = Math.floor(randomBetween(0, 8));
    const rainfallIndex = Math.round(randomBetween(0, 5) * 10) / 10;
    const blockageFrequency = Math.floor(randomBetween(0, 6));
    const overstayCount = Math.floor(randomBetween(0, 4));
    const risk = predictRisk({ incidentCount, rainfallIndex, blockageFrequency, overstayCount });

    manholes.push({
      id: `MH-SOL-${String(i).padStart(4, "0")}`,
      name: `Manhole ${i} - ${wards[i % wards.length]}`,
      lat: SOLAPUR_CENTER[0] + randomBetween(-0.04, 0.04),
      lng: SOLAPUR_CENTER[1] + randomBetween(-0.05, 0.05),
      ward: wards[i % wards.length],
      depth: Math.round(randomBetween(2, 8) * 10) / 10,
      lastCleaned: new Date(Date.now() - Math.floor(randomBetween(1, 90)) * 86400000).toISOString().split("T")[0],
      riskLevel: risk,
      incidentCount,
      blockageFrequency,
      rainfallIndex,
      overstayCount,
      cleaningHistory: Array.from({ length: Math.floor(randomBetween(2, 6)) }, (_, j) => ({
        date: new Date(Date.now() - (j + 1) * Math.floor(randomBetween(15, 45)) * 86400000).toISOString().split("T")[0],
        crew: crewNames[j % crewNames.length],
        notes: j === 0 ? "Routine cleaning completed" : "Deep cleaning performed",
      })),
      incidents: Array.from({ length: incidentCount }, (_, j) => ({
        date: new Date(Date.now() - j * Math.floor(randomBetween(10, 60)) * 86400000).toISOString().split("T")[0],
        type: ["Blockage", "Gas Detected", "Structural Damage", "Overflow"][j % 4],
        description: "Incident recorded during routine inspection",
        resolved: Math.random() > 0.2,
      })),
    });
  }
  return manholes;
}

export function generateWorkers(): Worker[] {
  return workerNames.map((name, i) => ({
    id: `WKR-${String(i + 1).padStart(3, "0")}`,
    name,
    phone: `+91 98${Math.floor(randomBetween(10000000, 99999999))}`,
    badge: `B-${String(i + 1).padStart(3, "0")}`,
    photo: "",
    activeEntry: null,
  }));
}

export function generateActiveEntries(manholes: Manhole[], workers: Worker[]): ActiveEntry[] {
  const entries: ActiveEntry[] = [];
  const activeWorkers = workers.slice(0, 5);
  activeWorkers.forEach((w, i) => {
    const m = manholes[i * 3];
    const minutesAgo = Math.floor(randomBetween(5, 55));
    entries.push({
      manholeId: m.id,
      manholeName: m.name,
      workerId: w.id,
      workerName: w.name,
      supervisorId: "SUP-001",
      entryTime: new Date(Date.now() - minutesAgo * 60000),
      maxDuration: 45,
      ward: m.ward,
      riskLevel: m.riskLevel,
    });
  });
  return entries;
}

export function generateAlerts(entries: ActiveEntry[]): Alert[] {
  const alerts: Alert[] = [];
  entries.forEach((e, i) => {
    if (i < 2) {
      alerts.push({
        id: `ALT-${String(i + 1).padStart(3, "0")}`,
        type: "overstay",
        workerId: e.workerId,
        workerName: e.workerName,
        manholeId: e.manholeId,
        manholeName: e.manholeName,
        timestamp: new Date(),
        message: `Worker ${e.workerName} has exceeded max duration at ${e.manholeName}`,
        resolved: false,
        ward: e.ward,
      });
    }
  });
  alerts.push({
    id: "ALT-010",
    type: "high-risk",
    workerId: "WKR-008",
    workerName: "Pravin Pawar",
    manholeId: "MH-SOL-0042",
    manholeName: "Manhole 42 - Ward C",
    timestamp: new Date(Date.now() - 3600000),
    message: "High risk entry attempted at Manhole 42",
    resolved: true,
    ward: "Ward C",
  });
  return alerts;
}

export function generateEntryLogs(): EntryLog[] {
  const logs: EntryLog[] = [];
  for (let i = 0; i < 30; i++) {
    const entryTime = new Date(Date.now() - i * 3600000 - Math.floor(randomBetween(0, 3600000)));
    const duration = Math.floor(randomBetween(15, 60));
    const maxDuration = 45;
    logs.push({
      id: `LOG-${String(i + 1).padStart(4, "0")}`,
      workerId: `WKR-${String((i % 12) + 1).padStart(3, "0")}`,
      workerName: workerNames[i % 12],
      manholeId: `MH-SOL-${String(Math.floor(randomBetween(1, 120))).padStart(4, "0")}`,
      manholeName: `Manhole ${Math.floor(randomBetween(1, 120))}`,
      entryTime: entryTime.toISOString(),
      exitTime: new Date(entryTime.getTime() + duration * 60000).toISOString(),
      duration,
      maxDuration,
      riskLevel: randomRisk(),
      ward: wards[i % wards.length],
      overstay: duration > maxDuration,
    });
  }
  return logs;
}

// Singleton data for consistent state
export const MANHOLES = generateManholes();
export const WORKERS = generateWorkers();
export const ACTIVE_ENTRIES = generateActiveEntries(MANHOLES, WORKERS);
export const ALERTS = generateAlerts(ACTIVE_ENTRIES);
export const ENTRY_LOGS = generateEntryLogs();

export const STATS = {
  totalEntriesToday: 47,
  activeWorkers: ACTIVE_ENTRIES.length,
  highRiskZones: MANHOLES.filter(m => m.riskLevel === "danger").length,
  alertsTriggered: 12,
  totalManholes: MANHOLES.length,
  resolvedAlerts: 9,
};
