import { useState, useEffect, useCallback, useRef } from 'react';
import { useMetaAPI, Position, SymbolPrice } from './useMetaAPI';
import { toast } from 'sonner';

export interface BrokerConfig {
  broker: 'MT4' | 'MT5';
  lotSize: number;
  timeframe: string;
  accountId: string;
  accountName?: string;
}

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
  positionId?: string;
}

interface TradingState {
  isAutoTrading: boolean;
  isConfigured: boolean;
  isConnected: boolean;
  brokerConfig: BrokerConfig | null;
  currentPrice: number;
  previousPrice: number;
  balance: number;
  equity: number;
  activeTrades: Trade[];
  tradeHistory: Trade[];
  totalProfit: number;
  winRate: number;
  totalTrades: number;
  lastError: string | null;
}

const INITIAL_BALANCE = 0;
const BASE_GOLD_PRICE = 2650;
const TAKE_PROFIT_PIPS = 50;
const STOP_LOSS_PIPS = 30;

export const useTradingBot = () => {
  const [state, setState] = useState<TradingState>({
    isAutoTrading: false,
    isConfigured: false,
    isConnected: false,
    brokerConfig: null,
    currentPrice: BASE_GOLD_PRICE,
    previousPrice: BASE_GOLD_PRICE,
    balance: INITIAL_BALANCE,
    equity: INITIAL_BALANCE,
    activeTrades: [],
    tradeHistory: [],
    totalProfit: 0,
    winRate: 0,
    totalTrades: 0,
    lastError: null,
  });

  const { 
    getAccountInfo, 
    getPositions, 
    getSymbolPrice, 
    openTrade, 
    closeTrade,
    loading: apiLoading 
  } = useMetaAPI();

  const priceRef = useRef<number>(BASE_GOLD_PRICE);
  const autoTradeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch real-time data from MT5
  const fetchMT5Data = useCallback(async () => {
    if (!state.brokerConfig?.accountId) return;
    
    try {
      const accountId = state.brokerConfig.accountId;
      
      // Fetch all data in parallel
      const [accountInfo, positions, priceData] = await Promise.all([
        getAccountInfo(accountId),
        getPositions(accountId),
        getSymbolPrice(accountId, 'XAUUSD'),
      ]);

      setState(prev => {
        const newPrice = priceData?.bid || prev.currentPrice;
        priceRef.current = newPrice;

        // Map positions to trades
        const activeTrades: Trade[] = (positions || []).map((pos: Position) => ({
          id: pos.id,
          type: pos.type === 'POSITION_TYPE_BUY' ? 'BUY' as const : 'SELL' as const,
          openPrice: pos.openPrice,
          currentPrice: pos.currentPrice || newPrice,
          lots: pos.volume,
          profit: pos.profit,
          openTime: new Date(pos.time),
          status: 'OPEN' as const,
          positionId: pos.id,
        }));

        return {
          ...prev,
          isConnected: true,
          previousPrice: prev.currentPrice,
          currentPrice: newPrice,
          balance: accountInfo?.balance || prev.balance,
          equity: accountInfo?.equity || prev.equity,
          activeTrades,
          lastError: null,
        };
      });
    } catch (error) {
      console.error('Error fetching MT5 data:', error);
      setState(prev => ({
        ...prev,
        lastError: error instanceof Error ? error.message : 'Connection error',
      }));
    }
  }, [state.brokerConfig?.accountId, getAccountInfo, getPositions, getSymbolPrice]);

  // Poll for real-time updates when configured
  useEffect(() => {
    if (!state.isConfigured || !state.brokerConfig?.accountId) return;

    // Initial fetch
    fetchMT5Data();

    // Poll every 2 seconds
    const pollInterval = setInterval(fetchMT5Data, 2000);

    return () => clearInterval(pollInterval);
  }, [state.isConfigured, state.brokerConfig?.accountId, fetchMT5Data]);

  // Auto-trading logic
  useEffect(() => {
    if (!state.isAutoTrading || !state.brokerConfig?.accountId) {
      if (autoTradeIntervalRef.current) {
        clearInterval(autoTradeIntervalRef.current);
        autoTradeIntervalRef.current = null;
      }
      return;
    }

    const runAutoTrade = async () => {
      const accountId = state.brokerConfig?.accountId;
      if (!accountId) return;

      try {
        // Check for take profit / stop loss on existing trades
        for (const trade of state.activeTrades) {
          if (!trade.positionId) continue;

          const shouldTakeProfit = trade.profit >= TAKE_PROFIT_PIPS * trade.lots * 100;
          const shouldStopLoss = trade.profit <= -STOP_LOSS_PIPS * trade.lots * 100;

          if (shouldTakeProfit || shouldStopLoss) {
            console.log(`Closing trade ${trade.id}: ${shouldTakeProfit ? 'Take Profit' : 'Stop Loss'}`);
            try {
              await closeTrade(accountId, trade.positionId);
              toast.success(`Trade closed: ${shouldTakeProfit ? 'Take Profit' : 'Stop Loss'} $${trade.profit.toFixed(2)}`);
              
              // Add to history
              setState(prev => {
                const closedTrade = { ...trade, status: 'CLOSED' as const, closePrice: priceRef.current, closeTime: new Date() };
                const allTrades = [closedTrade, ...prev.tradeHistory];
                const wins = allTrades.filter(t => t.profit > 0).length;
                
                return {
                  ...prev,
                  tradeHistory: allTrades,
                  winRate: allTrades.length > 0 ? (wins / allTrades.length) * 100 : 0,
                  totalTrades: allTrades.length,
                  totalProfit: allTrades.reduce((sum, t) => sum + t.profit, 0),
                };
              });
            } catch (err) {
              console.error('Failed to close trade:', err);
            }
          }
        }

        // Open new trade if conditions met
        if (state.activeTrades.length < 3 && Math.random() > 0.85) {
          const trend = priceRef.current > state.previousPrice;
          const actionType = trend ? 'ORDER_TYPE_BUY' : 'ORDER_TYPE_SELL';
          const lotSize = state.brokerConfig?.lotSize || 0.01;

          console.log(`Opening ${actionType} trade with ${lotSize} lots`);
          try {
            await openTrade(accountId, {
              symbol: 'XAUUSD',
              actionType,
              volume: lotSize,
            });
            toast.success(`Opened ${trend ? 'BUY' : 'SELL'} trade: ${lotSize} lots`);
          } catch (err) {
            console.error('Failed to open trade:', err);
            toast.error('Failed to open trade');
          }
        }
      } catch (error) {
        console.error('Auto-trade error:', error);
      }
    };

    // Run auto-trade every 5 seconds
    autoTradeIntervalRef.current = setInterval(runAutoTrade, 5000);

    return () => {
      if (autoTradeIntervalRef.current) {
        clearInterval(autoTradeIntervalRef.current);
        autoTradeIntervalRef.current = null;
      }
    };
  }, [state.isAutoTrading, state.brokerConfig?.accountId, state.activeTrades, state.previousPrice, state.brokerConfig?.lotSize, openTrade, closeTrade]);

  const toggleAutoTrading = useCallback(() => {
    setState(prev => {
      const newState = !prev.isAutoTrading;
      if (newState) {
        toast.success('Auto-trading started');
      } else {
        toast.info('Auto-trading stopped');
      }
      return { ...prev, isAutoTrading: newState };
    });
  }, []);

  const closeAllTrades = useCallback(async () => {
    if (!state.brokerConfig?.accountId) return;

    const accountId = state.brokerConfig.accountId;
    toast.info('Closing all trades...');

    for (const trade of state.activeTrades) {
      if (trade.positionId) {
        try {
          await closeTrade(accountId, trade.positionId);
        } catch (err) {
          console.error('Failed to close trade:', trade.id, err);
        }
      }
    }

    toast.success('All trades closed');
    
    // Update history
    setState(prev => {
      const closedTrades = prev.activeTrades.map(trade => ({
        ...trade,
        status: 'CLOSED' as const,
        closePrice: prev.currentPrice,
        closeTime: new Date(),
      }));

      const allTrades = [...closedTrades, ...prev.tradeHistory];
      const wins = allTrades.filter(t => t.profit > 0).length;

      return {
        ...prev,
        tradeHistory: allTrades,
        winRate: allTrades.length > 0 ? (wins / allTrades.length) * 100 : 0,
        totalTrades: allTrades.length,
        totalProfit: allTrades.reduce((sum, t) => sum + t.profit, 0),
      };
    });
  }, [state.brokerConfig?.accountId, state.activeTrades, closeTrade]);

  const resetAccount = useCallback(() => {
    setState(prev => ({
      ...prev,
      isAutoTrading: false,
      tradeHistory: [],
      totalProfit: 0,
      winRate: 0,
      totalTrades: 0,
    }));
    toast.info('Local trade history cleared');
  }, []);

  const configureBroker = useCallback((config: BrokerConfig) => {
    setState(prev => ({
      ...prev,
      isConfigured: true,
      brokerConfig: config,
    }));
    toast.success(`Connected to ${config.accountName || config.accountId}`);
  }, []);

  return {
    ...state,
    apiLoading,
    toggleAutoTrading,
    closeAllTrades,
    resetAccount,
    configureBroker,
  };
};
