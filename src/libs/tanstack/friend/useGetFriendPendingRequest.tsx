import friendApi from '@/libs/apis/friend.api';
import { useSocketContext } from '@/libs/context/socket.context';
import { IFriendRequest } from '@/libs/types/friend.type';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import { useEffect } from 'react';

const useGetFriendPendingRequest = () => {
  const socket = useSocketContext();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [friendApi.KEY],
    queryFn: friendApi.getPendingFriendRequest,
  });

  useEffect(() => {
    const handleSendFriendRequest = (data: IFriendRequest) => {
      queryClient.setQueryData<IBackendResponse<IFriendRequest[]>>([friendApi.KEY], (oldData) =>
        produce(oldData, (draft) => {
          if (!draft) return;
          draft.data.push(data);
        })
      );
    };

    const handleCancelFriendRequest = ({ friendRequestId }: { friendRequestId: string }) => {
      queryClient.setQueryData<IBackendResponse<IFriendRequest[]>>([friendApi.KEY], (oldData) =>
        produce(oldData, (draft) => {
          if (!draft) return;
          draft.data = draft.data.filter((req) => req._id !== friendRequestId);
        })
      );
    };

    socket?.on('send_friend_request', handleSendFriendRequest);
    socket?.on('cancel_friend_request', handleCancelFriendRequest);
    return () => {
      socket?.off('send_friend_request', handleSendFriendRequest);
      socket?.off('cancel_friend_request', handleCancelFriendRequest);
    };
  }, [socket, queryClient]);

  return {
    data: data?.data || ([] as IFriendRequest[]),
    isLoading,
  };
};
export default useGetFriendPendingRequest;
