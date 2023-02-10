let mongoose=require("mongoose")

let hardskillsSchema= new mongoose.Schema({

    industry_id:{type:mongoose.Schema.ObjectId,ref:'industry'},
    skill:{type:String},
    // hardskill_info:{type:Number,ref:"candidate"}

    

})
let hardskill= mongoose.model("hardskill",hardskillsSchema)
module.exports=hardskill