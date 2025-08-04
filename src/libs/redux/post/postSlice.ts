import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { TPost } from '@/libs/types/post.type';
import { TReactionType } from '@/libs/types/reaction.type';

// Define a type for the slice state
interface IPostState {
  data: TPost;
}

export const initialPost = {
  _id: '',
  authorId: '',
  backgroundColor: '',
  content: '',
  createdAt: '',
  updatedAt: '',
  mediaFiles: [],
  privacy: 'public',
  reactionsCount: {} as Record<TReactionType, number>,
  authorName: '',
  authorEmail: '',
};

// Define the initial state using that type
const initialState: IPostState = {
  data: initialPost,
};

export const postSlice = createSlice({
  name: 'post',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setPost: (state, action: PayloadAction<TPost>) => {
      state.data = action.payload;
    },
  },
});

export const { setPost } = postSlice.actions;

export default postSlice.reducer;
