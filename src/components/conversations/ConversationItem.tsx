import { useAppSelector } from '@/libs/redux/hook';
import { IConversation } from '@/libs/types/conversation.type';
import { formatTime } from '@/utils/day';
import { DeleteOutline } from '@mui/icons-material';
import { Avatar, Box, IconButton, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from '@mui/material';
import Link from 'next/link';
import DeleteModal from './DeleteModal';
import { useState } from 'react';

interface IConversationItemProps {
  conversation: IConversation;
}

const ConversationItem = ({ conversation }: IConversationItemProps) => {
  const user = useAppSelector((state) => state.user.data);

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Link href={`/conversations/${conversation._id}?name=${conversation?.participants[0]?.name}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
        <ListItem
          disablePadding
          divider
          secondaryAction={
            <Typography variant="caption" color="text.secondary">
              {formatTime(conversation.lastMessageAt)}
            </Typography>
          }
        >
          <ListItemButton>
            <ListItemAvatar>
              <Avatar src={conversation.participants[0].avatarUrl} alt={conversation.participants[0].name} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box component="span" sx={{ display: 'flex', alignItems: 'center', fontWeight: conversation.isLastMessageSeen ? 'normal' : 'bold' }}>
                  {conversation.participants[0].name}
                  <Typography color="primary" sx={{ ml: 0.5, fontSize: 20, display: conversation.isLastMessageSeen ? 'none' : 'inline-block' }}>
                    &bull;
                  </Typography>
                </Box>
              }
              secondary={
                <Typography sx={{ fontWeight: conversation.isLastMessageSeen ? 'normal' : '600', fontSize: '0.8rem' }}>
                  {conversation.senderIdLastMessage === user._id ? 'You' : conversation.senderLastMessage}: {conversation.lastMessage}
                </Typography>
              }
              slotProps={{ primary: { fontWeight: 'regular' }, secondary: { noWrap: true, fontWeight: 'regular', color: 'text.secondary' } }}
            />
          </ListItemButton>
        </ListItem>
      </Link>
      <IconButton onClick={handleOpen}>
        <DeleteOutline color="error" />
      </IconButton>
      <DeleteModal open={open} handleClose={handleClose} conversationId={conversation._id} />
    </Box>
  );
};
export default ConversationItem;
