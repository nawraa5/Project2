const mongoose= require("mongoose")

const storeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    category:{
        type:String,
        enum:["flowers","cakes"],
        required:true

    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
}, {timestamps: true});


const Store= mongoose.model("Store", storeSchema)
module.exports= Store;