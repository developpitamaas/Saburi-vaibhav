const axios = require("axios");
const SecondorderSchema = require("../../../model/order/orders");


// create order on Shiprocket
const createShiprocketOrder = async (orderData) => {
  const url = "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQ2MDQxODksInNvdXJjZSI6InNyLWF1dGgtaW50IiwiZXhwIjoxNzQ4NTg3Mzc5LCJqdGkiOiI0cmJ6Q3AyRHlvdVh4bHM5IiwiaWF0IjoxNzQ3NzIzMzc5LCJpc3MiOiJodHRwczovL3NyLWF1dGguc2hpcHJvY2tldC5pbi9hdXRob3JpemUvdXNlciIsIm5iZiI6MTc0NzcyMzM3OSwiY2lkIjo0NDMyNDc1LCJ0YyI6MzYwLCJ2ZXJib3NlIjpmYWxzZSwidmVuZG9yX2lkIjowLCJ2ZW5kb3JfY29kZSI6IiJ9.Gxs-goyXrRBVn4WiL7TTmL_xwGrJVBUfKUwchzylL0E`,
  };
  try {
  
    const response = await axios.post(url, orderData, { headers });
    return response.data;
  } catch (error) {
    console.error(
      "Error while creating Shiprocket order:",
      error.response?.data || error.message
    );
    throw new Error("Error while creating Shiprocket order");
  }
};  

// get all orders

// const getAllOrders = async (req, res) => {
//   const url = "https://apiv2.shiprocket.in/v1/external/orders";
//   const headers = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${process.env.SHIPROCKET_TOKEN}`,
//   };

//   try {
//     const response = await axios.get(url, { headers });
// // default status is  - status
//     res.status(200).json({
//       success: true,
//       message: "Shiprocket orders fetched successfully",
//       data: response.data,
//     });
//   } catch (error) {
//     const errorMessage = error.response
//       ? JSON.stringify(error.response.data)
//       : error.message;
//     console.error("Error while fetching Shiprocket orders:", errorMessage);
//     res.status(500).json({
//       success: false,
//       message: "Error while fetching Shiprocket orders",
//       error: errorMessage,
//     });
//   }
// };

const getAllOrders = async (req, res) => {

  const status = req.query.status;
  const url = "https://apiv2.shiprocket.in/v1/external/orders";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.SHIPROCKET_TOKEN}`,
  };

  try {
    const response = await axios.get(url, { headers });
    const newOrders = response.data.data.filter(
      (order) => order.status === status
    );
    res.status(200).json({
      success: true,
      message: "Shiprocket new orders fetched successfully",
      data: newOrders,
    });
  } catch (error) {
    const errorMessage = error.response
      ? JSON.stringify(error.response.data)
      : error.message;
    console.error("Error while fetching Shiprocket orders:", errorMessage);
    res.status(500).json({
      success: false,
      message: "Error while fetching Shiprocket orders",
      error: errorMessage,
    });
  }
};




const getOrderById = async (req, res) => {
  const orderId = req.params.id;
  const url = `https://apiv2.shiprocket.in/v1/external/orders/show/${orderId}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.SHIPROCKET_TOKEN}`,
  };
  try {
    const response = await axios.get(url, { headers });
    res.status(200).json({
      success: true,
      message: "Shiprocket order fetched successfully",
      data: response.data,
    });
  } catch (error) {
    const errorMessage = error.response
      ? JSON.stringify(error.response.data)
      : error.message;
    console.error("Error while fetching Shiprocket order:", errorMessage);
    res.status(500).json({
      success: false,
      message: "Error while fetching Shiprocket order",
      error: errorMessage,
    });
  }
};

