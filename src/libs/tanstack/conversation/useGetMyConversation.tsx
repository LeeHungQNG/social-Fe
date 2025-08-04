import conversationApi from '@/libs/apis/conversation.api';
import { useSocketContext } from '@/libs/context/socket.context';
import { IConversation } from '@/libs/types/conversation.type';
import { IMessage } from '@/libs/types/message.type';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import { useEffect } from 'react';

const useGetMyConversation = () => {
  const socket = useSocketContext();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: [conversationApi.KEY],
    queryFn: conversationApi.getAll,
  });

  useEffect(() => {
    const handleNewMessage = (data: IMessage) => {
      queryClient.setQueryData<IBackendResponse<IConversation[]>>([conversationApi.KEY], (oldData) =>
        produce(oldData, (draft) => {
          if (!draft) return;

          const foundConversation = draft.data.find((conversation) => conversation._id === data.conversation);
          if (foundConversation) {
            foundConversation.lastMessage = data.text;
            foundConversation.isLastMessageSeen = false;
            foundConversation.lastMessageAt = data.createdAt;
            foundConversation.senderLastMessage = data.senderName;
            foundConversation.senderIdLastMessage = data.senderId;
          }
        })
      );
    };
    
    socket?.on('new_message', handleNewMessage);

    return () => {
      socket?.off('new_message', handleNewMessage);
    };
  }, []);

  return {
    data: data?.data ?? ([] as IConversation[]),
    isLoading,
  };
};
export default useGetMyConversation;
