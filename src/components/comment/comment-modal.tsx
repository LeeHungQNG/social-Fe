'use client';

import { Close } from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle, Divider, IconButton, Typography } from '@mui/material';
import CommentInput from './comment-input';
import CommentList from './comment-list';

interface CommentModalProps {
  open: boolean;
  handleClose: () => void;
}

export default function CommentModal({ open, handleClose }: CommentModalProps) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            maxHeight: '80vh',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography>Comments</Typography>
        <IconButton aria-label="close" onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ p: 2 }}>
        {/* Comment input */}
        <CommentInput />

        {/* Comments list */}
        <CommentList />
      </DialogContent>
    </Dialog>
  );
}
