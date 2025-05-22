const SecondorderSchema = require("../../model/order/orders");
const Productsize = require("../../model/Product/productsize");
const TryCatch = require("../../middleware/Trycatch");
const Address = require("../../model/order/shipedaddress");
const Mail = require("../../utils/sendmail");
const Cart = require("../../model/order/cart");
const Product = require("../../model/Product/product");
const ApiFeatures = require("../../utils/apifeature");
const User = require("../../model/User/users");
const RazorpayData = require("../order/razorpay/razorpayController");
const ShiprocketData = require("../order/shiprocket/shiprocket");

// const CreateSecondOrder = TryCatch(async (req, res, next) => {
//   const userId = req.user.id;
//   const { CartId, paymentMethod, paymentId, paymentorderCratedAt,currency ,paymentDoneAt,DeviceType } = req.body;

//   // Create the second order
//   const secondorder = await SecondorderSchema.create({
//     ...req.body,
//     userId,
//     CartId: CartId,
//     // payment details
//     isPaid: paymentMethod === "Razorpay",
//     paymentId: paymentId || null,
//     paymentorderCratedAt: paymentorderCratedAt,
//     currency: currency,
//     paymentDoneAt,
//     DeviceType
//   });

//   // Extract order items from the cart
//   const cart = await Cart.findById(CartId).populate("orderItems.productId");
//   if (!cart) {
//     return res.status(404).json({ success: false, message: "Cart not found" });
//   }

//   // Clear the complete cart
//   await Cart.findByIdAndUpdate(CartId, { activecart: "false" });

//   // Send mail
//   const userEmail = req.user.email;
//   const orderDetails = generateOrderDetails(cart);
//   const orderTotal = calculateOrderTotal(cart);

//   // Update product quantities and check for out of stock
//   const updatedProducts = [];
//   const lowQuantityProducts = [];
//   const outOfStockProducts = [];
//   for (const item of cart.orderItems) {
//     const product = item.productId;
//     const size = item.size;

//     const Orderproductsize = await Productsize.findById(size);

//     const updatedQuantity = Orderproductsize.quantity - item.quantity;
//     const isOutOfStock = updatedQuantity <= 0 ? "true" : "false";

//     const updatedProduct = await Productsize.findByIdAndUpdate(
//       size,
//       { quantity: updatedQuantity, IsOutOfStock: isOutOfStock },
//       { new: true }
//     );
//     if (updatedQuantity < 20 && updatedQuantity > 1) {
//       lowQuantityProducts.push(updatedProduct);
//     }

//     if (updatedQuantity <= 0) {
//       outOfStockProducts.push(updatedProduct);
//     }
//     updatedProducts.push(updatedProduct);
//   }

//   // Send mail for low quantity products
//   if (lowQuantityProducts.length > 0) {
//     let lowQuantityMessage =
//       "<p>Some products are running low on quantity. Please check your inventory:</p><ul>";
//     lowQuantityProducts.forEach((product) => {
//       lowQuantityMessage += `<li>${product.name} : <br/> quantity : ${Orderproductsize.quantity} </li> <img loading="lazy" src="${product.thumbnail}" alt="${product.name}" style="max-width: 100px;">`;
//     });
//     lowQuantityMessage += "</ul>";

//     Mail(
//       "vaibhavrathorema@gmail.com",
//       "Low Product Quantity Alert",
//       lowQuantityMessage,
//       true
//     );
//   }

//   // Send mail for out of stock products
//   if (outOfStockProducts.length > 0) {
//     let outOfStockMessage =
//       "<p>Some products are out of stock. Please update your inventory:</p><ul>";
//     outOfStockProducts.forEach((product) => {
//       outOfStockMessage += `<li>${product.name}</li><img loading="lazy" src="${product.thumbnail}" alt="${product.name}" style="max-width: 100px;">`;
//     });
//     outOfStockMessage += "</ul>";

//     Mail(
//       "vaibhavrathorema@gmail.com",
//       "Out of Stock Products Alert",
//       outOfStockMessage,
//       true
//     );
//   }

//   res.status(201).json({
//     success: true,
//     message: "Order created successfully",
//     secondorder,
//     updatedProducts,
//     paymentMethod,
//     paymentId,
//   });
// });

