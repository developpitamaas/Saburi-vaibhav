const Data = require("../controllers/message");
const express = require("express");
const Message = express.Router();

// create message
Message.route("/create-message").post(Data.CreateMessage)
// get all messages
Message.route("/get-all-messages").get(Data.GetAllMessages)

// export 
module.exports = Message