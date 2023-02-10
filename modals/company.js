let mongoose=require("mongoose")
let companySchema=new mongoose.Schema({
    userID:{type:mongoose.Schema.ObjectId},
    company_name:{type:String},
    company_logo:{type:String},
    company_type:{type:String},
    employee_strength:{type:Number},
    summary:{type:String},
    vision:{type:String},
    GST_identification_no:{type:String},
    company_contact_no:{type:String},
    company_address:{type:String},
    website:{type:String},
    status:{type:String},

},{timestamps:true})
let company= mongoose.model("company",companySchema)
module.exports=company