const CreateSecondOrder = TryCatch(async (req, res, next) => {
  const userId = req.user.id;
  const {
    CartId,
    paymentMethod,
    paymentId,
    paymentorderCratedAt,
    currency,
    paymentDoneAt,
    DeviceType,
    shippingAddress,
  } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const cart = await Cart.findById(CartId).populate("orderItems.productId");
  if (!cart) {
    return res.status(404).json({ success: false, message: "Cart not found" });
  }

  const address = await Address.findById(shippingAddress);
  if (!address) {
    return res
      .status(404)
      .json({ success: false, message: "Shipping address not found" });
  }

  const userData = {
    _id: user._id,
    username: user.username,
    email: user.email,
    Number: user.Number,
    userImage: user.userImage,
    role: user.role,
  };

  const orderItems = cart.orderItems.map((item) => ({
    product: {
      _id: item.productId._id,
      name: item.productId.name,
      description: item.productId.description || "",
      image: item.productId.image || [],
      thumbnail: item.productId.thumbnail || "",
      category: item.productId.category,
      brand: item.productId.brand || "",
      productType: item.productId.productType || "Domestic",
      mrp: item.size.price || 0,
      price: item.size.FinalPrice || 0,
      discountPercentage: item.size.discountPercentage || 0,
      sizeType: item.size.sizeType || "Regular",
      size: item.productId.size || [],
    },
    singleProductPrice: item.singleProductPrice,
    quantity: item.quantity,
    totalPrice: item.totalPrice,
    size: item.size,
    Iscoupanapplie: item.Iscoupanapplie || false,
    Coupan: item.Coupan || "",
    CoupandiscountPercentage: item.CoupandiscountPercentage || 0,
    PorudctpricebeforeapplyCoupan: item.PorudctpricebeforeapplyCoupan || 0,
  }));

  const shippingAddressData = {
    _id: address._id,
    userId: address.userId,
    fullName: `${address.firstname} ${address.lastname}`,
    phoneNumber: address.phonenumber.toString(),
    pincode: address.pincode.toString(),
    country: address.country,
    state: address.state,
    city: address.city,
    address: address.address,
    isDefault: false,
  };

  const secondorder = await SecondorderSchema.create({
    user: userData,
    orderItems,
    shippingAddress: shippingAddressData,
    paymentMethod,
    taxPrice: 1.05,
    priceAfterAddingTax: cart.totalPrice * 1.05,
    TotalProductPrice: cart.totalPrice,
    shippingPrice: 0,
    totalPrice: cart.totalPrice * 1.05,
    totalPriceWithoutDiscount: cart.totalPriceWithoutDiscount,
    isPaid: paymentMethod === "Razorpay",
    status: "Pending",
    currency: currency || "INR",
    paymentId: paymentId || null,
    paymentConfirmation: paymentMethod === "Razorpay",
    paymentorderCratedAt: paymentorderCratedAt,
    paymentDoneAt: paymentDoneAt || null,
    UserIp: req.body.UserIp || "Unknown",
    DeviceType: DeviceType || "Unknown",
    orderfromURL: req.body.orderfromURL || "Direct",
    Iscoupanapplied: "false",
    CoupanCode: "",
    CoupanDiscount: 0,
  });

  await Cart.findByIdAndUpdate(CartId, { activecart: "false" });

  const userEmail = req.user.email;
  const orderDetails = generateOrderDetails(cart);
  const orderTotal = calculateOrderTotal(cart);

  const updatedProducts = [];
  const lowQuantityProducts = [];
  const outOfStockProducts = [];

  for (const item of cart.orderItems) {
    const product = item.productId;
    const size = item.size;

    const Orderproductsize = await Productsize.findById(size);

    const updatedQuantity = Orderproductsize.quantity - item.quantity;
    const isOutOfStock = updatedQuantity <= 0 ? "true" : "false";

    const updatedProduct = await Productsize.findByIdAndUpdate(
      size,
      { quantity: updatedQuantity, IsOutOfStock: isOutOfStock },
      { new: true }
    );

    if (updatedQuantity < 20 && updatedQuantity > 1) {
      lowQuantityProducts.push(updatedProduct);
    }

    if (updatedQuantity <= 0) {
      outOfStockProducts.push(updatedProduct);
    }
    updatedProducts.push(updatedProduct);
  }

  const shiprocketPayload = {
    order_id: secondorder._id.toString(),
    order_date: new Date().toISOString(),
    pickup_location: "Primary",
    channel_id: "4903096",
    billing_customer_name: address.firstname,
    billing_last_name: address.lastname,
    client_id: req.user._id.toString(),
    user_id: req.user._id.toString(),
    billing_email: req.user.email,
    billing_address: address.address,
    billing_city: address.city,
    billing_state: address.state,
    billing_pincode: address.pincode,
    billing_country: address.country,
    billing_phone: address.phonenumber,
    shipping_is_billing: true,
    shipping_customer_name: address.firstname,
    shipping_last_name: address.lastname,
    shipping_address: address.address,
    shipping_city: address.city,
    shipping_pincode: address.pincode,
    shipping_state: address.state,
    shipping_country: address.country,
    transaction_id: paymentId || null,
    shipping_phone: address.phonenumber,
    order_items: cart.orderItems.map((item) => ({
      sku: `SKU_${item.productId._id}}`,
      name: item.productId.name,
      category: item.productId.category,
      units: item.quantity,
      selling_price: item.singleProductPrice,
      product_id: item.productId._id.toString(), 
      product_image: item.productId.thumbnail,
    })),
    payment_method: paymentMethod === "Razorpay" ? "Prepaid" : "COD",
    sub_total: cart.totalPrice,
    shipping_charges: 0,
     length: 1,
    breadth: 1,
    height: 1,
    weight: 1,
  };

    const shiprocketResponse = await ShiprocketData.createShiprocketOrder(
    shiprocketPayload
  );
  if (shiprocketResponse.error) {
    throw new Error(
      shiprocketResponse.message || "Failed to create order on Shiprocket"
    );
  }


  if (lowQuantityProducts.length > 0) {
    let lowQuantityMessage =
      "<p>Some products are running low on quantity. Please check your inventory:</p><ul>";
    lowQuantityProducts.forEach((product) => {
      lowQuantityMessage += `<li>${product.name} : <br/> quantity : ${product.quantity} </li> <img loading="lazy" src="${product.thumbnail}" alt="${product.name}" style="max-width: 100px;">`;
    });
    lowQuantityMessage += "</ul>";

    Mail(
      "vaibhavrathorema@gmail.com",
      "Low Product Quantity Alert",
      lowQuantityMessage,
      true
    );
  }

  if (outOfStockProducts.length > 0) {
    let outOfStockMessage =
      "<p>Some products are out of stock. Please update your inventory:</p><ul>";
    outOfStockProducts.forEach((product) => {
      outOfStockMessage += `<li>${product.name}</li><img loading="lazy" src="${product.thumbnail}" alt="${product.name}" style="max-width: 100px;">`;
    });
    outOfStockMessage += "</ul>";

    Mail(
      "vaibhavrathorema@gmail.com",
      "Out of Stock Products Alert",
      outOfStockMessage,
      true
    );
  }

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    secondorder,
    updatedProducts,
    paymentMethod,
    paymentId,
  });
});
function generateOrderDetails(cart) {
  let detailsHtml = "";
  cart.orderItems.forEach((item) => {
    detailsHtml += `
      <div class="order-item" style="display: flex; flex-direction: column; align-items: center; padding: 10px; border: 1x solid  rgba(60, 60, 60, 0.735); border-radius: 10px;  background-color: #f2f2f2; width: 100%; ">
        <img loading="lazy" src="${item.productId.thumbnail}" alt="${item.productId.name}" style="max-width: 100px; margin-right: 20px;">
        <div class="order-item-info" style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: space-between; width: 100%;  ">
        <div style="width: 100%;">
        <h4 style="margin: 0; font-size: 16px; color: #000;">${item.productId.name}</h4>
        <p style="margin: 5px 0; color: #555;">Quantity: ${item.quantity}</p>
        </div>
        <div style="width: 30%;" >
        <p style="margin: 5px 0; color: #555;">Price: ₹${item.singleProductPrice}</p>
        </div>
        </div>
      </div>
      <br/> 
    `;
  });
  return detailsHtml;
}

