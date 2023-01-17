let mongoose=require("mongoose")
let softskillsSchema= new mongoose.Schema({
    skill:{type:String},
})
let softskill= mongoose.model("softskill",softskillsSchema)
module.exports=softskill


