const mongoose= require("mongoose")

const orderSchema = new mongoose.Schema({
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }],
    totalPrice:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["Pending","Confirmed","Delivered"],
        default:"Pending"
    }
    }, {timestamps: true});


const Order= mongoose.model("Order", orderSchema)
module.exports= Order;