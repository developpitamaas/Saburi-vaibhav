// const nodemailer = require("nodemailer");

// // send mail to user
// const sendEmail = async (email, subject, message, template) => {
//   let transporter = nodemailer.createTransport({
//     service: "gmail",
//     port: 587,
//     secure: false,
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.PASSWORD,
//     },
//   });
//   var mailOptions = {};
//   if (template) {
//     mailOptions = {
//       from: process.env.EMAIL,
//       to: email,
//       subject: subject,
//       text: message,
//       html: template || "",
//     };
//   } else {
//     mailOptions = {
//       from: process.env.EMAIL,
//       to: email,
//       subject: subject,
//       text: message,
//     };
//   }
//   return await transporter.sendMail(mailOptions);
// };

// //   export
// module.exports = sendEmail;


const nodemailer = require("nodemailer");

// send mail to user
const sendEmail = async (email, subject, message, isHTML = false) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  // Create mail options
  let mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    text: isHTML ? undefined : message, // Set text to undefined if HTML content is provided
    html: isHTML ? message : undefined, // Set html to undefined if plain text content is provided
  };

  // Send mail
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

// Export the sendEmail function
module.exports = sendEmail;
