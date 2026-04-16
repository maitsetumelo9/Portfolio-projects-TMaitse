import { useState, useEffect } from "react";
import { ArrowLeft, Shield, AlertTriangle, Activity, Wifi, Server, Globe, Clock, Bell, XCircle, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Alert {
  id: number;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  source: string;
  destination: string;
  time: string;
  status: "active" | "resolved";
}

const initialAlerts: Alert[] = [
  { id: 1, type: "DDoS Attack Detected", severity: "critical", source: "185.234.72.x", destination: "10.0.1.5", time: "Just now", status: "active" },
  { id: 2, type: "Port Scan Detected", severity: "high", source: "45.33.32.156", destination: "10.0.1.0/24", time: "2 min ago", status: "active" },
  { id: 3, type: "Brute Force SSH", severity: "high", source: "91.134.15.x", destination: "10.0.1.12", time: "5 min ago", status: "active" },
  { id: 4, type: "Suspicious DNS Query", severity: "medium", source: "10.0.1.45", destination: "External", time: "12 min ago", status: "resolved" },
  { id: 5, type: "ARP Spoofing", severity: "medium", source: "10.0.1.88", destination: "Broadcast", time: "18 min ago", status: "resolved" },
  { id: 6, type: "Unusual Outbound Traffic", severity: "low", source: "10.0.1.23", destination: "External", time: "25 min ago", status: "resolved" },
];

const firewallRules = [
  { name: "Block Known Malicious IPs", action: "DROP", enabled: true, hits: 14523 },
  { name: "Allow Internal SSH", action: "ACCEPT", enabled: true, hits: 8734 },
  { name: "Rate Limit HTTP", action: "LIMIT", enabled: true, hits: 45123 },
  { name: "Block Tor Exit Nodes", action: "DROP", enabled: false, hits: 892 },
  { name: "Allow VPN Traffic", action: "ACCEPT", enabled: true, hits: 23456 },
];

const sevColors = {
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function NetSentinelDemo() {
  const navigate = useNavigate();
  const [alerts] = useState<Alert[]>(initialAlerts);
  const [trafficData, setTrafficData] = useState<number[]>(Array(30).fill(0).map(() => Math.random() * 80 + 20));
  const [packetsPerSec, setPacketsPerSec] = useState(12453);
  const [bandwidth, setBandwidth] = useState(847.3);
  const [activeConnections, setActiveConnections] = useState(1247);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficData(prev => {
        const next = [...prev.slice(1), Math.random() * 80 + 20 + (Math.random() > 0.9 ? 60 : 0)];
        return next;
      });
      setPacketsPerSec(prev => prev + Math.floor((Math.random() - 0.48) * 500));
      setBandwidth(prev => Math.max(0, prev + (Math.random() - 0.48) * 50));
      setActiveConnections(prev => prev + Math.floor((Math.random() - 0.5) * 20));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const maxTraffic = Math.max(...trafficData);

  return (
    <div className="min-h-screen bg-[#0c0c14] text-gray-100">
      <header className="h-14 border-b border-white/5 bg-[#0c0c14]/90 backdrop-blur-xl flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-1" /> Portfolio
          </Button>
          <div className="h-5 w-px bg-white/10" />
          <span className="font-display text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-500">NetSentinel</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-medium">Monitoring</span>
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Packets/sec", value: packetsPerSec.toLocaleString(), icon: Activity, color: "from-violet-500 to-purple-400" },
            { label: "Bandwidth", value: `${bandwidth.toFixed(1)} Mbps`, icon: Wifi, color: "from-cyan-500 to-blue-400" },
            { label: "Active Connections", value: activeConnections.toLocaleString(), icon: Globe, color: "from-emerald-500 to-teal-400" },
            { label: "Active Alerts", value: alerts.filter(a => a.status === "active").length.toString(), icon: AlertTriangle, color: "from-red-500 to-orange-400" },
          ].map(s => (
            <div key={s.label} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-gray-500">{s.label}</span>
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                  <s.icon className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div className="text-lg font-display font-bold text-white">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Traffic chart */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm font-semibold text-white">Live Network Traffic</h3>
            <span className="text-[10px] text-gray-500">Last 30 seconds</span>
          </div>
          <div className="flex items-end gap-px h-40">
            {trafficData.map((val, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t-sm transition-all duration-300 ${
                  val > 120 ? "bg-red-500/60" : val > 80 ? "bg-amber-500/40" : "bg-violet-500/30"
                }`}
                style={{ height: `${(val / Math.max(maxTraffic, 1)) * 100}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[9px] text-gray-600">
            <span>-30s</span><span>-20s</span><span>-10s</span><span>Now</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Alerts */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h3 className="font-display text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-red-400" /> Intrusion Alerts
            </h3>
            <div className="space-y-2">
              {alerts.map(a => (
                <div key={a.id} className={`p-3 rounded-xl border transition-all ${a.status === "active" ? "bg-white/[0.02] border-white/10" : "border-white/5 opacity-60"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-bold border ${sevColors[a.severity]}`}>{a.severity}</span>
                    <span className="text-xs text-white font-medium flex-1">{a.type}</span>
                    {a.status === "active" ? <XCircle className="w-3.5 h-3.5 text-red-400" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono">
                    <span>{a.source} → {a.destination}</span>
                    <span className="ml-auto">{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Firewall */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h3 className="font-display text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-violet-400" /> Firewall Rules
            </h3>
            <div className="space-y-2">
              {firewallRules.map((r, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.01] border border-white/5">
                  <div className={`w-2 h-2 rounded-full ${r.enabled ? "bg-emerald-400" : "bg-gray-600"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white font-medium truncate">{r.name}</div>
                    <div className="text-[10px] text-gray-500">{r.hits.toLocaleString()} hits</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    r.action === "DROP" ? "bg-red-500/10 text-red-400" :
                    r.action === "ACCEPT" ? "bg-emerald-500/10 text-emerald-400" :
                    "bg-amber-500/10 text-amber-400"
                  }`}>{r.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
