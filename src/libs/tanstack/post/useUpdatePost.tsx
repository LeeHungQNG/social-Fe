import postApi from '@/libs/apis/post.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import useUpload from '../upload/useUpload';
import useReplaceMedia from './usReplaceMedia';
import { TCreatePostInputs } from '@/libs/types/post.type';

interface IUseUpdatePost {
  id: string;
  files: File[];
  mediaFiles: IMediaFile[];
  handleClose: () => void;
}

const useUpdatePost = ({ files, handleClose, id, mediaFiles }: IUseUpdatePost) => {
  const uploadMutation = useUpload(files);
  const replaceMediaFilesMutation = useReplaceMedia();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TCreatePostInputs) => postApi.update(id, data),
    onSuccess: async () => {
      // 1 -> make api to upload multiple files
      const uploadData = await uploadMutation.mutateAsync();

      // 2 -> Replace media
      await replaceMediaFilesMutation.mutateAsync({
        id,
        files: [...uploadData.data, ...mediaFiles], //combine the new upload image
      });

      // Revalidate data
      queryClient.invalidateQueries({ queryKey: [postApi.KEY] });

      handleClose();
      toast.success('Update post successfully');
    },
  });
};
export default useUpdatePost;
