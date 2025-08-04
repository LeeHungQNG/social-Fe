'use client';
import { useAppSelector } from '@/libs/redux/hook';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const UnauthorizedPage = () => {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  return null;
};
export default UnauthorizedPage;
