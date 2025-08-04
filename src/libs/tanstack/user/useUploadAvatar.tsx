import userApi from "@/libs/apis/user.api";
import { useMutation } from "@tanstack/react-query";

const useUploadAvatar = () => {
  return useMutation({
    mutationFn: userApi.uploadAvatar
  })
};
export default useUploadAvatar;
