import React from 'react';
import { Dropdown } from 'paul-fds-ui';
import './ConditionDropdown.css';

const ConditionDropdown = ({ value = 'AND', onChange }) => {
  const options = [
    { name: 'AND', value: 'AND' },
    { name: 'OR', value: 'OR' }
  ];

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="condition-dropdown-container">
      <Dropdown
        className="condition-dropdown"
        options={options}
        value={selectedOption}
        onChange={(option) => onChange && onChange(option.value)}
        labelKey="name"
        valueKey="value"
        placeholder="Select condition"
      />
    </div>
  );
};
export default ConditionDropdown;
