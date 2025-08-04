import conversationApi from '@/libs/apis/conversation.api';
import { useMutation } from '@tanstack/react-query';

const useGetOrCreateConversation = () => {
  return useMutation({
    mutationFn: conversationApi.createOrGetConversation,
  });
};
export default useGetOrCreateConversation;
