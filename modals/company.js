let mongoose=require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2");
const DateTime = require("node-datetime/src/datetime");
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
    type:{type:String}


},{timestamps:true})
companySchema.plugin(mongoosePaginate);
let company= mongoose.model("company",companySchema)
module.exports=company