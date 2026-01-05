import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, auth-token',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, accountId, ...params } = await req.json();
    console.log(`MetaAPI action: ${action}, accountId: ${accountId}`);

    const metaApiAccessToken = (Deno.env.get('METAAPI_ACCESS_TOKEN') ?? '').trim();
    if (!metaApiAccessToken) {
      throw new Error('MetaAPI access token not configured');
    }

    const headers = {
      'auth-token': metaApiAccessToken,
      'Content-Type': 'application/json',
    };

    let result;

    switch (action) {
      case 'getAccounts':
        // List all provisioned MetaAPI accounts
        console.log('Fetching MetaAPI accounts...');
        const accountsRes = await fetch('https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts', {
          headers,
        });
        const accountsData = await accountsRes.json();
        console.log('Accounts response:', JSON.stringify(accountsData));
        result = accountsData;
        break;

      case 'getAccountInfo':
        // Get account information including balance
        if (!accountId) throw new Error('accountId is required');
        console.log(`Fetching account info for: ${accountId}`);
        
        const infoRes = await fetch(`https://mt-client-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts/${accountId}/account-information`, {
          headers,
        });
        const infoData = await infoRes.json();
        console.log('Account info response:', JSON.stringify(infoData));
        result = infoData;
        break;

      case 'getPositions':
        // Get open positions
        if (!accountId) throw new Error('accountId is required');
        console.log(`Fetching positions for: ${accountId}`);
        
        const positionsRes = await fetch(`https://mt-client-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts/${accountId}/positions`, {
          headers,
        });
        const positionsData = await positionsRes.json();
        console.log('Positions response:', JSON.stringify(positionsData));
        result = positionsData;
        break;

      case 'getSymbolPrice':
        // Get current price for a symbol
        if (!accountId) throw new Error('accountId is required');
        const symbol = params.symbol || 'XAUUSD';
        console.log(`Fetching price for ${symbol} on account: ${accountId}`);
        
        const priceRes = await fetch(`https://mt-client-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts/${accountId}/symbols/${symbol}/current-price`, {
          headers,
        });
        const priceData = await priceRes.json();
        console.log('Price response:', JSON.stringify(priceData));
        result = priceData;
        break;

      case 'openTrade':
        // Open a new trade
        if (!accountId) throw new Error('accountId is required');
        const { symbol: tradeSymbol, actionType, volume, stopLoss, takeProfit } = params;
        console.log(`Opening trade: ${actionType} ${volume} ${tradeSymbol}`);
        
        const tradeRes = await fetch(`https://mt-client-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts/${accountId}/trade`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            symbol: tradeSymbol || 'XAUUSD',
            actionType: actionType, // ORDER_TYPE_BUY or ORDER_TYPE_SELL
            volume: volume || 0.01,
            stopLoss,
            takeProfit,
          }),
        });
        const tradeData = await tradeRes.json();
        console.log('Trade response:', JSON.stringify(tradeData));
        result = tradeData;
        break;

      case 'closeTrade':
        // Close a position
        if (!accountId) throw new Error('accountId is required');
        const { positionId } = params;
        if (!positionId) throw new Error('positionId is required');
        console.log(`Closing position: ${positionId}`);
        
        const closeRes = await fetch(`https://mt-client-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts/${accountId}/trade`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            actionType: 'POSITION_CLOSE_ID',
            positionId,
          }),
        });
        const closeData = await closeRes.json();
        console.log('Close response:', JSON.stringify(closeData));
        result = closeData;
        break;

      case 'getHistory':
        // Get trade history
        if (!accountId) throw new Error('accountId is required');
        const { startTime, endTime } = params;
        console.log(`Fetching history for account: ${accountId}`);
        
        const historyRes = await fetch(`https://mt-client-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts/${accountId}/history-deals/time/${startTime || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}/${endTime || new Date().toISOString()}`, {
          headers,
        });
        const historyData = await historyRes.json();
        console.log('History response:', JSON.stringify(historyData));
        result = historyData;
        break;

      case 'deployAccount':
        // Deploy/undeploy an account
        if (!accountId) throw new Error('accountId is required');
        console.log(`Deploying account: ${accountId}`);
        
        const deployRes = await fetch(`https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts/${accountId}/deploy`, {
          method: 'POST',
          headers,
        });
        
        if (deployRes.status === 204) {
          result = { success: true, message: 'Account deployment started' };
        } else {
          const deployData = await deployRes.json();
          result = deployData;
        }
        console.log('Deploy response:', JSON.stringify(result));
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('MetaAPI error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
