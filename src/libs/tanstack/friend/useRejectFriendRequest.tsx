import friendApi from '@/libs/apis/friend.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const useRejectFriendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: friendApi.rejectFriendRequest,
    onSuccess: () => {
      toast.success('Reject friend request successfully');
      queryClient.invalidateQueries({ queryKey: [friendApi.KEY] });
    },
  });
};
export default useRejectFriendRequest;
