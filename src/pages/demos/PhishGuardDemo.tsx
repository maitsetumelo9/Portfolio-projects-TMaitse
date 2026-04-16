import { useState } from "react";
import { ArrowLeft, Shield, AlertTriangle, CheckCircle2, XCircle, Search, Mail, Eye, BarChart3, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const campaigns = [
  { name: "Q4 Security Test", status: "active", sent: 245, clicked: 23, reported: 189, date: "Oct 15, 2025" },
  { name: "Invoice Phishing Sim", status: "completed", sent: 312, clicked: 41, reported: 234, date: "Sep 28, 2025" },
  { name: "CEO Fraud Test", status: "completed", sent: 180, clicked: 12, reported: 156, date: "Sep 10, 2025" },
];

const indicators = [
  { label: "Suspicious sender domain", risk: "high", detail: "Domain 'amaz0n-security.com' mimics legitimate brand" },
  { label: "Urgency language detected", risk: "high", detail: "'Your account will be suspended in 24 hours'" },
  { label: "Mismatched URL", risk: "critical", detail: "Display text shows amazon.com but links to phishing-site.ru" },
  { label: "Missing SPF record", risk: "medium", detail: "Sender domain lacks SPF authentication" },
  { label: "Suspicious attachment", risk: "high", detail: "invoice.pdf.exe — executable disguised as PDF" },
  { label: "Grammar errors", risk: "low", detail: "Multiple spelling and grammar inconsistencies" },
];

const riskColors = {
  critical: "text-red-400 bg-red-500/10 border-red-500/20",
  high: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  low: "text-blue-400 bg-blue-500/10 border-blue-500/20",
};

export default function PhishGuardDemo() {
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [threatScore, setThreatScore] = useState(0);
  const [activeView, setActiveView] = useState<"analyzer" | "campaigns">("analyzer");

  const analyzeEmail = () => {
    if (!emailInput.trim()) return;
    setAnalyzing(true);
    setAnalyzed(false);
    setThreatScore(0);

    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
      let score = 0;
      const interval = setInterval(() => {
        score += Math.random() * 15;
        if (score >= 87) { score = 87; clearInterval(interval); }
        setThreatScore(Math.round(score));
      }, 100);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0c0c14] text-gray-100">
      <header className="h-14 border-b border-white/5 bg-[#0c0c14]/90 backdrop-blur-xl flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-1" /> Portfolio
          </Button>
          <div className="h-5 w-px bg-white/10" />
          <span className="font-display text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">PhishGuard</span>
        </div>
        <div className="flex gap-2">
          {(["analyzer", "campaigns"] as const).map(v => (
            <button key={v} onClick={() => setActiveView(v)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${activeView === v ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "text-gray-500 hover:text-gray-300"}`}>
              {v === "analyzer" ? "Email Analyzer" : "Campaigns"}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4 md:p-6">
        {activeView === "analyzer" && (
          <div className="space-y-6">
            {/* Input */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="font-display text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" /> Analyze Suspicious Email
              </h3>
              <textarea
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                placeholder={`Paste email content or URL here...\n\nExample: "Dear Customer, Your Amazon account has been compromised. Click here to verify: http://amaz0n-security.com/verify"`}
                className="w-full h-32 bg-white/[0.03] border border-white/5 rounded-xl p-4 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-amber-500/30 resize-none font-mono"
              />
              <Button onClick={analyzeEmail} disabled={analyzing || !emailInput.trim()} className="mt-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold border-0 hover:opacity-90">
                {analyzing ? (
                  <><div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" /> Analyzing...</>
                ) : (
                  <><Search className="w-4 h-4 mr-2" /> Analyze Email</>
                )}
              </Button>
            </div>

            {/* Results */}
            {analyzed && (
              <div className="grid md:grid-cols-3 gap-6">
                {/* Threat score */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center">
                  <span className="text-xs text-gray-500 mb-3">Threat Score</span>
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
                      <circle cx="50" cy="50" r="42" fill="none" stroke="url(#threatGrad)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${threatScore * 2.64} 264`} />
                      <defs>
                        <linearGradient id="threatGrad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#ef4444" />
                          <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-display font-bold text-red-400">{threatScore}</span>
                      <span className="text-[10px] text-gray-500">/ 100</span>
                    </div>
                  </div>
                  <span className="mt-3 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">HIGH RISK</span>
                </div>

                {/* Indicators */}
                <div className="md:col-span-2 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  <h4 className="font-display text-sm font-semibold text-white mb-4">Threat Indicators</h4>
                  <div className="space-y-3">
                    {indicators.map((ind, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.01] border border-white/5">
                        <span className={`shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold border ${riskColors[ind.risk as keyof typeof riskColors]}`}>{ind.risk}</span>
                        <div>
                          <div className="text-xs text-white font-medium">{ind.label}</div>
                          <div className="text-[11px] text-gray-500 mt-0.5">{ind.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeView === "campaigns" && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: "Total Emails Sent", value: "737", icon: Mail },
                { label: "Click Rate", value: "10.3%", icon: Eye },
                { label: "Report Rate", value: "78.6%", icon: Shield },
              ].map(s => (
                <div key={s.label} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">{s.label}</span>
                    <s.icon className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-display font-bold text-white">{s.value}</div>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="font-display text-sm font-semibold text-white mb-4">Phishing Campaigns</h3>
              <div className="space-y-3">
                {campaigns.map((c, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-sm text-white font-medium">{c.name}</span>
                        <div className="text-[10px] text-gray-500 mt-0.5">{c.date}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.status === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-gray-500/10 text-gray-400 border border-gray-500/20"}`}>
                        {c.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 rounded-lg bg-white/[0.02]">
                        <div className="text-sm font-bold text-white">{c.sent}</div>
                        <div className="text-[9px] text-gray-500">Sent</div>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-red-500/5">
                        <div className="text-sm font-bold text-red-400">{c.clicked}</div>
                        <div className="text-[9px] text-gray-500">Clicked</div>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-emerald-500/5">
                        <div className="text-sm font-bold text-emerald-400">{c.reported}</div>
                        <div className="text-[9px] text-gray-500">Reported</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
