let language = require("../modals/language")


exports.get_language=async(req,res)=>{
  let result=await language.find()
  res.json(result)
}