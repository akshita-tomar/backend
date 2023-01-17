let softskill = require("../modals/softskill")


exports.get_softskill=async(req,res)=>{
  let result=await softskill.find()
  res.json(result)
}