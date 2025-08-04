import conversationApi from '@/libs/apis/conversation.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

interface IUseDeleteConversation {
  handleClose: () => void;
}

const useDeleteConversation = ({ handleClose }: IUseDeleteConversation) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: conversationApi.delete,
    onSuccess: () => {
      toast.success('Delete conversation successfully');
      queryClient.invalidateQueries({ queryKey: [conversationApi.KEY] });
      handleClose();
    },
  });
};
export default useDeleteConversation;
