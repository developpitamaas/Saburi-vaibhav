const express = require("express");
const Admin = express.Router();
const Data = require("../controllers/admin/dashboard");
const auth = require("../middleware/Auth");

// get dashboard
Admin.route("/get-dashboard").get(auth.IsAuthenticateUser,auth.authorizeRole("admin") ,Data.GetDashboard)
Admin.route("/revenu-info").get(auth.IsAuthenticateUser,auth.authorizeRole("admin") ,Data.RevenuInfo)
Admin.route("/sale-info").get(auth.IsAuthenticateUser,auth.authorizeRole("admin") ,Data.SaleDetails)


module.exports = Admin