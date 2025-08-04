import messageApi from '@/libs/apis/message.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useSeenMessage = (conversationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: messageApi.seen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [messageApi.KEY, conversationId] });
    },
  });
};
export default useSeenMessage;
