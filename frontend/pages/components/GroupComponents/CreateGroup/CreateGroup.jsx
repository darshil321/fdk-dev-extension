import React, { useState } from 'react';

import SKUSelectionModal from './SKUSelectionModal';
import './CreateGroup.css';
import { Button, Card, Input } from 'paul-fds-ui';

const CreateGroup = ({ companyId, onClose }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedSKUs, setSelectedSKUs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddSKUs = (skus) => {
    setSelectedSKUs([...selectedSKUs, ...skus]);
    setIsModalOpen(false);
  };

  const handleRemoveSKU = (skuToRemove) => {
    setSelectedSKUs(selectedSKUs.filter(sku => sku.id !== skuToRemove.id));
  };

  return (
    <div className="create-group-container">
      <h2 className="create-group-title">Create New Group</h2>

      <Card className="group-details-card">
        <h3 className="card-title">Group Details</h3>
        <div className="form-field">
          <Input
            label="Group Name"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
        </div>
      </Card>

      <Card className="sku-selection-card">
        <div className="sku-header">
          <div>
            <h3 className="card-title">SKU</h3>
            <p className="sku-subtitle">Select all SKU's to apply to this Group</p>
          </div>
          <Button
            kind="primary"
            size="m"
            onClick={() => setIsModalOpen(true)}
          >
            Add SKUs
          </Button>
        </div>

        {selectedSKUs.length > 0 && (
          <div className="selected-skus-list">
            {selectedSKUs.map(sku => (
              <div key={sku.id} className="sku-item">
                <div className="sku-info">
                  <img src={sku.image} alt={sku.name} />
                  <div>
                    <h4>{sku.name}</h4>
                    <p>{sku.code}</p>
                  </div>
                </div>
                <Button
                  kind="secondary"
                  size="s"
                  onClick={() => handleRemoveSKU(sku)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <SKUSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddSKUs}
        companyId={companyId}
        existingSkus={selectedSKUs}
      />
    </div>
  );
};

export default CreateGroup;
