const Wishlist = require("../../model/wishlist/whishlisting.js");
const User = require("../../model/User/users");
const Product = require("../../model/Product/product");
const TryCatch = require("../../middleware/Trycatch");

// create wishlist
// create or remove wishlist
const CreateWishlist = TryCatch(async (req, res, next) => {
  const existingWishlist = await Wishlist.findOne({
    userId: req.user.id,
    products: req.params.productId,
  });

  if (existingWishlist) {
    // Product already exists in wishlist, so remove it
    await Wishlist.findOneAndDelete({
      userId: req.user.id,
      products: req.params.productId,
    });
    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
    });
  } else {
    // Product doesn't exist in wishlist, so add it
    const wishlist = await Wishlist.create({
      userId: req.user.id,
      products: req.params.productId,
    });
    res.status(201).json({
      success: true,
      message: "Product added to wishlist",
      wishlist,
    });
  }
});

// get my wishlist
const GetMyWishlist = TryCatch(async (req, res, next) => {
  const wishlist = await Wishlist.find({ userId: req.user.id })
    .populate("userId")
    .populate("products");
  res.status(200).json({
    success: true,
    totalProduct : wishlist.length,
    wishlist,
  });
});

// remove product from wishlist by product id
const RemoveProductFromWishlist = TryCatch(async (req, res, next) => {
  const wishlist = await Wishlist.findOneAndDelete({
    userId: req.user.id,
    productId: req.params.productId,
  });
  res.status(200).json({
    success: true,
    message: "Product removed from wishlist",
  });
});

// find wishlist by product id
const FindWishlistByProductId = TryCatch(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({
    userId: req.user.id,
    productId: req.params.productId,
  })
    .populate("userId")
    .populate("products");
  res.status(200).json({
    success: true,
    wishlist,
  });
});

// export
module.exports = {
  CreateWishlist,
  RemoveProductFromWishlist,
  GetMyWishlist,
  FindWishlistByProductId,
};
