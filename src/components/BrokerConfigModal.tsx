import React, { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Flame, Monitor, Clock, Layers, Link2 } from 'lucide-react';

export interface BrokerConfig {
  broker: 'MT4' | 'MT5';
  lotSize: number;
  timeframe: string;
  accountId?: string;
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
  const [broker, setBroker] = useState<'MT4' | 'MT5' | ''>('');
  const [lotSize, setLotSize] = useState('0.10');
  const [timeframe, setTimeframe] = useState('M15');
  const [accountId, setAccountId] = useState('');
  const [step, setStep] = useState(1);

  const handleConnect = () => {
    if (broker && lotSize && timeframe) {
      onConfigure({
        broker: broker as 'MT4' | 'MT5',
        lotSize: parseFloat(lotSize),
        timeframe,
        accountId: accountId || undefined,
      });
    }
  };

  const canProceed = () => {
    if (step === 1) return broker !== '';
    if (step === 2) return lotSize !== '' && timeframe !== '';
    return true;
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
            Configure your trading connection to get started
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
              <h3 className="font-display text-lg text-foreground flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary" />
                Which broker platform are you using?
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={broker === 'MT4' ? 'gold' : 'outline'}
                  className="h-24 flex-col gap-2"
                  onClick={() => setBroker('MT4')}
                >
                  <Monitor className="h-8 w-8" />
                  <span className="font-display text-lg">MetaTrader 4</span>
                </Button>
                <Button
                  variant={broker === 'MT5' ? 'gold' : 'outline'}
                  className="h-24 flex-col gap-2"
                  onClick={() => setBroker('MT5')}
                >
                  <Monitor className="h-8 w-8" />
                  <span className="font-display text-lg">MetaTrader 5</span>
                </Button>
              </div>
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

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-display text-lg text-foreground flex items-center gap-2">
                <Link2 className="h-5 w-5 text-primary" />
                Connect to {broker}
              </h3>
              
              <div className="space-y-3">
                <Label className="text-foreground">Account ID (Optional)</Label>
                <Input
                  placeholder="Enter your broker account ID"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="bg-secondary border-border"
                />
                <p className="text-xs text-muted-foreground">
                  This is for display purposes. The bot will simulate trading on XAUUSD.
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4 space-y-2 border border-border">
                <h4 className="font-semibold text-foreground">Configuration Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Platform:</span>
                  <span className="text-gold font-semibold">{broker}</span>
                  <span className="text-muted-foreground">Lot Size:</span>
                  <span className="text-foreground">{lotSize}</span>
                  <span className="text-muted-foreground">Timeframe:</span>
                  <span className="text-foreground">{timeframe}</span>
                  <span className="text-muted-foreground">Symbol:</span>
                  <span className="text-gold">XAUUSD (Gold)</span>
                </div>
              </div>
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
            <Button variant="gold" onClick={handleConnect}>
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
