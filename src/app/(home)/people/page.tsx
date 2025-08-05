import People from '@/components/people/people';
import { Suspense } from 'react';

const PeoplePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <People />
    </Suspense>
  );
};
export default PeoplePage;
