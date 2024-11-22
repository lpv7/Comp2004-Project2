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

server.get("/products", async (request, response) => {
  try {
    await Product.find().then((result) => response.status(200).send(result));
  } catch (error) {
    console.log(error.message);
  }
});
