import commentApi from '@/libs/apis/comment.api';
import { useAppSelector } from '@/libs/redux/hook';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const useDeleteComment = () => {
  const post = useAppSelector((state) => state.post.data);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [commentApi.KEY, post._id] });
      toast.success('Delete comment successfully');
    },
  });
};
export default useDeleteComment;
