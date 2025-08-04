import messageApi from '@/libs/apis/message.api';
import { useSocketContext } from '@/libs/context/socket.context';
import { IMessage } from '@/libs/types/message.type';
import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import { useEffect } from 'react';

const useGetAllMessage = (conversationId: string) => {
  const socket = useSocketContext();
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [messageApi.KEY, conversationId],
    queryFn: ({ pageParam }: { pageParam: string | null }) => messageApi.getAll(conversationId, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.cursor,
  });

  const messages = data?.pages?.flatMap((page) => page.data).reverse() || [];

  useEffect(() => {
    const handleNewMessage = (data: IMessage) => {
      queryClient.setQueryData<InfiniteData<IBackendResponseWithPagination<IMessage[]>>>([messageApi.KEY, conversationId], (oldData) =>
        produce(oldData, (draft) => {
          if (!draft) return;

          // struct of draft
          // draft.page = [
          //   {
          //     cursor: 'timeStamp',
          //     data: [msg1, msg2, msg3],
          //   },
          //   {
          //     cursor: null,
          //     data: [newMsg, msg1, msg2, msg3],
          //   },
          // ];

          // push new data realtime in first page in data ==> because data is reverse
          const lastPage = draft.pages[draft.pages.length - 1];
          lastPage.data.unshift(data);
        })
      );
    };

    const handleRemoveMessage = (messageId: string) => {
      queryClient.setQueryData<InfiniteData<IBackendResponseWithPagination<IMessage[]>>>([messageApi.KEY, conversationId], (oldData) =>
        produce(oldData, (draft) => {
          if (!draft) return;

          draft.pages.forEach((page) => {
            const message = page.data.find((msg) => msg._id === messageId);
            if (message) {
              message.isDelete = true;
            }
          });
        })
      );
    };

    socket?.on('new_message', handleNewMessage);
    socket?.on('remove_message', handleRemoveMessage);

    return () => {
      socket?.off('new_message', handleNewMessage);
      socket?.off('remove_message', handleRemoveMessage);
    };
  }, [socket, queryClient]);

  return {
    data: messages,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  };
};
export default useGetAllMessage;
