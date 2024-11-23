import "./App.css";
//import products from "./data/products";//NOW USING MONGO INSTEAD OF THE DATA FILE
import GroceriesAppContainer from "./Components/GroceriesAppContainer";

function App() {
  return (
    <>
      <GroceriesAppContainer />
      {/* products={products} NO NEED FOR THIS ANYMORE AS WE REMOVED THE DATA FILE*/}
    </>
  );
}

export default App;
