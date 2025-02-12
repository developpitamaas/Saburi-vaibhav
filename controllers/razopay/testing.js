// razopay testing
const Razorpay = require("razorpay");
const keyId = "rzp_test_DaA1MMEW2IUUYe";
const keySecret = "q67o8eUlhpkUQAMSQTTgki8y";

const CreateRazorpayOrder = async(req,res)=>{
    const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret
    }) 
    const options = {
        amount : req.body.amount,
        currency : "INR",
        receipt : "receipt#1",
        payment_capture : 1
    }
    try{
        const reaponse =  await razorpay.orders.create(options)
        res.json({
            order_id : reaponse.id,
            currency : reaponse.currency,
            amount : reaponse.amount
        })
    }catch(err){
        console.log(err)
    }
}

const Getpaymentdetailsbyorderid = async(req,res)=>{
    const {paymentId} = req.params
    const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret
    })

    try{
        const reaponse = await razorpay.payments.fetch(paymentId)
        res.json({
            status : reaponse.status,
            mathod : reaponse.method,
            amount : reaponse.amount,
            currency : reaponse.currency
        })
    }catch(err){
        console.log(err)
    }
}


module.exports = {CreateRazorpayOrder,Getpaymentdetailsbyorderid}