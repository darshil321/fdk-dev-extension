import { useGetGroupProductsQuery } from "@/store/api";
import { Button } from "paul-fds-ui";


export const GroupTable = ({ group, onRemove }) => {
  const { data: products, isLoading } = useGetGroupProductsQuery(group.id);

  if (isLoading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="group-table">
      <div className="group-table-header">
        <div className="header-info">
          <h4>{group.name}</h4>
          <span>{products?.length || 0} products</span>
        </div>
        <Button kind="secondary" size="s" onClick={onRemove}>Remove</Button>
      </div>
      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products?.map(product => (
            <tr key={product.id}>
              <td>{product.sku}</td>
              <td>
                <div className="product-info">
                  <img src={product.image} alt={product.name} />
                  <span>{product.name}</span>
                </div>
              </td>
              <td>₹{product.price}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={product.quantity || 1}
                  onChange={(e) => {
                    // Handle quantity change
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
