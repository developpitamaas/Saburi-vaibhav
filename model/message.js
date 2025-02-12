const mongoose = require("mongoose");

// Define message schema
const messageSchema = new mongoose.Schema({
    message:{
        type: String,
    },
    time: {
        type: Number,
        required: true,
    }
})

// Export message model
module.exports = mongoose.model("messagetest", messageSchema)