'use client';

import useGetAllUser from '@/libs/tanstack/user/useGetAllUser';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import UserCard from './user-card';
import { useRef } from 'react';
import useInfiniteScroll from '@/libs/hooks/useInfiniteScroll';
import { useSearchParams } from 'next/navigation';
import useGetUserById from '@/libs/tanstack/user/useGetUserById';

export default function People() {
  const lastPageRef = useRef<HTMLDivElement | null>(null);

  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  const { data: users, hasNextPage, fetchNextPage } = useGetAllUser();
  const { data: searchedUser } = useGetUserById(userId || '');

  useInfiniteScroll({ targetRef: lastPageRef, hasNextPage, fetchNextPage });

  const usersToShow = userId && searchedUser ? [searchedUser] : users;

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
        {usersToShow.map((user) => {
          return <UserCard key={user._id} user={user} />;
        })}
        {/* <div ref={lastPageRef}></div> */}
        {!userId && <div ref={lastPageRef}></div>}
      </Grid>
    </>
  );
}
