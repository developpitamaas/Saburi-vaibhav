const express = require("express");
const cors = require("cors");
const User = require("./routes/user");
const Product = require("./routes/product");
const Category = require("./routes/category");
const Address = require("./routes/address");
// const Order = require("./routes/order");
const Admin = require("./routes/admin");
const Coupan = require("./routes/Coupan");
const Wishlist = require("./routes/Wishlist");
const Message = require("./routes/usermessage");   
const Subscribe = require("./routes/subscribe");
const Cart = require("./routes/cart");
const SecondOrder = require("./routes/SecondOrder");
const cookieParser = require("cookie-parser");   
const Banner = require("./routes/offer");

const Razorpay = require("./routes/razopay");
const axios = require("axios");
// define app using express
const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// use routes
app.use(
  "/api",
  User,
  Product,
  Category,
  Address,
  // Order,
  Admin,
  Wishlist,
  Coupan,
  Message,
  Subscribe,
  Cart,
  SecondOrder,
  Banner,
  Razorpay
);

// default route
app.get("/", (req, res) => {
  res.send("Hello World!, Server is running");
});
