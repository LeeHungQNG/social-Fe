import { IComment } from '@/libs/types/comment.type';
import { Box, ListItem } from '@mui/material';
import { useState } from 'react';
import CommentInput from './comment-input';
import CommentItemField from './comment-item-field';
interface ICommentListProps {
  comment: IComment;
  selectedComment: string;
  setSelectedComment: (comment: string) => void;
  users: IUser[];
}
const CommentItem = ({ comment, selectedComment, setSelectedComment, users }: ICommentListProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [parentCommentId, setParentCommentId] = useState<string>();
  const [replyToUserId, setReplyToUserId] = useState<string>();

  const handleClickReply = () => {
    setIsReplying(true);
    setSelectedComment(comment._id);
    setParentCommentId(comment._id);
    setReplyToUserId(comment.userCommentId);
  };

  const handleCancelReply = () => {
    setIsReplying(false);
    setParentCommentId(undefined);
    setReplyToUserId(undefined);
  };

  return (
    <Box key={comment._id} sx={{ mb: 2 }}>
      <ListItem alignItems="flex-start" sx={{ px: 0, py: 1 }}>
        <Box sx={{ width: '100%' }}>
          <CommentItemField comment={comment} handleClickReply={handleClickReply} users={users} />
          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <Box sx={{ ml: 4, mt: 1 }}>
              {comment.replies.map((reply) => (
                <CommentItemField key={reply._id} comment={reply} users={users} />
              ))}
            </Box>
          )}

          {/* Reply comment input */}
          {selectedComment === comment._id && isReplying && (
            <CommentInput
              isReplyMode={isReplying}
              placeholder={`Reply to ${comment.userCommentName}`}
              onCancel={handleCancelReply}
              parentCommentId={parentCommentId}
              replyToUserId={replyToUserId}
            />
          )}
        </Box>
      </ListItem>
    </Box>
  );
};
export default CommentItem;
