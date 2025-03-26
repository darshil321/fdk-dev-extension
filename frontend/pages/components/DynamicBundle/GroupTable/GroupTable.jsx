import React, { useState, useEffect } from "react";
import { Button, DataTable, Dropdown } from "paul-fds-ui";
import { Icons } from "paul-icons-react";

import "./GroupTable.css";
import {
  useGetGroupByIdQuery,
  useGetGroupProductsAddonsMutation,
} from "@/store/services/bundles";
import SvgIcon from "../../Icons/LeftArrow";
import FormCard from "../../common/FormCard/FormCard";
import InputField from "../../common/Form/Input/Input";

const GroupTable = ({
  group,
  onRemove,
  companyId,
  applicationId,
  onProductChange,
  products: initialProducts = [],
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch group details to get products if not provided
  const { data: groupData, isLoading: isGroupLoading } = useGetGroupByIdQuery(
    { companyId, applicationId, groupId: group.value },
    { skip: !group.value || initialProducts.length > 0 }
  );

  // Mutation to fetch add-ons for products
  const [getAddOns, { isLoading: isAddOnsLoading }] =
    useGetGroupProductsAddonsMutation();

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
          const itemUids = groupData.products.map((p) => p.item_uid);

          if (itemUids.length > 0) {
            // Fetch add-ons for these products
            const addonsResult = await getAddOns({
              companyId,
              applicationId,
              groupId: group.value,
              itemUids,
            }).unwrap();

            // Transform and set products with add-ons
            const productsWithAddons = addonsResult.items.map((item) => ({
              id: item.item_uid,
              item_uid: item.item_uid,
              name: item.name || `Product ${item.item_uid}`,
              size: "Regular",
              price: item.price || 0,
              quantity: 1,
              addOns: item.add_ons || [],
              imageUrl: item.image_url || "/api/placeholder/50/50",
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
  }, [
    groupData,
    initialProducts,
    getAddOns,
    companyId,
    applicationId,
    group.value,
  ]);

  // Handle quantity change
  const handleQuantityChange = (productId, value) => {
    const updatedProducts = products.map((product) => {
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
    const updatedProducts = products.map((product) => {
      if (product.id === productId || product.item_uid === productId) {
        const updatedProduct = { ...product, price: parseFloat(value) || 0 };
        return updatedProduct;
      }
      return product;
    });

    setProducts(updatedProducts);
    onProductChange(group.value, updatedProducts);
  };

  // if (loading || isGroupLoading || isAddOnsLoading) {
  //   return <div className="group-table-loading">Loading group products...</div>;
  // }
  console.log("groupData", groupData);

  return (
    <div className="">
      <FormCard variant="secondary" style={{ padding: "0px" }}>
        <div className="group-table">
          <div className="group-table-header">
            <p className="sku-column">SKUs</p>
            <p className="qty-column"> Quantity</p>
            <p className="price-column">Selling Price</p>
          </div>

          <div className="group-table-body">
            {products?.map((product) => (
              <div key={product.id || product.item_uid} className="product-row">
                <div className="product-info">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="product-name">{product.name}</div>
                </div>

                <div className="product-qty">
                  <InputField
                    type="number"
                    value={product.quantity}
                    onChange={(e) =>
                      handleQuantityChange(
                        product.id || product.item_uid,
                        e.target.value
                      )
                    }
                    min="1"
                    className="quantity-input"
                    style={{}}
                  />
                </div>

                <div className="product-price">
                  <InputField
                    onChange={function Ya() {}}
                    placeholder="0"
                    prefix={
                      <Dropdown
                        onChange={function Ya() {}}
                        options={[{ name: "RM", value: "RM" }]}
                        placeholder="RM"
                        size="m"
                        style={{ width: "70px" }}
                        value={{ name: "RM", value: "RM" }}
                      />
                    }
                    size="m"
                    type="Number"
                    min="0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </FormCard>
    </div>
  );
};

export default GroupTable;
