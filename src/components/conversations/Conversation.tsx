'use client';
import useGetMyConversation from '@/libs/tanstack/conversation/useGetMyConversation';
import { IConversation } from '@/libs/types/conversation.type';
import { Box, List, Paper, Typography } from '@mui/material';
import ConversationItem from './ConversationItem';
import { useAppSelector } from '@/libs/redux/hook';

export default function Conversations() {
  const { data: conversations } = useGetMyConversation();

  const user = useAppSelector((state) => state.user.data);

  const filteredConversations = conversations
    .map((conversation) => {
      return {
        ...conversation,
        participants: conversation.participants.filter((p) => p._id !== user._id),
      };
    })
    .filter((conversation) => conversation.lastMessage) as IConversation[];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Conversations
      </Typography>
      {filteredConversations.length > 0 ? (
        <Paper elevation={2}>
          <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 1 }}>
            {filteredConversations.map((conversation) => (
              <ConversationItem key={conversation._id} conversation={conversation} />
            ))}
          </List>
        </Paper>
      ) : (
        <Typography variant="body1" color="text.secondary">
          There are no conversation. Add friends to start a conversation
        </Typography>
      )}
    </Box>
  );
}
