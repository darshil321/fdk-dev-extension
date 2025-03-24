import React from 'react';

import './EmptyState.css';
import { Button } from 'paul-fds-ui';

const EmptyState = ({ onCreateClick }) => {
  return (
    <div className="empty-bundle-state">
      <h2>No Bundles Found</h2>
      <p>
        Create a customisable bundle that combines individual items into a complete meal,
        simplifying product relationships and dynamic promotions
      </p>
      <div className="button-group">
        <Button
          kind="secondary"
          onClick={() => window.open('https://partners.fynd.com/docs/bundles', '_blank')}
        >
          Learn More
        </Button>
        <Button
          kind="primary"
          onClick={onCreateClick}
        >
          Create Bundle
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
