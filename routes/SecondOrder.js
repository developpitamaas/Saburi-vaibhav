const express = require("express");
const SecondOrder = express.Router();
const Data = require("../controllers/order/secondOrder");
const Auth = require("../middleware/Auth");
const RazorpayData = require("../controllers/order/razorpay/razorpayController");

SecondOrder.route("/create-second-order").post(Auth.IsAuthenticateUser, Data.CreateSecondOrder)
SecondOrder.route("/create-razorpay-order").post(RazorpayData.CreateRazorpayOrder)

SecondOrder.route("/get-my-second-order").get(Auth.IsAuthenticateUser,Data.GetMySecondOrder)
SecondOrder.route("/get-second-order-by-id/:id").get(Auth.IsAuthenticateUser,Data.GetSecondOrderById)
SecondOrder.route("/get-all-second-order").get(Auth.IsAuthenticateUser,Data.GetAllsecondOrders)
SecondOrder.route("/update-second-order-by-id/:id").put(Auth.IsAuthenticateUser,Data.UpdateSecondOrder)

// module.exports
module.exports = SecondOrder 