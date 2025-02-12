
// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };
  // otp
  var OTPs = {};

  // Send OTP via email
const sendOTP = async (email, OTP) => {
    try {
      await Mail(
        email,
        "Password Reset OTP",
        `Your OTP  is: ${OTP}. Please do not share this OTP with anyone.`
      );
      return true;
    } catch (error) {
      console.error("Error sending OTP:", error);
      return false;
    }
  };

  // Verify OTP
const verifyOTP = (email, userOTP) => {
    const storedOTP = OTPs[email];
    if (!storedOTP || storedOTP !== userOTP) {
      return false;
    }
    // OTP is valid, remove it from storage
    delete OTPs[email];
    return true;
  };

  
  module.exports = { generateOTP, sendOTP, verifyOTP };