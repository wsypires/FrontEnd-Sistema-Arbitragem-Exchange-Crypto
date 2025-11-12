import React, { createContext, useContext, useEffect, useState } from 'react';
import useWebSocket from '../hooks/useWebSocket';

const WebSocketContext = createContext();

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext deve ser usado dentro de WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [monitorStatus, setMonitorStatus] = useState({ is_running: false });
  const [prices, setPrices] = useState({});
  const [statistics, setStatistics] = useState({});
  
  // Conectar ao WebSocket
  const wsUrl = `ws://localhost:8000/api/v1/ws/ws`;
  const {
    isConnected,
    lastMessage,
    connectionError,
    sendMessage,
    subscribeToUpdates
  } = useWebSocket(wsUrl);

  // Processar mensagens recebidas
  useEffect(() => {
    if (!lastMessage) return;

    const { type, data } = lastMessage;

    switch (type) {
      case 'pong':
        // Resposta ao ping - manter conexão viva
        break;

      case 'opportunity_detected':
      case 'new_opportunity':
        // Nova oportunidade detectada
        setOpportunities(prev => {
          const exists = prev.find(opp => opp.id === data.id);
          if (exists) {
            return prev.map(opp => opp.id === data.id ? data : opp);
          }
          return [data, ...prev].slice(0, 50); // Manter apenas 50 mais recentes
        });
        
        // Adicionar aos alertas
        setAlerts(prev => [{
          id: Date.now(),
          type: 'opportunity',
          message: `Nova oportunidade: ${data.trading_pair} - Spread ${data.spread_percentage.toFixed(2)}%`,
          data: data,
          timestamp: new Date().toISOString(),
          level: data.spread_percentage >= 1.0 ? 'high' : data.spread_percentage >= 0.5 ? 'medium' : 'low'
        }, ...prev].slice(0, 100));
        break;

      case 'opportunity_executed':
      case 'execution_result':
        // Oportunidade executada
        setOpportunities(prev => 
          prev.map(opp => 
            opp.id === data.opportunity_id 
              ? { ...opp, status: data.success ? 'executed' : 'failed' }
              : opp
          )
        );
        
        setAlerts(prev => [{
          id: Date.now(),
          type: 'execution',
          message: data.message,
          data: data,
          timestamp: new Date().toISOString(),
          level: data.success ? 'success' : 'error'
        }, ...prev].slice(0, 100));
        break;

      case 'monitor_status':
      case 'monitor_status_update':
        // Status do monitor
        setMonitorStatus(data);
        break;

      case 'price_update':
        // Atualização de preços
        setPrices(prev => ({
          ...prev,
          ...data
        }));
        break;

      case 'monitor_statistics':
        // Estatísticas do monitor
        setStatistics(data);
        break;

      case 'system_alert':
        // Alerta do sistema
        setAlerts(prev => [{
          id: Date.now(),
          type: 'system',
          message: data.message,
          data: data,
          timestamp: new Date().toISOString(),
          level: data.level || 'info'
        }, ...prev].slice(0, 100));
        break;

      case 'active_alerts':
        // Alertas ativos (dados iniciais)
        if (data && typeof data === 'object') {
          const alertsArray = Object.values(data).map(alert => ({
            ...alert,
            id: alert.data?.id || Date.now()
          }));
          setAlerts(prev => [...alertsArray, ...prev].slice(0, 100));
        }
        break;

      case 'heartbeat':
        // Heartbeat - manter conexão viva
        console.log('Heartbeat recebido:', data);
        break;

      default:
        console.log('Tipo de mensagem não reconhecido:', type, data);
    }
  }, [lastMessage]);

  // Funções para interagir com o WebSocket
  const subscribeToPrices = (exchanges, pairs = ['USDT/BRL']) => {
    return subscribeToUpdates('subscribe_prices', { exchanges, pairs });
  };

  const requestOpportunities = () => {
    return subscribeToUpdates('get_opportunities');
  };

  const requestStatistics = () => {
    return subscribeToUpdates('get_monitor_stats');
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  const removeAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  // Enviar ping periodicamente para manter conexão
  useEffect(() => {
    if (!isConnected) return;

    const pingInterval = setInterval(() => {
      sendMessage({ type: 'ping' });
    }, 30000); // Ping a cada 30 segundos

    return () => clearInterval(pingInterval);
  }, [isConnected, sendMessage]);

  // Solicitar dados iniciais quando conectar
  useEffect(() => {
    if (isConnected) {
      requestOpportunities();
      requestStatistics();
      
      // Inscrever-se para atualizações de preços das exchanges principais
      subscribeToPrices(['binance', 'coinbase', 'kraken']);
    }
  }, [isConnected]);

  const value = {
    // Estado da conexão
    isConnected,
    connectionError,
    
    // Dados em tempo real
    opportunities,
    alerts,
    monitorStatus,
    prices,
    statistics,
    
    // Funções
    sendMessage,
    subscribeToPrices,
    requestOpportunities,
    requestStatistics,
    clearAlerts,
    removeAlert,
    
    // Utilitários
    setOpportunities,
    setAlerts,
    setMonitorStatus,
    setPrices,
    setStatistics
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

