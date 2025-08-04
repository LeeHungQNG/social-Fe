'use client';

import { Box, Divider, Paper } from '@mui/material';
import AvatarSection from './avatar-section';
import CoverPhotoSection from './cover-photo-section';
import UserInfoSection from './user-info-section';

export default function Profile() {
  return (
    <Box sx={{ mx: 'auto', p: 2 }}>
      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 3,
        }}
      >
        {/* Avatar Section */}
        <AvatarSection />

        {/* User Info  */}
        <UserInfoSection />

        <Divider sx={{ width: '100%', mb: 3 }} />

        {/* Cover Photo Section  */}
        <CoverPhotoSection />
      </Paper>
    </Box>
  );
}
