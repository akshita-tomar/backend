let mongoose=require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
let postjobSchema=new mongoose.Schema({

    companyID:{type:mongoose.Schema.ObjectId},
    job_title:{type:String},
    job_discription:{type:String},
    required_qualification:{type:String},
    salary:{type:Number},
    required_hardskills:{type:Array},
    type:{type:String}


},{timestamps:true})
postjobSchema.plugin(mongoosePaginate);

let postjob=mongoose.model("jobpost",postjobSchema)
module.exports=postjob

