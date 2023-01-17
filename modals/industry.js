let mongoose=require("mongoose")
const hardskill = require("./hardskill")
let industrySchema= new mongoose.Schema({
     
      name:{type:String}
})
let industry= mongoose.model("industry",industrySchema)
module.exports=industry