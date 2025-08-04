export interface IParticipant {
  _id: string;
  avatarUrl: string;
  email: string;
  name: string;
}

export interface IConversation {
  _id: string;
  isGroup: boolean;
  participants: IParticipant[];
  groupAvatarUrl: string | null;
  lastMessage: string;
  lastMessageAt: string;
  senderLastMessage: string;
  senderIdLastMessage: string;
  isLastMessageSeen: boolean;
  createdAt: string;
  updatedAt: string;
}
