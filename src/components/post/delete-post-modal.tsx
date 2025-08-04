import useDeletePost from '@/libs/tanstack/post/useDeletePost';
import { TPost } from '@/libs/types/post.type';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';

interface IDeleteModalProps {
  initialValue: TPost | null;
  open: boolean;
  handleClose: () => void;
}

export default function DeletePostModal({ open, handleClose, initialValue }: IDeleteModalProps) {
  const deleteMutation = useDeletePost({ handleClose });
  const handleDelete = () => {
    deleteMutation.mutate(initialValue?._id ?? '');
  };
  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">Are you sure to delete this post?</DialogTitle>
      <DialogActions>
        <Button onClick={handleClose}>Disagree</Button>
        <Button onClick={handleDelete} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}
