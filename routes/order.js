const express = require("express");
const data = require("../controllers/order/order");
const auth = require("../middleware/Auth");
const Order = express.Router();

// create order
Order.route("/create-order").post(auth.IsAuthenticateUser,data.CreateOrder)


// get my order
Order.route("/get-my-order").get(auth.IsAuthenticateUser,data.GetMyOrder)

// get order by id
Order.route("/get-order-by-id/:id").get(auth.IsAuthenticateUser,data.GetOrderById)
 
// update order by id
Order.route("/update-order-by-id/:id").put(auth.IsAuthenticateUser,data.UpdateOrderById)

// delete order by id
Order.route("/delete-order-by-id/:id").delete(auth.IsAuthenticateUser,data.DeleteOrder)

// get all order
Order.route("/get-order").get(auth.IsAuthenticateUser,data.GetAllOrders)

// get order by user id
Order.route("/get-order-by-user-id/:id").get(auth.IsAuthenticateUser,data.GetOrderByUserId)

// get order by status
Order.route("/get-order-by-status/:status").get(auth.IsAuthenticateUser,data.GetOrderByStatus)



// exports
module.exports = Order