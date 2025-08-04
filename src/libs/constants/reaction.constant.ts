import { IReactionUI } from '../types/reaction.type';

export const reactions: IReactionUI[] = [
  { name: 'like', emoji: '👍' },
  { name: 'love', emoji: '❤️' },
  { name: 'haha', emoji: '😂' },
  { name: 'wow', emoji: '😮' },
  { name: 'sad', emoji: '😢' },
  { name: 'angry', emoji: '😡' },
];

export const reactionObj = Object.fromEntries(reactions.map((r) => [r.name, r.emoji]));
