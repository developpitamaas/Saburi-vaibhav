const mongoose = require("mongoose");

// Define banner schema
const ExistingOfferSchema = new mongoose.Schema({
    bannerImage: {
        type: String,
        required: true,
    },
    BannerFor : {
        type: String,
    },
});

// Export banner model
const ExistingOffer = mongoose.model("existingoffer", ExistingOfferSchema);

module.exports = ExistingOffer;