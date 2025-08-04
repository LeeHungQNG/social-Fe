import fileApi from '@/libs/apis/file.api';
import { useMutation } from '@tanstack/react-query';

const useUploadSingle = () => {
  return useMutation({
    mutationFn: fileApi.uploadSingleFile,
  });
};
export default useUploadSingle;
