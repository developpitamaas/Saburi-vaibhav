const express = require("express");
const Coupan = express.Router();
const Data = require("../controllers/coupan/coupanController");
const auth = require("../middleware/Auth");

// create coupan
Coupan.route("/create-coupan").post(auth.IsAuthenticateUser,auth.authorizeRole("admin") ,Data.CreateCoupan)

// get all coupan
Coupan.route("/get-all-coupan").get(Data.GetAllCoupan)

// get coupan code by Coupancode
Coupan.route("/get-coupan-by-coupancode/:coupancode").get(Data.GetCoupanByCoupancode)

// get coupan by id
Coupan.route("/get-coupan-by-id/:id").get(Data.GetCoupanById)

// update coupan
Coupan.route("/update-coupan/:id").put(auth.IsAuthenticateUser,auth.authorizeRole("admin") ,Data.UpdateCoupan)

// delete coupan
Coupan.route("/delete-coupan/:id").delete(auth.IsAuthenticateUser,auth.authorizeRole("admin") ,Data.deleteCoupan)

// exports
module.exports = Coupan

