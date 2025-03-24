
import React, { useState } from 'react';


import './BundleList.css';
import { useDispatch } from 'react-redux';
import { Button, Dropdown, SearchInput } from 'paul-fds-ui';
import Table from '../../common/Table/Table';
import { useGetBundlesQuery } from '@/store/api';
import { setIsCreating } from '@/store/slices/bundlesSlice';

const BundlesList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    sortBy: 'created_at'
  });
  const dispatch = useDispatch();

  const { data: bundles, isLoading, isFetching } = useGetBundlesQuery({
    search: searchQuery,
    ...filters
  });

  const columns = [
    {
      Header: 'Bundle Name',
      accessor: 'name',
      Cell: ({ row }) => (
        <div className="bundle-name-cell">
          <img src={row.original.imageUrl} alt={row.original.name} />
          <span>{row.original.name}</span>
        </div>
      )
    },
    {
      Header: 'Item Code',
      accessor: 'itemCode'
    },
    {
      Header: 'Groups',
      accessor: 'groups',
      Cell: ({ value }) => `${value.length} groups`
    },
    {
      Header: 'Price',
      accessor: 'pricing.sellingPrice',
      Cell: ({ value }) => `₹${value}`
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => (
        <span className={`status-badge ${value.toLowerCase()}`}>
          {value}
        </span>
      )
    },

  ];

  return (
    <div className="bundle-list-container">
      <div className="list-header">
        <h2>Bundles</h2>
        <Button
          kind="primary"
          onClick={() => dispatch(setIsCreating(true))}
        >
          Create Bundle
        </Button>
      </div>

      <div className="list-filters">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search bundles..."
        />
        <div className="filter-group">
          <Dropdown
            options={[
              { label: 'All', value: 'all' },
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' }
            ]}
            value={filters.status}
            onChange={(value) => setFilters({ ...filters, status: value })}
            placeholder="Status"
          />
          <Dropdown
            options={[
              { label: 'Newest First', value: '-created_at' },
              { label: 'Oldest First', value: 'created_at' },
              { label: 'Name A-Z', value: 'name' },
              { label: 'Name Z-A', value: '-name' }
            ]}
            value={filters.sortBy}
            onChange={(value) => setFilters({ ...filters, sortBy: value })}
            placeholder="Sort by"
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={bundles || []}
        loading={isLoading || isFetching}
      />
    </div>
  );
};

export default BundlesList;
