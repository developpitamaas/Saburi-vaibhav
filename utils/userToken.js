// getting token and saving in cookies
const sendToken = (user, statusCode, res) => {
    // getting token from user model to controller
    const token = user.getJWTToken();
  
    // options for cookie
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 // 24 hours
      ),
      httpOnly: true,
    };
  
    // send response
    res.status(statusCode).cookie("token", token, options).json({
      success: true,
      message : "Logged in successfully",
      user,
      token,
    });
  };
  
  // export default sendToken;
  module.exports = sendToken 