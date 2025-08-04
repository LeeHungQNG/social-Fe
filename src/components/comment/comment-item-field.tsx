import { IComment } from '@/libs/types/comment.type';
import { formatTime } from '@/utils/day';
import { MoreHoriz } from '@mui/icons-material';
import { Avatar, Box, Button, IconButton, Menu, MenuItem, Paper, Typography } from '@mui/material';
import { MouseEvent, useState } from 'react';
import CommentInput from './comment-input';
import { useAppSelector } from '@/libs/redux/hook';
import useDeleteComment from '@/libs/tanstack/comment/useDeleteComment';

interface ICommentItemFieldProps {
  comment: IComment;
  handleClickReply?: () => void;
}

const CommentItemField = ({ comment, handleClickReply }: ICommentItemFieldProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedComment, setSelectedComment] = useState<IComment>();

  const user = useAppSelector((state) => state.user.data);

  // delete comment query
  const deleteCommentMutation = useDeleteComment();

  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdate = () => {
    setSelectedComment(comment);
    handleClose();
  };

  const handleDelete = () => {
    handleClose();
    deleteCommentMutation.mutate(comment._id);
  };

  const handleCancelUpdate = () => {
    setSelectedComment(undefined);
  };
  return (
    <>
      <Box sx={{ display: 'flex', mb: handleClickReply ? 1 : 0 }}>
        <Avatar sx={{ width: handleClickReply ? 32 : 36, height: handleClickReply ? 32 : 36, mr: 1.5 }}>{comment.userCommentName.charAt(0)}</Avatar>
        <Box sx={{ flexGrow: 1 }}>
          {/* Comment content and input edit comment*/}
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              borderRadius: 3,
              backgroundColor: 'grey.100',
            }}
          >
            <Typography variant="subtitle2">{comment.userCommentName}</Typography>
            {selectedComment ? (
              <CommentInput placeholder="Edit a comment..." initialValue={comment} onCancel={handleCancelUpdate} />
            ) : (
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {comment.content}
              </Typography>
            )}
          </Paper>

          {/* Comment actions Reply*/}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 0.5,
              ml: 1,
            }}
          >
            {handleClickReply && (
              <Button
                size="small"
                onClick={handleClickReply}
                sx={{
                  minWidth: 'auto',
                  p: 0.5,
                  mr: 1,
                  color: 'text.secondary',
                }}
              >
                Reply
              </Button>
            )}

            <Typography variant="caption" color="text.secondary">
              {formatTime(comment.createdAt)}
            </Typography>

            {/* Comment actions edit and remove */}
            {user._id === comment.userCommentId && (
              <IconButton aria-controls={open ? 'basic-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined} onClick={handleClick}>
                <MoreHoriz />
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}
      >
        <MenuItem onClick={handleUpdate}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Remove</MenuItem>
      </Menu>
    </>
  );
};
export default CommentItemField;
