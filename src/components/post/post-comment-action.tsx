import { Chat } from '@mui/icons-material';
import { Button } from '@mui/material';
import CommentModal from '../comment/comment-modal';
import { useState } from 'react';
import { TPost } from '@/libs/types/post.type';
import { useAppDispatch } from '@/libs/redux/hook';
import { initialPost, setPost } from '@/libs/redux/post/postSlice';

interface IPostCommentActionProps {
  post: TPost;
}

const PostCommentAction = ({ post }: IPostCommentActionProps) => {
  const [open, setOpen] = useState(false);

  const dispatch = useAppDispatch();

  const handleClickOpen = () => {
    dispatch(setPost(post));
    setOpen(true);
  };

  const handleClose = () => {
    dispatch(setPost(initialPost));
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleClickOpen} startIcon={<Chat />}>
        Comments
      </Button>
      {open && <CommentModal open={open} handleClose={handleClose} />}
    </>
  );
};
export default PostCommentAction;
