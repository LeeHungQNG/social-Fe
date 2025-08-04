'use client';

import useGetAllMessage from '@/libs/tanstack/message/useGetAllMessage';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import useSendMessage from '@/libs/tanstack/message/useSendMessage';
import { ArrowBack, Close, Send } from '@mui/icons-material';
import { AppBar, Box, CircularProgress, Container, Grid, IconButton, InputAdornment, Paper, TextField, Toolbar, Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import MessageCard from './MessageCard';
import useInfiniteScroll from '@/libs/hooks/useInfiniteScroll';
import Image from 'next/image';
import { useSocketContext } from '@/libs/context/socket.context';
import useSeenMessage from '@/libs/tanstack/message/useSeenMessage';
import { useAppSelector } from '@/libs/redux/hook';

export default function ConversationDetail({ id }: { id: string }) {
  // context
  const socket = useSocketContext();
  const user = useAppSelector((state) => state.user.data);

  // navigate
  const router = useRouter();
  const searchParams = useSearchParams();

  // state
  const [text, setText] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  // ref
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const name = searchParams.get('name');

  // query
  const { data: messages, fetchNextPage, hasNextPage } = useGetAllMessage(id);
  const sendMessageMutation = useSendMessage({
    conversationId: id,
    mediaFiles,
    reset: () => {
      setText('');
      setMediaFiles([]);
    },
  });
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const seenMessage = useSeenMessage(id);

  const handleSendMessage = () => {
    sendMessageMutation.mutate({ text });
  };

  const handleRemoveImg = (index: number) => {
    const filteredMediaFiles = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(filteredMediaFiles);
  };

  useInfiniteScroll({ targetRef: lastMessageRef, hasNextPage, fetchNextPage });

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!text) return;

    if (e.key === 'Enter' && !e.shiftKey) {
      sendMessageMutation.mutate({ text });
    }
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    const attachFiles = Array.from(files);
    setMediaFiles((prev) => [...prev, ...attachFiles]);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  useEffect(() => {
    const newImagePreview = mediaFiles.map((file) => URL.createObjectURL(file));
    setImagePreview(newImagePreview);

    return () => {
      newImagePreview.map((preview) => URL.revokeObjectURL(preview));
    };
  }, [mediaFiles]);

  useEffect(() => {
    socket?.emit('join', id);
  }, [socket, id]);

  useEffect(() => {
    if (!lastMessage) return;

    if (user._id === lastMessage.senderId) return;

    const hasSeen = lastMessage.seenBy.some((u) => u.seenById === user._id);
    if (hasSeen) return;

    seenMessage.mutate(lastMessage._id);
  }, [lastMessage]);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => router.push('/conversations')}>
            <ArrowBack />
          </IconButton>

          <Box>
            <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
              {name}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flexGrow: 1,
          bgcolor: '#f5f5f5',
          p: 2,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column-reverse',
        }}
      >
        <Container maxWidth="md" sx={{ flexGrow: 1 }}>
          <div ref={lastMessageRef}></div>
          {messages.map((message) => (
            <MessageCard key={message._id} message={message} />
          ))}
        </Container>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          bottom: 0,
        }}
      >
        {imagePreview.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={1}>
              {imagePreview.map((image, index) => (
                <Grid key={index}>
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'inline-block',
                      borderRadius: 1,
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: 'divider',
                      width: 80,
                      height: 80,
                    }}
                  >
                    <Image src={image} alt={`imagePreview-${index}`} width={80} height={80} style={{ objectFit: 'cover' }} />

                    <IconButton
                      size="small"
                      onClick={() => handleRemoveImg(index)}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        p: 0.5,
                        '&:hover': {
                          bgcolor: 'rgba(0,0,0,0.7)',
                        },
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <TextField
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          multiline
          minRows={1}
          maxRows={5}
          variant="outlined"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <input onChange={handleFile} type="file" accept="image/*" multiple hidden ref={inputRef} />
                  <IconButton onClick={() => inputRef.current?.click()}>
                    <AttachFileIcon color="primary" />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    // loading={sendMessageMutation.isPending}
                    disabled={(!text && !mediaFiles.length) || sendMessageMutation.isPending}
                    aria-label="Type message..."
                    onClick={handleSendMessage}
                  >
                    {sendMessageMutation.isPending ? <CircularProgress size={20} /> : <Send color={text || mediaFiles.length ? 'primary' : 'disabled'} />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Paper>
    </Box>
  );
}
