import React, { useState, useEffect } from 'react';

import axios from 'axios';
import './SKUSelectionModal.css';
import { Button, Input, Modal } from 'paul-fds-ui';

const SKUSelectionModal = ({ isOpen, onClose, onAdd, companyId, existingSkus }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [skus, setSkus] = useState([]);
  const [selectedSkus, setSelectedSkus] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSKUs();
    }
  }, [isOpen]);

  const fetchSKUs = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/skus', {
        headers: {
          'x-company-id': companyId
        },
        params: {
          search: searchQuery
        }
      });
      setSkus(response.data.items);
    } catch (error) {
      console.error('Error fetching SKUs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Debounce search
    setTimeout(() => {
      fetchSKUs();
    }, 300);
  };

  const toggleSkuSelection = (sku) => {
    if (selectedSkus.find(s => s.id === sku.id)) {
      setSelectedSkus(selectedSkus.filter(s => s.id !== sku.id));
    } else {
      setSelectedSkus([...selectedSkus, sku]);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="sku-selection-modal"
    >
      <div className="modal-header">
        <h3>Select SKUs</h3>
        <Input
          placeholder="Search SKUs"
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <div className="sku-list">
        {loading ? (
          <div className="loading">Loading SKUs...</div>
        ) : (
          skus.map(sku => (
            <div
              key={sku.id}
              className={`sku-list-item ${
                selectedSkus.find(s => s.id === sku.id) ? 'selected' : ''
              }`}
              onClick={() => toggleSkuSelection(sku)}
            >
              <div className="sku-info">
                <img src={sku.image} alt={sku.name} />
                <div>
                  <h4>{sku.name}</h4>
                  <p>{sku.code}</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={!!selectedSkus.find(s => s.id === sku.id)}
                readOnly
              />
            </div>
          ))
        )}
      </div>

      <div className="modal-footer">
        <Button
          kind="secondary"
          size="m"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          kind="primary"
          size="m"
          onClick={() => onAdd(selectedSkus)}
        >
          Add Selected
        </Button>
      </div>
    </Modal>
  );
};

export default SKUSelectionModal;
