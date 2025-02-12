const mongoose = require("mongoose");

// Define banner schema
const bannerSchema = new mongoose.Schema({
    bannerImage: {
        type: String,
        required: true,
    },
    BannerFor : {
        type: String,
    },
    BannerCategory : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
    },
});

// Export banner model
const Banner = mongoose.model("banner", bannerSchema);

module.exports = Banner;