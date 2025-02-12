const Message = require("../../model/User/usermessage");
const TryCatch = require("../../middleware/Trycatch");

// create message
const CreateMessage = TryCatch(async (req, res, next) => {
    const message = await Message.create(req.body);
    res.status(201).json({
        success: true,
        message : "Message sent successfully",
    });
})

// get all messages
const GetAllMessages = TryCatch(async (req, res, next) => {
    const messages = await Message.find();
    const totalMessages = messages.length;
    res.status(200).json({
        success: true,
        totalMessages,
        messages,
    });
})

// export
module.exports = {
    CreateMessage,
    GetAllMessages
}