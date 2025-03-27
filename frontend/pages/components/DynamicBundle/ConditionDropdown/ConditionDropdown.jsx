import React from 'react';
import { Dropdown } from 'paul-fds-ui';
import './ConditionDropdown.css';

const ConditionDropdown = () => {
  const options = [
    { name: 'AND', value: 'AND' },
    { name: 'OR', value: 'OR' }
  ];

  const [selected, setSelected] = React.useState(options[0]);

  return (
    <div className="condition-dropdown-container">
      <Dropdown
        className="condition-dropdown"
        options={options}
        value={selected.value}
        onChange={(option) => setSelected(option.value)}
        placeholder="Select condition"
      />
    </div>
  );
};

export default ConditionDropdown;
