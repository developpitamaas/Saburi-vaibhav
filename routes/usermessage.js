const Data = require("../controllers/User/usermessage");
const express = require("express");
const Message = express.Router();
const auth = require("../middleware/Auth");

// create message
Message.route("/create-message").post(Data.CreateMessage)

// get all messages
Message.route("/get-all-messages").get( auth.IsAuthenticateUser,auth.authorizeRole("admin") , Data.GetAllMessages)

// exports
module.exports = Message