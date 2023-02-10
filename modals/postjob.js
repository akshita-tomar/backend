let mongoose=require("mongoose");
let postjobSchema=new mongoose.Schema({

    companyID:{type:mongoose.Schema.ObjectId},
    job_title:{type:String},
    job_discription:{type:String},
    required_qualification:{type:String},
    salary:{type:Number},
    required_hardskills:{type:Array},


},{timestamps:true})

let postjob=mongoose.model("jobpost",postjobSchema)
module.exports=postjob