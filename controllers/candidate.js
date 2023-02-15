let candidate = require("../modals/candidate")
let hardskill = require("../modals/hardskill");
const language = require("../modals/language");
const softskill = require("../modals/softskill");
let userModel = require("../modals/user")

exports.post_candidate = async (req, res) => {


   let { firstname, lastname, location, heighest_qualification, about,hardskills,softskills} = req.body;


   if (!firstname || !lastname || !location || !heighest_qualification || !about) {
      return res.json("fill all the parameters")
   }


   // let result1 = await hardskill.find().populate("skill")
   // let a = result1
   // var skills = a.map(function (i) {

   //    return i.skill;

   // });


   // let result2 = await softskill.find().populate("skill")
   // let b = result2
   // var skills2 = b.map(function (i) {
   //    return i.skill;
   // });


   let result3 = await language.find().populate("languages")
   let c = result3
   var language1 = c.map(function (i) {
      return i.languages;
   });


     
   let candidatetype="candidatetype"
   let candidatedetils = {
      candidateID: req.result.id,
      firstname: firstname,
      lastname: lastname,
      location: location,
      heighest_qualification: heighest_qualification,
      about: about,
      hardskills: hardskills,
      softskills: softskills,
      languages: language1,
      type:candidatetype
   }
   await candidate.create(candidatedetils)
      .then(async (data) => {
         await userModel.findOneAndUpdate({ _id: req.result.id }, {
            $set: {
               onboarding: true
            }
         })
      })


   return res.json("candidate successfully registered")

}


// ###################################get all the candidates###############
  
exports.get_candidates=async (req,res)=>{
      let result=await candidate.find()
      let total_candidates=result.length
      console.log(total_candidates)
      return res.send(result)
      
}
