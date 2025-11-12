import { useState, useEffect, useRef, useCallback } from 'react';

const useWebSocket = (url) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        console.log('WebSocket conectado');
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttemptsRef.current = 0;
        
        // Enviar ping inicial
        ws.send(JSON.stringify({ type: 'ping' }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
        } catch (error) {
          console.error('Erro ao parsear mensagem WebSocket:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket desconectado:', event.code, event.reason);
        setIsConnected(false);
        setSocket(null);
        
        // Tentar reconectar se não foi fechamento intencional
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          console.log(`Tentativa de reconexão ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectDelay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setConnectionError('Máximo de tentativas de reconexão atingido');
        }
      };

      ws.onerror = (error) => {
        console.error('Erro no WebSocket:', error);
        setConnectionError('Erro de conexão WebSocket');
      };

      setSocket(ws);
    } catch (error) {
      console.error('Erro ao criar WebSocket:', error);
      setConnectionError('Erro ao criar conexão WebSocket');
    }
  }, [url]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (socket) {
      socket.close(1000, 'Desconexão intencional');
    }
  }, [socket]);

  const sendMessage = useCallback((message) => {
    if (socket && isConnected) {
      try {
        socket.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        return false;
      }
    }
    return false;
  }, [socket, isConnected]);

  const subscribeToUpdates = useCallback((type, data = {}) => {
    return sendMessage({ type, ...data });
  }, [sendMessage]);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    socket,
    isConnected,
    lastMessage,
    connectionError,
    sendMessage,
    subscribeToUpdates,
    connect,
    disconnect,
    reconnectAttempts: reconnectAttemptsRef.current
  };
};

export default useWebSocket;

