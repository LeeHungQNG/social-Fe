import friendApi from '@/libs/apis/friend.api';
import userApi from '@/libs/apis/user.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const useSendFriendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: friendApi.sendFriendRequest,
    onSuccess: () => {
      toast.success('Send friend request successfully');
      queryClient.invalidateQueries({ queryKey: [userApi.KEY] });
    },
  });
};
export default useSendFriendRequest;
