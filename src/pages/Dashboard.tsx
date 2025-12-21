import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTradingBot } from '@/hooks/useTradingBot';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/StatCard';
import PriceDisplay from '@/components/PriceDisplay';
import TradesTable from '@/components/TradesTable';
import BrokerConfigModal, { BrokerConfig } from '@/components/BrokerConfigModal';
import { 
  Flame, 
  Power, 
  LogOut, 
  Wallet, 
  TrendingUp, 
  Activity,
  Target,
  BarChart3,
  XCircle,
  RotateCcw,
  Monitor,
  Clock,
  Layers
} from 'lucide-react';
import dragonBg from '@/assets/dragon-bg.jpg';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const {
    isAutoTrading,
    isConfigured,
    isConnected,
    brokerConfig,
    currentPrice,
    previousPrice,
    balance,
    equity,
    activeTrades,
    tradeHistory,
    totalProfit,
    winRate,
    totalTrades,
    lastError,
    apiLoading,
    toggleAutoTrading,
    closeAllTrades,
    resetAccount,
    configureBroker,
  } = useTradingBot();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBrokerConfig = (config: BrokerConfig) => {
    configureBroker(config);
  };

  return (
    <div className="min-h-screen relative">
      {/* Broker Configuration Modal */}
      <BrokerConfigModal 
        isOpen={!isConfigured} 
        onConfigure={handleBrokerConfig} 
      />

      {/* Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: `url(${dragonBg})` }}
      >
        <div className="absolute inset-0 bg-background/90" />
      </div>

      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame className="h-8 w-8 text-primary animate-pulse-glow" />
              <h1 className="font-display text-2xl font-bold text-gold">PHOENIX EA</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm text-muted-foreground">Welcome,</p>
                <p className="font-semibold text-foreground">{user?.name}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Control Panel */}
        <div className="flex flex-wrap items-center gap-4">
          <Button
            variant={isAutoTrading ? 'destructive' : 'gold'}
            size="lg"
            onClick={toggleAutoTrading}
            className="min-w-48"
          >
            <Power className="h-5 w-5" />
            {isAutoTrading ? 'STOP AUTO-TRADE' : 'START AUTO-TRADE'}
          </Button>

          {activeTrades.length > 0 && (
            <Button variant="outline" size="lg" onClick={closeAllTrades}>
              <XCircle className="h-5 w-5" />
              Close All ({activeTrades.length})
            </Button>
          )}

          <Button variant="secondary" size="lg" onClick={resetAccount}>
            <RotateCcw className="h-5 w-5" />
            Reset Account
          </Button>

          {isAutoTrading && (
            <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-success/20 border border-success/50 rounded-lg">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-success font-semibold">Bot Active</span>
            </div>
          )}

          {isConnected && !isAutoTrading && (
            <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/50 rounded-lg">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-primary font-semibold">MT5 Connected</span>
            </div>
          )}

          {lastError && (
            <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-destructive/20 border border-destructive/50 rounded-lg">
              <span className="text-destructive text-sm">{lastError}</span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Balance"
            value={`$${balance.toFixed(2)}`}
            icon={<Wallet className="h-5 w-5" />}
          />
          <StatCard
            title="Equity"
            value={`$${equity.toFixed(2)}`}
            trend={equity > balance ? 'up' : equity < balance ? 'down' : 'neutral'}
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <StatCard
            title="Total Profit"
            value={`${totalProfit >= 0 ? '+' : ''}$${totalProfit.toFixed(2)}`}
            trend={totalProfit >= 0 ? 'up' : 'down'}
            icon={<BarChart3 className="h-5 w-5" />}
          />
          <StatCard
            title="Win Rate"
            value={`${winRate.toFixed(1)}%`}
            subtitle={`${totalTrades} total trades`}
            icon={<Target className="h-5 w-5" />}
          />
        </div>

        {/* Price & Trading Info */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <PriceDisplay
              symbol="XAUUSD"
              price={currentPrice}
              previousPrice={previousPrice}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="bg-card border-2 border-border rounded-xl p-5">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Trading Settings
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-muted-foreground text-sm mb-1 flex items-center gap-1">
                    <Monitor className="h-3 w-3" /> Platform
                  </p>
                  <p className="text-gold font-display font-bold text-xl">{brokerConfig?.broker || 'N/A'}</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-muted-foreground text-sm mb-1 flex items-center gap-1">
                    <Layers className="h-3 w-3" /> Lot Size
                  </p>
                  <p className="text-foreground font-display font-bold text-xl">{brokerConfig?.lotSize?.toFixed(2) || '0.10'}</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-muted-foreground text-sm mb-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Timeframe
                  </p>
                  <p className="text-foreground font-display font-bold text-xl">{brokerConfig?.timeframe || 'M15'}</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-muted-foreground text-sm mb-1">Take Profit</p>
                  <p className="text-success font-display font-bold text-xl">$50/lot</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-muted-foreground text-sm mb-1">Stop Loss</p>
                  <p className="text-destructive font-display font-bold text-xl">$30/lot</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trades Tables */}
        <div className="grid lg:grid-cols-2 gap-6">
          <TradesTable
            trades={activeTrades}
            title={`Active Trades (${activeTrades.length})`}
          />
          <TradesTable
            trades={tradeHistory}
            title="Trade History"
            showClosePrice
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-muted-foreground text-sm">
            © 2024 Phoenix EA - Automated Gold Trading Bot. Trade responsibly.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
