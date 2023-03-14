let candidate = require("../modals/candidate");
const company = require("../modals/company");
let hardskill = require("../modals/hardskill");
const language = require("../modals/language");
const softskill = require("../modals/softskill");
let userModel = require("../modals/user")



// #######################  post candidate ##################
exports.post_candidate = async (req, res) => {

   var profile = "";

   if (req.files) {
      var file = req.files.candidate_profile;

      if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif" || file.mimetype == "image/jpg") {

         profile = req.protocol + "://" + req.headers.host + '/uploadprofile/' + file.name;

         file.mv('public/uploadprofile/' + file.name, function (err) {

         });

      } else {
         return res.send({ message: "This format is not allowed , please upload file with '.png','.gif','.jpg'" })
      }
   }


   let { firstname, lastname, location, heighest_qualification, about, hardskills, softskills, languages } = req.body;


   if (!firstname || !lastname || !location || !heighest_qualification || !about || !hardskills || !softskills || !languages || !profile) {

      return res.json("fill all the parameters")

   }




   let candidatetype = "candidatetype"
   let candidatedetils = {
      candidateID: req.result.id,
      firstname: firstname,
      candidate_profile: profile,
      lastname: lastname,
      location: location,
      heighest_qualification: heighest_qualification,
      about: about,
      hardskills: hardskills,
      softskills: softskills,
      languages: languages,
      type: candidatetype
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





// ###################################  get all the candidates   ###############

exports.get_candidates = async (req, res) => {
   let result = await candidate.find()
   let total_candidates = result.length
   console.log(total_candidates)
   return res.send(result)

}



// ###################### get candidate profile  ###################
exports.get_candidate_profile = async (req, res) => {
   let result = await candidate.findOne({ _id: req.query.id })
   if (!result) {
      return res.send("unidentified user")
   }
   return res.send(result)
}



//########################## update candidate ###################

exports.update_candidate = async (req, res) => {
   let candidatetype = "candidatetype"

   var profile = "";

   if (req.files) {

      var file = req.files.candidate_profile;

      if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif" || file.mimetype == "image/jpg") {

         profile = req.protocol + "://" + req.headers.host + '/uploadprofile/' + file.name;

         file.mv('public/uploadprofile/' + file.name, function (err) {

         });

      } else {
         return res.send("This format is not allowed , please upload file with '.png','.gif','.jpg','jpeg'")
      }
   }


   let { firstname, lastname, location, heighest_qualification, about, hardskills, softskills, languages } = req.body;


   if (!firstname || !lastname || !location || !heighest_qualification || !about || !hardskills || !softskills || !languages || !profile) {

      return res.send("fill all the parameters")

   }

   await candidate.findOneAndUpdate({ candidateID: req.result.id }, {

      $set: {

         candidateID: req.result.id,
         firstname: firstname,
         candidate_profile: profile,
         lastname: lastname,
         location: location,
         heighest_qualification: heighest_qualification,
         about: about,
         hardskills: hardskills,
         softskills: softskills,
         languages: languages,
         type: candidatetype

      }
   })


   return res.send("profile updated successfully")

}


// ############################  get candidate ####################

exports.get_candidate = async (req, res) => {
   let result = await candidate.findOne({ candidateID: req.result.id })
   return res.send(result)
}



// #####################  post education details ############
exports.post_education_details = async (req, res) => {

   let result = await candidate.findOneAndUpdate({ candidateID: req.result.id }, {
      $set: {
         education: req.body.education
      }
   })
   if (!result) {
      return res.send("unidentified user")
   }

   return res.send("record added successfully")
}






// ################## post work experience###################
exports.post_workexperience = async (req, res) => {

   let result = await candidate.findOneAndUpdate({ candidateID: req.result.id }, {
      $set: {

         work_experience: req.body.work_experience

      }

   })

   if (!result) {
      return res.send("unidentified user")
   }
   return res.send("record added successfully")
}





//  ################################  upload post  #######################
exports.upload_post = async (req, res) => {
  

      var post = "";

      if (req.files) {

         var file = req.files.file;

         if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif" || file.mimetype == "image/jpg", file.mimetype == "video/mp4") {

            post = req.protocol + "://" + req.headers.host + '/uploadpost/' + file.name;

            file.mv('public/uploadpost/' + file.name, function (err) {

            });

         } else {
            return res.send("This format is not allowed , please upload file with '.png','.gif','.jpg','jpeg'")
         }
      }
   
   let result = await userModel.findOne({ _id: req.result.id })
   if (result.profile === "candidate") {
      let result2 = await candidate.findOneAndUpdate({ candidateID: result._id }, {
         $push: {
            candidate_post:
               [
                  {
                     post: post,
                     post_status: req.body.status
                  }
               ]
         }
      })
      if(!result2){
         return res.send("unidenmtified user")
      }
      return res.send("post uploaded successfully")
   } else {
      let result3 = await company.findOneAndUpdate({ userID: result._id }, {
         $push: {
            company_post:
               [
                  {
                     post: post,
                     post_status: req.body.status
                  }
               ]
         }
      })
      if(!result3){
         return res.send("unidentified user")
      }else
      return res.send(" post uploaded successfully..")
   }
}