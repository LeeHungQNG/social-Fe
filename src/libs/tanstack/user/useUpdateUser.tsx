import userApi from '@/libs/apis/user.api';
import { IUserUpdateInput } from '@/libs/types/user.type';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export default function useUpdateUser() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUserUpdateInput }) => userApi.update(id, data),
    onSuccess: () => {
      toast.success('Update user successfully');
    },
  });
}
