import postApi from '@/libs/apis/post.api';
import { useQuery } from '@tanstack/react-query';

interface IUseGetPostReactions {
  postId: string;
}

const useGetPostReactions = ({ postId }: IUseGetPostReactions) => {
  const { data, isLoading } = useQuery({
    queryKey: [postApi.KEY_POST_REACTIONS, postId],
    queryFn: () => postApi.getPostReactions(postId),
  });

  return {
    data: data?.data ?? [],
    isLoading,
  };
};
export default useGetPostReactions;