function calculateOrderTotal(cart) {
  return cart.orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}

function calculateOrderTotal(cart) {
  let total = 0;
  cart.orderItems.forEach((item) => {
    total += item.totalPrice;
  });
  return total;
}

// get my second order

const GetMySecondOrder = TryCatch(async (req, res, next) => {
  const userId = req.user._id;

  const data = await SecondorderSchema.find({ "user._id": userId });
  const secondorders = data.reverse();

  res.status(200).json({
    success: true,
    message: "Your orders fetched successfully",
    total: secondorders.length,
    secondorders,
  });
});

// get second order by id
const GetSecondOrderById = TryCatch(async (req, res, next) => {
  const secondorder = await SecondorderSchema.findById(req.params.id);

  res.status(200).json({
    success: true,
    message: "Order fetched successfully vaibhaknknknknk",
    secondorder,
  });
});

// get all orders
const GetAllsecondOrders = TryCatch(async (req, res, next) => {
  const status = req.query.status || "Pending";
  const resultperpage = req.query.resultperpage || 10000;
  // Initialize ApiFeatures with the Order model query and the query string from the request
  const features = new ApiFeatures(SecondorderSchema.find(), req.query)
    // Apply search functionality if 'name' is provided in the query string
    .search()
    .filterByStatus(status)
    // Apply pagination with default limit of 10 items per page
    .paginate(resultperpage);

  // Execute the query with applied features
  const ALlOrders = await features.query

  const Orders = ALlOrders.reverse();

  // Send response
  res.status(200).json({
    success: true,
    count: Orders.length,
    Orders,
  });
});

// update order
const UpdateSecondOrder = TryCatch(async (req, res, next) => {
  // req.body.UpdateAt = Date.now();
  const secondorder = await SecondorderSchema.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  // UpdateAt
  res.status(200).json({
    success: true,
    message: "Order updated successfully",
    secondorder,
  });
});

// exports
module.exports = {
  CreateSecondOrder,
  GetMySecondOrder,
  GetSecondOrderById,
  GetAllsecondOrders,
  UpdateSecondOrder,
  // CreateRazorpayOrder: RazorpayData.CreateRazorpayOrder,
  // Getpaymentdetailsbyorderid: RazorpayData.Getpaymentdetailsbyorderid,
};
