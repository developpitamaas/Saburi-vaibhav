const mongoose = require("mongoose");

// Define subscribe schema
const subscribeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Export subscribe model
module.exports = mongoose.model("subscribe", subscribeSchema)