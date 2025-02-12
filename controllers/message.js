const Message = require("../../model/message");
const TryCatch = require("../../middleware/Trycatch");

// crate message 
const CreateMessage = TryCatch(async (req, res, next) => {
    const message = await Message.create(req.body);
    res.status(201).json({
        success: true,
        message
    })
})

// get all messages
const GetAllMessages = TryCatch(async (req, res, next) => {
    const messages = await Message.find();
    res.status(200).json({
        success: true,
        messages
    })
})

// export 
module.exports = {
    CreateMessage,
    GetAllMessages
}