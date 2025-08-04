export interface ISeen {
  seenById: string;
  seenByName: string;
  seenByAvatarUrl: string;
}

export interface IMessage {
  _id: string;
  conversation: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl: string;
  text: string;
  mediaFiles: string[];
  isDelete: boolean;
  seenBy: ISeen[];
  createdAt: string;
  updatedAt: string;
}

export interface IMessageInputs {
  text: string;
  mediaFiles?: IMediaFile[];
}
