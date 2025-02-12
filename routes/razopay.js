const express = require("express");
const Razorpay = express.Router();
const  Data = require("../controllers/razopay/testing")

 
Razorpay.route("/create-razorpay-order").post(Data.CreateRazorpayOrder)
Razorpay.route("/get-razorpay-payment-details/:paymentId").get(Data.Getpaymentdetailsbyorderid)


module.exports = Razorpay
