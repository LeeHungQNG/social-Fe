import { initialUserState } from '@/utils/initUserState.util';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ISetUserPayload {
  user: IUser;
  accessToken: string;
}

interface IUpdateUserPayload {
  name?: string;
  avatarUrl?: string | null;
  coverPhotoUrl?: string | null;
  bio?: string;
}

// Define a type for the slice state
export interface UserState {
  data: IUser;
  isAuthenticated: boolean;
  accessToken: string;
}

// Define the initial state using that type
const initialState: UserState = initialUserState();

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<ISetUserPayload>) => {
      state.data = action.payload.user;
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;

      localStorage.setItem('user', JSON.stringify(state.data));
      localStorage.setItem('isAuthenticated', `${state.isAuthenticated}`);
      localStorage.setItem('accessToken', state.accessToken);
    },
    updateUser: (state, action: PayloadAction<IUpdateUserPayload>) => {
      state.data = {
        ...state.data,
        ...action.payload,
      };
      localStorage.setItem('user', JSON.stringify(state.data));
    },
    logout: (state) => {
      state.data = {
        _id: '',
        name: '',
        email: '',
        avatarUrl: null,
        coverPhotoUrl: null,
        bio: undefined,
        role: 'user',
        isActive: false,
      };
      state.isAuthenticated = false;
      state.accessToken = '';

      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('accessToken');
    },
  },
});

export const { setUser, logout, updateUser } = userSlice.actions;

export default userSlice.reducer;
