'use client';

import useGetFriendPendingRequest from '@/libs/tanstack/friend/useGetFriendPendingRequest';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import InvitationCard from './invitation-card';

export default function Invitation() {
  const { data: requests } = useGetFriendPendingRequest();

  return (
    <>
      {/* Title */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Invitations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          People want to connect with you, accept their friend request
        </Typography>
      </Box>

      {/* User Card */}
      <Grid container spacing={3}>
        {requests.map((request) => {
          return <InvitationCard key={request._id} request={request} />;
        })}
      </Grid>
    </>
  );
}
