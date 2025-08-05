import { useAppSelector } from '@/libs/redux/hook';
import useGetAllComments from '@/libs/tanstack/comment/useGetAllComments';
import { List } from '@mui/material';
import CommentItem from './comment-item';
import { useState } from 'react';
import useGetAllUser from '@/libs/tanstack/user/useGetAllUser';

const CommentList = () => {
  const [selectedComment, setSelectedComment] = useState('');
  const post = useAppSelector((state) => state.post.data);
  

  const { data: comments } = useGetAllComments({ postId: post._id });
  const { data: users } = useGetAllUser();
  return (
    <List sx={{ p: 0 }}>
      {comments.map((comment) => (
        <CommentItem users={users} key={comment._id} comment={comment} selectedComment={selectedComment} setSelectedComment={setSelectedComment} />
      ))}
    </List>
  );
};
export default CommentList;
