const mongoose = require("mongoose");

// Define product category schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    Image: {
        type: String,
    },
})

// Export product category model
module.exports = mongoose.model("category", categorySchema)
