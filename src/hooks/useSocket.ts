import { useCallback, useEffect, useRef } from 'react';

import { getSocket, connectSocket, disconnectSocket } from '@/services/socket';

export const useSocket = () => {
  const socket = getSocket();
  // Используем useRef для хранения активных слушателей
  const listeners = useRef(new Map());

  useEffect(() => {
    // Подключаемся к сокету при монтировании (только на клиенте)
    if (typeof window !== 'undefined') {
      connectSocket();
    }

    // Очистка всех слушателей при размонтировании
    return () => {
      listeners.current.forEach((callback, event) => {
        socket.off(event, callback);
      });
      listeners.current.clear();
      // Не отключаем сокет полностью, так как он может использоваться другими компонентами
    };
  }, []); 

  const emit = useCallback((event: string, data: any) => {
    if (socket.connected) {
      socket.emit(event, data);
    } else {
      console.warn('Socket not connected, attempting to connect...');
      connectSocket();
      socket.once('connect', () => {
        socket.emit(event, data);
      });
    }
  }, [socket]);

  const on = useCallback((event: string, callback: any) => {
    // Сохраняем слушатель
    listeners.current.set(event, callback);
    socket.on(event, callback);
  }, [socket]);

  const off = useCallback((event: string, callback?: any) => {
    // Удаляем слушатель
    const savedCallback = callback || listeners.current.get(event);
    if (savedCallback) {
      socket.off(event, savedCallback);
      listeners.current.delete(event);
    }
  }, [socket]);

  return { socket, emit, on, off };
};
