import QuantityCounter from "./QuantityCounter";
//Basically another waystation, but note the implementation of the handles on the buttons
//below. Also note that the props for product have been broken up into their "sub-props"

export default function ProductCard({
  productName,
  brand,
  image,
  price,
  productQuantity,
  handleAddQuantity,
  handleRemoveQuantity,
  handleEdit,
  handleDelete,
  handleAddToCart,
  id,
  _id,
}) {
  return (
    <div className="ProductCard">
      <h3>{productName}</h3>
      <img src={image} alt="" />
      <h4>{brand}</h4>
      <br />
      <QuantityCounter
        handleAddQuantity={handleAddQuantity}
        productQuantity={productQuantity}
        handleRemoveQuantity={handleRemoveQuantity}
        id={id}
        mode="product"
      />
      <h3>{price}</h3>
      <button onClick={() => handleAddToCart(id)}>Add to Cart</button>
      <button
        onClick={() => handleEdit({ productName, brand, image, price, _id })} //adding {} around the props list here made a massive difference (controlled vs. uncontrolled)
      >
        Edit
      </button>
      <button onClick={() => handleDelete(_id)}>Delete</button>
    </div>
  );
}
