const SecondorderSchema = require("../../model/order/orders");
const Productsize = require("../../model/Product/productsize");

const TryCatch = require("../../middleware/Trycatch");
const Mail = require("../../utils/sendmail");
const Cart = require("../../model/order/cart");
const Product = require("../../model/Product/product");
const ApiFeatures = require("../../utils/apifeature");
const RazorpayData = require("../order/razorpay/razorpayController");


const CreateSecondOrder = TryCatch(async (req, res, next) => {
  const userId = req.user.id;
  const { CartId, paymentMethod, paymentId, paymentorderCratedAt,currency ,paymentDoneAt,DeviceType } = req.body;

  // Create the second order
  const secondorder = await SecondorderSchema.create({
    ...req.body,
    userId,
    CartId: CartId,
    // payment details
    isPaid: paymentMethod === "Razorpay",
    paymentId: paymentId || null,
    paymentorderCratedAt: paymentorderCratedAt,
    currency: currency,
    paymentDoneAt,
    DeviceType  
  });

  // Extract order items from the cart
  const cart = await Cart.findById(CartId).populate("orderItems.productId");
  if (!cart) {
    return res.status(404).json({ success: false, message: "Cart not found" });
  }

  // Clear the complete cart
  await Cart.findByIdAndUpdate(CartId, { activecart: "false" });

  // Send mail
  const userEmail = req.user.email;
  const orderDetails = generateOrderDetails(cart);
  const orderTotal = calculateOrderTotal(cart);

  // Update product quantities and check for out of stock
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

  // Send mail for low quantity products
  if (lowQuantityProducts.length > 0) {
    let lowQuantityMessage =
      "<p>Some products are running low on quantity. Please check your inventory:</p><ul>";
    lowQuantityProducts.forEach((product) => {
      lowQuantityMessage += `<li>${product.name} : <br/> quantity : ${Orderproductsize.quantity} </li> <img loading="lazy" src="${product.thumbnail}" alt="${product.name}" style="max-width: 100px;">`;
    });
    lowQuantityMessage += "</ul>";

    Mail(
      "vaibhavrathorema@gmail.com",
      "Low Product Quantity Alert",
      lowQuantityMessage,
      true
    );
  }

  // Send mail for out of stock products
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
  const data = await SecondorderSchema.find({ userId: req.user.id })
    // .populate("CartId")
    .populate({
      path: "CartId",
      populate: {
        path: "orderItems.productId",
        model: "product",
      },
    })
    .populate({
      path: "CartId",
      populate: {
        path: "orderItems.size",
        select: "size sizetype",
      },
    })
    .populate("shippingAddress")
    .populate("billingAddress")
    .populate("userId");

  const secondorders = data.reverse();

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    total: secondorders.length,
    secondorders,
  });
});

// get second order by id
const GetSecondOrderById = TryCatch(async (req, res, next) => {
  const secondorder = await SecondorderSchema.findById(req.params.id)
    .populate("CartId")
    .populate({
      path: "CartId",
      populate: {
        path: "orderItems.productId",
        model: "product",
      },
    })
    .populate({
      path: "CartId",
      populate: {
        path: "orderItems.size",
        select: "size sizetype",
      },
    })
    .populate("shippingAddress")
    .populate("billingAddress")
    .populate("userId");

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
    // Populate necessary fields
    .populate("CartId")
    .populate({
      path: "CartId",
      populate: {
        path: "orderItems.productId",
        model: "product",
      },
    })
    .populate({
      path: "CartId",
      populate: {
        path: "orderItems.size",
        select: "size sizetype",
      },
    })
    .populate("shippingAddress")
    .populate("billingAddress")
    .populate("userId");

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
