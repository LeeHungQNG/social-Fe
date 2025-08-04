interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  coverPhotoUrl: string | null;
  bio?: string;
  isFriend?: boolean;
  isSentFriendRequest?: boolean;
  isActive: boolean;
}

interface IAuthResponse {
  message: string;
  data: IUser;
  accessToken: string;
}

interface IMediaFile {
  url: string;
  public_id: string;
  version: string;
  display_name: string;
  format: string;
  resource_type: string;
}

interface IBackendResponse<T> {
  message: string;
  data: T;
}

type IBackendResponseWithPagination<T> = IBackendResponse<T> & { hasNextPage: boolean; cursor: string };
