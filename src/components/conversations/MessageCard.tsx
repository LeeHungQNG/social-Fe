import { useAppSelector } from '@/libs/redux/hook';
import { IMessage } from '@/libs/types/message.type';
import { formatTime } from '@/utils/day';
import { MoreHoriz } from '@mui/icons-material';
import { Avatar, Box, IconButton, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';
import { memo, useState } from 'react';
import DeleteModal from './DeleteModal';

interface IMessageCardProps {
  message: IMessage;
}

const MessageCard = ({ message }: IMessageCardProps) => {
  const user = useAppSelector((state) => state.user.data);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      key={message._id}
      sx={{
        display: 'flex',
        justifyContent: message.senderId === user._id ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Box sx={{ cursor: 'pointer' }}>
          <Tooltip title={message.senderName}>
            <Avatar src={message.senderAvatarUrl}></Avatar>
          </Tooltip>
        </Box>

        {/* Message deleted */}
        {message.isDelete && (
          <Box
            sx={{
              maxWidth: '70%',
              p: 2,
              borderRadius: 2,
              bgcolor: 'gray',
              color: 'white',
              boxShadow: 1,
            }}
          >
            <Typography variant="body1">Message deleted</Typography>
          </Box>
        )}

        {/* Message with image */}
        {!message.isDelete && (
          <Box
            sx={{
              maxWidth: '100%',
              p: 2,
              borderRadius: 2,
              bgcolor: message.senderId === user._id ? 'primary.main' : 'white',
              color: message.senderId === user._id ? 'white' : 'text.primary',
              boxShadow: 1,
            }}
          >
            {message.mediaFiles && message.mediaFiles.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'flex-start', maxWidth: message.mediaFiles.length <= 2 ? '320px' : '100%' }}>
                  {message.mediaFiles.map((image) => (
                    <Box
                      key={image}
                      sx={{
                        position: 'relative',
                        display: 'block',
                        width: '150px',
                        height: '150px',
                        borderRadius: 1,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider',
                        flexShrink: 0,
                      }}
                    >
                      <Image src={image} alt={image} width={150} height={150} style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }} />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {message.text && (
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {message.text}
              </Typography>
            )}

            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'right',
                mt: 0.5,
                opacity: 0.8,
              }}
            >
              {formatTime(message.createdAt)}
            </Typography>
          </Box>
        )}

        {/* Button delete message */}
        {message.senderId === user._id && (
          <Box>
            {!message.isDelete && (
              <IconButton onClick={handleClickOpen}>
                <MoreHoriz />
              </IconButton>
            )}
            {open && <DeleteModal open={open} handleClose={handleClose} messageId={message._id} conversationId={message.conversation} />}
          </Box>
        )}
      </Box>
    </Box>
  );
};
export default memo(MessageCard);
