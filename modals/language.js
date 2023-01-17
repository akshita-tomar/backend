let mongoose=require("mongoose")
const industry = require("./industry")
let languageSchema= new mongoose.Schema({
    _id:{type:mongoose.Schema.Types.ObjectId,ref:industry},
    languages:{type:String}
})
let language= mongoose.model("language",languageSchema)
module.exports=language