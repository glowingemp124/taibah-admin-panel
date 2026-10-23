import { useCallback, useMemo, useState } from 'react';

import { useAppRole } from 'src/hooks/use-app-role';

import { findMockOrder, toSellerOrder } from './mock';


export function useOrderActions({ sellerId, sellerMode = false, onChanged } = {}) {
  const { user } = useAppRole();
  const [viewOrder, setViewOrder] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  const role = sellerMode ? 'seller' : 'admin';
  const actor = useMemo(
    () => ({ _id: sellerMode ? sellerId : user?.basicInfo?._id || 'admin-001', name: user?.basicInfo?.name || (sellerMode ? 'Seller' : 'Admin User') }),
    [sellerId, sellerMode, user]
  );

  const reload = useCallback(
    (row) => {
      const fresh = findMockOrder(row._id);
      if (!fresh) return null;
      return sellerId ? toSellerOrder(fresh, sellerId) : fresh;
    },
    [sellerId]
  );

  const openView = useCallback((row) => setViewOrder(row), []);
  const closeView = useCallback(() => setViewOrder(null), []);
  const openEdit = useCallback((order, store) => setEditTarget({ order, store }), []);
  const closeEdit = useCallback(() => setEditTarget(null), []);

  const handleEdited = useCallback(() => {
    setViewOrder((current) => (current ? reload(current) : current));
    onChanged?.();
  }, [onChanged, reload]);

  return { role, actor, viewOrder, editTarget, openView, closeView, openEdit, closeEdit, handleEdited };
}
