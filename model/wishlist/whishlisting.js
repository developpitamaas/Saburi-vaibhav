const mongoose = require("mongoose");

// Define wishlist schema
const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
})

// Export wishlist model
module.exports = mongoose.model("wishlistData", wishlistSchema);