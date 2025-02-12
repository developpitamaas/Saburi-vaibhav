const express = require("express");
const Wishlist = express.Router();
const Data = require("../controllers/wishlist/wishlistcontroller");
const auth = require("../middleware/Auth");

// create wishlist
Wishlist.route("/create-wishlist/:productId").post(auth.IsAuthenticateUser, Data.CreateWishlist)

// remove product from wishlist
Wishlist.route("/remove-product/:productId").delete(auth.IsAuthenticateUser, Data.RemoveProductFromWishlist)

// get my wishlist
Wishlist.route("/get-my-wishlist").get(auth.IsAuthenticateUser, Data.GetMyWishlist)

// find wishlist by product id
Wishlist.route("/find-wishlist-by-product/:productId").get(auth.IsAuthenticateUser, Data.FindWishlistByProductId)


// exports
module.exports = Wishlist