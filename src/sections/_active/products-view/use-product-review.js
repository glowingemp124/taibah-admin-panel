import { useCallback, useState } from 'react';

import { toast } from 'src/components/snackbar';

import { reviewMockProduct } from './mock';

// ----------------------------------------------------------------------
// Admin approve / reject actions shared by the product list and details page.

export function useProductReview(onReviewed) {
  const [rejectTarget, setRejectTarget] = useState(null);

  const approve = useCallback(
    async (product) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      reviewMockProduct(product._id, 'approved');
      toast.success(`"${product.title}" approved`);
      onReviewed?.();
    },
    [onReviewed]
  );

  const openReject = useCallback((product) => setRejectTarget(product), []);

  const closeReject = useCallback(() => setRejectTarget(null), []);

  const confirmReject = useCallback(
    async (reason) => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      reviewMockProduct(rejectTarget._id, 'rejected', reason);
      toast.success(`"${rejectTarget.title}" rejected`);
      setRejectTarget(null);
      onReviewed?.();
    },
    [onReviewed, rejectTarget]
  );

  return { rejectTarget, approve, openReject, closeReject, confirmReject };
}
