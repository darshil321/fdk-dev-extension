import React, { useState, useEffect } from 'react';
import { Button, Input } from 'paul-fds-ui';
import { Icons } from 'paul-icons-react';
import { useGetGroupsQuery } from '../../store/services/dynamicBundleApi';
import './GroupSelector.css';

const GroupSelector = ({ onGroupSelect, companyId, applicationId, selectedGroups = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');


  const { data: groups, isLoading, error } = useGetGroupsQuery(
    {
      companyId,
      applicationId,
      params: { name: searchTerm }
    },
    { skip: !isOpen }
  );


  const filteredGroups = groups?.filter(group =>
    !selectedGroups.some(selectedGroup => selectedGroup.value === group.value)
  ) || [];


  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.querySelector('.group-selector-container');
      if (dropdown && !dropdown.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleGroupSelect = (group) => {
    onGroupSelect(group);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="group-selector-container">
      <Button
        kind="text"
        className="add-group-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icons name="plus" size={16} /> Add Group
      </Button>

      {isOpen && (
        <div className="group-dropdown">
          <div className="group-dropdown-header">
            <p>Select Group</p>
            <div className="group-search">
              <Input
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  kind="tertiary"
                  icon={<Icons name="x" />}
                  onClick={() => setSearchTerm('')}
                />
              )}
              <Button
                kind="tertiary"
                icon={<Icons name="chevron-up" />}
                onClick={() => setIsOpen(false)}
              />
            </div>
          </div>

          <div className="group-dropdown-options">
            {isLoading ? (
              <div className="group-loading">Loading groups...</div>
            ) : error ? (
              <div className="group-error">Error loading groups</div>
            ) : filteredGroups.length === 0 ? (
              <div className="no-groups-found">
                {searchTerm ? 'No matching groups found' : 'No available groups'}
              </div>
            ) : (
              filteredGroups.map(group => (
                <div
                  key={group.value}
                  className="group-option"
                  onClick={() => handleGroupSelect(group)}
                >
                  {group.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupSelector;
