import useGetOrCreateConversation from '@/libs/tanstack/conversation/useGetOrCreateConversation';
import useUnFriendRequest from '@/libs/tanstack/friend/useUnFriendRequest';
import { IFriendRequest } from '@/libs/types/friend.type';
import { Person } from '@mui/icons-material';
import { Avatar, Box, Button, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

interface IFriendCardProps {
  friend: IFriendRequest;
}

const FriendCard = ({ friend }: IFriendCardProps) => {
  const { _id, senderName, senderAvatarUrl, senderEmail, senderCoverPhotoUrl } = friend;
  const router = useRouter();

  const createOrGetConversation = useGetOrCreateConversation();
  const unFriendMutation = useUnFriendRequest();

  const handleChat = async () => {
    const data = await createOrGetConversation.mutateAsync(friend._id);
    router.push(`/conversations/${data.data._id}?name=${senderName}`);
  };

  const handleUnfriend = () => {
    unFriendMutation.mutate(friend._id);
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
          image={senderCoverPhotoUrl || ''}
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
            src={senderAvatarUrl || undefined}
            sx={{
              width: 80,
              height: 80,
              border: '4px solid #fff',
              backgroundColor: '#1976d2',
            }}
          >
            {!senderAvatarUrl && <Person sx={{ fontSize: 40 }} />}
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
              {senderName}
            </Typography>

            <Typography variant="body2" sx={{ wordBreak: 'break-all' }} color="text.secondary" mb={1}>
              {senderEmail}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Button fullWidth variant="outlined" color="primary" onClick={handleChat}>
              Chat
            </Button>
            <Button fullWidth variant="outlined" color="error" onClick={handleUnfriend}>
              UnFriend
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};
export default FriendCard;