const cancelOrderById = async (req, res) => { 
  const orderId = req.params.id; 

  if (!orderId) {
    return res.status(400).json({
      success: false,
      message: "Order ID is missing",
    });
  }

  const url = 'https://apiv2.shiprocket.in/v1/external/orders/cancel';
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.SHIPROCKET_TOKEN}`,
  };

  const body = {
    ids: [parseInt(orderId)], 
  };

  try {
    const response = await axios.post(url, body, { headers });
    return res.status(200).json({
      success: true,
      message: "Order canceled successfully",
      data: response.data,
    });
  } catch (error) {
    const errorMessage = error.response
      ? JSON.stringify(error.response.data)
      : error.message;

    console.error("Error while canceling order:", errorMessage);

    return res.status(500).json({
      success: false,
      message: "Error while canceling order",
      error: errorMessage,
    });
  }
};


const getOrdersByUserId = async (req, res) => {
  const userId = req.user.id; 
  const url = "https://apiv2.shiprocket.in/v1/external/orders";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.SHIPROCKET_TOKEN}`,
  };
  try {
    const response = await axios.get(url, { headers });
    const userOrders = response.data.data.filter(
      (order) => order.others.client_id == userId
    );
      const data = await SecondorderSchema.find({ userId: req.params.id })
    

    res.status(200).json({
      success: true,
      message: "Orders for the logged-in user fetched successfully",
      data: userOrders,
    });
  } catch (error) {
    console.error("Error while fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching user orders",
      error: error.message,
    });
  }
};




const checkServiceability = async (req, res) => {
  const { pickup_postcode, delivery_postcode, weight, cod, order_id } = req.query; 

  if (!pickup_postcode || !delivery_postcode || !weight) {
    return res.status(400).json({
      success: false,
      message: "Missing required parameters: pickup_postcode, delivery_postcode, or weight",
    });
  }

  const serviceabilityUrl = "https://apiv2.shiprocket.in/v1/external/courier/serviceability";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.SHIPROCKET_TOKEN}`,
  };

  const payload = {
    pickup_postcode,
    delivery_postcode,
    weight,
    cod: cod || "0", 
    order_id: order_id || "", 
  };

  try {
    const response = await axios.get(serviceabilityUrl, {
      headers,
      params: payload, 
    });

    return res.status(200).json({
      success: true,
      message: "Serviceability check successful",
      data: response.data,
    });
  } catch (error) {
    console.error("Error checking serviceability:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Error checking serviceability",
      error: error.response?.data || error.message,
    });
  }
};


const createShipment = async (req, res) => {
  const orderId = req.params.id;
  const courierId = req.params.courierId;

  if (!orderId) {
    return res.status(400).json({
      success: false,
      message: "Order ID is missing",
    });
  }

  const orderDetailsUrl = `https://apiv2.shiprocket.in/v1/external/orders/show/${orderId}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.SHIPROCKET_TOKEN}`,
  };

  try {
    const orderResponse = await axios.get(orderDetailsUrl, { headers });
    const orderData = orderResponse.data.data;

    const awbAssignUrl = "https://apiv2.shiprocket.in/v1/external/courier/assign/awb";
    const awbPayload = {
      shipment_id: orderData.shipments.id, 
      courier_id: 58,
    };

    const awbResponse = await axios.post(awbAssignUrl, awbPayload, { headers });

    if (awbResponse.data.awb_assign_status === 0) {
      return res.status(400).json({
        success: false,
        message: "Failed to assign AWB",
        error: awbResponse.data.response.data.awb_assign_error || "Insufficient funds or other error",
      });
    }

    const shipmentId = awbResponse.data.response.data.shipment_id; 

    const pickupUrl = "https://apiv2.shiprocket.in/v1/external/courier/generate/pickup";
    const pickupPayload = {
      shipment_id: shipmentId, 
    };

    const pickupResponse = await axios.post(pickupUrl, pickupPayload, { headers });

    return res.status(200).json({
      success: true,
      message: "Shipment created and pickup requested successfully",
      data: {
        awbAssignResponse: awbResponse.data,
        pickupResponse: pickupResponse.data,
      },
    });
  } catch (error) {
    console.error("Error while creating shipment:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Error while creating shipment",
      error: error.response?.data || error.message,
    });
  }
};

module.exports = {
  createShiprocketOrder,
  getAllOrders,
  getOrderById,
  cancelOrderById,
  getOrdersByUserId,
  createShipment,
  checkServiceability
};
