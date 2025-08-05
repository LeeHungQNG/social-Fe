// src/libs/tanstack/user/useGetUserById.ts
import { useQuery } from '@tanstack/react-query';
import userApi from '@/libs/apis/user.api';

const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userApi.getOne(id).then((res) => res.data),
    enabled: !!id,
  });
};

export default useGetUserById;
