import { useAppDispatch, useAppSelector } from '@/libs/redux/hook';
import useUploadSingle from '@/libs/tanstack/upload/useUploadSingle';
import useUploadAvatar from '@/libs/tanstack/user/useUploadAvatar';
import { PhotoCamera } from '@mui/icons-material';
import { Box, Button, CircularProgress } from '@mui/material';
import { ChangeEvent, useRef, useState } from 'react';

// Hydration error ssr -> src diffrent csr -> src
import dynamic from 'next/dynamic';
import { updateUser } from '@/libs/redux/user/userSlice';
const CustomAvatar = dynamic(() => import('../common/custom-avatar'), {
  ssr: false,
});

const AvatarSection = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const user = useAppSelector((state) => state.user.data);
  const [loading, setLoading] = useState(false);
  console.log('🚀 ~ AvatarSection ~ loading:', loading);

  const dispatch = useAppDispatch();

  const uploadFile = useUploadSingle();
  const uploadAvatar = useUploadAvatar();

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const avatarFile = e.target.files?.[0];

    if (avatarFile) {
      setLoading(true);
      const res = await uploadFile.mutateAsync(avatarFile);
      const avatarRes = await uploadAvatar.mutateAsync(res.data);

      dispatch(updateUser({ avatarUrl: avatarRes.data.avatarUrl }));
      setLoading(false);
    }
  };
  return (
    <Box sx={{ position: 'relative', mb: 3 }}>
      <input type="file" accept="image/*" hidden ref={inputRef} onChange={handleAvatarChange} />

      {/* Avatar */}
      {loading ? (
        <Box sx={{ width: 160, height: 160, borderRadius: '50%', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'cener', justifyContent: 'center' }}>
          <CircularProgress sx={{ position: 'absolute', top: 50 }} />
        </Box>
      ) : (
        <CustomAvatar avatarUrl={user.avatarUrl || ''} />
      )}

      <Button
        onClick={() => inputRef.current?.click()}
        variant="contained"
        size="small"
        sx={{
          minWidth: 'unset',
          width: 36,
          height: 36,
          borderRadius: '50%',
          position: 'absolute',
          bottom: 5,
          right: 5,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
        }}
      >
        <PhotoCamera fontSize="small" />
      </Button>
    </Box>
  );
};
export default AvatarSection;
