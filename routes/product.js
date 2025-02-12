const express = require("express");
const Product = express.Router();
const Data = require("../controllers/Product/product");
const ProductSize = require("../controllers/Product/Productsize");
const auth = require("../middleware/Auth");

// create product
Product.route("/create-product").post(auth.IsAuthenticateUser,auth.authorizeRole("admin") ,Data.CreateProduct)

// get all products
Product.route("/get-all-products").get(Data.GetAllProducts)

// get single product
Product.route("/get-single-product/:id").get(Data.GetSingleProduct)

// update product
Product.route("/update-product/:id").put(auth.IsAuthenticateUser,auth.authorizeRole("admin") ,Data.UpdateProduct)

// delete product
Product.route("/delete-product/:id").delete(auth.IsAuthenticateUser,auth.authorizeRole("admin") ,Data.DeleteProduct)

// ProductSize
Product.route("/update-productsize/:id").put(auth.IsAuthenticateUser,auth.authorizeRole("admin") ,ProductSize.UpdateProductsize)
Product.route("/delete-productsize/:id").delete(auth.IsAuthenticateUser,auth.authorizeRole("admin") ,ProductSize.DeleteProductsize)

// exports 
module.exports = Product