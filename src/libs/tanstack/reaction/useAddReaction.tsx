import postApi from '@/libs/apis/post.api';
import { TPost } from '@/libs/types/post.type';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';

interface IUseAddReaction {
  handleReactionLeave: () => void;
}

const useAddReaction = ({ handleReactionLeave }: IUseAddReaction) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postApi.addReaction,
    onMutate: ({ postId, type }) => {
      queryClient.setQueryData<InfiniteData<IBackendResponseWithPagination<TPost[]>, unknown>>([postApi.KEY], (oldData) => {
        if (!oldData) return;

        const updatedPage = oldData.pages.map((page) => {
          const updatedPost = page.data.map((post) => {
            if (post._id !== postId) return post;

            return { ...post, myReaction: type };
          });

          return { ...page, data: updatedPost };
        });

        return { ...oldData, pages: updatedPage };
      });
    },
    onSuccess: () => {
      handleReactionLeave();
      queryClient.invalidateQueries({ queryKey: [postApi.KEY] });
    },
  });
};
export default useAddReaction;
