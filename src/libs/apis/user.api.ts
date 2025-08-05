import axiosClient from '.';
import { IUserUpdateInput } from '../types/user.type';

const userApi = {
  KEY: 'users',
  getAll(cursor: string | null) {
    return axiosClient.get<unknown, IBackendResponseWithPagination<IUser[]>>('/users', { params: { cursor } });
  },
  uploadAvatar(data: IMediaFile) {
    return axiosClient.post<unknown, IBackendResponse<IUser>>('/users/upload-avatar', data);
  },
  uploadCoverPhoto(data: IMediaFile) {
    return axiosClient.post<unknown, IBackendResponse<IUser>>('/users/upload-cover', data);
  },
  update(id: string, data: IUserUpdateInput) {
    return axiosClient.patch<unknown, IBackendResponse<IUser>>(`/users/${id}`, data);
  },
  getOne(id: string) {
    return axiosClient.get<unknown, IBackendResponse<IUser>>(`/users/${id}`);
  },
};

export default userApi;
