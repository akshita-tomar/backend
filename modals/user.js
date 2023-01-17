let mongoose=require("mongoose");
const DateTime = require("node-datetime/src/datetime");
let userSchema=new mongoose.Schema({
    username:{type: String},
    email:{type: String},
    password:{type: String},
    profile:{type: Number,enum:[1,2]},
    token:{type:String},
    otp:{type:Number},
    otp_createdAt:{String},
    otp_verified:{ type:Boolean,default:false},

},{timestamps:true})
let userModel= mongoose.model("User",userSchema)
module.exports=userModel;








