const jwt = require("jsonwebtoken");
const TryCatch = require("./Trycatch.js");
const User = require("../model/User/users.js");

// using cookies for authentication
// const IsAuthenticateUser = TryCatch(async (req, res, next) => {
//   // Get token
//     const { token } = req.cookies;

//   //   // Check if token exists
//     if (!token) {
//       return res
//         .status(404)
//         .json({ failed: "Please login to access this facility" });
//     }

//     // Verify and decode token
//     const decodeData = jwt.verify(token, process.env.JWT_SECRET);

//     // Find user based on decoded data
//     req.user = await User.findById(decodeData.id);
//     next();
//   });

// Middleware to check if the user is authenticated for localstorage
const IsAuthenticateUser = TryCatch(async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    return res.status(403).json({ error: "Unauthorized access" });
  }
  const bearerToken = bearerHeader.split(" ")[1];
  req.token = bearerToken;
  try {

    const decodeData = jwt.verify(bearerToken, process.env.JWT_SECRET);

    req.user = await User.findById(decodeData.id);
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(400).json({ error: 'Invalid Token.' });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expired.' })
    } else {
      res.status(500).json({ error: 'Token verification error.' })
    }
  }
});


// Middleware to authorize user roles
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    // Check if user role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return next(
        res.json({
          failed: `Role : ${req.user.role} is not allowed to access this resource`,
        })
      );
    }
    next();
  };
};

module.exports = { IsAuthenticateUser, authorizeRole };

// import jwt from "jsonwebtoken";
// import TryCatch from "./Trycatch.js";
// import User from "../model/User/user.js";

// // Middleware to check if the user is authenticated for local storage
// const IsAuthenticateUser = TryCatch(async (req, res, next) => {
//   try {
//     const bearerHeader = req.headers["authorization"];

//     if (!bearerHeader) {
//       return res
//         .status(403)
//         .json({ error: "Unauthorized access. No token provided." });
//     }

//     console.log("Token:", bearerHeader);
//     var bearerToken = bearerHeader.split(" ")[1].trim();

//     const decodeData = jwt.verify(bearerToken, process.env.JWT_SECRET);
//     console.log("Decoded Data:", decodeData);

//     req.user = await User.findById(decodeData.id);
//     next();
//   } catch (error) {
//     console.error("Token Verification Error:", error);

//     if (error instanceof jwt.JsonWebTokenError) {
//       res.status(400).json({ error: "Invalid Token.", bearerToken });
//     } else if (error instanceof jwt.TokenExpiredError) {
//       res.status(401).json({ error: "Token expired." });
//     } else {
//       res.status(500).json({ error: "Token verification error." });
//     }
//   }
// });

// // Middleware to authorize user roles
// const authorizeRole = (...roles) => {
//   return (req, res, next) => {
//     // Check if user role is included in the allowed roles
//     if (!roles.includes(req.user.role)) {
//       return res.json({
//         failed: `Role: ${req.user.role} is not allowed to access this resource.`,
//       });
//     }
//     next();
//   };
// };

// export { IsAuthenticateUser, authorizeRole };
