const mongoose = require("mongoose");

const userMessageSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    message: {
        type: String,
        required: true
    },
    phonennumber: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("usermessage", userMessageSchema)