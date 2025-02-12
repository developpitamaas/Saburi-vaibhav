const mongoose = require("mongoose");

// Define product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  Tax: {
    type: Number,
    default: 0.05,
  },
  subTitle: {
    type: String,
  },
  Size: {
    type: String,
  },
  description: {
    type: String,
  },
  image: [
    {
      type: String,
      default:
        "https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png",
    },
  ],
  thumbnail: {
    type: String,
    default:
      "https://www.dentee.com/buy/content/images/thumbs/default-image_450.png",
  },
  category: {
    ref: "category",
    type: mongoose.Schema.Types.ObjectId,
  },
  brand: {
    type: String,
  },
  Size: [
    {
      type: String,
    },
  ],
  IsOutOfStock: {
    type: String,
    default: "false",
  },
 
});

// Export product model
module.exports = mongoose.model("product", productSchema);
