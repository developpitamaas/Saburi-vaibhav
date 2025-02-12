const axios = require("axios");

// Shiprocket Credentials
const shiprocketEmail = "parampreet759@gmail.com";
const shiprocketPassword = "Param@28";

// Authenticate Shiprocket
const authenticateShiprocket = async () => {
  try {
    const { data } = await axios.post("https://apiv2.shiprocket.in/v1/external/auth/login", {
      email: shiprocketEmail,
      password: shiprocketPassword
    });
    return data.token;
  } catch (error) {
    throw new Error("Shiprocket Authentication Failed");
  }
};

// Create Shipment Order
exports.createShipment = async (req, res) => {
  const token = await authenticateShiprocket();
  
  const shipmentData = {
    order_id: req.body.order_id,
    order_date: req.body.order_date,
    pickup_location: req.body.pickup_location,
    billing_customer_name: req.body.billing_customer_name,
    billing_address: req.body.billing_address,
    billing_city: req.body.billing_city,
    billing_pincode: req.body.billing_pincode,
    billing_country: req.body.billing_country,
    billing_email: req.body.billing_email,
    billing_phone: req.body.billing_phone,
    shipping_is_billing: true,
    order_items: req.body.order_items,
    payment_method: req.body.payment_method,
    sub_total: req.body.sub_total,
    length: req.body.length,
    breadth: req.body.breadth,
    height: req.body.height,
    weight: req.body.weight,
  };

  try {
    const { data } = await axios.post("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", shipmentData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    res.status(201).json({ success: true, shipment: data });
  } catch (error) {
    console.error("Shiprocket Order Error:", error);
    res.status(500).json({ error: "Failed to create shipment" });
  }
};

// Track Shipment
exports.trackShipment = async (req, res) => {
  const token = await authenticateShiprocket();
  const { shipment_id } = req.params;

  try {
    const { data } = await axios.get(`https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${shipment_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    res.status(200).json({ success: true, tracking_data: data });
  } catch (error) {
    console.error("Shiprocket Tracking Error:", error);
    res.status(500).json({ error: "Failed to track shipment" });
  }
};
