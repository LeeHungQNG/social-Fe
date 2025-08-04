export type TReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';

export type TReactionInput = {
  postId: string;
  type?: TReactionType;
};

export interface IReactionUI {
  name: TReactionType;
  emoji: string;
}

export interface IUserReactionResponse {
  _id: string;
  post: string;
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  type: TReactionType;
  createdAt: string;
  updatedAt: string;
}
