// const mongoose = require("mongoose");

// // Define order schema
// const SecondorderSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   CartId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Cart",
//     required: true,
//   },
//   shippingAddress: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "shipedaddress",
//   },
//   billingAddress: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "billingaddress",
//   },
//   isPaid: {
//     type: Boolean,
//     required: true,
//     default: false,
//   },
//   paidAt: {
//     type: Date,
//   },
//   isDelivered: {
//     type: Boolean,
//     required: true,
//     default: false,
//   },
//   deliveredAt: {
//     type: Date,
//   },
//   status: {
//     type: String,
//     required: true,
//     default: "Pending",
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   // payment 
//   transactionId: {
//     type: String,
//     required: true,
//   },
//   paymentGatewayResponse: {
//     type: Object, 
//     required: true,
//   },
//   currency: {
//     type: String,
//     required: true,
//     default: "INR",
//   },
//   paymentIntent: {
//     type: String,
//   },    
    
//   paymentMethod: {
//     type: String,
//     required: true,
//     default: "Cash On Delievery",
//     enum: ["Cash On Delievery", "Razorpay"],
//   },
//   paymentResult: {
//     id: String,
//     status: String,
//     update_time: String,
//     email_address: String,
//   },
//   paymentId: {
//     type: String,
//     default: null,
//   },
//   trackingNumber: {
//     type: String,
//   },
//   orderSource: {
//     type: String,
//     enum: ["Website", "Mobile App", "Third-party"],
//   },
//   refundStatus: {
//     type: String,
//     enum: ["Not Requested", "Requested", "Processed"],
//     default: "Not Requested",
//   },
//   paymentConfirmation: {
//     type: Boolean,
//     default: false,
//   },
        

//   // other 
//   orderNotes: {
//     type: String,
//   },
  
//   UpdateAt: {
//     type: Date,
//     default: Date.now,
//   },
// },{timestamps:true});

// // Export order model
// module.exports = mongoose.model("Secondorder", SecondorderSchema);

const mongoose = require("mongoose");

const SecondorderSchema = new mongoose.Schema({
  // Personal Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
 
  // Cart Reference
  CartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
    required: true,
  },
  
  // Address Information
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "shippedaddress",
  },
  billingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "billingaddress",
  },
  
  // Order Status
  isPaid: {
    type: Boolean,
    required: true,
    default: false,
  },
  paidAt: {
    type: Date,
  }, 
  isDelivered: {
    type: Boolean,
    required: true,
    default: false,
  },
  deliveredAt: {
    type: Date,
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // Payment Details
  transactionId: {
    type: String,
  },
  paymentGatewayResponse: {
    type: Object,
  },
  currency: {
    type: String,
    default: "INR",
  },
  paymentIntent: {
    type: String,
  },
  paymentMethod: {
    type: String,
    required: true,
    default: "Cash On Delivery",
    enum: ["Cash On Delivery", "Razorpay"],
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String,
  },
  UserIp: {
    type: String,
  },
  UserContact: {
    type: String,
  },
  DeviceType: {
    type: String,
  },
  paymentId: {
    type: String,
    default: null,
  },
  User_Location:{
    type: String,
  },
  Geolocation: {
    type: String,
  },
  paymentConfirmation: {
    type: Boolean,
    default: false,
  },
  paymentorderCratedAt: {
    type: String,
  },
  paymentDoneAt: {
    type: Date,
  },
  orderfromURL: {
    type: String,
  },

  // Other Information
  trackingNumber: {
    type: String,
  },
  orderSource: {
    type: String,
    enum: ["Website", "Mobile App", "Third-party"],
  },
  refundStatus: {
    type: String,
    enum: ["Not Requested", "Requested", "Processed"],
    default: "Not Requested",
  },
  orderNotes: {
    type: String,
  },
  
  // Timestamps
  UpdateAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Export order model
module.exports = mongoose.model("Secondorder", SecondorderSchema);
