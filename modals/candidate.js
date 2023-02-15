let mongoose=require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2");
let candidateSchema=new mongoose.Schema({
    candidateID:{type:mongoose.Schema.ObjectId},
    firstname:{type:String},
    lastname:{type:String},
    location:{type:String},
    heighest_qualification:{type:String},
    about:{type:String},
    hardskills:{type:Array},
    softskills:{type:Array},
    languages:{type:Array},
    type:{type:String}

},{timestamps:true})
candidateSchema.plugin(mongoosePaginate);
let candidate=mongoose.model("candidate",candidateSchema)
module.exports=candidate