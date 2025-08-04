import messageApi from '@/libs/apis/message.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

interface IUseDeleteMessage {
  conversationId: string;
  handleClose: () => void;
}

const useDeleteMessage = ({ conversationId, handleClose }: IUseDeleteMessage) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: messageApi.delete,
    onSuccess: () => {
      toast.success('Delete message successfully');
      queryClient.invalidateQueries({ queryKey: [messageApi.KEY, conversationId] });
      handleClose();
    },
  });
};
export default useDeleteMessage;
