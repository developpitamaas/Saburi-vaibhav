const mongoose = require("mongoose");

// Define coupan schema
const coupanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  Coupancode: {
    type: String,
    required: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
  },
  applicableProducts: [
    { type: mongoose.Schema.Types.ObjectId, ref: "product" },
  ],
  applicableCategories: [
    { type: mongoose.Schema.Types.ObjectId, ref: "category" },
  ],
  coupanfor: {
    type: String,
    enum: ["all", "minimumOrderValue","category", "product"],
    required: true,
  },
  minimumOrderValue: {
    type: Number,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  Isexpired: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export coupan model
module.exports = mongoose.model("Coupan", coupanSchema);
