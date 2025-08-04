import { RefObject, useEffect } from 'react';

interface IUseInfiniteScroll {
  targetRef: RefObject<HTMLDivElement | null>;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}

const useInfiniteScroll = ({ targetRef, hasNextPage, fetchNextPage }: IUseInfiniteScroll) => {
  useEffect(() => {
    const ref = targetRef.current;

    if (!ref) return;

    const observer = new IntersectionObserver((entries) => {
      // we already saw the lastPageRef
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(ref);

    return () => {
      observer.unobserve(ref);
    };
  }, [targetRef, fetchNextPage, hasNextPage]);
};
export default useInfiniteScroll;
