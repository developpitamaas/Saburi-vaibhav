const Subscribe = require("../../model/User/Subscribe");
const TryCatch = require("../../middleware/Trycatch");
const NodeCache = require("node-cache");
const sendEmail = require("../../utils/sendmail");
const cache = new NodeCache();

 
// create subscribe
const CreateSubscribe = TryCatch(async (req, res, next) => {

  const email = req.body.email;
  // const { email } = req.body;
  const findUser = await Subscribe.findOne({ email });

  if (findUser) {
    return res.status(400).json({
      success: false,
      message: "You have already subscribed",
    });
  }

  const subscribe = await Subscribe.create(req.body);
  cache.del("subscribe");

  // Send a subscription email
  const subject = "Welcome to SK Food!"; 
  const message = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); background-color: #f9f9f9;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://res.cloudinary.com/dtakusspm/image/upload/v1724484115/uffc8a6nzd13s0zfiik9.png" alt="SK Food Logo" style="width: 100px; height: auto; margin-bottom: 10px;" />
        <h1 style="color: #333; margin: 0;">Welcome to SK Food!</h1>
      </div>
      <div style="background-color: #fff; padding: 20px; border-radius: 10px;">
        <p style="margin: 0; color: #555;">Dear Customer,</p>
        <p style="margin: 0 0 20px 0; color: #555;">Congratulations, you have subscribed successfully to SK Food! We're thrilled to have you with us.</p>
        <p style="margin: 0 0 20px 0; color: #555;">At SK Food, we are dedicated to bringing you the best and freshest food products. Stay tuned for exciting updates, exclusive offers, and delicious recipes straight to your inbox.</p>
        <p style="margin: 0 0 20px 0; color: #555;">Thank you for joining our community. We look forward to serving you!</p>
        <p style="margin: 0; color: #555;">Best Regards,</p>
        <p style="margin: 0; color: #555;"><strong>SK Food Team</strong></p>
      </div>
      <p style="font-size: 0.8em; color: #999; text-align: center; margin-top: 20px;">If you did not subscribe to this newsletter or wish to unsubscribe, please <a href="#" style="color: #007BFF; text-decoration: none;">click here</a>.</p>
    </div>
  `;

  await sendEmail(email, subject, message, true); // Send HTML email

  res.status(201).json({
    success: true,
    message: "Congratulations, you have subscribed successfully",
  });
});


// get all subscribe
const GetAllSubscribe = TryCatch(async (req, res, next) => {
  
  // check cache
  if (cache.has("subscribe")) {
    const subscribe = cache.get("subscribe");
    return res.status(200).json({
      success: true,
      subscribe,
    });
  } else {
    const subscribe = await Subscribe.find();
    cache.set("subscribe", subscribe, 10);
    res.status(200).json({
      success: true,
      subscribe,
    });
  }
})

// export
module.exports = {
  CreateSubscribe,
  GetAllSubscribe
};
