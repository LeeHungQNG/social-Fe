import postApi from '@/libs/apis/post.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import useUpload from '../upload/useUpload';
import useUploadPost from './useUploadPost';

interface IUseCreatePost {
  files: File[];
  handleClose: () => void;
}

const useCreatePost = ({ files, handleClose }: IUseCreatePost) => {
  const uploadMutation = useUpload(files);
  const uploadMediaToPostMutation = useUploadPost();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postApi.create,
    onSuccess: async (data) => {
      const newPost = data.data;

      // 1 -> make api to upload multiple files
      const uploadData = await uploadMutation.mutateAsync();

      // 2 -> Upload media
      await uploadMediaToPostMutation.mutateAsync({ id: newPost._id, files: uploadData.data });

      // Revalidate data
      queryClient.invalidateQueries({ queryKey: [postApi.KEY] });

      handleClose();
      toast.success('Create post successfully');
    },
  });
};
export default useCreatePost;
