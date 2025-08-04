import userApi from '@/libs/apis/user.api';
import { useSocketContext } from '@/libs/context/socket.context';
import { useAppSelector } from '@/libs/redux/hook';
import { IFriendRequest } from '@/libs/types/friend.type';
import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import { useEffect } from 'react';

const useGetAllUser = () => {
  const user = useAppSelector((state) => state.user.data);

  const socket = useSocketContext();
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [userApi.KEY],
    queryFn: ({ pageParam }: { pageParam: string | null }) => userApi.getAll(pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.cursor,
  });

  useEffect(() => {
    const handleAcceptFriendRequest = (data: IFriendRequest, whoEmitEventId: string) => {
      queryClient.setQueryData<InfiniteData<IBackendResponseWithPagination<IUser[]>>>([userApi.KEY], (oldData) =>
        produce(oldData, (draft) => {
          if (!draft) return;

          draft.pages.forEach((page) => {
            page.data.forEach((user) => {
              if (user._id === whoEmitEventId) {
                user.isFriend = true;
                user.isSentFriendRequest = false;
              }
            });
          });
        })
      );
    };

    const handleUnFriend = (unfriendById: string) => {
      queryClient.setQueryData<InfiniteData<IBackendResponseWithPagination<IUser[]>>>([userApi.KEY], (oldData) =>
        produce(oldData, (draft) => {
          if (!draft) return;

          draft.pages.forEach((page) => {
            page.data.forEach((user) => {
              if (user._id === unfriendById) {
                user.isFriend = false;
                user.isSentFriendRequest = false;
              }
            });
          });
        })
      );
    };
    const handleRejectFriendRequest = (_: unknown, whoEmitEventId: string) => {
      queryClient.setQueryData<InfiniteData<IBackendResponseWithPagination<IUser[]>>>([userApi.KEY], (oldData) =>
        produce(oldData, (draft) => {
          if (!draft) return;

          draft.pages.forEach((page) => {
            page.data.forEach((user) => {
              if (user._id === whoEmitEventId) {
                user.isFriend = false;
                user.isSentFriendRequest = false;
              }
            });
          });
        })
      );
    };

    socket?.on('accept_friend_request', handleAcceptFriendRequest);
    socket?.on('un_friend', handleUnFriend);
    socket?.on('reject_friend_request', handleRejectFriendRequest);

    return () => {
      socket?.off('accept_friend_request', handleAcceptFriendRequest);
      socket?.off('un_friend', handleUnFriend);
      socket?.off('reject_friend_request', handleRejectFriendRequest);
    };
  }, [queryClient, socket]);

  // const users = data?.pages?.flatMap((page) => page.data) || [];
  const users = data?.pages?.map((page) => page.data).flat() || [];

  return { data: users.filter((u) => u._id !== user._id), fetchNextPage, hasNextPage, isFetching, isFetchingNextPage };
};
export default useGetAllUser;
