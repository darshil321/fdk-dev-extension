import {
    useGetBundlesQuery,
} from "@/store/services/bundles";
import { setIsCreating } from "@/store/slices/bundlesSlice";
import { useDispatch, useSelector } from "react-redux";
import BundlesList from "./BundleList/BundleList";
import CreateBundle from "./CreateBundle/CreateBundle";
import "./DynamicBundle.css";
import EmptyState from "./EmptyState/EmptyState";

const DynamicBundle = ({ companyId, applicationId }) => {
  const dispatch = useDispatch();
  const { isCreating } = useSelector((state) => state.bundles);
  const filters = useSelector((state) => state.bundles.filters);

  const { data: bundlesData, isLoading } = useGetBundlesQuery({
    companyId,
    applicationId,
    params: {
      name: filters.search,
      status: filters.status !== "all" ? filters.status : undefined,
      sort_by: filters.sortBy,
    },
  });

  const bundles = bundlesData?.items || [];

  if (isLoading) {
    return <div className="loading-container">Loading bundles...</div>;
  }

  if (bundles.length === 0 && !isCreating) {
    return (
      <EmptyState
        title="No bundles found"
        description="Get started by creating your first bundle"
        onCreateClick={() => dispatch(setIsCreating(true))}
      />
    );
  }

  return isCreating ? (
    <CreateBundle
      companyId={companyId}
      applicationId={applicationId}
      onClose={() => dispatch(setIsCreating(false))}
    />
  ) : (
    <BundlesList
      bundles={bundles}
      onCreateClick={() => dispatch(setIsCreating(true))}
    />
  );
};

export default DynamicBundle;
