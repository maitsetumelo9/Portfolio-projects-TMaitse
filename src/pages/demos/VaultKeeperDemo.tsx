import { useState } from "react";
import { ArrowLeft, Lock, Unlock, Eye, EyeOff, Copy, Plus, Shield, Key, Clock, CheckCircle2, AlertTriangle, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Secret {
  id: number;
  name: string;
  value: string;
  type: "api_key" | "password" | "certificate" | "token";
  lastRotated: string;
  expiresIn: string;
  status: "active" | "expiring" | "expired";
}

const initialSecrets: Secret[] = [
  { id: 1, name: "AWS_ACCESS_KEY", value: "AKIA5XMPLEO7GEXAMPLE", type: "api_key", lastRotated: "2 days ago", expiresIn: "28 days", status: "active" },
  { id: 2, name: "DATABASE_PASSWORD", value: "dGhpc0lzQVN1cGVyU2VjcmV0", type: "password", lastRotated: "15 days ago", expiresIn: "15 days", status: "active" },
  { id: 3, name: "JWT_SIGNING_KEY", value: "eyJhbGciOiJSUzI1NiIs...truncated", type: "token", lastRotated: "28 days ago", expiresIn: "2 days", status: "expiring" },
  { id: 4, name: "STRIPE_SECRET_KEY", value: "sk_live_51H7example...key", type: "api_key", lastRotated: "5 days ago", expiresIn: "25 days", status: "active" },
  { id: 5, name: "TLS_CERTIFICATE", value: "-----BEGIN CERTIFICATE-----", type: "certificate", lastRotated: "45 days ago", expiresIn: "Expired", status: "expired" },
  { id: 6, name: "GITHUB_TOKEN", value: "ghp_xxxxxxxxxxxxxxxxxxxx", type: "token", lastRotated: "10 days ago", expiresIn: "20 days", status: "active" },
];

const accessLogs = [
  { user: "deploy-bot", action: "READ", secret: "AWS_ACCESS_KEY", time: "30s ago", ip: "10.0.1.5" },
  { user: "sarah.chen", action: "ROTATE", secret: "DATABASE_PASSWORD", time: "2 min ago", ip: "10.0.2.15" },
  { user: "ci-pipeline", action: "READ", secret: "STRIPE_SECRET_KEY", time: "5 min ago", ip: "10.0.1.20" },
  { user: "admin", action: "CREATE", secret: "NEW_API_KEY", time: "15 min ago", ip: "10.0.2.1" },
  { user: "deploy-bot", action: "READ", secret: "JWT_SIGNING_KEY", time: "22 min ago", ip: "10.0.1.5" },
  { user: "alex.r", action: "DELETE", secret: "OLD_TOKEN", time: "1 hour ago", ip: "10.0.2.22" },
];

const typeIcons = { api_key: Key, password: Lock, certificate: Shield, token: RefreshCw };
const statusStyles = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  expiring: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  expired: "bg-red-500/10 text-red-400 border-red-500/20",
};
const actionColors = { READ: "text-cyan-400", ROTATE: "text-amber-400", CREATE: "text-emerald-400", DELETE: "text-red-400" };

export default function VaultKeeperDemo() {
  const navigate = useNavigate();
  const [secrets] = useState<Secret[]>(initialSecrets);
  const [revealedIds, setRevealedIds] = useState<Set<number>>(new Set());
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const toggleReveal = (id: number) => {
    setRevealedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const copySecret = (id: number) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0c0c14] text-gray-100">
      <header className="h-14 border-b border-white/5 bg-[#0c0c14]/90 backdrop-blur-xl flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-1" /> Portfolio
          </Button>
          <div className="h-5 w-px bg-white/10" />
          <span className="font-display text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500">VaultKeeper</span>
        </div>
        <Button size="sm" onClick={() => setShowAdd(!showAdd)} className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0 hover:opacity-90 text-xs">
          <Plus className="w-3 h-3 mr-1" /> Add Secret
        </Button>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Secrets", value: "6", icon: Key, color: "from-pink-500 to-rose-400" },
            { label: "Active", value: "4", icon: CheckCircle2, color: "from-emerald-500 to-teal-400" },
            { label: "Expiring Soon", value: "1", icon: AlertTriangle, color: "from-amber-500 to-yellow-400" },
            { label: "Expired", value: "1", icon: Clock, color: "from-red-500 to-orange-400" },
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

        {/* Add form */}
        {showAdd && (
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-pink-500/20 animate-in slide-in-from-top-2">
            <h3 className="font-display text-sm font-semibold text-white mb-4">Add New Secret</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <input placeholder="Secret name (e.g. API_KEY)" className="bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-pink-500/30" />
              <input placeholder="Secret value" type="password" className="bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-pink-500/30" />
              <Button onClick={() => setShowAdd(false)} className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0 hover:opacity-90">
                <Lock className="w-4 h-4 mr-2" /> Encrypt & Store
              </Button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Secrets list */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-display text-sm font-semibold text-white">Encrypted Secrets</h3>
            {secrets.map(s => {
              const TypeIcon = typeIcons[s.type];
              const revealed = revealedIds.has(s.id);
              return (
                <div key={s.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                      <TypeIcon className="w-4 h-4 text-pink-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white font-mono font-medium">{s.name}</div>
                      <div className="text-[10px] text-gray-500">Rotated {s.lastRotated} · Expires in {s.expiresIn}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${statusStyles[s.status]}`}>{s.status}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 font-mono text-xs text-gray-400 overflow-hidden">
                      {revealed ? s.value : "•".repeat(24)}
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => toggleReveal(s.id)} className="text-gray-500 hover:text-white h-8 w-8 p-0">
                      {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => copySecret(s.id)} className="text-gray-500 hover:text-white h-8 w-8 p-0">
                      {copiedId === s.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </Button>
                    <Button size="sm" variant="ghost" className="text-gray-500 hover:text-amber-400 h-8 w-8 p-0">
                      <RefreshCw className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Access logs */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 h-fit">
            <h3 className="font-display text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-pink-400" /> Access Log
            </h3>
            <div className="space-y-3">
              {accessLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-[11px] text-gray-300">
                      <span className="text-white font-medium">{log.user}</span>
                      {" "}<span className={`font-mono font-bold ${actionColors[log.action as keyof typeof actionColors]}`}>{log.action}</span>{" "}
                      <span className="text-pink-400">{log.secret}</span>
                    </p>
                    <span className="text-[9px] text-gray-600">{log.time} · {log.ip}</span>
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
