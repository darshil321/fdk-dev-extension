import React from 'react';
import { Dropdown } from 'paul-fds-ui';
import './ConditionDropdown.css';

const ConditionDropdown = ({ value = 'AND', onChange }) => {
  const options = [
    { label: 'AND', value: 'AND' },
    { label: 'OR', value: 'OR' }
  ];

  return (
    <div className="condition-dropdown-container">
      <Dropdown
        className="condition-dropdown"
        options={options}
        value={value}
        onChange={onChange || (() => {})}
      />
    </div>
  );
};

export default ConditionDropdown;
