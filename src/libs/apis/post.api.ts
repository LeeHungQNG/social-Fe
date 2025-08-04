import axiosClient from '.';
import { TCreatePostInputs, TPost, TUploadPostInput } from '../types/post.type';
import { IUserReactionResponse, TReactionInput } from '../types/reaction.type';

const postApi = {
  KEY: 'posts',
  KEY_POST_REACTIONS: 'post-reactions',
  getAll(cursor: string | null) {
    return axiosClient.get<unknown, IBackendResponseWithPagination<TPost[]>>('/posts', { params: { limit: 5, cursor } });
  },
  create(data: TCreatePostInputs) {
    return axiosClient.post<unknown, IBackendResponse<TPost>>('/posts', data);
  },
  update(id: string, data: TCreatePostInputs) {
    return axiosClient.patch<unknown, IBackendResponse<TPost>>(`/posts/${id}`, data);
  },
  delete(id: string) {
    return axiosClient.delete<unknown, IBackendResponse<undefined>>(`/posts/${id}`);
  },
  uploadMedia(data: TUploadPostInput) {
    return axiosClient.patch(`/posts/${data.id}/upload`, data.files);
  },
  replaceMedia(data: TUploadPostInput) {
    return axiosClient.patch(`/posts/${data.id}/replace`, data.files);
  },
  addReaction(data: TReactionInput) {
    return axiosClient.post('/posts/reaction', data);
  },
  deleteReaction(data: TReactionInput) {
    return axiosClient.post('/posts/delete-reaction', data);
  },
  getPostReactions(id: string) {
    return axiosClient.get<unknown, IBackendResponse<IUserReactionResponse[]>>(`/posts/${id}/reaction`);
  },
};

export default postApi;
