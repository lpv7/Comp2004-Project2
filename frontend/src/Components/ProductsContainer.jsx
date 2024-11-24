import ProductCard from "./ProductCard";
//This is essentially just a "waystation" component, serving as a passing through point for props and the main
//container for all product cards, ie the items that make up the store. Note the use of map and find below.
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
