import friendApi from '@/libs/apis/friend.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: friendApi.acceptFriendRequest,
    onSuccess: () => {
      toast.success('Accept friend request successfully');
      queryClient.invalidateQueries({ queryKey: [friendApi.KEY] });
    },
  });
};
export default useAcceptFriendRequest;
