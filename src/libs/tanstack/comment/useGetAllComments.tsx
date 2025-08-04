import commentApi from '@/libs/apis/comment.api';
import { useSocketContext } from '@/libs/context/socket.context';
import { IComment } from '@/libs/types/comment.type';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import { useEffect } from 'react';

interface IUseGetAllComments {
  postId: string;
}

const useGetAllComments = ({ postId }: IUseGetAllComments) => {
  const socket = useSocketContext();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [commentApi.KEY, postId],
    queryFn: () => commentApi.getAll(postId),
  });

  useEffect(() => {
    const handleCreateComment = (data: IComment) => {
      queryClient.setQueryData<IBackendResponse<IComment[]>>([commentApi.KEY, postId], (oldData) => {
        if (!oldData) return;

        // let newData: IComment[] = [];

        // this is a children comment
        // if (data.parent) {
        // append to reply
        //   newData = oldData.data.map((comment) => {
        //     if (comment._id === data.parent) {
        //       return {
        //         ...comment,
        //         replies: [...(comment.replies ?? []), data],
        //       };
        //     }
        //   }) as IComment[];
        // } else {
        // append to root
        //   newData = [...oldData.data, data];
        // }

        // return {
        //   ...oldData,
        //   data: [...newData],
        // };

        return produce(oldData, (draft) => {
          // handle nested create comment
          if (data.parent) {
            // find parent
            const parentComment = draft.data.find((comment) => comment._id === data.parent);

            if (parentComment) {
              parentComment.replies?.push(data);
            }
          } else {
            draft.data.push(data);
          }
        });
      });
    };

    const handleUpdateComment = (data: { commentId: string; content: string; updatedAt: string }) => {
      // queryClient.setQueryData<IBackendResponse<IComment[]>>([commentApi.KEY, postId], (oldData) => {
      //   if (!oldData) return;

      //   const updatedComments = oldData.data.map((comment) => {
      //     // Root comment
      //     if (comment._id === data.commentId) {
      //       return {
      //         ...comment,
      //         content: data.content,
      //         updatedAt: data.updatedAt,
      //       };
      //     }

      //     const updatedReplies = comment.replies?.map((reply) => (reply._id === data.commentId ? { ...reply, content: data.content, updatedAt: data.updatedAt } : reply));

      //     return {
      //       ...comment,
      //       replies: [...(updatedReplies ?? [])],
      //     };
      //   });

      //   return {
      //     ...oldData,
      //     data: updatedComments,
      //   };
      // });

      queryClient.setQueryData<IBackendResponse<IComment[]>>(
        [commentApi.KEY, postId],
        produce((draft) => {
          for (const comment of draft?.data || []) {
            if (comment._id === data.commentId) {
              comment.content = data.content;
              comment.updatedAt = data.updatedAt;
            }

            for (const reply of comment?.replies || []) {
              if (reply._id === data.commentId) {
                reply.content = data.content;
                reply.updatedAt = data.updatedAt;
              }
            }
          }
        })
      );
    };

    const handleDeleteComment = (data: { commentId: string; parentId: string | null }) => {
      queryClient.setQueryData<IBackendResponse<IComment[]>>([commentApi.KEY, postId], (oldData) => {
        if (!oldData) return;

        return produce(oldData, (draft) => {
          if (!data.parentId) {
            draft.data = draft.data.filter((comment) => comment._id !== data.commentId);
          } else {
            //find the root comment
            const parentComment = draft.data.find((comment) => comment._id === data.parentId);

            if (parentComment) {
              parentComment.replies = parentComment.replies?.filter((reply) => reply._id !== data.commentId);
            }
          }
        });
      });
    };

    socket?.on('comment_created', handleCreateComment);
    socket?.on('comment_updated', handleUpdateComment);
    socket?.on('comment_deleted', handleDeleteComment);

    return () => {
      socket?.off('comment_created', handleCreateComment);
      socket?.off('comment_updated', handleUpdateComment);
      socket?.off('comment_deleted', handleDeleteComment);
    };
  }, [socket, queryClient, postId]);

  return {
    data: data?.data ?? [],
    isLoading,
  };
};
export default useGetAllComments;
