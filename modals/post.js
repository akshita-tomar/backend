let mongoose=require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2");
let postSchema= new mongoose.Schema({
    candidate_id:{type:mongoose.Schema.ObjectId},
    candidate_post:[
        {
            post:{type:String},
            post_status:{type:String},
            type:{type:String}
        }
    ],
    candidate_profile:{type:String},
    candidate_firstname:{type:String},
    candidate_lastname:{type:String},
    company_id:{type:mongoose.Schema.ObjectId},
    company_post:[
        {
            post:{type:String},
            post_status:{type:String}
            
        }
    ],
    type:{type:String},
    company_profile:{type:String},
    company_name:{type:String}
},{timestamps:true})
postSchema.plugin(mongoosePaginate);
let post= mongoose.model("post",postSchema,"post")
module.exports=post