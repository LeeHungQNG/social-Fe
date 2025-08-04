import axiosClient from '.';
import { IComment, ICommentInputs } from '../types/comment.type';

const commentApi = {
  KEY: 'comments',
  create(data: ICommentInputs) {
    return axiosClient.post('/comments', data);
  },
  getAll(postId: string) {
    return axiosClient.get<unknown, IBackendResponse<IComment[]>>(`/comments/post/${postId}`);
  },
  update(id: string, content: string) {
    return axiosClient.patch(`/comments/${id}`, { content });
  },
  delete(id: string) {
    return axiosClient.delete(`/comments/${id}`);
  },
};

export default commentApi;
