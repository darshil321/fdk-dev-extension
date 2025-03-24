import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeTab, onTabChange }) => {
  return (
    <aside className="sidebar">
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'bundles' ? 'active' : ''}`}
          onClick={() => onTabChange('bundles')}
        >
          Bundle Listing
        </button>
        <button
          className={`tab ${activeTab === 'groups' ? 'active' : ''}`}
          onClick={() => onTabChange('groups')}
        >
          Groups
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
