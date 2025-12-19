import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpCircle, ArrowDownCircle, Clock } from 'lucide-react';

interface Trade {
  id: string;
  type: 'BUY' | 'SELL';
  openPrice: number;
  currentPrice: number;
  lots: number;
  profit: number;
  openTime: Date;
  status: 'OPEN' | 'CLOSED';
  closePrice?: number;
  closeTime?: Date;
}

interface TradesTableProps {
  trades: Trade[];
  title: string;
  showClosePrice?: boolean;
}

const TradesTable: React.FC<TradesTableProps> = ({ trades, title, showClosePrice }) => {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="bg-card border-2 border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
      </div>

      {trades.length === 0 ? (
        <div className="p-8 text-center">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">No trades yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Lots</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Open Price</th>
                {showClosePrice && (
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Close Price</th>
                )}
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Time</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {trades.slice(0, 10).map((trade) => (
                <tr key={trade.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold",
                      trade.type === 'BUY' 
                        ? "bg-success/20 text-success" 
                        : "bg-destructive/20 text-destructive"
                    )}>
                      {trade.type === 'BUY' ? (
                        <ArrowUpCircle className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDownCircle className="h-3.5 w-3.5" />
                      )}
                      {trade.type}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground font-medium">{trade.lots.toFixed(2)}</td>
                  <td className="px-4 py-3 text-foreground">${trade.openPrice.toFixed(2)}</td>
                  {showClosePrice && (
                    <td className="px-4 py-3 text-foreground">${trade.closePrice?.toFixed(2) || '-'}</td>
                  )}
                  <td className="px-4 py-3 text-muted-foreground text-sm">
                    {formatTime(showClosePrice ? trade.closeTime! : trade.openTime)}
                  </td>
                  <td className={cn(
                    "px-4 py-3 text-right font-display font-bold",
                    trade.profit >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TradesTable;
