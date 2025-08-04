'use client';
import { useSocketContext } from '@/libs/context/socket.context';
import { useAppSelector } from '@/libs/redux/hook';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProtectedPage = () => {
  const router = useRouter();
  const { isAuthenticated, data } = useAppSelector((state) => state.user);

  const socket = useSocketContext();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/sign-in');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      socket?.emit('join_room', data._id);
    }
  }, [socket, isAuthenticated, data]);

  return null;
};
export default ProtectedPage;
