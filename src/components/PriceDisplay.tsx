import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  symbol: string;
  price: number;
  previousPrice: number;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ symbol, price, previousPrice }) => {
  const isUp = price >= previousPrice;
  const change = price - previousPrice;
  const changePercent = ((change / previousPrice) * 100).toFixed(3);

  return (
    <div className="bg-card border-2 border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full gradient-gold flex items-center justify-center glow-gold">
            <span className="font-display font-bold text-primary-foreground">Au</span>
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">{symbol}</h3>
            <p className="text-muted-foreground text-sm">Gold Spot</p>
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium",
          isUp ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
        )}>
          {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          {isUp ? '+' : ''}{changePercent}%
        </div>
      </div>

      <div className={cn(
        "text-4xl font-display font-bold transition-all duration-300",
        isUp ? "text-success" : "text-destructive"
      )}>
        ${price.toFixed(2)}
      </div>

      <div className="flex items-center gap-4 mt-4 text-sm">
        <div>
          <span className="text-muted-foreground">24h High:</span>
          <span className="text-foreground ml-2 font-semibold">${(price * 1.005).toFixed(2)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">24h Low:</span>
          <span className="text-foreground ml-2 font-semibold">${(price * 0.995).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceDisplay;
