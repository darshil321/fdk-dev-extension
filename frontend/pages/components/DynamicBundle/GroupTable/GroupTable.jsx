import React, { useState, useEffect } from 'react';
import { Button } from 'paul-fds-ui';
import { Icons } from 'paul-icons-react';
import ProductItem from './ProductItem';
import { useGetGroupByIdQuery, useGetGroupProductsAddonsMutation } from '../../store/services/dynamicBundleApi';
import './GroupTable.css';

const GroupTable = ({
  group,
  onRemove,
  companyId,
  applicationId,
  onProductChange,
  products: initialProducts = []
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch group details to get products if not provided
  const { data: groupData, isLoading: isGroupLoading } = useGetGroupByIdQuery(
    { companyId, applicationId, groupId: group.value },
    { skip: !group.value || initialProducts.length > 0 }
  );

  // Mutation to fetch add-ons for products
  const [getAddOns, { isLoading: isAddOnsLoading }] = useGetGroupProductsAddonsMutation();

  useEffect(() => {
    const fetchProductsWithAddons = async () => {
      if (initialProducts.length > 0) {
        setProducts(initialProducts);
        setLoading(false);
        return;
      }

      if (groupData && groupData.products) {
        try {
          // Extract item_uids from group products
          const itemUids = groupData.products.map(p => p.item_uid);

          if (itemUids.length > 0) {
            // Fetch add-ons for these products
            const addonsResult = await getAddOns({
              companyId,
              applicationId,
              groupId: group.value,
              itemUids
            }).unwrap();

            // Transform and set products with add-ons
            const productsWithAddons = addonsResult.items.map(item => ({
              id: item.item_uid,
              item_uid: item.item_uid,
              name: item.name || `Product ${item.item_uid}`,
              size: "Regular",
              price: item.price || 0,
              quantity: 1,
              addOns: item.add_ons || [],
              imageUrl: item.image_url || "/api/placeholder/50/50"
            }));

            setProducts(productsWithAddons);
          }
        } catch (error) {
          console.error("Error fetching product add-ons:", error);
        }
      }

      setLoading(false);
    };

    fetchProductsWithAddons();
  }, [groupData, initialProducts, getAddOns, companyId, applicationId, group.value]);

  // Handle quantity change
  const handleQuantityChange = (productId, value) => {
    const updatedProducts = products.map(product => {
      if (product.id === productId || product.item_uid === productId) {
        const updatedProduct = { ...product, quantity: parseInt(value) || 1 };
        return updatedProduct;
      }
      return product;
    });

    setProducts(updatedProducts);
    onProductChange(group.value, updatedProducts);
  };

  // Handle price change
  const handlePriceChange = (productId, value) => {
    const updatedProducts = products.map(product => {
      if (product.id === productId || product.item_uid === productId) {
        const updatedProduct = { ...product, price: parseFloat(value) || 0 };
        return updatedProduct;
      }
      return product;
    });

    setProducts(updatedProducts);
    onProductChange(group.value, updatedProducts);
  };

  if (loading || isGroupLoading || isAddOnsLoading) {
    return <div className="group-table-loading">Loading group products...</div>;
  }

  return (
    <div className="group-table">
      <div className="group-header">
        <h3 className="group-title">{group.label}</h3>
        <Button
          kind="tertiary"
          icon={<Icons name="trash" />}
          onClick={() => onRemove(group.value)}
          className="remove-group-btn"
        />
      </div>

      {products.length > 0 ? (
        <div className="product-table">
          <div className="table-header">
            <div className="skus-column">SKUs</div>
            <div className="quantity-column">Quantity</div>
            <div className="price-column">Selling Price</div>
          </div>

          <div className="table-body">
            {products.map((product) => (
              <ProductItem
                key={product.id || product.item_uid}
                product={product}
                onQuantityChange={handleQuantityChange}
                onPriceChange={handlePriceChange}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-products">No products available in this group</div>
      )}
    </div>
  );
};

export default GroupTable;
