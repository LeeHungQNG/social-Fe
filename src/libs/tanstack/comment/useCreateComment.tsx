import commentApi from '@/libs/apis/comment.api';
import { useAppSelector } from '@/libs/redux/hook';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

interface IUseCreateComment {
  reset: () => void;
}

const useCreateComment = ({ reset }: IUseCreateComment) => {
  const post = useAppSelector((state) => state.post.data);

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentApi.create,
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: [commentApi.KEY, post._id] });
      toast.success('Create comment successfully');
    },
  });
};
export default useCreateComment;
