import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetBundlesQuery } from '../../../store/services/bundles';
import { setIsCreating } from '../../../store/slices/bundlesSlice';
import CreateBundle from './CreateBundle/CreateBundle';
import BundlesList from './BundleList/BundleList';
import './DynamicBundle.css';
import EmptyState from './EmptyState/EmptyState';

const DynamicBundle = ({ companyId }) => {
  const dispatch = useDispatch();
  const { isCreating } = useSelector(state => state.bundles);
  const { data: bundles, isLoading } = useGetBundlesQuery();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }


  if (!bundles?.length && !isCreating) {
    return (
      <EmptyState
        onCreateClick={() => dispatch(setIsCreating(true))}
      />
    );
  }


  return isCreating ? (
    <CreateBundle
      companyId={companyId}
      onClose={() => dispatch(setIsCreating(false))}
    />
  ) : (
    <BundlesList />
  );
};

export default DynamicBundle;
