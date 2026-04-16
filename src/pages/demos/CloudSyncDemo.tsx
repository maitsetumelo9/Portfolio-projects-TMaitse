import { useState, useEffect } from "react";
import { ArrowLeft, Users, FileText, MessageSquare, Bell, Search, Plus, Circle, CheckCircle2, Clock, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const users = [
  { name: "Sarah Chen", color: "bg-cyan-500", status: "online", avatar: "SC" },
  { name: "Alex Rivera", color: "bg-violet-500", status: "online", avatar: "AR" },
  { name: "Jordan Kim", color: "bg-emerald-500", status: "away", avatar: "JK" },
  { name: "Taylor Osei", color: "bg-amber-500", status: "offline", avatar: "TO" },
];

const documents = [
  { name: "Q4 Product Roadmap", updated: "2 min ago", collaborators: 3, status: "active" },
  { name: "API Documentation v3", updated: "15 min ago", collaborators: 2, status: "active" },
  { name: "Sprint Retrospective", updated: "1 hour ago", collaborators: 4, status: "idle" },
  { name: "Security Audit Report", updated: "3 hours ago", collaborators: 1, status: "idle" },
  { name: "Database Migration Plan", updated: "Yesterday", collaborators: 2, status: "idle" },
];

const activities = [
  { user: "Sarah Chen", action: "edited", target: "Q4 Product Roadmap", time: "2 min ago" },
  { user: "Alex Rivera", action: "commented on", target: "API Documentation v3", time: "5 min ago" },
  { user: "Jordan Kim", action: "created", target: "Sprint Retrospective", time: "1 hour ago" },
  { user: "You", action: "shared", target: "Security Audit Report", time: "2 hours ago" },
];

const editorLines = [
  { text: "# Q4 Product Roadmap", type: "heading" },
  { text: "", type: "empty" },
  { text: "## Goals & Objectives", type: "subheading" },
  { text: "- Launch v3.0 of the collaboration platform", type: "list" },
  { text: "- Implement real-time video conferencing", type: "list" },
  { text: "- Achieve 99.9% uptime SLA", type: "list" },
  { text: "", type: "empty" },
  { text: "## Timeline", type: "subheading" },
  { text: "Phase 1: October — Core feature development", type: "paragraph" },
  { text: "Phase 2: November — Beta testing & QA", type: "paragraph" },
  { text: "Phase 3: December — Production rollout", type: "paragraph" },
  { text: "", type: "empty" },
  { text: "## Key Metrics", type: "subheading" },
  { text: "| Metric | Target | Current |", type: "table" },
  { text: "| Active Users | 10,000 | 7,245 |", type: "table" },
  { text: "| Response Time | <200ms | 145ms |", type: "table" },
];

export default function CloudSyncDemo() {
  const navigate = useNavigate();
  const [cursorPos, setCursorPos] = useState({ line: 5, char: 40 });
  const [remoteCursor, setRemoteCursor] = useState({ line: 9, char: 20 });
  const [notifications, setNotifications] = useState(3);
  const [typingUser, setTypingUser] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setRemoteCursor(prev => ({
        line: Math.min(15, Math.max(0, prev.line + (Math.random() > 0.5 ? 1 : -1))),
        char: Math.floor(Math.random() * 50)
      }));
    }, 2000);

    const typingInterval = setInterval(() => {
      const names = ["Sarah Chen", "Alex Rivera", ""];
      setTypingUser(names[Math.floor(Math.random() * names.length)]);
    }, 3000);

    return () => { clearInterval(interval); clearInterval(typingInterval); };
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0c14] text-gray-100 flex flex-col">
      {/* Top bar */}
      <header className="h-14 border-b border-white/5 bg-[#0c0c14]/90 backdrop-blur-xl flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-1" /> Portfolio
          </Button>
          <div className="h-5 w-px bg-white/10" />
          <span className="font-display text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">CloudSync</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {users.slice(0, 3).map(u => (
              <div key={u.name} className={`w-7 h-7 rounded-full ${u.color} flex items-center justify-center text-[10px] font-bold text-white border-2 border-[#0c0c14]`}>
                {u.avatar}
              </div>
            ))}
          </div>
          <div className="relative">
            <Bell className="w-4 h-4 text-gray-400" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] font-bold flex items-center justify-center">{notifications}</span>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 border-r border-white/5 bg-[#0a0a12] hidden md:flex flex-col">
          <div className="p-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/[0.04] border border-white/5 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/30" placeholder="Search docs..." />
            </div>
          </div>

          <div className="px-4 mb-2 flex items-center justify-between">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-display">Documents</span>
            <Plus className="w-3.5 h-3.5 text-gray-500 hover:text-cyan-400 cursor-pointer" />
          </div>

          <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
            {documents.map((doc, i) => (
              <button key={doc.name} className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 text-sm transition-all ${i === 0 ? "bg-cyan-500/10 text-white" : "text-gray-400 hover:bg-white/[0.04]"}`}>
                <FileText className="w-4 h-4 shrink-0" />
                <div className="truncate">
                  <div className="truncate font-medium">{doc.name}</div>
                  <div className="text-[10px] text-gray-600">{doc.updated}</div>
                </div>
                {doc.status === "active" && <Circle className="w-2 h-2 fill-emerald-400 text-emerald-400 shrink-0 ml-auto" />}
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-white/5">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-display mb-3 block">Team</span>
            {users.map(u => (
              <div key={u.name} className="flex items-center gap-2 py-1.5">
                <div className="relative">
                  <div className={`w-6 h-6 rounded-full ${u.color} flex items-center justify-center text-[9px] font-bold text-white`}>{u.avatar}</div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0a0a12] ${u.status === "online" ? "bg-emerald-400" : u.status === "away" ? "bg-amber-400" : "bg-gray-600"}`} />
                </div>
                <span className="text-xs text-gray-400">{u.name}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main editor */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="h-10 border-b border-white/5 flex items-center px-4 gap-4 shrink-0">
            <span className="text-sm font-display font-semibold text-white">Q4 Product Roadmap</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Auto-saved</span>
            <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
              {typingUser && (
                <span className="text-cyan-400 animate-pulse">{typingUser} is typing...</span>
              )}
              <span>3 collaborators</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 font-mono text-sm">
            {editorLines.map((line, i) => (
              <div key={i} className={`relative py-0.5 px-2 rounded group flex items-start gap-4 ${i === cursorPos.line ? "bg-cyan-500/5" : ""}`}>
                <span className="text-gray-700 text-xs w-6 text-right shrink-0 select-none">{i + 1}</span>
                <span className={`${
                  line.type === "heading" ? "text-xl font-bold text-white" :
                  line.type === "subheading" ? "text-base font-semibold text-cyan-300" :
                  line.type === "list" ? "text-gray-300" :
                  line.type === "table" ? "text-gray-400 font-mono text-xs" :
                  "text-gray-400"
                }`}>
                  {line.text}
                </span>
                {i === remoteCursor.line && (
                  <div className="absolute h-5 w-0.5 bg-violet-500 animate-pulse" style={{ left: `${remoteCursor.char * 7 + 60}px` }}>
                    <span className="absolute -top-5 left-0 text-[9px] bg-violet-500 text-white px-1 rounded whitespace-nowrap">Sarah Chen</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>

        {/* Activity panel */}
        <aside className="w-64 border-l border-white/5 bg-[#0a0a12] hidden lg:flex flex-col">
          <div className="p-4 border-b border-white/5">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-display">Activity</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activities.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center text-[9px] font-bold text-gray-400 shrink-0 mt-0.5">
                  {a.user.split(" ").map(w => w[0]).join("")}
                </div>
                <div>
                  <p className="text-xs text-gray-300">
                    <span className="text-white font-medium">{a.user}</span> {a.action} <span className="text-cyan-400">{a.target}</span>
                  </p>
                  <span className="text-[10px] text-gray-600">{a.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <input className="flex-1 bg-white/[0.04] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/30" placeholder="Add comment..." />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
