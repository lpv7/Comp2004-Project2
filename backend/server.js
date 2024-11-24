//GITHUB RULEZ

//imports and initializations
const express = require("express"); //express server
const server = express();
const port = 3000; //old reliable
const mongoose = require("mongoose"); //mongo database
const cors = require("cors");
const Product = require("./models/product"); //see product.js, basically formatting data that will be sent to mongo
require("dotenv").config();
const { DB_URI } = process.env; //URI: Universal Resource Indicator. See .env file

//MIDDLEWARE
server.use(express.json()); //change (convert?) everything we will use into json (per lecture 11/11)
server.use(cors());
server.use(express.urlencoded({ extended: true })); //deprecated?? allows server (computer) to read/see information from URLs (per lecture 11/11)

//DB connect and server start. Connect to server via link in DB_URI (in .env)
mongoose
  .connect(DB_URI)
  .then((res) => {
    server.listen(port, () => {
      console.log(`DB connected...\nServer is listening on ${port}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });

//routing
//root
server.get("/", (request, response) => {
  response.send("LIVE!");
});

//render existing product list. That find function is so useful!
server.get("/products", async (request, response) => {
  try {
    await Product.find().then((result) => response.status(200).send(result));
  } catch (error) {
    console.log(error.message);
  }
});

//once a new product has been successfully added via the form, add (post) to the existing list
server.post("/add-product", async (request, response) => {
  const { productName, brand, image, price, quantity } = request.body;
  const newProduct = new Product({
    productName,
    brand,
    image,
    price, // quantity: 0,
    id: crypto.randomUUID(),
  });
  try {
    await newProduct.save();
    response.status(201).json({ message: "Product added successfully!" });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
});

//patch, ie update an existing entry, ie product!
//findByIdAndUpdate? AMAZING! Courtesy of Mongoose
server.patch("/products/:id", async (request, response) => {
  const { id } = request.params;
  const { productName, brand, image, price } = request.body;
  const objectId = new mongoose.Types.ObjectId(id); // Convert id to Mongoose ObjectId
  try {
    await Product.findById(objectId).then((result) => {
      console.log(result);
    });
  } catch (error) {
    response.status(404).json({ message: "Can't find it" });
  }
  try {
    await Product.findByIdAndUpdate(objectId, {
      productName,
      brand,
      image,
      price,
      id: crypto.randomUUID(),
    }).then((result) => {
      console.log(result);
      response.status(200).json({ message: "Product updated successfully" });
    });
  } catch (error) {
    console.log(error.message);
    response.status(404).json({ message: error.message });
  }
});

//Delete. Bye bye product :(
server.delete("/products/:id", async (request, response) => {
  const { id } = request.params;
  const objectId = new mongoose.Types.ObjectId(id); //Convert id to Mongoose Object ID
  try {
    await Product.findByIdAndDelete(objectId); //What a usefull function!!!
    response.status(200).json({ message: "Product deleted :(" });
  } catch (error) {
    console.log(error.message);
    response.status(404).json({ message: error.message });
  }
});
