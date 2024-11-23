//Form to submit new products; Top h1 reads "Add a New Product Here!" as opposed
//to "Product Form" because "Product Form" reads like "It Is Your Birthday" from
//"The Office".

export default function ProductsForm({
  formData,
  handleOnChange,
  handleOnSubmit,
}) {
  return (
    <div>
      <h1>Add a New Product Here!</h1>
      <form onSubmit={handleOnSubmit}>
        <label htmlFor="productName"></label>
        {/* would normally add Text between label tags, but 
        initial state contains the appropriate text prompts */}
        <input
          type="text"
          name="productName"
          id="productName"
          value={formData.productName}
          onChange={handleOnChange}
        />
        <br />
        <label htmlFor="brand"></label>
        <input
          type="text"
          name="brand"
          id="brand"
          value={formData.brand}
          onChange={handleOnChange}
        />
        <br />
        <label htmlFor="image"></label>
        <input
          type="text"
          name="image"
          id="image"
          value={formData.image}
          onChange={handleOnChange}
        />
        <br />
        <label htmlFor="price"></label>
        <input
          type="text"
          name="price"
          id="price"
          value={formData.price}
          onChange={handleOnChange}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
