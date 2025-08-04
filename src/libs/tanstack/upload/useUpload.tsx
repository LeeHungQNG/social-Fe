import fileApi from '@/libs/apis/file.api';
import { useMutation } from '@tanstack/react-query';

const useUpload = (imagesFile: File[]) => {
  return useMutation({
    mutationFn: () => fileApi.uploadFiles(imagesFile),
  });
};
export default useUpload;
