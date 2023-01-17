let mongoose=require("mongoose")

let hardskillsSchema= new mongoose.Schema({

    industry_id:{type:mongoose.Schema.ObjectId,ref:'industry'},
    skill:{type:String},
    

})
let hardskill= mongoose.model("hardskill",hardskillsSchema)
module.exports=hardskill