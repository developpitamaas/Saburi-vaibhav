const express = require("express");
const Category = express.Router();
const Data = require("../controllers/Product/category");
const auth = require("../middleware/Auth");

// create product
Category.route("/create-category").post(auth.IsAuthenticateUser,auth.authorizeRole("admin") ,Data.CreateCategory)

// get all categories
Category.route("/get-all-categories").get(Data.GetAllCategories)            

// get single category
Category.route("/get-single-category/:id").get(Data.GetSingleCategory)

// update category
Category.route("/update-category/:id").put(auth.IsAuthenticateUser,auth.authorizeRole("admin") ,Data.UpdateCategory)

// delete category
Category.route("/delete-category/:id").delete(auth.IsAuthenticateUser,auth.authorizeRole("admin") ,Data.DeleteCategory)

// get all products by category
Category.route("/get-all-products-by-category/:id").get(Data.GetAllProductsByCategory)

// exports
module.exports = Category