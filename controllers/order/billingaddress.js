const Billingaddress = require("../../model/order/billingaddress");
const TryCatch = require("../../middleware/Trycatch");
const User = require("../../model/User/users");

// create billing address
const CreateBillingAddress = TryCatch(async (req, res, next) => {
    req.body.userId = req.user.id
    const billingaddress = await Billingaddress.create(req.body);
    res.status(201).json({
        success: true,
        message: "Billing address created successfully",
        billingaddress,
    });
})

// get my billing address
const GetMyBillingAddress = TryCatch(async (req, res, next) => {
    const billingaddress = await Billingaddress.find({ userId: req.user.id });
    res.status(200).json({
        success: true,
        billingaddress
    });
})

// update billing address
const UpdateBillingAddress = TryCatch(async (req, res, next) => {
    const billingaddress = await Billingaddress.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        billingaddress
    });
})

// delete billing address
const DeleteBillingAddress = TryCatch(async (req, res, next) => {
  
    const billingaddress = await Billingaddress.findById(req.params.id);
 

    if (!billingaddress) {
        return res.status(404).json({
            success: false,
            message: "Billing address not found",
        });
    }
    await billingaddress.deleteOne();
    res.status(200).json({
        success: true,
        message: "Billing address deleted successfully",
    });
})

// get billing address by id
const GetBillingAddressById = TryCatch(async (req, res, next) => {
    const billingaddress = await Billingaddress.findById(req.params.id);
    res.status(200).json({
        success: true,
        billingaddress
    });
})

// exports
module.exports = {
    CreateBillingAddress,
    GetMyBillingAddress,
    UpdateBillingAddress,
    DeleteBillingAddress,
    GetBillingAddressById
}