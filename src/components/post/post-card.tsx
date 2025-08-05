'use client';
import { reactionObj, reactions } from '@/libs/constants/reaction.constant';
import useAddReaction from '@/libs/tanstack/reaction/useAddReaction';
import useDeleteReaction from '@/libs/tanstack/reaction/useDeleteReaction';
import { TPost } from '@/libs/types/post.type';
import { TReactionType } from '@/libs/types/reaction.type';
import { formatTime } from '@/utils/day';
import { MoreVert } from '@mui/icons-material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { MouseEvent, useState } from 'react';
import ReactionViewer from '../reaction/reaction-viewer';
import ImagePreview from './image-preview';
import PostCommentAction from './post-comment-action';
import ReactionPopper from './reaction-popper';
import { useAppSelector } from '@/libs/redux/hook';
import useGetAllUser from '@/libs/tanstack/user/useGetAllUser';

interface IPostCardProps {
  post: TPost;
  onUpdate: (post: TPost) => void;
  onDelete: (post: TPost) => void;
}

const PostCart = ({ post, onUpdate, onDelete }: IPostCardProps) => {
  const user = useAppSelector((state) => state.user.data);

  // Dropdown menu (update,delete)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Popper reaction (like, heart)
  const [anchorReactionEl, setAnchorReactionEl] = useState<null | HTMLElement>(null);

  const handleReactionEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorReactionEl(anchorReactionEl ? null : event.currentTarget);
  };
  const handleReactionLeave = () => {
    setAnchorReactionEl(null);
  };

  // React Query
  const addReactionMutation = useAddReaction({ handleReactionLeave });
  const deleteReactionMutation = useDeleteReaction({ handleReactionLeave });
  const { data: postUser } = useGetAllUser();

  const avatarAuthor = post.authorId === user._id ? user : postUser?.find((author) => author._id === post.authorId);

  const openReaction = Boolean(anchorReactionEl);
  const id = open ? 'reaction-popper' : undefined;

  const handleSelectReaction = (reaction: TReactionType) => {
    addReactionMutation.mutate({ postId: post._id, type: reaction });
  };

  const handleLikeClick = () => {
    if (post.myReaction) {
      deleteReactionMutation.mutate({ postId: post._id });
    } else {
      handleSelectReaction('like');
    }
  };

  return (
    <>
      <Card key={post._id} sx={{ mb: 3 }}>
        <CardHeader
          avatar={<Avatar src={avatarAuthor?.avatarUrl || ''} />}
          action={
            post.authorId === user._id && (
              <IconButton
                id="dropdown-button"
                aria-controls={open ? 'dropdown-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                <MoreVert />
              </IconButton>
            )
          }
          title={post.authorName}
          subheader={formatTime(post.createdAt)}
        />
        <CardContent sx={{ background: post.backgroundColor }}>
          <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
            {post.content}
          </Typography>
        </CardContent>
        {post.mediaFiles.length > 0 && <ImagePreview imagePreview={post.mediaFiles.map((item) => item.url)} />}
        <CardActions disableSpacing sx={{ display: 'block' }}>
          {/* Reaction viewer */}
          <ReactionViewer post={post} reactionObj={reactionObj} />
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #d7cfcf' }}>
            <Box sx={{ position: 'relative' }} onMouseEnter={handleReactionEnter} onMouseLeave={handleReactionLeave}>
              <Button onClick={handleLikeClick} aria-describedby={id} className="reaction-button">
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  {post.myReaction ? <Typography>{reactionObj[post.myReaction]}</Typography> : <ThumbUpOffAltIcon />}
                </Box>
              </Button>
              <ReactionPopper id={id} open={openReaction} anchorEl={anchorReactionEl} reactions={reactions} onSelect={handleSelectReaction} />
            </Box>
            {/* Post Comment button */}
            <PostCommentAction post={post} />
          </Box>
        </CardActions>
      </Card>
      <Menu
        id="dropdown-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'dropdown-button',
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          onClick={() => {
            onUpdate(post);
            handleClose();
          }}
        >
          Update
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDelete(post);
            handleClose();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};
export default PostCart;
