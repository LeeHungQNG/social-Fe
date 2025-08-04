export const getUser = () => {
  //Tránh lỗi SSR: Dùng typeof window !== 'undefined' để chắc chắn đang ở client trước khi dùng localStorage (Server-side (SSR)	❌ Không có window) (Client-side (CSR)	✅ Có window)
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    try {
      return user ? (JSON.parse(user) as IUser) : ({} as IUser);
    } catch {
      return {} as IUser;
    }
  }

  return {} as IUser;
};
