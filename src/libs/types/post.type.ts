import { TReactionType } from './reaction.type';

export type TCreatePostInputs = {
  content: string;
  backgroundColor: string;
};

export type TUploadPostInput = {
  id: string;
  files: IMediaFile[];
};

export type TPost = {
  _id: string;
  authorId: string;
  backgroundColor: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  mediaFiles: (IMediaFile & { url: string })[];
  privacy: string;
  reactionsCount: Record<TReactionType, number>;
  authorName: string;
  authorEmail: string;
  myReaction?: TReactionType;
};
