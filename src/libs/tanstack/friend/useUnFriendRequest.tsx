import friendApi from '@/libs/apis/friend.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const useUnFriendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: friendApi.unFriend,
    onSuccess: () => {
      toast.success('Unfriend successfully');
      queryClient.invalidateQueries({ queryKey: [friendApi.FRIEND_KEY] });
    },
  });
};
export default useUnFriendRequest;
