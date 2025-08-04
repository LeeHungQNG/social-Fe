import postApi from '@/libs/apis/post.api';
import { useSocketContext } from '@/libs/context/socket.context';
import { TPost } from '@/libs/types/post.type';
import { IUserReactionResponse } from '@/libs/types/reaction.type';
import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

const useGetAllPost = () => {
  const socket = useSocketContext();

  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [postApi.KEY],
    queryFn: ({ pageParam }: { pageParam: string | null }) => postApi.getAll(pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.cursor,
  });

  // C1: using state to update create post realtime
  // const [posts, setPosts] = useState<TPost[]>([]);

  // const initialPosts = useMemo(() => {
  //   return data?.pages?.flatMap((page) => page.data) || [];
  // }, [data]);

  // useEffect(() => {
  //   setPosts(initialPosts);
  // }, [initialPosts]);

  // useEffect(() => {
  //   socket?.on('post_created', (data) => {
  //     setPosts((prev) => [data, ...prev]);
  //   });
  // }, [socket]);

  // C2: using react query to update post realtime
  const posts = data?.pages?.flatMap((page) => page.data) || [];

  useEffect(() => {
    const handleCreatePost = (data: TPost) => {
      queryClient.setQueryData<InfiniteData<IBackendResponseWithPagination<TPost[]>, unknown>>([postApi.KEY], (oldData) => {
        if (!oldData) return;

        // data newPages struct
        // {
        //   pageParams: [null, 'cursor123', ...],
        //   pages: [
        //     {data: [soketPost, post1, post2, post3], cursor: 'next-cursor'} // update if index = 0
        //     {data: [post1, post2, post3], cursor: 'anothor-cursor'}
        //   ]
        // }
        const newPages = oldData.pages.map((page, index) => {
          if (index === 0) {
            return {
              ...page,
              data: [data, ...page.data],
            };
          }
          return page;
        });

        return {
          ...oldData,
          pages: newPages,
        };
      });
    };

    const handleUploadMedia = (payload: { postId: string; mediaFiles: IMediaFile[] }) => {
      queryClient.setQueryData<InfiniteData<IBackendResponseWithPagination<TPost[]>, unknown>>([postApi.KEY], (oldData) => {
        if (!oldData) return;

        const updatedPage = oldData.pages.map((page) => {
          const updatedPost = page.data.map((post) => {
            if (post._id !== payload.postId) return post;

            return { ...post, mediaFiles: payload.mediaFiles };
          });

          return { ...page, data: updatedPost };
        });

        return { ...oldData, pages: updatedPage };
      });
    };
    const handleUpdatePost = (payload: { postId: string; backgroundColor: string; content: string }) => {
      queryClient.setQueryData<InfiniteData<IBackendResponseWithPagination<TPost[]>, unknown>>([postApi.KEY], (oldData) => {
        if (!oldData) return;

        const updatedPage = oldData.pages.map((page) => {
          const updatedPost = page.data.map((post) => {
            if (post._id !== payload.postId) return post;

            return { ...post, backgroundColor: payload.backgroundColor, content: payload.content };
          });

          return { ...page, data: updatedPost };
        });

        return { ...oldData, pages: updatedPage };
      });
    };

    const handleDeletePost = (postId: string) => {
      queryClient.setQueryData<InfiniteData<IBackendResponseWithPagination<TPost[]>, unknown>>([postApi.KEY], (oldData) => {
        if (!oldData) return;

        const updatedPages = oldData.pages.map((page) => {
          return { ...page, data: page.data.filter((post) => post._id !== postId) };
        });

        return { ...oldData, pages: updatedPages };
      });
    };

    const handleReaction = (data: TPost, userReactions: IUserReactionResponse[]) => {
      queryClient.setQueryData<InfiniteData<IBackendResponseWithPagination<TPost[]>, unknown>>([postApi.KEY], (oldData) => {
        if (!oldData) return;

        const updatedPage = oldData.pages.map((page) => {
          const updatedPost = page.data.map((post) => {
            if (post._id !== data._id) return post;

            return { ...post, reactionsCount: data.reactionsCount };
          });

          return { ...page, data: updatedPost };
        });

        return { ...oldData, pages: updatedPage };
      });

      queryClient.setQueryData<IBackendResponse<IUserReactionResponse[]>>([postApi.KEY_POST_REACTIONS, data._id], (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: [...userReactions],
        };
      });
    };

    socket?.on('post_created', handleCreatePost);
    socket?.on('post_upload_media', handleUploadMedia);
    socket?.on('post_updated', handleUpdatePost);
    socket?.on('post_replace_media', handleUploadMedia);
    socket?.on('post_deleted', handleDeletePost);
    socket?.on('post_add_reaction', handleReaction);
    socket?.on('post_remove_reaction', handleReaction);

    return () => {
      socket?.off('post_created', handleCreatePost);
      socket?.off('post_upload_media', handleUploadMedia);
      socket?.off('post_updated', handleUpdatePost);
      socket?.off('post_replace_media', handleUploadMedia);
      socket?.off('post_deleted', handleDeletePost);
      socket?.off('post_add_reaction', handleReaction);
      socket?.off('post_remove_reaction', handleReaction);
    };
  }, [socket, queryClient]);

  return { data: posts, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage };
};
export default useGetAllPost;
