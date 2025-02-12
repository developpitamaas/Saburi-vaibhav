const mongoose = require("mongoose");

// Define billing address schema
const billingAddressSchema = new mongoose.Schema({
    name: {
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
    GSTNumber : {
        type: Number,
    },
    userId : {
        ref: "user",
        type: mongoose.Schema.Types.ObjectId
    }
})

// Export billing address model
module.exports = mongoose.model("billingaddress", billingAddressSchema)