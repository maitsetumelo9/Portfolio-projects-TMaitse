import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MetaAPIAccount {
  _id: string;
  name: string;
  type: string;
  login: string;
  server: string;
  state: string;
  connectionStatus: string;
  platform: 'mt4' | 'mt5';
}

export interface AccountInfo {
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  leverage: number;
  currency: string;
}

export interface Position {
  id: string;
  symbol: string;
  type: 'POSITION_TYPE_BUY' | 'POSITION_TYPE_SELL';
  volume: number;
  openPrice: number;
  currentPrice: number;
  profit: number;
  time: string;
  stopLoss?: number;
  takeProfit?: number;
}

export interface SymbolPrice {
  symbol: string;
  bid: number;
  ask: number;
  time: string;
}

export const useMetaAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<MetaAPIAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  const callMetaAPI = useCallback(async (action: string, params: Record<string, unknown> = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Calling MetaAPI:', action, params);
      const { data, error: fnError } = await supabase.functions.invoke('metaapi', {
        body: { action, ...params },
      });

      if (fnError) {
        console.error('MetaAPI function error:', fnError);
        throw new Error(fnError.message);
      }

      if (data?.error) {
        console.error('MetaAPI response error:', data.error);
        throw new Error(data.error);
      }

      console.log('MetaAPI response:', data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAccounts = useCallback(async () => {
    try {
      const data = await callMetaAPI('getAccounts');
      setAccounts(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      console.error('Failed to fetch accounts:', err);
      return [];
    }
  }, [callMetaAPI]);

  const getAccountInfo = useCallback(async (accountId: string): Promise<AccountInfo | null> => {
    try {
      const data = await callMetaAPI('getAccountInfo', { accountId });
      return data;
    } catch (err) {
      console.error('Failed to get account info:', err);
      return null;
    }
  }, [callMetaAPI]);

  const getPositions = useCallback(async (accountId: string): Promise<Position[]> => {
    try {
      const data = await callMetaAPI('getPositions', { accountId });
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('Failed to get positions:', err);
      return [];
    }
  }, [callMetaAPI]);

  const getSymbolPrice = useCallback(async (accountId: string, symbol: string = 'XAUUSD'): Promise<SymbolPrice | null> => {
    try {
      const data = await callMetaAPI('getSymbolPrice', { accountId, symbol });
      return data;
    } catch (err) {
      console.error('Failed to get symbol price:', err);
      return null;
    }
  }, [callMetaAPI]);

  const openTrade = useCallback(async (
    accountId: string,
    params: {
      symbol?: string;
      actionType: 'ORDER_TYPE_BUY' | 'ORDER_TYPE_SELL';
      volume: number;
      stopLoss?: number;
      takeProfit?: number;
    }
  ) => {
    try {
      const data = await callMetaAPI('openTrade', { accountId, ...params });
      return data;
    } catch (err) {
      console.error('Failed to open trade:', err);
      throw err;
    }
  }, [callMetaAPI]);

  const closeTrade = useCallback(async (accountId: string, positionId: string) => {
    try {
      const data = await callMetaAPI('closeTrade', { accountId, positionId });
      return data;
    } catch (err) {
      console.error('Failed to close trade:', err);
      throw err;
    }
  }, [callMetaAPI]);

  const deployAccount = useCallback(async (accountId: string) => {
    try {
      const data = await callMetaAPI('deployAccount', { accountId });
      return data;
    } catch (err) {
      console.error('Failed to deploy account:', err);
      throw err;
    }
  }, [callMetaAPI]);

  return {
    loading,
    error,
    accounts,
    selectedAccount,
    setSelectedAccount,
    fetchAccounts,
    getAccountInfo,
    getPositions,
    getSymbolPrice,
    openTrade,
    closeTrade,
    deployAccount,
  };
};
