import { useAppSelector } from '@/libs/redux/hook';
import useCreateComment from '@/libs/tanstack/comment/useCreateComment';
import useUpdateComment from '@/libs/tanstack/comment/useUpdateComment';
import { IComment } from '@/libs/types/comment.type';
import { Avatar, Box, Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

interface ICommentInputProps {
  initialValue?: IComment;
  placeholder?: string;
  isReplyMode?: boolean;
  onCancel?: () => void;
  parentCommentId?: string;
  replyToUserId?: string;
}

const CommentInput = ({ placeholder, isReplyMode = false, onCancel, parentCommentId, replyToUserId, initialValue }: ICommentInputProps) => {
  const [content, setContent] = useState('');

  const post = useAppSelector((state) => state.post.data);

  // react query
  const createCommentMutation = useCreateComment({ reset: () => setContent('') });
  const updateCommentMutation = useUpdateComment({ onCancel });

  const handleComment = () => {
    if (initialValue) {
      updateCommentMutation.mutate({ id: initialValue._id, content });
    } else {
      createCommentMutation.mutate({ postId: post._id, content, parentCommentId, replyToUserId });
    }
    onCancel?.();
  };

  useEffect(() => {
    if (initialValue) {
      setContent(initialValue.content);
    }
  }, [initialValue]);

  return (
    <Box sx={{ display: 'flex', ml: isReplyMode ? 4 : 0, mb: 3, gap: 1.5 }}>
      <Avatar sx={{ width: 36, height: 36 }}>U</Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <TextField
          fullWidth
          multiline
          placeholder={placeholder ? placeholder : 'Write a comment...'}
          variant="outlined"
          size="small"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
            },
          }}
        />
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 1 }}>
          {onCancel && (
            <Button
              onClick={onCancel}
              variant="contained"
              size="small"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
              }}
            >
              Cancel
            </Button>
          )}

          <Button
            onClick={handleComment}
            variant="contained"
            size="small"
            disabled={!content}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            {isReplyMode ? 'Reply' : initialValue ? 'Edit' : 'Comment'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
export default CommentInput;
