import friendApi from '@/libs/apis/friend.api';
import userApi from '@/libs/apis/user.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const useCancelFriendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: friendApi.cancelFriendRequest,
    onSuccess: () => {
      toast.success('Cancel friend request successfully');
      queryClient.invalidateQueries({ queryKey: [userApi.KEY] });
    },
  });
};
export default useCancelFriendRequest;
