import { useState, useEffect, useCallback } from 'react';

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

interface TradingState {
  isAutoTrading: boolean;
  currentPrice: number;
  previousPrice: number;
  balance: number;
  equity: number;
  activeTrades: Trade[];
  tradeHistory: Trade[];
  totalProfit: number;
  winRate: number;
  totalTrades: number;
}

const INITIAL_BALANCE = 10000;
const BASE_GOLD_PRICE = 2650;
const TAKE_PROFIT_PIPS = 50; // $50 per lot
const STOP_LOSS_PIPS = 30;
const LOT_SIZE = 0.1;

export const useTradingBot = () => {
  const [state, setState] = useState<TradingState>({
    isAutoTrading: false,
    currentPrice: BASE_GOLD_PRICE,
    previousPrice: BASE_GOLD_PRICE,
    balance: INITIAL_BALANCE,
    equity: INITIAL_BALANCE,
    activeTrades: [],
    tradeHistory: [],
    totalProfit: 0,
    winRate: 0,
    totalTrades: 0,
  });

  // Simulate price movement
  useEffect(() => {
    const priceInterval = setInterval(() => {
      setState(prev => {
        const change = (Math.random() - 0.48) * 2; // Slight upward bias
        const newPrice = Math.max(2500, Math.min(2800, prev.currentPrice + change));
        
        // Update active trades profit
        const updatedTrades = prev.activeTrades.map(trade => {
          const priceDiff = trade.type === 'BUY' 
            ? newPrice - trade.openPrice 
            : trade.openPrice - newPrice;
          return {
            ...trade,
            currentPrice: newPrice,
            profit: priceDiff * trade.lots * 100, // Each pip = $1 per 0.01 lot
          };
        });

        const totalFloatingProfit = updatedTrades.reduce((sum, t) => sum + t.profit, 0);

        return {
          ...prev,
          previousPrice: prev.currentPrice,
          currentPrice: newPrice,
          activeTrades: updatedTrades,
          equity: prev.balance + totalFloatingProfit,
        };
      });
    }, 1000);

    return () => clearInterval(priceInterval);
  }, []);

  // Auto-trading logic
  useEffect(() => {
    if (!state.isAutoTrading) return;

    const tradeInterval = setInterval(() => {
      setState(prev => {
        let newState = { ...prev };
        
        // Check for take profit / stop loss on existing trades
        const tradesToClose: Trade[] = [];
        const remainingTrades: Trade[] = [];

        prev.activeTrades.forEach(trade => {
          const shouldTakeProfit = trade.profit >= TAKE_PROFIT_PIPS * trade.lots * 100;
          const shouldStopLoss = trade.profit <= -STOP_LOSS_PIPS * trade.lots * 100;

          if (shouldTakeProfit || shouldStopLoss) {
            tradesToClose.push({
              ...trade,
              status: 'CLOSED',
              closePrice: prev.currentPrice,
              closeTime: new Date(),
            });
          } else {
            remainingTrades.push(trade);
          }
        });

        if (tradesToClose.length > 0) {
          const closedProfit = tradesToClose.reduce((sum, t) => sum + t.profit, 0);
          newState.balance += closedProfit;
          newState.tradeHistory = [...tradesToClose, ...prev.tradeHistory];
          newState.activeTrades = remainingTrades;
          
          const allTrades = [...tradesToClose, ...prev.tradeHistory];
          const wins = allTrades.filter(t => t.profit > 0).length;
          newState.winRate = allTrades.length > 0 ? (wins / allTrades.length) * 100 : 0;
          newState.totalTrades = allTrades.length;
          newState.totalProfit = allTrades.reduce((sum, t) => sum + t.profit, 0);
        }

        // Open new trade if no active trades and conditions met
        if (newState.activeTrades.length < 3 && Math.random() > 0.7) {
          const trend = prev.currentPrice > prev.previousPrice;
          const tradeType = trend ? 'BUY' : 'SELL';
          
          const newTrade: Trade = {
            id: Date.now().toString(),
            type: tradeType,
            openPrice: prev.currentPrice,
            currentPrice: prev.currentPrice,
            lots: LOT_SIZE,
            profit: 0,
            openTime: new Date(),
            status: 'OPEN',
          };

          newState.activeTrades = [...newState.activeTrades, newTrade];
        }

        const totalFloatingProfit = newState.activeTrades.reduce((sum, t) => sum + t.profit, 0);
        newState.equity = newState.balance + totalFloatingProfit;

        return newState;
      });
    }, 3000);

    return () => clearInterval(tradeInterval);
  }, [state.isAutoTrading]);

  const toggleAutoTrading = useCallback(() => {
    setState(prev => ({ ...prev, isAutoTrading: !prev.isAutoTrading }));
  }, []);

  const closeAllTrades = useCallback(() => {
    setState(prev => {
      const closedTrades = prev.activeTrades.map(trade => ({
        ...trade,
        status: 'CLOSED' as const,
        closePrice: prev.currentPrice,
        closeTime: new Date(),
      }));

      const closedProfit = closedTrades.reduce((sum, t) => sum + t.profit, 0);
      const allTrades = [...closedTrades, ...prev.tradeHistory];
      const wins = allTrades.filter(t => t.profit > 0).length;

      return {
        ...prev,
        balance: prev.balance + closedProfit,
        activeTrades: [],
        tradeHistory: [...closedTrades, ...prev.tradeHistory],
        equity: prev.balance + closedProfit,
        winRate: allTrades.length > 0 ? (wins / allTrades.length) * 100 : 0,
        totalTrades: allTrades.length,
        totalProfit: allTrades.reduce((sum, t) => sum + t.profit, 0),
      };
    });
  }, []);

  const resetAccount = useCallback(() => {
    setState({
      isAutoTrading: false,
      currentPrice: BASE_GOLD_PRICE,
      previousPrice: BASE_GOLD_PRICE,
      balance: INITIAL_BALANCE,
      equity: INITIAL_BALANCE,
      activeTrades: [],
      tradeHistory: [],
      totalProfit: 0,
      winRate: 0,
      totalTrades: 0,
    });
  }, []);

  return {
    ...state,
    toggleAutoTrading,
    closeAllTrades,
    resetAccount,
  };
};
