import useCancelFriendRequest from '@/libs/tanstack/friend/useCancelFriendRequest';
import useSendFriendRequest from '@/libs/tanstack/friend/useSendFriendRequest';
import { Person } from '@mui/icons-material';
import { Avatar, Box, Button, Card, CardContent, CardMedia, Chip, Grid, Typography } from '@mui/material';

interface IUserCardProps {
  user: IUser;
}

const UserCard = ({ user }: IUserCardProps) => {
  const { _id, name, email, bio, avatarUrl, coverPhotoUrl, isActive, isFriend, isSentFriendRequest } = user;

  const sendFriendRequest = useSendFriendRequest();
  const cancelFriendRequest = useCancelFriendRequest();
  const handleSendFriendRequest = () => {
    sendFriendRequest.mutate(user._id);
  };

  const handleCancelFriendRequest = () => {
    cancelFriendRequest.mutate(user._id);
  };

  return (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
      <Card
        key={_id}
        sx={{
          flexBasis: '30%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6,
          },
        }}
      >
        {/* Cover photo */}
        <CardMedia
          component="div"
          sx={{
            height: 100,
            backgroundColor: '#e0e0e0',
            position: 'relative',
          }}
          image={coverPhotoUrl || ''}
        />

        {/* Avatar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: -5,
          }}
        >
          <Avatar
            src={avatarUrl || undefined}
            sx={{
              width: 80,
              height: 80,
              border: '4px solid #fff',
              backgroundColor: '#1976d2',
            }}
          >
            {!avatarUrl && <Person sx={{ fontSize: 40 }} />}
          </Avatar>
        </Box>

        <CardContent
          sx={{
            flexGrow: 1,
            textAlign: 'center',
            pt: 2,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Box sx={{ mb: 'auto' }}>
            <Typography gutterBottom variant="h5" component="div">
              {name}
            </Typography>

            <Typography variant="body2" color="text.secondary" mb={1}>
              {email}
            </Typography>

            {bio && (
              <Typography variant="body2" color="text.secondary" mb={2}>
                {bio}
              </Typography>
            )}

            {isActive && <Chip label="Active" size="small" color="success" sx={{ mb: 2 }} />}
          </Box>

          {isSentFriendRequest ? (
            <Button disabled={isFriend} variant="outlined" color="secondary" onClick={handleCancelFriendRequest}>
              Cancel
            </Button>
          ) : (
            <Button disabled={isFriend} variant="contained" onClick={handleSendFriendRequest}>
              {isFriend ? 'Friend Added' : 'Add Friend'}
            </Button>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};
export default UserCard;
