const mongoose = require("mongoose");
// Define order schema
const orderSchema = new mongoose.Schema(
  {
    user: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      username: {
        type: String,
      },
      email: {
        type: String,
      },
      Number: {
        type: Number,
      },
      userImage: {
        type: String,
        default:
          "https://media.istockphoto.com/id/1131164548/vector/avatar-5.jpg?s=612x612&w=0&k=20&c=CK49ShLJwDxE4kiroCR42kimTuuhvuo2FH5y_6aSgEo=",
      },
      role: {
        type: String,
        default: "user",
      },
    },
    orderItems: [
      {
        product: {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          size: {
            type: String,
          },
          sizeType: {
            type: String,
          },
          description: {
            type: String,
          },
          mrp: {
            type: Number,
          },
          price: {
            type: Number,
          },
          Tax: {
            type: Number,
          },
          discountPercentage: {
            type: Number,
          },
          image: [
            {
              type: String,
            },
          ],
          thumbnail: {
            type: String,
          },
          category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
          },
          brand: {
            type: String,
          },
          productType: {
            type: String,
          },
        },
        singleProductPrice: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
        size: {
          size: {
            type: String,
          },
          sizetype: {
            type: String,
          },
        },
        Iscoupanapplie: {
          type: Boolean,
          default: false,
        },
        Coupan: {
          type: String,
        },
        CoupandiscountPercentage: {
          type: Number,
        },
        PorudctpricebeforeapplyCoupan: {
          type: Number,
        },
      },
    ],
    shippingAddress: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      fullName: {
        type: String,
      },
      phoneNumber: {
        type: String,
      },
      pincode: {
        type: String,
      },
      state: {
        type: String,
      },
      city: {
        type: String,
      },
      houseNo: {
        type: String,
      },
      area: {
        type: String,
      },
      landmark: {
        type: String,
      },
      addressType: {
        type: String,
        enum: ["Home", "Work", "Other"],
        default: "Home",
      },
      isDefault: {
        type: Boolean,
        default: false,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "Cash On Delivery",
    },

    MRP: {
      type: Number,
    },
    DISCOUNT: {
      type: Number,
    },
    SELLINGPRICE : {
      type: Number,
    },
    TAXABLEAMOUNT: {
      type: Number,
    },
    TAXADDED: {
      type: Number,
    },
    DELIVERYCHARGE:{
      type: Number
    },
    ORDERTOTAL: {
      type: Number,
    },


  
    TotalProductPrice: {
      type: Number,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPriceWithoutDiscount: {
      type: Number,
    },
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
   
    paymentId: {
      type: String,
    },
    paymentConfirmation: {
      type: Boolean,
      default: false,
    },
    Iscoupanapplied: {
      type: String,
      default: "false",
    },
    CoupanCode: {
      type: String,
    },
    CoupanDiscount: {
      type: Number,
    },
    priceafterAddingMinimumOrderValueCoupan: {
      type: Number,
    },
  },
  { timestamps: true }
);

// Export order model
module.exports = mongoose.model("Order", orderSchema);
