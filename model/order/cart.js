// cart.js
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
      singleProductPrice: {
        type: Number,
      },
      quantity: {
        type: Number,
        required: true,
      },
      totalPrice:{
        type: Number,
      },
      size: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productsize",
      },
      // Iscoupanapplie: {
      //   type: Boolean,
      //   default: false,
      // },
      // Coupan: {
      //   type: String,
      // },
      // CoupandiscountPercentage: {
      //   type: Number,
      // },
      // if coupan applied then
      // PorudctpricebeforeapplyCoupan: {
      //   type: Number,
      // }
    },
  ],

  // taxPrice: {
  //   type: Number,
  //   required: true,
  //   default: 1.05, // 5% tax
  // },
  // priceAfterAddingTax: {
  //   type: Number,
  // },
  // TotalProductPrice: {
  //   type: String,
  // },
  // shippingPrice: {
  //   type: Number,
  //   required: true,
  //   default: 0.0,
  // },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  totalPriceWithoutDiscount: {
    type: Number,
    required: true,
    default: 0.0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // Iscoupanapplied: {
  //   type: String,
  //   default: "false",
  // },
  // CoupanCode: {
  //   type: String,
  // },
  // CoupanDiscount:{
  //   type:Number
  // },
  // priceafterAddingMinimumOrderValueCoupan:{
  //   type:Number
  // },
  activecart: {
    type: String,
    default: "true",
  }

});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
