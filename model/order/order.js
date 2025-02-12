const mongoose = require("mongoose");

// Define order schema
const orderSchema = new mongoose.Schema({
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
      totalPrice: {
        type: Number,
      },
      size: {
        type: String,
      },
      Iscoupanapplie: {
        type: Boolean,
        default: false,
      },
      Coupan: {
        type: String,
      },
      CoupandiscountPercentage: {
        type: Number,
      },
      // if coupan applied then
      PorudctpricebeforeapplyCoupan: {
        type: Number,
      },
    },
  ],
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "shipedaddress",
  },
  paymentMethod: {
    type: String,
    required: true,
    default: "Cash On Delievery",
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 1.05, // 5% tax
  },
  priceAfterAddingTax: {
    type: Number,
  },
  TotalProductPrice: {
    type: Number,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false,
  },
  paidAt: {
    type: Date,
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false,
  },
  deliveredAt: {
    type: Date,
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  Iscoupanapplied: {
    type: String,
    default: "false",
  },
  CoupanCode: {
    type: String,
  },
  CoupanDiscount: {
    type: Number,
  },
  priceafterAddingMinimumOrderValueCoupan: {
    type: Number,
  },
}, { timestamps: true });

// Export order model
module.exports = mongoose.model("Order", orderSchema);
