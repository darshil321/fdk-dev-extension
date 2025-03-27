import { Dropdown, Input } from "paul-fds-ui";
import { Icons } from "paul-icons-react";
import { useEffect, useState } from "react";

import {
    useGetGroupByIdQuery,
    useGetGroupProductsAddonsMutation,
} from "@/store/services/bundles";
import InputField from "../../common/Form/Input/Input";
import FormCard from "../../common/FormCard/FormCard";
import "./GroupTable.css";

const GroupTable = ({
  group,
  companyId,
  applicationId,
  onProductChange,
  products: initialProducts = [],
}) => {
  const [products, setProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(true);
  const [expandedProducts, setExpandedProducts] = useState({});

  const { data: groupData } = useGetGroupByIdQuery(
    { companyId, applicationId, groupId: group.value },
    { skip: !group.value || initialProducts.length > 0 }
  );

  const [getAddOns] =
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
          const itemUids = groupData.products.map((p) => p.item_uid);

          if (itemUids.length > 0) {
            const addonsResult = await getAddOns({
              companyId,
              applicationId,
              groupId: group.value,
              itemUids,
            }).unwrap();

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

  const toggleAddOns = (productId) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const handleQuantityChange = (productId, value) => {
    const updatedProducts = products.map(product => {
      if (product.id === productId || product.item_uid === productId) {
        return { ...product, quantity: parseInt(value) || 1 };
      }
      return product;
    });

    setProducts(updatedProducts);
    onProductChange && onProductChange(group.value, updatedProducts);
  };


  return (
    <div className="group-table-container">
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
                    src={"/images/empty.png"}
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="product-details">
                    <div className="product-name">{product.name}</div>
                    <div className="product-size">Size: {product.size || "Regular"}</div>
                    {product.addOns && product.addOns.length > 0 && (
                      <div
                        className="product-addons"
                        onClick={() => toggleAddOns(product.id || product.item_uid)}
                      >
                        <span>{product.addOns.length} Add-Ons</span>
                        <Icons
                          name={expandedProducts[product.id || product.item_uid] ? "chevron-up" : "chevron-down"}
                          size={14}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="quantity-column">
                  <Input
                    type="number"
                    value={product.quantity || 1}
                    onChange={(e) => handleQuantityChange(product.id || product.item_uid, e.target.value)}
                    min="1"
                    className="quantity-input"
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
