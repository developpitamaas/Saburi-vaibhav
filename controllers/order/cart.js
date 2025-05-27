const Cart = require("../../model/order/cart");
const TryCatch = require("../../middleware/Trycatch");
const Product = require("../../model/Product/product");
const Coupon = require("../../model/coupan/coupan");
const Productsize = require("../../model/Product/productsize");

const RemoveCoupon = TryCatch(async (req, res) => {
  const userId = req.user.id;
  // Find the cart for the logged-in user
  let cart = await Cart.findOne({ userId, activecart: "true" });

  if (!cart) {
    return res.status(400).json({
      success: false,
      message: "Cart not found for the user.",
    });
  }

  try {
    // Remove coupon data from cart items
    for (const orderItem of cart.orderItems) {
      if (orderItem.Iscoupanapplie) {
        // Reset coupon-related fields
        orderItem.Iscoupanapplie = false;
        orderItem.Coupan = "";
        orderItem.CoupanDiscountPercentage = 0;
        orderItem.CoupanDiscountPrice = 0;
        orderItem.PorudctpricebeforeapplyCoupan =
          orderItem.quantity * orderItem.singleProductPrice;
      }
    }

    // Recalculate total prices after removing the coupon
    let totalPrice = 0;
    for (const orderItem of cart.orderItems) {
      // Update totalPrice based on singleProductPrice and quantity
      orderItem.totalPrice = orderItem.quantity * orderItem.singleProductPrice;
      totalPrice += orderItem.totalPrice;
    }

    const priceAfterAddingTax = totalPrice * 1.05;
    const totalPriceWithShipping = priceAfterAddingTax + cart.shippingPrice;

    // Update cart total prices
    cart.TotalProductPrice = totalPrice;
    cart.totalPrice = totalPriceWithShipping;
    cart.Iscoupanapplied = "false";

    // Save the updated cart
    await cart.save();

    // Send success response with updated cart
    res.status(200).json({
      success: true,
      message: "Coupon removed successfully.",
      cart,
    });
  } catch (error) {
    // Handle errors when removing coupon
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});
const addToCart = TryCatch(async (req, res, next) => {
  try {
    const {
      productId,
      quantity,
      selectProductSize,
    } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product does not exist.",
      });
    }

    // Check if user has an existing cart
    let cart = await Cart.findOne({ userId: req.user.id, activecart: "true" });
    // console.log("cart -1",cart)

    if (!cart) {
      // If no cart exists, create a new one
      cart = new Cart({ userId: req.user.id, orderItems: [] });
    }

    // Check if the cart has orderItems array
    if (!cart.orderItems || !Array.isArray(cart.orderItems)) {
      cart.orderItems = [];
    }

    // Find the product in the cart
    const existingItemIndex = cart.orderItems.findIndex((item) => {
      return (
        item.productId.toString() === productId.toString() &&
        item.size.toString() === selectProductSize.toString()
      );
    });

    if (existingItemIndex !== -1) {
      // If product exists, update the quantity
      cart.orderItems[existingItemIndex].quantity += quantity;
    } else {
      // If product doesn't exist, add it to the cart
      cart.orderItems.push({
        productId,
        quantity,
        size: selectProductSize,
      });
    }

    await cart.save();

    // Calculate total price considering coupons
    const processedOrderItems = await calculateTotalPriceWithCoupons(
      cart.orderItems );
    // Calculate total product price
    const totalProductPrice = processedOrderItems.reduce(
      (total, item) => total + item.totalPrice,
      0
    );
    const PriceWithoutDiscount = processedOrderItems.reduce(
      (total, item) => total + item.WithOurDiscount,
      0
    );
    // Calculate price after adding tax (5%) tax
    // const priceAfterAddingTax = totalProductPrice * (1 + (18 / 100)) ;
    // const totalPriceWithShipping = priceAfterAddingTax + shippingPrice;

    // Update the existing cart with new details
    cart.orderItems = processedOrderItems;
    cart.totalPriceWithoutDiscount = PriceWithoutDiscount;
    cart.totalPrice = totalProductPrice;
    // cart.taxPrice = 1.05;
    // cart.priceAfterAddingTax = priceAfterAddingTax;
    // cart.totalPrice = totalPriceWithShipping;

    // Save the updated cart to the database
    await cart.save();

    // Send response with order details
    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

async function calculateTotalPriceWithCoupons(orderItems) {
  const processedItems = [];


  for (const orderItem of orderItems) {
    const product = await Product.findById(orderItem.productId);
    const productsize = await Productsize.findById(orderItem.size);
    
    const itemTotalPrice = orderItem.quantity * productsize.FinalPrice;
    const WithOurDiscount = orderItem.quantity * productsize.price;

    processedItems.push({
      productId: product._id,
      quantity: orderItem.quantity,
      totalPrice: itemTotalPrice,
      singleProductPrice: productsize.FinalPrice,
      // size: `${productsize.size} ${productsize.sizetype} `/,
      size: orderItem.size,
      WithOurDiscount: WithOurDiscount,
      // Iscoupanapplie: false,
      // Coupan:  "",
      // CoupanDiscountPercentage: orderItem.CoupanDiscountPercentage || 0,
      // CoupanDiscountPrice: orderItem.CoupanDiscountPrice || 0,
      // PorudctpricebeforeapplyCoupan: 0,
    });
  }



  return processedItems;
}

const checkCouponApplicability = async (Reqcoupon, product) => {
  // Get coupon details
  const coupon = await Coupon.findOne({
    Coupancode: Reqcoupon,
    Isexpired: false,
  });
  if (!coupon) {
    throw new Error("Invalid or expired coupon code");
  }
  switch (coupon.coupanfor) {
    case "all":
      return true;
    case "product":
      return coupon.applicableProducts.includes(product._id);
    case "category":
      return coupon.applicableCategories.includes(product.category);
    case "minimumOrderValue":
      return false;
    default:
      return false;
  }
};

const ApplyCoupon = TryCatch(async (req, res) => {
  const { CoupanCode } = req.body;
  const userId = req.user.id;

  // Find the cart for the logged-in user
  let cart = await Cart.findOne({ userId, activecart: "true" });

  if (!cart) {
    return res.status(400).json({
      success: false,
      message: "Cart not found for the user.",
    });
  }

  try {
    // Check if the coupon code is applicable to the cart items
    const processedItems = await calculateTotalPriceWithCoupons(
      cart.orderItems    );

    // Update the cart with the processed items
    cart.orderItems = processedItems;

    // Calculate total product price
    const totalProductPrice = processedItems.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

    // Calculate price after adding tax (5%) tax
    const priceAfterAddingTax = totalProductPrice * 1.05;

    // Update cart details
    cart.taxPrice = 1.05;
    cart.shippingPrice = 0; // Assuming shipping is free
    cart.totalPrice = priceAfterAddingTax;
    cart.Iscoupanapplied = true; // Assuming you want to mark if a coupon is applied

    // Save the updated cart
    await cart.save();

    // Send success response with updated cart
    res.status(200).json({
      success: true,
      message: "Coupon applied successfully.",
      cart,
    });
  } catch (error) {
    // Handle errors when applying coupon
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// get cart
const GetCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id, activecart: "true" })
      .populate({
        path: "orderItems",
        populate: [
          {
            path: "productId",
            select: "name price PriceAfterDiscount discountPercentage thumbnail category",
            model: "product",
            populate: {
              path: "category",
              model: "category",
              select: "name tax",
            },
          },
          {
            path: "size",
            model: "productsize",
            select: "size sizetype price discountPercentage FinalPrice",
          },
        ],
      });

    if (!cart) {
      return res.status(200).json({ message: "Cart is empty" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Controller function to reduce the quantity of a product in the cart
const RemoveFromCart = TryCatch(async (req, res) => {
  const { productId, selectProductSize } = req.body;

  const userId = req.user.id;
  try {
    // Find the cart for the logged-in user
    let cart = await Cart.findOne({ userId, activecart: "true" });

    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "Cart not found for the user.",
      });
    }

    const productIndex = cart.orderItems.findIndex((item) => {
      return (
        item.productId.toString() === productId.toString() &&
        item.size.toString() === selectProductSize.toString()
      );
    });

  
    // Decrease the quantity of the product in the cart
    cart.orderItems[productIndex].quantity -= 1;

    // If quantity becomes zero, remove the product from the cart
    if (cart.orderItems[productIndex].quantity === 0) {
      cart.orderItems.splice(productIndex, 1);
    }

    // Recalculate cart details
    const processedItems = await calculateTotalPriceWithCoupons(
      cart.orderItems    );

    const totalProductPrice = processedItems.reduce(
      (total, item) => total + item.totalPrice,
      0
    );
    const PriceWithoutDiscount = processedItems.reduce(
      (total, item) => total + item.WithOurDiscount,
      0
    );

    // Update cart details
    cart.orderItems = processedItems;
    cart.totalPriceWithoutDiscount = PriceWithoutDiscount;
    cart.totalPrice = totalProductPrice;

    // Save the updated cart
    await cart.save();

    // Send success response with updated cart
    res.status(200).json({
      success: true,
      message: "Cart updated successfully.",
      cart,
    });
  } catch (error) {
    // Handle errors when updating cart
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Controller function to remove a complete product from the cart
const DeleteProductFromCart = TryCatch(async (req, res) => {
  const { productId, selectProductSize , productQuantity } = req.body;
  const userId = req.user.id;
  try {
    // Find the cart for the logged-in user
    let cart = await Cart.findOne({ userId, activecart: "true" });

    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "Cart not found for the user.",
      });
    }

    const productIndex = cart.orderItems.findIndex((item) => {
      return (
        item.productId.toString() === productId.toString() &&
        item.size.toString() === selectProductSize.toString()
      );
    });

  
    // Decrease the quantity of the product in the cart
    cart.orderItems[productIndex].quantity -= productQuantity;

    // If quantity becomes zero, remove the product from the cart
    if (cart.orderItems[productIndex].quantity === 0) {
      cart.orderItems.splice(productIndex, 1);
    }

    // Recalculate cart details
    const processedItems = await calculateTotalPriceWithCoupons(
      cart.orderItems    );

    const totalProductPrice = processedItems.reduce(
      (total, item) => total + item.totalPrice,
      0
    );
    const PriceWithoutDiscount = processedItems.reduce(
      (total, item) => total + item.WithOurDiscount,
      0
    );

    // Update cart details
    cart.orderItems = processedItems;
    cart.totalPriceWithoutDiscount = PriceWithoutDiscount;
    cart.totalPrice = totalProductPrice;

    // Save the updated cart
    await cart.save();

    // Send success response with updated cart
    res.status(200).json({
      success: true,
      message: "Cart updated successfully.",
      cart,
    });
  } catch (error) {
    // Handle errors when updating cart
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// export
module.exports = { 
  addToCart,
  GetCart,
  RemoveFromCart,
  ApplyCoupon,
  RemoveCoupon,
  DeleteProductFromCart
};


  