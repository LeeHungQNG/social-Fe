import postApi from '@/libs/apis/post.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

interface IUseDeletePost {
  handleClose: () => void;
}

const useDeletePost = ({ handleClose }: IUseDeletePost) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [postApi.KEY] });
      handleClose();
      toast.success('Delete post successfully');
    },
  });
};
export default useDeletePost;
