import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Flame, Monitor, Clock, Layers, Link2, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useMetaAPI, MetaAPIAccount } from '@/hooks/useMetaAPI';
import { toast } from 'sonner';

export interface BrokerConfig {
  broker: 'MT4' | 'MT5';
  lotSize: number;
  timeframe: string;
  accountId: string;
  accountName?: string;
}

interface BrokerConfigModalProps {
  isOpen: boolean;
  onConfigure: (config: BrokerConfig) => void;
}

const TIMEFRAMES = [
  { value: 'M1', label: '1 Minute (M1)' },
  { value: 'M5', label: '5 Minutes (M5)' },
  { value: 'M15', label: '15 Minutes (M15)' },
  { value: 'M30', label: '30 Minutes (M30)' },
  { value: 'H1', label: '1 Hour (H1)' },
  { value: 'H4', label: '4 Hours (H4)' },
  { value: 'D1', label: 'Daily (D1)' },
];

const LOT_SIZES = [
  { value: '0.01', label: '0.01 (Micro)' },
  { value: '0.05', label: '0.05' },
  { value: '0.10', label: '0.10 (Mini)' },
  { value: '0.50', label: '0.50' },
  { value: '1.00', label: '1.00 (Standard)' },
  { value: '2.00', label: '2.00' },
];

const BrokerConfigModal: React.FC<BrokerConfigModalProps> = ({
  isOpen,
  onConfigure,
}) => {
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [lotSize, setLotSize] = useState('0.10');
  const [timeframe, setTimeframe] = useState('M15');
  const [step, setStep] = useState(1);
  
  const { loading, error, accounts, fetchAccounts, deployAccount } = useMetaAPI();

  useEffect(() => {
    if (isOpen) {
      fetchAccounts();
    }
  }, [isOpen, fetchAccounts]);

  const selectedAccount = accounts.find(acc => acc._id === selectedAccountId);

  const handleConnect = async () => {
    if (!selectedAccount) return;
    
    // Deploy account if not already deployed
    if (selectedAccount.state !== 'DEPLOYED') {
      toast.info('Deploying MT5 account...');
      try {
        await deployAccount(selectedAccountId);
        toast.success('Account deployment started. This may take a few moments.');
      } catch (err) {
        toast.error('Failed to deploy account');
        return;
      }
    }

    onConfigure({
      broker: selectedAccount.platform.toUpperCase() as 'MT4' | 'MT5',
      lotSize: parseFloat(lotSize),
      timeframe,
      accountId: selectedAccountId,
      accountName: selectedAccount.name,
    });
  };

  const canProceed = () => {
    if (step === 1) return selectedAccountId !== '';
    if (step === 2) return lotSize !== '' && timeframe !== '';
    return true;
  };

  const handleRefresh = () => {
    fetchAccounts();
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-lg bg-card border-2 border-primary/30">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Flame className="h-8 w-8 text-primary animate-pulse-glow" />
            <DialogTitle className="font-display text-2xl text-gold">
              Phoenix EA Setup
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Connect your MT5 account via MetaAPI
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-12 rounded-full transition-colors ${
                  s <= step ? 'bg-primary' : 'bg-secondary'
                }`}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg text-foreground flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-primary" />
                  Select MetaAPI Account
                </h3>
                <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>

              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Loading accounts...</span>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              )}

              {!loading && accounts.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No MetaAPI accounts found. Please add your MT5 account in the MetaAPI dashboard first.
                  </p>
                  <Button variant="outline" asChild>
                    <a href="https://app.metaapi.cloud" target="_blank" rel="noopener noreferrer">
                      Open MetaAPI Dashboard
                    </a>
                  </Button>
                </div>
              )}

              {!loading && accounts.length > 0 && (
                <div className="space-y-2">
                  {accounts.map((account: MetaAPIAccount) => (
                    <button
                      key={account._id}
                      onClick={() => setSelectedAccountId(account._id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedAccountId === account._id
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-secondary/50 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground">{account.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {account.platform.toUpperCase()} • Login: {account.login} • {account.server}
                          </p>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-semibold ${
                          account.state === 'DEPLOYED' 
                            ? 'bg-success/20 text-success' 
                            : 'bg-warning/20 text-warning'
                        }`}>
                          {account.state}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-foreground">
                  <Layers className="h-4 w-4 text-primary" />
                  Select Lot Size
                </Label>
                <Select value={lotSize} onValueChange={setLotSize}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Choose lot size" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOT_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  Select Timeframe
                </Label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Choose timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEFRAMES.map((tf) => (
                      <SelectItem key={tf.value} value={tf.value}>
                        {tf.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && selectedAccount && (
            <div className="space-y-4">
              <h3 className="font-display text-lg text-foreground flex items-center gap-2">
                <Link2 className="h-5 w-5 text-primary" />
                Ready to Connect
              </h3>

              <div className="bg-secondary/50 rounded-lg p-4 space-y-2 border border-border">
                <h4 className="font-semibold text-foreground">Configuration Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Account:</span>
                  <span className="text-gold font-semibold">{selectedAccount.name}</span>
                  <span className="text-muted-foreground">Platform:</span>
                  <span className="text-gold font-semibold">{selectedAccount.platform.toUpperCase()}</span>
                  <span className="text-muted-foreground">Login:</span>
                  <span className="text-foreground">{selectedAccount.login}</span>
                  <span className="text-muted-foreground">Server:</span>
                  <span className="text-foreground">{selectedAccount.server}</span>
                  <span className="text-muted-foreground">Lot Size:</span>
                  <span className="text-foreground">{lotSize}</span>
                  <span className="text-muted-foreground">Timeframe:</span>
                  <span className="text-foreground">{timeframe}</span>
                  <span className="text-muted-foreground">Symbol:</span>
                  <span className="text-gold">XAUUSD (Gold)</span>
                </div>
              </div>

              {selectedAccount.state !== 'DEPLOYED' && (
                <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/30 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <p className="text-warning text-sm">
                    Account will be deployed when you connect.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between gap-3">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          <div className="flex-1" />
          {step < 3 ? (
            <Button
              variant="gold"
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
            >
              Continue
            </Button>
          ) : (
            <Button variant="gold" onClick={handleConnect} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Link2 className="h-4 w-4 mr-2" />
              Connect & Start Trading
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BrokerConfigModal;
