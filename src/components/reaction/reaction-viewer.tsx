import { TPost } from '@/libs/types/post.type';
import { Box, Typography } from '@mui/material';
import ReactionModal from './reaction-modal';
import { useState } from 'react';
import useGetAllComments from '@/libs/tanstack/comment/useGetAllComments';

interface IReactionViewer {
  post: TPost;
  reactionObj: Record<string, string>;
}

const ReactionViewer = ({ post, reactionObj }: IReactionViewer) => {
  const [open, setOpen] = useState(false);
  const { data: comments } = useGetAllComments({ postId: post._id });

  const handleClose = () => {
    setOpen(false);
  };

  const totalReaction = Object.values(post.reactionsCount).reduce((prev, cur) => prev + cur, 0);

  const totalComments = comments.reduce((acc, comment) => {
    return acc + 1 + (comment.replies?.length || 0);
  }, 0);
  return (
    <>
      {totalReaction > 0 ? (
        <Box onClick={() => setOpen(true)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', cursor: 'pointer', mb: 1 }}>
          <Box sx={{ display: 'flex', gap: '4px' }}>
            {Object.entries(post.reactionsCount).map(([type, count]) => {
              return count > 0 && <Typography key={type}>{reactionObj[type]}</Typography>;
            })}
            <Typography>({totalReaction})</Typography>
          </Box>
          <Box>{totalComments ? `${totalComments} comments` : ''}</Box>
        </Box>
      ) : (
        <Box sx={{ height: '15px' }}></Box>
      )}
      {open && <ReactionModal post={post} open={open} handleClose={handleClose} />}
    </>
  );
};
export default ReactionViewer;
