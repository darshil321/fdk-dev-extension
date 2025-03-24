import React, { useState } from 'react';
import './Table.css';
import { Button, Checkbox } from 'paul-fds-ui';


const Table = ({
  columns,
  data,
  loading,
  selectable = false,
  pagination,
  onRowClick,
  onSelectionChange,
  sortable = true,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  // Handle row selection
  const handleSelectRow = (rowId) => {
    const newSelection = selectedRows.includes(rowId)
      ? selectedRows.filter(id => id !== rowId)
      : [...selectedRows, rowId];

    setSelectedRows(newSelection);
    onSelectionChange?.(newSelection);
  };

  // Handle select all
  const handleSelectAll = () => {
    const allRowIds = data.map(row => row.id);
    const newSelection = selectedRows.length === data.length ? [] : allRowIds;

    setSelectedRows(newSelection);
    onSelectionChange?.(newSelection);
  };

  // Handle sorting
  const handleSort = (key) => {
    if (!sortable) return;

    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  return (
    <div className="custom-table-container">
      {/* Table Header */}
      <div className="table-header">
        {selectable && selectedRows.length > 0 && (
          <div className="bulk-actions">
            <span>{selectedRows.length} items selected</span>
            <Button
              kind="secondary"
              size="small"
              onClick={() => setSelectedRows([])}
            >
              Clear Selection
            </Button>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              {selectable && (
                <th className="checkbox-column">
                  <Checkbox
                    checked={selectedRows.length === data.length}
                    indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key || column.accessor}
                  className={`
                    ${column.className || ''}
                    ${sortable && column.sortable !== false ? 'sortable' : ''}
                  `}
                  onClick={() => handleSort(column.accessor)}
                >
                  <div className="th-content">
                    {column.Header}
                    {sortable && column.sortable !== false && (
                      <div className="sort-icons">
                        {/* <Icons
                          name={sortConfig.key === column.accessor && sortConfig.direction === 'asc'
                            ? 'arrow-up-filled'
                            : 'arrow-up'
                          }
                          size="small"
                        /> */}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="loading-cell">
                  <div className="loading-indicator">
                    {/* <Icons size="small" /> */}
                    <span>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="empty-cell">
                  <div className="empty-state">
                    {/* <Icons size="large" /> */}
                    <span>No data available</span>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className={`
                    ${onRowClick ? 'clickable' : ''}
                    ${selectedRows.includes(row.id) ? 'selected' : ''}
                  `}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className="checkbox-column">
                      <Checkbox
                        checked={selectedRows.includes(row.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectRow(row.id);
                        }}
                      />
                    </td>
                  )}
                  {columns.map((column, colIndex) => (
                    <td
                      key={`${row.id}-${column.key || colIndex}`}
                      className={column.className}
                    >
                      {column.Cell ? column.Cell({ row }) : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="table-pagination">
          <div className="pagination-info">
            Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.pageSize, pagination.total)} of{' '}
            {pagination.total} entries
          </div>
          <div className="pagination-controls">
            <Button
              kind="secondary"
              size="small"
              disabled={pagination.currentPage === 1}
              onClick={() => pagination.onChange(pagination.currentPage - 1)}
            >
              Previous
            </Button>
            {generatePaginationNumbers(pagination.currentPage, Math.ceil(pagination.total / pagination.pageSize))}
            <Button
              kind="secondary"
              size="small"
              disabled={pagination.currentPage === Math.ceil(pagination.total / pagination.pageSize)}
              onClick={() => pagination.onChange(pagination.currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to generate pagination numbers
const generatePaginationNumbers = (currentPage, totalPages) => {
  const pages = [];
  const maxButtons = 5;

  if (totalPages <= maxButtons) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    }
  }

  return pages;
};

export default Table;
