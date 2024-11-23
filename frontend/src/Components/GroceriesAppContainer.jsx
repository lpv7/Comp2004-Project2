//GITHUB RULEZ
//MINE
//IMPORTS
import { useState, useEffect } from "react";
import CartContainer from "./CartContainer";
import ProductsContainer from "./ProductsContainer";
import NavBar from "./NavBar";
import axios from "axios";
import ProductsForm from "./ProductsForm";

//MAIN FUNCTION
export default function GroceriesAppContainer() {
  //STATES
  //state for products list, now from mongo instead of our regular data file.
  const [productList, setProductList] = useState([]);

  //state for item count, used both in store and cart
  const [productQuantity, setProductQuantity] = useState(
    productList.map((product) => ({ id: product.id, quantity: 0 }))
  );

  //state for cart
  const [cartList, setCartList] = useState([]);

  //state for FORM, to add new products to the store! Note the initial state
  //serves as the prompts for users to enter the relevant information
  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    image: "",
    price: "",
  });

  //postResponse if successful triggers useEffect to run again (see below),
  //showing the updated products list
  const [postResponse, setPostResponse] = useState("");

  //indicates if we are editing or creating a new product; dictates patch or post
  const [isEditing, setIsEditing] = useState(false);

  // // React Hook Form. NEEDED for VALIDATION
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm();

  //USEEFFECT (see handler below) This will run initially (at the mount
  //stage), and each time a new product is added or removed, or an
  //existing one is edited
  useEffect(() => {
    handleProductsFromDB();
  }, [postResponse]);

  //HANDLERS
  //handleInitProductQuantity; sets initial quantity of products to 0, including (and most importantly) newly added ones.
  const handleInitProductQuantity = (produit) => {
    return produit.map((product) => ({ id: product.id, quantity: 0 }));
  };

  //handle to grab from Database, and display in backend, per effect above (under states). Note that due to the convoluted
  //creation of this project, we have to call setProductQuantity and our handler handleInitProductQuantity to successfully
  //initialize the products and their counts.
  const handleProductsFromDB = async () => {
    try {
      await axios.get("http://localhost:3000/products").then((result) => {
        setProductList(result.data);
        setProductQuantity(handleInitProductQuantity(result.data));
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  //handle to allow us to type input into the form (and hopefully when editing products in the store);
  //name in e.target.name refers to the name="" section of the input tag in HTML for each of productName,
  //brand, image, price(See Form Component)
  const handleOnChange = (e) => {
    setFormData(() => {
      return {
        ...formData,
        [e.target.name]: e.target.value,
      };
    });
  };

  //handle submit new info on form; naming matches useState above for formData.
  //
  const handleOnSubmit = async (e) => {
    e.preventDefault(); // YOU HAVE TO REMOVE THE BRACKETS FOR THIS TO WORK WITH VALIDATION, but LEAVE for now
    try {
      if (isEditing) {
        // If isEditing is true, then update the product
        try {
          await handleUpdate(formData._id); // Update the product
          await setIsEditing(false); // Set isEditing to false
          await setFormData({
            productName: "",
            brand: "",
            image: "",
            price: "",
          });
        } catch (error) {
          console.log(error.message);
        }
      } else {
        // If isEditing is false, then add the contact
        await axios
          .post("http://localhost:3000/add-product", formData)
          .then((response) => {
            console.log(response);
            setPostResponse(response.data.message);
          });
        setFormData({
          productName: "",
          brand: "",
          image: "",
          price: "",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //handleEdit: handles editing product information with the form
  const handleEdit = async (product) => {
    setIsEditing(true);
    setFormData({
      productName: product.productName,
      brand: product.brand,
      image: product.image,
      price: product.price,
      _id: product._id,
    });
  };

  //handleUpdate: handles updating product info in the database by id
  const handleUpdate = async (id) => {
    try {
      await axios
        .patch(`http://localhost:3000/products/${id}`, formData)
        .then((response) => {
          setPostResponse(response.data.message);
        });
      // handleContactsDB();
      // setPostResponse("Contact updated successfully");
    } catch (error) {
      console.log(error.message);
    }
  };

  //handle delete: handles deleting products from the database by ID
  const handleDelete = async (id) => {
    try {
      await axios
        .delete(`http://localhost:3000/products/${id}`)
        .then((response) => {
          setPostResponse(response.data.message);
        });
      // handleContactsDB();
      // setPostResponse("Contact deleted successfully");
    } catch (error) {
      console.log(error.message);
    }
  };

  //handleAddQuantity, handler will be sent all the way down to QuantityCounter component,
  //where like its component home, handleAddQuantity will function with the cart
  //(per mode ==== "cart") and the store itself (per mode === "product"). Each mode indicates
  //which "list" (item counter) will be updated (cartList or productQuantity), but otherwise
  //the functionality within each mode is the same.
  const handleAddQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setCartList(newCartList);
      return;
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };

  //handleRemoveQuantity. Very similar to its sibling above, handleAddQuantity,
  //but here we must enforce a lower limit, as this particular online store does
  //not allow the customer to add a negative quantity of items to the cart (or
  //zero items, see handleAddToCart). Within cart, if an item amount is above 1
  //the amount will be reduced. Currently no functionality to remove from cart by
  //reducing to zero, but remove and empty cart buttons work (see handles below)
  const handleRemoveQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product.id === productId && product.quantity > 1) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setCartList(newCartList);
      return;
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId && product.quantity > 0) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };

  //handleAddToCart: The big one, adding selected items from store to the cart,
  //to be rendered through CartContainer and CartCard. Grabs item ID and quantity,
  //sends as cartList then checks if the item is already in the cart (notice we've
  //defined productInCart) to search by id through the existing cart items); if so,
  //the new quantity is added to the existing quantity on the existing item;
  //otherwise a new card for the item is rendered (note the push function used!!!).
  //If the user attempts to add 0 of any item to the cart, they will be yelled at
  //via popup!
  const handleAddToCart = (productId) => {
    const product = productList.find((product) => product.id === productId);
    const pQuantity = productQuantity.find(
      (product) => product.id === productId
    );
    const newCartList = [...cartList];
    const productInCart = newCartList.find(
      (product) => product.id === productId
    );
    if (productInCart) {
      productInCart.quantity += pQuantity.quantity;
    } else if (pQuantity.quantity === 0) {
      alert(`Please select quantity for ${product.productName}`);
    } else {
      newCartList.push({ ...product, quantity: pQuantity.quantity });
    }
    setCartList(newCartList);
  };

  //handleRemoveFromCart uses filter to take out the selected id...by selecting all
  //other ids and only including those in the new array.
  const handleRemoveFromCart = (productId) => {
    const newCartList = cartList.filter((product) => product.id !== productId);
    setCartList(newCartList);
  };

  //handleClearCart sets cartList to an empty array, []
  const handleClearCart = () => {
    setCartList([]);
  };

  return (
    <div>
      <NavBar quantity={cartList.length} />
      <div className="GroceriesApp-Container">
        <ProductsForm
          formData={formData}
          handleOnChange={handleOnChange}
          handleOnSubmit={handleOnSubmit}
          isEditing={isEditing}
          //other stuff (see ContactsApp) for validation
        />
        <ProductsContainer
          products={productList}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleAddToCart={handleAddToCart}
          productQuantity={productQuantity}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
        <CartContainer
          cartList={cartList}
          handleRemoveFromCart={handleRemoveFromCart}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleClearCart={handleClearCart}
        />
      </div>
    </div>
  );
}
