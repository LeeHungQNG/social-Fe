'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppSelector } from '../redux/hook';

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { isAuthenticated } = useAppSelector((state) => state.user);
  useEffect(() => {
    if (!isAuthenticated) return;

    const socketIo = io(process.env.NEXT_PUBLIC_BACKEND_URL);

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
      setSocket(null);
    };
  }, [isAuthenticated]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocketContext = () => {
  return useContext(SocketContext);
};
