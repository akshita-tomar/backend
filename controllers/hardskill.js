let hardskill = require("../modals/hardskill")

// exports.get_hardskill = async (req, res) => {
//    let result1=await hardskill.find({industry_id:req.query.industry_id})

//  res.send(result1)

// }



exports.get_hardskill = async (req, res) => {
let result= await hardskill.find()
.populate("industry_id")
res.json(result)
}



   // exports.get_hardskill = async (req, res) => {

   // let result= await hardskill.find({industry_id:req.query.industry_id})
   // .populate("industry_id")
   // return res.json(result)  

   // }