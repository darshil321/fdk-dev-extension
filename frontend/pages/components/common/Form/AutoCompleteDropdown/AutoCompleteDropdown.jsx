import React, { useState, useEffect, useRef } from "react";
import { Input, Button } from "paul-fds-ui";
import SvgIcon from "@/pages/components/Icons/LeftArrow";

// CSS for the Searchable Dropdown component
const dropdownStyles = `
.dropdown-container {
  position: relative;
  width: 100%;
  margin-bottom: 20px;
}

.dropdown-label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
  display: block;
}

.dropdown-field {
  position: relative;
  width: 100%;
}

.dropdown-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  cursor: pointer;
  padding: 8px;
}

.dropdown-clear {
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  cursor: pointer;
  padding: 8px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 300px;
  background-color: white;
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 4px;
}

.dropdown-items {
  overflow-y: auto;
  max-height: 250px;
}

.dropdown-item {
  padding: 10px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 12px;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-empty {
  padding: 12px;
  color: #999;
  text-align: center;
  font-style: italic;
}

.dropdown-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-top: 1px solid #f0f0f0;
  font-size: 12px;
}

.pagination-info {
  color: #666;
}

.pagination-controls {
  display: flex;
  gap: 8px;
}

.pagination-control {
  background: #f5f5f5;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  color: #333;
}

.pagination-control:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-control:hover:not(:disabled) {
  background: #e5e5e5;
}

.add-group-button {
  display: flex;
  align-items: center;
  color: #6b7aff;
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 8px;
}

.add-group-button svg {
  margin-right: 4px;
}
`;

const SearchableDropdown = ({
  label = "Select Group",
  placeholder = "E.g: Saver Pack",
  options = [],
  value = null,
  onChange,
  onAddNew,
  itemsPerPage = 10,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredOptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOptions = filteredOptions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handle dropdown toggle
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen && inputRef.current) {
      // Focus the input when opening the dropdown
      inputRef.current.focus();
    }
  };

  // Handle option selection
  const handleSelect = (option) => {
    onChange(option);
    setSearchTerm(""); // Clear search term
    setIsOpen(false);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search

    // Open dropdown when typing
    if (!isOpen && e.target.value.trim().length > 0) {
      setIsOpen(true);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle pagination
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <style>{dropdownStyles}</style>
      <div className="dropdown-container" ref={dropdownRef}>
        <label className="dropdown-label">{label}</label>
        <div className="dropdown-field">
          <Input
            ref={inputRef}
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleSearchChange}
            onClick={() => setIsOpen(true)}
          />
          {searchTerm && (
            <div className="dropdown-clear" onClick={clearSearch}>
              <SvgIcon name="close" />
            </div>
          )}
          <div className="dropdown-arrow" onClick={toggleDropdown}>
            <SvgIcon name={isOpen ? "chevron-up" : "chevron-down"} />
          </div>
        </div>

        {isOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-items">
              {paginatedOptions.length > 0 ? (
                paginatedOptions.map((option) => (
                  <div
                    key={option.value}
                    className="dropdown-item"
                    onClick={() => handleSelect(option)}
                  >
                    {option.label}
                  </div>
                ))
              ) : (
                <div className="dropdown-empty">No options found</div>
              )}
            </div>

            {filteredOptions.length > itemsPerPage && (
              <div className="dropdown-pagination">
                <div className="pagination-info">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="pagination-controls">
                  <button
                    className="pagination-control"
                    disabled={currentPage === 1}
                    onClick={() => goToPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                  <button
                    className="pagination-control"
                    disabled={currentPage === totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchableDropdown;
