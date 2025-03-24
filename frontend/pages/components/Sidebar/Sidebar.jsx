import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeTab, onTabChange }) => {
  console.log('activeTab', activeTab)
  return (
    <aside className="sidebar">
      <div className="tabs">
        <div
          className={`tab ${activeTab === 'bundles' ? 'active' : ''}`}
          onClick={() => onTabChange('bundles')}
        >
          Bundle Listing
        </div>
        <div
          className={`tab ${activeTab === 'groups' ? 'active' : ''}`}
          onClick={() => onTabChange('groups')}
        >
          Groups
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
