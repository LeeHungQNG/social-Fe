'use client';
import PostModel from '@/components/post/post-modal';
import useInfiniteScroll from '@/libs/hooks/useInfiniteScroll';
import useGetAllPost from '@/libs/tanstack/post/useGetAllPost';
import { TPost } from '@/libs/types/post.type';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import PostCart from './post-card';
import DeletePostModal from './delete-post-modal';

export default function Post() {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<TPost | null>(null);

  const lastPageRef = useRef<HTMLDivElement | null>(null);
  const { data: posts, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetAllPost();

  const handleClickOpenDeleteModal = () => {
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedPost(null);
  };

  const handleClickOpenModal = () => {
    setOpenCreateModal(true);
  };

  const handleCloseModal = () => {
    setOpenCreateModal(false);
    setSelectedPost(null);
  };

  useInfiniteScroll({ targetRef: lastPageRef, hasNextPage, fetchNextPage });

  const handleUpdatePost = (post: TPost) => {
    setSelectedPost(post);
    handleClickOpenModal();
  };

  const handleDeletePost = (post: TPost) => {
    setSelectedPost(post);
    handleClickOpenDeleteModal();
  };

  return (
    <>
      <Paper sx={{ mb: 3 }}>
        <Box
          sx={{ p: 3, borderRadius: 2, border: '1px solid #ddd', display: 'flex', alignItems: 'center', cursor: 'pointer', '&:hover': { background: '#f5f5f5' } }}
          onClick={handleClickOpenModal}
        >
          <Typography>What&apos;s going on?</Typography>
        </Box>
      </Paper>
      {/* Posts */}
      {posts.map((post) => (
        <PostCart key={post._id} post={post} onUpdate={handleUpdatePost} onDelete={handleDeletePost} />
      ))}
      <div ref={lastPageRef}></div>
      {isFetchingNextPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      )}
      {/* Create post modal */}
      <PostModel initialValue={selectedPost} open={openCreateModal} handleClose={handleCloseModal} />

      {/* Delete post modal */}
      <DeletePostModal initialValue={selectedPost} open={openDeleteModal} handleClose={handleCloseDeleteModal} />
    </>
  );
}
