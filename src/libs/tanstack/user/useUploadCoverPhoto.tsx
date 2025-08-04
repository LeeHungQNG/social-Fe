import userApi from '@/libs/apis/user.api';
import { useMutation } from '@tanstack/react-query';

const useUploadCoverPhoto = () => {
  return useMutation({
    mutationFn: userApi.uploadCoverPhoto,
  });
};
export default useUploadCoverPhoto;
