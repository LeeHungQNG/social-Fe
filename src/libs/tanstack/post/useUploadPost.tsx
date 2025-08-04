import postApi from '@/libs/apis/post.api';
import { TUploadPostInput } from '@/libs/types/post.type';
import { useMutation } from '@tanstack/react-query';

const useUploadPost = () => {
  return useMutation({
    mutationFn: (data: TUploadPostInput) => postApi.uploadMedia(data),
  });
};
export default useUploadPost;
