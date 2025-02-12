const express = require("express");
const Subscribe = express.Router();
const Data = require("../controllers/User/subscribe");
const Auth = require("../middleware/Auth");
// create subscribe
Subscribe.route("/create-subscribe").post(Data.CreateSubscribe)
Subscribe.route("/get-all-subscribe").get( Auth.IsAuthenticateUser,Auth.authorizeRole("admin"), Data.GetAllSubscribe)


// exports
module.exports = Subscribe