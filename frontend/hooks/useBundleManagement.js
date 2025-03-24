import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  useCreateBundleMutation,
  useUpdateBundleMutation,
  useDeleteBundleMutation
} from '../store/services/bundles';

export const useBundleManagement = () => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const [createBundle] = useCreateBundleMutation();
  const [updateBundle] = useUpdateBundleMutation();
  const [deleteBundle] = useDeleteBundleMutation();

  const handleCreateBundle = async (bundleData) => {
    try {
      setError(null);
      await createBundle(bundleData).unwrap();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const handleUpdateBundle = async (id, bundleData) => {
    try {
      setError(null);
      await updateBundle({ id, ...bundleData }).unwrap();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const handleDeleteBundle = async (id) => {
    try {
      setError(null);
      await deleteBundle(id).unwrap();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return {
    error,
    handleCreateBundle,
    handleUpdateBundle,
    handleDeleteBundle
  };
};
