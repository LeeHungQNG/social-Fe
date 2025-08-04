import axiosClient from '.';
import { IFriendRequest } from '../types/friend.type';

const friendApi = {
  KEY: ['request-pending'],
  FRIEND_KEY: ['friends'],
  sendFriendRequest(userId: string) {
    return axiosClient.post(`/friends/request/${userId}`);
  },
  unFriend(userId: string) {
    return axiosClient.delete(`/friends/${userId}`);
  },
  cancelFriendRequest(userId: string) {
    return axiosClient.post(`/friends/cancel-request/${userId}`);
  },
  getPendingFriendRequest() {
    return axiosClient.get<unknown, IBackendResponse<IFriendRequest[]>>('/friends/request-pending');
  },
  acceptFriendRequest(requestId: string) {
    return axiosClient.post(`/friends/accept-request/${requestId}`);
  },
  rejectFriendRequest(requestId: string) {
    return axiosClient.post(`/friends/reject-request/${requestId}`);
  },
  getMyFriend() {
    return axiosClient.get<unknown, IBackendResponse<IFriendRequest[]>>('/friends');
  },
};

export default friendApi;
