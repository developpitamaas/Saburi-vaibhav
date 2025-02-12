const mongoose = require("mongoose");

// Define shiped address schema
const shipedAddressSchema = new mongoose.Schema({
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    phonenumber: {
        type: Number,
    },
    address: {
        type: String,
    },
    pincode: {
        type: Number,
    },
    country : {
        type: String,
    },
    state : {
        type: String,
    },
    city : {
        type: String,
    },
    userId : {
        ref: "user",
        type: mongoose.Schema.Types.ObjectId
    }
})

// Export shiped address model
module.exports = mongoose.model("shipedaddress", shipedAddressSchema)