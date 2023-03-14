let mongoose=require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
let postjobSchema=new mongoose.Schema({

    companyID:{type:mongoose.Schema.ObjectId},
    company_name:{type:String},
    company_contact:{type:String},
    job_title:{type:String},
    job_discription:{type:String},
    required_qualification:{type:String},
    salary:{type:Number},
    required_hardskills:{type:Array},
    type:{type:String},
    questions:{type:Array},
    apply_count:{type:Number},
    likes:{type:Number},
    dislikes:{type:Number},
    user_liked:{type:[mongoose.Schema.ObjectId]},
    user_disliked:{type:[mongoose.Schema.ObjectId]}
   
},{timestamps:true})
postjobSchema.plugin(mongoosePaginate);

let postjob=mongoose.model("jobpost",postjobSchema)
module.exports=postjob

