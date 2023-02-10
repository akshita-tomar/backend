let softskill = require("../modals/softskill")


exports.get_softskill=async(req,res)=>{
  let result=await softskill.find()
  return res.json(result)
}