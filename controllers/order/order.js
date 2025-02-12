const Order = require("../../model/order/order");
const TryCatch = require("../../middleware/Trycatch");
const User = require("../../model/User/users");
// const Coupan = require("../../model/coupan/coupan");
const Coupon = require("../../model/coupan/coupan");
const Product = require("../../model/Product/product");
const shippingAddress = require("../../model/order/shipedaddress");
const BillingAddress = require("../../model/order/billingaddress");
const ApiFeatures = require("../../utils/apifeature");

const CreateOrderWorking = TryCatch(async (req, res, next) => {
  try {
    req.body.userId = req.user.id;
    const productIds = req.body.orderItems.map((item) => item.productId);
    // Finding products
    const products = await Product.find({ _id: { $in: productIds } });

    // Calculate total price considering coupons
    let totalPrice = 0;
    const orderItems = req.body.orderItems.map(async (orderItem) => {
      const product = products.find(
        (produc) => produc._id.toString() === orderItem.productId
      );
      const itemTotalPrice = orderItem.quantity * product.price;
      let totalPriceBeforeCoupon = itemTotalPrice;

      // Check if coupon is applicable
      if (req.body.CoupanCode) {
        const couponApplicable = await checkCouponApplicability(
          req.body.CoupanCode,
          product
        );

        if (couponApplicable) {
          // Apply coupon discount
          const coupon = await Coupon.findOne({
            Coupancode: req.body.CoupanCode,
          });

          const couponDiscount =
            (coupon.discountPercentage / 100) * product.price;
          totalPriceBeforeCoupon -= couponDiscount;
        }
      }

      // Increment total price
      totalPrice += totalPriceBeforeCoupon;

      return {
        productId: product._id,
        productName: product.name,
        quantity: orderItem.quantity,
        priceBeforeCoupon: itemTotalPrice,
        totalPrice: totalPriceBeforeCoupon,
      };
    });

    // Wait for all order items to be processed
    const processedOrderItems = await Promise.all(orderItems);

    // Send response with total price
    res.status(200).json({
      success: true,
      orderItems: processedOrderItems,
      totalPrice: totalPrice,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
const CreateOrder = TryCatch(async (req, res, next) => {
  try {
    req.body.userId = req.user.id;
    const productIds = req.body.orderItems.map((item) => item.productId);
    // Finding products
    const products = await Product.find({ _id: { $in: productIds } });

    const outOfStockProducts = [];
    const allProductsInStock = products.every((product) => {
      if (product.quantity <= 0) {
        outOfStockProducts.push({ product });
        return false;
      }
      return true;
    });

    if (!allProductsInStock) {
      return res.status(400).json({
        success: false,
        message: "One or more products in the order are out of stock.",
        outOfStockProducts: outOfStockProducts,
      });
    }


    // Calculate total price considering coupons
    let totalPrice = 0;
    const orderItems = req.body.orderItems.map(async (orderItem) => {
      const product = products.find(
        (produc) => produc._id.toString() === orderItem.productId
      );
      const itemTotalPrice = orderItem.quantity * product.price;
      let totalPriceBeforeCoupon = itemTotalPrice;

      // Check if coupon is applicable
      if (req.body.CoupanCode) {
        const couponApplicable = await checkCouponApplicability(
          req.body.CoupanCode,
          product
        );

        if (couponApplicable) {
          // Apply coupon discount
          const coupon = await Coupon.findOne({
            Coupancode: req.body.CoupanCode,
          });

          const couponDiscount =
            (coupon.discountPercentage / 100) * product.price;
          totalPriceBeforeCoupon -= couponDiscount;
          orderItem.Iscoupanapplie = true;
          orderItem.Coupan = req.body.CoupanCode;
          orderItem.CoupanDiscountPercentage = coupon.discountPercentage;
          orderItem.CoupanDiscountPrice = couponDiscount;
          orderItem.PorudctpricebeforeapplyCoupan = itemTotalPrice;
        }
      }

      // Increment total price
      totalPrice += totalPriceBeforeCoupon;
      // Update product quantity
      product.quantity -= orderItem.quantity;

      // Check if product quantity is 0 and set IsOutOfStock flag
      if (product.quantity === 0 || product.quantity <= 0) {
        product.IsOutOfStock = true;
        product.quantity = 0
      }

      // Save the updated product
      await product.save();

      return {
        productId: product._id,
        quantity: orderItem.quantity,
        totalPrice: totalPriceBeforeCoupon,
        singleProductPrice: product.price, // Added singleProductPrice
        size: orderItem.size,
        Iscoupanapplie: orderItem.Iscoupanapplie || false,
        Coupan: orderItem.Coupan || "",
        CoupanDiscountPercentage: orderItem.CoupanDiscountPercentage || 0,
        CoupanDiscountPrice: orderItem.CoupanDiscountPrice || 0,
        PorudctpricebeforeapplyCoupan:
          orderItem.PorudctpricebeforeapplyCoupan || itemTotalPrice,
      };
    });

    // Wait for all order items to be processed
    const processedOrderItems = await Promise.all(orderItems);

    // Calculate total product price
    const totalProductPrice = processedOrderItems.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

    // Calculate price after adding tax (5%) tax
    const priceAfterAddingTax = totalProductPrice * 1.05;
    const shippingPrice = 0;
    // Calculate total price (including shipping price)
    const totalPriceWithShipping = priceAfterAddingTax + shippingPrice;

    // check if user sent a coupon code
    let priceafterAddingMinimumOrderValueCoupan = 0;
    if (req.body.CoupanCode) {
      // now check coupon coupanfor minimumOrderValue
      const coupon = await Coupon.findOne({
        Coupancode: req.body.CoupanCode,
        Isexpired: false,
      });
      if (coupon && coupon.coupanfor === "minimumOrderValue") {
        if (priceAfterAddingTax > coupon.minimumOrderValue) {
          // Apply coupon discount and remove percent from priceAfterAddingTax and set in priceafterAddingMinimumOrderValueCoupan
          const couponDiscount =
            (coupon.discountPercentage / 100) * priceAfterAddingTax;
          priceafterAddingMinimumOrderValueCoupan =
            priceAfterAddingTax - couponDiscount;
        } else {
          return res
            .status(400)
            .json({
              success: false,
              message:
                "Order value must be greater than " +
                coupon.minimumOrderValue +
                " ₹ order value",
            });
        }
      }
    }

    // Create the order
    const order = new Order({
      userId: req.body.userId,
      orderItems: processedOrderItems,
      shippingAddress: req.body.shippingAddress,
      billingAddress: req.body.billingAddress,
      paymentMethod: req.body.paymentMethod,
      taxPrice: 1.05,
      priceAfterAddingTax: priceAfterAddingTax,
      TotalProductPrice: totalProductPrice,
      shippingPrice: shippingPrice,
      totalPrice: totalPriceWithShipping,
      priceafterAddingMinimumOrderValueCoupan:
        priceafterAddingMinimumOrderValueCoupan || 0,
    });

    // Save the order to the database
    await order.save();

    // Send response with order details
    res.status(200).json({
      success: true,
      order: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

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

const CreateOrderWorkingFinrONTotalProductPrice = TryCatch(
  async (req, res, next) => {
    req.body.userId = req.user.id;
    const productIds = req.body.orderItems.map((item) => item.productId);

    // Finding products
    const products = await Product.find({ _id: { $in: productIds } });

    let totalPriceBeforeCoupon = 0;
    let totalPriceAfterCoupon = 0;
    let HaveOutOfStock = true;
    let couponApplied = false;

    // Count total price and apply coupons if provided
    const orderItems = req.body.orderItems.map((orderItem) => {
      const product = products.find(
        (produc) => produc._id.toString() === orderItem.productId
      );

      if (
        !product ||
        product.IsOutOfStock == "true" ||
        product.quantity < orderItem.quantity
      ) {
        return res.status(400).json({
          success: false,
          message: "Product is out of stock or quantity is not enough",
        });
      }

      const itemTotalPrice = orderItem.quantity * product.price;
      totalPriceBeforeCoupon += itemTotalPrice;

      product.quantity -= orderItem.quantity;
      if (product.quantity == 0) {
        product.IsOutOfStock = "true";
      }
      product.save();

      HaveOutOfStock = false;

      return {
        productId: product._id,
        quantity: orderItem.quantity,
        totalPrice: itemTotalPrice,
      };
    });

    if (!HaveOutOfStock) {
      // Check if coupon code is provided and valid
      if (req.body.CoupanCode) {
        var coupon = await Coupon.findOne({ Coupancode: req.body.CoupanCode });
        if (!coupon) {
          return res.status(400).json({
            success: false,
            message: "Invalid coupon code",
          });
        }

        // Apply coupon discount based on its type
        let totalDiscountApplied = 0;
        switch (coupon.coupanfor) {
          case "all":
            totalDiscountApplied =
              (coupon.discountPercentage / 100) * totalPriceBeforeCoupon;
            totalPriceAfterCoupon =
              totalPriceBeforeCoupon - totalDiscountApplied;
            couponApplied = true;
            break;
          case "product":
            const couponProductIds = coupon.applicableProducts.map((prod) =>
              prod.toString()
            );
            const matchingProducts = orderItems.filter((item) =>
              couponProductIds.includes(item.productId.toString())
            );
            if (matchingProducts.length > 0) {
              totalDiscountApplied =
                (coupon.discountPercentage / 100) *
                matchingProducts.reduce(
                  (acc, curr) => acc + curr.totalPrice,
                  0
                );
              totalPriceAfterCoupon =
                totalPriceBeforeCoupon - totalDiscountApplied;
              couponApplied = true;
            }
            break;
          case "category":
            const couponCategoryIds = coupon.applicableCategories.map((cat) =>
              cat.toString()
            );
            const matchingCategoryProducts = orderItems.filter((item) => {
              const product = products.find(
                (prod) => prod._id.toString() === item.productId.toString()
              );
              return (
                product &&
                product.category &&
                couponCategoryIds.includes(product.category.toString())
              );
            });
            if (matchingCategoryProducts.length > 0) {
              totalDiscountApplied =
                (coupon.discountPercentage / 100) *
                matchingCategoryProducts.reduce(
                  (acc, curr) => acc + curr.totalPrice,
                  0
                );
              totalPriceAfterCoupon =
                totalPriceBeforeCoupon - totalDiscountApplied;
              couponApplied = true;
            }
            break;
          default:
            break;
        }

        if (!couponApplied) {
          return res.status(400).json({
            success: false,
            message: "Coupon is not applicable to any products in the order",
          });
        }
      }

      // Add tax and shipping price
      var totalProductPrice = totalPriceAfterCoupon;
      var priceAfterTax = totalPriceAfterCoupon * 1.05;
      totalPriceAfterCoupon =
        totalPriceAfterCoupon * 1.05 + req.body.shippingPrice;

      const order = await Order.create({
        userId: req.user.id,
        orderItems: orderItems,
        shippingAddress: req.body.shippingAddress,
        billingAddress: req.body.billingAddress,
        paymentMethod: req.body.paymentMethod || "Cash On Delivery",
        taxPrice: req.body.taxPrice || 0,
        priceAfterAddingTax: priceAfterTax || totalPriceAfterCoupon,
        TotalProductPrice: totalProductPrice || null,
        shippingPrice: req.body.shippingPrice || 0,
        totalPrice: totalPriceAfterCoupon,
        isPaid: req.body.isPaid || false,
        paidAt: req.body.paidAt || null,
        isDelivered: req.body.isDelivered || false,
        deliveredAt: req.body.deliveredAt || null,
        status: req.body.status || "Pending",
        Iscoupanapplied: req.body.CoupanCode ? "true" : "false",
        CoupanCode: req.body.CoupanCode || null,
        CoupanDiscount: req.body.CoupanCode
          ? coupon.discountPercentage || 0
          : null,
      });

      res.status(201).json({
        success: true,
        order,
      });
    }
  }
);

// get my order
const GetMyOrder = TryCatch(async (req, res, next) => {
  const order = await Order.find({ userId: req.user.id })
    .populate({
      path: "orderItems",
      populate: {
        path: "productId",
        model: "product",
        select: "name price image thumbnail brand",
      },
    })
    .populate({
      path: "shippingAddress",
      model: "shipedaddress",
      // select: "address city state country postalCode",
    })
    .populate({
      path: "billingAddress",
      model: "billingaddress",
      // select: "address city state country postalCode",
    })
    .populate({
      path: "userId",
      //   model:"user",
      select: "firstName lastName email mobileNumber userImage",
    });
  res.status(200).json({
    success: true,
    order,
  });
});

// get order details by id
const GetOrderById = TryCatch(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate({
      path: "orderItems",
      populate: {
        path: "productId",
        model: "product",
        select: "name price image thumbnail brand",
      },
    })
    .populate({
      path: "shippingAddress",
      model: "shipedaddress",
      // select: "address city state country postalCode",
    })
    .populate({
      path: "billingAddress",
      model: "billingaddress",
      // select: "address city state country postalCode",
    })
    .populate({
      path: "userId",
      //   model:"user",
      select: "firstName lastName email mobileNumber userImage",
    });
  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }
  res.status(200).json({
    success: true,
    order,
  });
});

// update order details by order id
const UpdateOrderById = TryCatch(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    order,
  });
});

// delete order
const DeleteOrder = TryCatch(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }
  await order.remove();
  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});

// get all orders
const GetAllOrders = TryCatch(async (req, res, next) => {
  const status = req.query.status || "Pending";
  const resultperpage = req.query.resultperpage || 10;
  // Initialize ApiFeatures with the Order model query and the query string from the request
  const features = new ApiFeatures(Order.find(), req.query)
    // Apply search functionality if 'name' is provided in the query string
    .search()
    .filterByStatus(status)
    // Apply pagination with default limit of 10 items per page
    .paginate(resultperpage);

  // Execute the query with applied features
  const Orders = await features.query
    // Populate necessary fields
    .populate({
      path: "orderItems",
      populate: {
        path: "productId",
        model: "product",
        select: "name price image thumbnail brand",
      },
    })
    .populate({
      path: "shippingAddress",
      model: "shipedaddress",
    })
    .populate({
      path: "billingAddress",
      model: "billingaddress",
    })
    .populate({
      path: "userId",
      select: "firstName lastName email mobileNumber userImage",
    });

  // Send response
  res.status(200).json({
    success: true,
    count: Orders.length,
    Orders,
  });
});

// orders by user Id
const GetOrderByUserId = TryCatch(async (req, res, next) => {
  const Orders = await Order.find({ userId: req.params.id });
  res.status(200).json({
    success: true,
    Orders,
  });
});

// get order by status
const GetOrderByStatus = TryCatch(async (req, res, next) => {
  const Orders = await Order.find({ status: req.params.status });
  res.status(200).json({
    success: true,
    Orders,
  });
});

// exports
module.exports = {
  CreateOrder,
  GetMyOrder,
  GetOrderById,
  UpdateOrderById,
  DeleteOrder,
  GetAllOrders,
  GetOrderByUserId,
  GetOrderByStatus,
};
