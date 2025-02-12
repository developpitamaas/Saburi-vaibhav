const User = require("../../model/User/users");
const TryCatch = require("../../middleware/Trycatch");
const Products = require("../../model/Product/product");
const SecondorderSchema = require("../../model/order/orders");

// get dashboard
const GetDashboard = TryCatch(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Products.countDocuments();
  // count out of stock products
  const totalOrders = await SecondorderSchema.countDocuments();
  // countDocuments total panding orders
  const totalPandingOrders = await SecondorderSchema.countDocuments({
    status: "Pending",
  });
  // countDocuments total shipped orders
  const totalShippedOrders = await SecondorderSchema.countDocuments({
    status: "Shipped",
  });
  // // countDocuments total delivered orders
  const totalDeliveredOrders = await SecondorderSchema.countDocuments({
    status: "Delivered",
  });
  // // countDocuments total canceled orders
  const totalCanceledOrders = await SecondorderSchema.countDocuments({
    status: "Cancelled",
  });
  // // countDocuments total returned orders
  const totalReturnedOrders = await SecondorderSchema.countDocuments({
    status: "returned",
  });

  res.status(200).json({
    success: true,
    totalUsers,
    totalProducts,
    totalOrders,
    totalPandingOrders,
    totalShippedOrders,
    totalDeliveredOrders,
    totalCanceledOrders,
    totalReturnedOrders,
  });
});

const RevenuInfo = async (req, res) => {
  try {
    // Fetch all orders and populate necessary fields
    const orders = await SecondorderSchema.find().populate({
      path: "CartId",
      populate: {
        path: "orderItems.productId",
        model: "product",
      },
    });

    // Calculate metrics
    const totalDeliveredRevenue = orders
      .filter((order) => order.isDelivered)
      .reduce((total, order) => total + order.CartId.totalPrice, 0);

    const totalPendingRevenue = orders
      .filter((order) => order.status === "Pending")
      .reduce((total, order) => total + order.CartId.totalPrice, 0);

    const totalCanceledRevenue = orders
      .filter((order) => order.status === "Cancelled")
      .reduce((total, order) => total + order.CartId.totalPrice, 0);

    // Construct response
    const adminDashboardInfo = {
      totalDeliveredRevenue,
      totalPendingRevenue,
      totalCanceledRevenue,
      totalOrders: orders.length,
    };

    res.status(200).json(adminDashboardInfo);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const SaleDetails = async (req, res) => {
  try {
    const { today, yesterday, thisMonth, lastMonth, year, yearName, date } =
      req.query;
    let salesData = {};
    let sale = [];

    // Fetch today's sales
    if (today === "true") {
      const todaySales = await getSalesForDate(new Date());
      salesData.todaySales = todaySales;
      sale.push(todaySales.length);
    }

    // Fetch yesterday's sales
    if (yesterday === "true") {
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdaySales = await getSalesForDate(yesterdayDate);
      salesData.yesterdaySales = yesterdaySales;
      sale.push(yesterdaySales.length);
    }

    // Fetch this month's sales
    if (thisMonth === "true") {
      const thisMonthSales = await getMonthlySales(new Date());
      salesData.thisMonthSales = thisMonthSales;
      sale.push(thisMonthSales.length);
    }

    // Fetch last month's sales
    if (lastMonth === "true") {
      const lastMonthDate = new Date();
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
      const lastMonthSales = await getMonthlySales(lastMonthDate);
      salesData.lastMonthSales = lastMonthSales;
      sale.push(lastMonthSales.length);
    }

    // Fetch yearly sales
    if (year === "true" && yearName) {
      const yearStartDate = new Date(yearName, 0, 1);
      const yearEndDate = new Date(yearName, 11, 31);
      const yearlySales = await getYearlySales(yearStartDate, yearEndDate);
      salesData.yearlySales = yearlySales;
      sale.push(yearlySales.length);
    }

    // Fetch sales for a specific date
    if (date) {
      const specificDate = new Date(date);
      const specificDateSales = await getSalesForDate(specificDate);
      salesData.specificDateSales = specificDateSales;
      sale.push(specificDateSales.length);
    }

    res.status(200).json({ sale, salesData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Function to get sales for a specific date
const getSalesForDate = async (date) => {
  const startOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const endOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1
  );

  const sales = await SecondorderSchema.find({
    createdAt: { $gte: startOfDay, $lt: endOfDay },
  });

  return sales;
};

// Function to get monthly sales
const getMonthlySales = async (date) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const sales = await SecondorderSchema.find({
    createdAt: { $gte: startOfMonth, $lt: endOfMonth },
  });

  return sales;
};

// Function to get yearly sales
const getYearlySales = async (startDate, endDate) => {
  const sales = await SecondorderSchema.find({
    createdAt: { $gte: startDate, $lte: endDate },
  });

  return sales;
};

// exports
module.exports = {
  GetDashboard,
  RevenuInfo,
  SaleDetails,
};
