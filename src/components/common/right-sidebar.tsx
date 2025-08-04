'use client';
import useGetOrCreateConversation from '@/libs/tanstack/conversation/useGetOrCreateConversation';
import useGetMyFriend from '@/libs/tanstack/friend/useGetMyFriend';
import { IFriendRequest } from '@/libs/types/friend.type';
import { Avatar, Box, Card, CardContent, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

const RightSidebar = () => {
  const { data: friends } = useGetMyFriend();
  const router = useRouter();

  const createOrGetConversation = useGetOrCreateConversation();

  const handleChat = async (friend: IFriendRequest) => {
    const data = await createOrGetConversation.mutateAsync(friend._id);
    router.push(`/conversations/${data.data._id}?name=${friend.senderName}`);
  };
  return (
    <Box
      sx={{
        width: 240,
        flexShrink: 0,
        display: { xs: 'none', lg: 'block' },
        mt: 8,
        p: 2,
        position: 'sticky',
        maxHeight: '100vh',
        top: 64,
        overflowY: 'auto',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: '#000' }}>
        Contacts
      </Typography>
      <List>
        {friends.length === 0 && (
          <Typography variant="body1" color="text.secondary">
            No friends, please add some friends, to start a conversation
          </Typography>
        )}
        {friends.slice(0, 6).map((friend) => (
          <ListItem key={friend._id} disablePadding>
            <ListItemButton onClick={() => handleChat(friend)}>
              <ListItemAvatar>
                <Avatar alt={friend.senderName} src={friend.senderAvatarUrl} />
              </ListItemAvatar>
              <ListItemText primary={friend.senderName} sx={{ color: '#000' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" sx={{ mb: 2, color: '#000' }}>
        Upcoming Events
      </Typography>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold">
            Web Dev Meetup
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tomorrow at 6:00 PM
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            15 people going
          </Typography>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold">
            Birthday Party
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Saturday at 8:00 PM
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            8 people going
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
export default RightSidebar;
