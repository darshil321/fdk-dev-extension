import React, { useState, useRef, useEffect } from 'react';
import './ConditionDropdown.css';

const ConditionDropdown = ({ value = 'AND', onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { label: 'AND', value: 'AND' },
    { label: 'OR', value: 'OR' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="condition-wrapper">
      <div className="horizontal-line"></div>
      <div className="custom-dropdown-container" ref={dropdownRef}>
        <button
          type="button"
          className="custom-dropdown-trigger"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selectedOption.label}</span>
          <svg
            className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {isOpen && (
          <div className="custom-dropdown-options">
            {options.map((option) => (
              <div
                key={option.value}
                className={`custom-dropdown-option ${option.value === value ? 'selected' : ''}`}
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConditionDropdown;
