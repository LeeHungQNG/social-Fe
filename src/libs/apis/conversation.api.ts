import axiosClient from '.';
import { IConversation } from '../types/conversation.type';

const conversationApi = {
  KEY: 'conversations',
  createOrGetConversation(userId: string) {
    return axiosClient.post<unknown, IBackendResponse<IConversation>>('/conversations/private', { participantId: userId });
  },
  getAll() {
    return axiosClient.get<unknown, IBackendResponse<IConversation[]>>('/conversations');
  },
  delete(id: string) {
    return axiosClient.delete(`/conversations/${id}`);
  },
};

export default conversationApi;
