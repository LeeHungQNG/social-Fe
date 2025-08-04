'use client';

import useGetAllUser from '@/libs/tanstack/user/useGetAllUser';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import UserCard from './user-card';
import { useRef } from 'react';
import useInfiniteScroll from '@/libs/hooks/useInfiniteScroll';

export default function People() {
  const { data: users, hasNextPage, fetchNextPage } = useGetAllUser();
  const lastPageRef = useRef<HTMLDivElement | null>(null);

  useInfiniteScroll({ targetRef: lastPageRef, hasNextPage, fetchNextPage });

  return (
    <>
      {/* Title */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Users
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Connect with other users by adding them as friends
        </Typography>
      </Box>

      {/* User Card */}
      <Grid container spacing={3}>
        {users.map((user) => {
          return <UserCard key={user._id} user={user} />;
        })}
        <div ref={lastPageRef}></div>
      </Grid>
    </>
  );
}
