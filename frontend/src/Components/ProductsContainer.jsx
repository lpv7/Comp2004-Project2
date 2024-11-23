import ProductCard from "./ProductCard";

export default function ProductsContainer({
  products,
  handleAddQuantity,
  handleRemoveQuantity,
  handleAddToCart,
  productQuantity,
  handleEdit,
  handleDelete,
}) {
  return (
    <div className="ProductsContainer">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleAddToCart={handleAddToCart}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          productQuantity={
            productQuantity.find((p) => p.id === product.id).quantity
          }
        />
      ))}
    </div>
  );
}
