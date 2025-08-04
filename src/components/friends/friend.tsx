'use client';

import useGetMyFriend from '@/libs/tanstack/friend/useGetMyFriend';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import FriendCard from './friend-card';

export default function Friend() {
  const { data: friends } = useGetMyFriend();

  return (
    <>
      {/* Title */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Friends ({friends.length})
        </Typography>
        <Typography variant="body1" color="text.secondary">
          When we have lovely friends, everything becomes possible
        </Typography>
      </Box>

      {/* User Card */}
      <Grid container spacing={3}>
        {friends.map((friend) => {
          return <FriendCard key={friend._id} friend={friend} />;
        })}
      </Grid>
    </>
  );
}
