import React, { useState } from 'react';
import { Input, Dropdown } from 'paul-fds-ui';
import { Icons } from 'paul-icons-react';
import './ProductItem.css';

const ProductItem = ({ product, onQuantityChange, onPriceChange, currency = "RM" }) => {
  const [addOnsOpen, setAddOnsOpen] = useState(false);

  return (
    <>
      <div className="product-row">
        <div className="skus-column">
          <div className="product-info">
            <img
              src={product.imageUrl || "/api/placeholder/50/50"}
              alt={product.name}
              className="product-image"
            />
            <div className="product-details">
              <div className="product-name">{product.name}</div>
              <div className="product-size">Size: {product.size || "Regular"}</div>
              {product.addOns && product.addOns.length > 0 && (
                <div
                  className="product-addons"
                  onClick={() => setAddOnsOpen(!addOnsOpen)}
                >
                  <span>{product.addOns.length} Add-Ons</span>
                  <Icons name={addOnsOpen ? "chevron-up" : "chevron-down"} size={14} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="quantity-column">
          <Input
            type="number"
            value={product.quantity || 1}
            onChange={(e) => onQuantityChange(product.id || product.item_uid, e.target.value)}
            min="1"
            className="quantity-input"
          />
        </div>

        <div className="price-column">
          <div className="price-field">
            <Dropdown
              options={[{ label: currency, value: currency }]}
              value={currency}
              className="currency-dropdown"
            />
            <Input
              type="number"
              value={product.price || 0}
              onChange={(e) => onPriceChange(product.id || product.item_uid, e.target.value)}
              min="0"
              step="0.01"
              className="price-input"
            />
          </div>
        </div>
      </div>

      {/* Add-ons section (shown when expanded) */}
      {addOnsOpen && product.addOns && product.addOns.length > 0 && (
        <div className="addons-container">
          {product.addOns.map((addon, index) => (
            <div className="addon-row" key={addon.item_uid || index}>
              <div className="addon-info">
                <span className="addon-dot">•</span>
                <span className="addon-name">{addon.name || `Add-on ${index + 1}`}</span>
                {addon.is_default && <span className="addon-default-badge">Default</span>}
              </div>
              <div className="addon-quantity">1</div>
              <div className="addon-price">
                {addon.price ? `+${currency} ${Number(addon.price).toFixed(2)}` : 'Included'}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ProductItem;
