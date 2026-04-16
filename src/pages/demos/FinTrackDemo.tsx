import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, CreditCard, PieChart, BarChart3, ArrowUpRight, ArrowDownRight, Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const transactions = [
  { name: "Spotify Premium", category: "Entertainment", amount: -9.99, date: "Today", icon: "🎵" },
  { name: "Salary Deposit", category: "Income", amount: 5200.00, date: "Today", icon: "💰" },
  { name: "Amazon Purchase", category: "Shopping", amount: -67.42, date: "Yesterday", icon: "📦" },
  { name: "Electric Bill", category: "Utilities", amount: -124.50, date: "Yesterday", icon: "⚡" },
  { name: "Freelance Payment", category: "Income", amount: 850.00, date: "2 days ago", icon: "💻" },
  { name: "Grocery Store", category: "Food", amount: -89.23, date: "3 days ago", icon: "🛒" },
  { name: "Gym Membership", category: "Health", amount: -45.00, date: "3 days ago", icon: "🏋️" },
  { name: "Restaurant", category: "Food", amount: -38.75, date: "4 days ago", icon: "🍽️" },
];

const budgets = [
  { category: "Food & Dining", spent: 412, limit: 500, color: "bg-emerald-500" },
  { category: "Entertainment", spent: 89, limit: 150, color: "bg-violet-500" },
  { category: "Utilities", spent: 245, limit: 300, color: "bg-amber-500" },
  { category: "Shopping", spent: 267, limit: 200, color: "bg-red-500" },
  { category: "Transportation", spent: 120, limit: 200, color: "bg-cyan-500" },
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const incomeData = [4200, 4200, 4800, 5200, 4900, 5200, 5600, 5200, 5800, 6050, 5200, 0];
const expenseData = [3100, 3400, 3200, 3800, 3500, 3900, 3700, 3600, 4100, 3800, 3200, 0];

export default function FinTrackDemo() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(24567.89);
  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "budgets">("overview");

  useEffect(() => {
    const interval = setInterval(() => {
      setBalance(prev => prev + (Math.random() - 0.48) * 10);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const maxIncome = Math.max(...incomeData);

  return (
    <div className="min-h-screen bg-[#0c0c14] text-gray-100">
      {/* Header */}
      <header className="h-14 border-b border-white/5 bg-[#0c0c14]/90 backdrop-blur-xl flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-1" /> Portfolio
          </Button>
          <div className="h-5 w-px bg-white/10" />
          <span className="font-display text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">FinTrack</span>
        </div>
        <div className="flex gap-2">
          {(["overview", "transactions", "budgets"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${activeTab === tab ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-gray-500 hover:text-gray-300"}`}>
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Balance cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Balance", value: `$${balance.toFixed(2)}`, change: "+2.4%", up: true, icon: DollarSign, color: "from-emerald-500 to-teal-400" },
            { label: "Monthly Income", value: "$5,200.00", change: "+12%", up: true, icon: TrendingUp, color: "from-cyan-500 to-blue-400" },
            { label: "Monthly Expenses", value: "$3,247.89", change: "-5.2%", up: false, icon: CreditCard, color: "from-violet-500 to-purple-400" },
            { label: "Savings Rate", value: "37.5%", change: "+3.1%", up: true, icon: PieChart, color: "from-amber-500 to-yellow-400" },
          ].map(card => (
            <div key={card.label} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500 font-body">{card.label}</span>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <card.icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-xl font-display font-bold text-white">{card.value}</div>
              <div className={`flex items-center gap-1 mt-1 text-xs ${card.up ? "text-emerald-400" : "text-red-400"}`}>
                {card.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {card.change} from last month
              </div>
            </div>
          ))}
        </div>

        {activeTab === "overview" && (
          <>
            {/* Chart */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-sm font-semibold text-white">Income vs Expenses</h3>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Income</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-violet-500" /> Expenses</span>
                </div>
              </div>
              <div className="flex items-end gap-2 h-48">
                {months.map((m, i) => (
                  <div key={m} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex gap-0.5 items-end" style={{ height: "160px" }}>
                      <div className="flex-1 bg-emerald-500/20 rounded-t-sm transition-all hover:bg-emerald-500/40" style={{ height: `${(incomeData[i] / maxIncome) * 100}%` }} />
                      <div className="flex-1 bg-violet-500/20 rounded-t-sm transition-all hover:bg-violet-500/40" style={{ height: `${(expenseData[i] / maxIncome) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-600">{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent transactions */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="font-display text-sm font-semibold text-white mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((t, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.02] transition-all">
                    <span className="text-lg">{t.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white font-medium truncate">{t.name}</div>
                      <div className="text-[10px] text-gray-500">{t.category} · {t.date}</div>
                    </div>
                    <span className={`text-sm font-display font-semibold ${t.amount > 0 ? "text-emerald-400" : "text-gray-300"}`}>
                      {t.amount > 0 ? "+" : ""}{t.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "transactions" && (
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-sm font-semibold text-white">All Transactions</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-white/10 text-gray-400 text-xs h-8"><Filter className="w-3 h-3 mr-1" /> Filter</Button>
                <Button size="sm" variant="outline" className="border-white/10 text-gray-400 text-xs h-8"><Calendar className="w-3 h-3 mr-1" /> Date</Button>
              </div>
            </div>
            <div className="space-y-2">
              {transactions.map((t, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-all border border-transparent hover:border-white/5">
                  <span className="text-lg">{t.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-medium">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.category} · {t.date}</div>
                  </div>
                  <span className={`text-sm font-display font-bold ${t.amount > 0 ? "text-emerald-400" : "text-gray-300"}`}>
                    {t.amount > 0 ? "+" : ""}${Math.abs(t.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "budgets" && (
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h3 className="font-display text-sm font-semibold text-white mb-6">Monthly Budgets</h3>
            <div className="space-y-5">
              {budgets.map(b => {
                const pct = Math.min(100, (b.spent / b.limit) * 100);
                const over = b.spent > b.limit;
                return (
                  <div key={b.category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">{b.category}</span>
                      <span className={`text-xs font-mono ${over ? "text-red-400" : "text-gray-500"}`}>${b.spent} / ${b.limit}</span>
                    </div>
                    <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${over ? "bg-red-500" : b.color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
