import friendApi from '@/libs/apis/friend.api';
import { useSocketContext } from '@/libs/context/socket.context';
import { IFriendRequest } from '@/libs/types/friend.type';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import { useEffect } from 'react';

const useGetMyFriend = () => {
  const socket = useSocketContext();

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [friendApi.FRIEND_KEY],
    queryFn: friendApi.getMyFriend,
  });

  useEffect(() => {
    const handleAcceptFriendRequest = (data: IFriendRequest) => {
      queryClient.setQueryData<IBackendResponse<IFriendRequest[]>>([friendApi.FRIEND_KEY], (oldData) =>
        produce(oldData, (draft) => {
          if (!draft) return;

          draft.data.push(data);
        })
      );
    };

    const handleUnFriend = (unfriendById: string) => {
      queryClient.setQueryData<IBackendResponse<IFriendRequest[]>>([friendApi.FRIEND_KEY], (oldData) =>
        produce(oldData, (draft) => {
          if (!draft) return;

          draft.data = draft.data.filter((friend) => friend._id !== unfriendById);
        })
      );
    };

    socket?.on('accept_friend_request', handleAcceptFriendRequest);
    socket?.on('un_friend', handleUnFriend);

    return () => {
      socket?.off('accept_friend_request', handleAcceptFriendRequest);
      socket?.off('un_friend', handleUnFriend);
    };
  }, []);

  return {
    data: data?.data || ([] as IFriendRequest[]),
    isLoading,
  };
};
export default useGetMyFriend;
