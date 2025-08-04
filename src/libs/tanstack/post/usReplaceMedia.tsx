import postApi from '@/libs/apis/post.api';
import { TUploadPostInput } from '@/libs/types/post.type';
import { useMutation } from '@tanstack/react-query';

const useReplaceMedia = () => {
  return useMutation({
    mutationFn: (data: TUploadPostInput) => postApi.replaceMedia(data),
  });
};
export default useReplaceMedia;
