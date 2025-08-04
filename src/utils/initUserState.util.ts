import { UserState } from '@/libs/redux/user/userSlice';
import { getUser } from './getUser.util';

export const initialUserState = (): UserState => {
  const user = getUser();
  //Tránh lỗi SSR: Dùng typeof window !== 'undefined' để chắc chắn đang ở client trước khi dùng localStorage.
  if (typeof window === 'undefined') {
    return {
      data: {
        _id: '',
        name: '',
        email: '',
        role: 'user',
        avatarUrl: null,
        coverPhotoUrl: null,
        bio: undefined,
        isActive: false,
      },
      isAuthenticated: false,
      accessToken: '',
    };
  }

  return {
    data: {
      _id: user._id || '',
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'user',
      isActive: user.isActive || false,
      avatarUrl: user.avatarUrl || null,
      coverPhotoUrl: user.coverPhotoUrl || null,
      bio: user.bio,
    },
    isAuthenticated: !!localStorage.getItem('isAuthenticated') || false,
    accessToken: localStorage.getItem('accessToken') || '',
  };
};
