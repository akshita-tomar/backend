let applyjob = require("../modals/applyjob")
let company = require("../modals/company")
let candidate = require("../modals/candidate")
let postjob = require("../modals/postjob")
const userModel = require("../modals/user")





//applied jobs
exports.apply_job = async (req, res) => {

  let { replied_answers, job_id } = req.body;
  if (!replied_answers) {
    return res.send("reply all the answers")
  }


  let result = await candidate.findOne({ candidateID: req.result.id })
  if(!result){
    return res.send("unidentified user")
  }
  let obj = {
    candidate_id: result._id,
    username: result.firstname,
    applicant_profile: result.candidate_profile,
    replied_answers: replied_answers,
    job_id: job_id,

  }
  await applyjob.create(obj)
  return res.send("job applied sucessfully")

}


//get job response
exports.get_jobresponse = async (req, res) => {
  let result = await applyjob.find({ job_id: req.query.id })
  return res.send(result)
}


//hire candidate
exports.hire_candidate = async (req, res) => {
  let jobstatus = "Hired"
  let { url, hireing_message, slot} = req.body
  if (!url || !hireing_message ||!slot) {
    return res.send("fill all the parameters")
  }
  let result = await applyjob.findOne({ _id: req.query.id })

  if (!result) {
    return res.send("unidentified user")
  }
  else {

    let result2 = await applyjob.findOneAndUpdate({ _id: req.query.id }, {
      $set: {
        status: jobstatus,
        slot:slot,
        url: url,
        hireing_message: hireing_message,
        rejection_message: null
      }
    })
    return res.send("Hiring details sent successfully...")
  }
}


//reject candidate 
exports.reject_candidate = async (req, res) => {
  let jobstatus = "Rejected"
  let { rejection_message } = req.body
  if (!rejection_message) {
    return res.send("enter the reason of rejection")
  }
  let result = await applyjob.findOne({ _id: req.query.id })
  if (!result) {
    return res.send("unidentified user")
  } else {
    let result2 = await applyjob.findOneAndUpdate({ _id: req.query.id }, {
      $set: {
        status: jobstatus,
        rejection_message: rejection_message,
        url: null,
        slot:null,
        hireing_message: null,

      }
    })
    
    return res.send("rejection response has been sucessfully sent..")
  }

}





// ############################ get applied job response ######################

exports.job_invitation = async (req, res) => {

  let result = await candidate.findOne({ candidateID: req.result.id })
  if(!result){
    return res.send("unidentified user")
  }
  let result2 = await applyjob.aggregate([
    { "$match": { "candidate_id": result._id, "status": "Hired" } },
    {
      $lookup: {
        from: "jobposts",
        localField: "job_id",
        foreignField: "_id",
        as: "job_details"
      }
    },
    {
      $lookup: {
        from: "companies",
        localField: "job_details.companyID",
        foreignField: "_id",
        as: "company_details"
      }
    }
  ])
  if (result2.length === 0) {
    return res.send("you haven't get any hiring message yet")
  }
  return res.send(result2)



}




// ######################### job rejections################
exports.job_rejections = async (req, res) => {

  let result = await candidate.findOne({ candidateID: req.result.id })
  if(!result){
    return res.send("unidentified user")
  }
  let result2 = await applyjob.aggregate([
    { "$match": { "candidate_id": result._id, "status": "Rejected" } },

    {
      $lookup: {
        from: "jobposts",
        localField: "job_id",
        foreignField: "_id",
        as: "job_details"
      }
    },
    {
      $lookup: {
        from: "companies",
        localField: "job_details.companyID",
        foreignField: "_id",
        as: "company_details"
      }
    }
  ])
  if (result2.length === 0) {
    return res.send("you haven't get any rejections yet")
  }
  return res.send(result2)


}



//post candidate acceptance response 
exports.accept_job = async (req, res) => {
  let accept = "Accept"
  let result = await applyjob.findOne({ _id: req.query.id })
  if (!result) {
    return res.send("unidentified user")
  }
  let result1 = await applyjob.findOneAndUpdate({ _id: req.query.id }, {
    $set: {
      candidate_response: accept
    }
  })

  return res.send("Accept response has been sent successfully")

}



//post candidate rejection response
exports.reject_job = async (req, res) => {
  let{job_rejection_reason}=req.body;
  if(!job_rejection_reason){
    return res.send("Enter reason of job rejection")
  }
  let reject = "Reject"
  let result = await applyjob.findOne({ _id: req.query.id })
  if (!result) {
    return res.send("unidentified user")
  }
  let result1 = await applyjob.findOneAndUpdate({ _id: req.query.id }, {
    $set: {
      candidate_response: reject,
      job_rejection_reason:job_rejection_reason,
    }
  })

  return res.send("rejection notification has been sent successfully")
}



// #################### accepted jobs in response of company###################
 exports.accepted_jobs=async(req,res)=>{
      let result = await company.findOne({userID:req.result.id})
      if(!result){
        return res.send("unidentified user")
      }
      let result2 = await postjob.aggregate([
        { "$match": { "companyID": result._id } },
        {
          $lookup:{
            from: "appliedjobs",
            localField: "_id",
            foreignField: "job_id",
            // pipeline: [
            //   { 
            //     $match: { 
            //       "job_details.candidate_response": {
            //         $in: ["Accept"]
            //       }
            //     } 
            //   }
            // ],
            as: "job_details",
          }
        },
        {"$match":{"job_details.candidate_response":"Accept"}}

      ]);
      
  return res.send(result2)
}





// ########################## reject jobs in response of company###################
exports.rejected_jobs=async(req,res)=>{
  let result = await company.findOne({userID:req.result.id})
  if(!result){
    return res.send("unidentified user")
  }
  let result2 = await postjob.aggregate([
    { "$match": { "companyID": result._id } },
    {
      $lookup:{
        from: "appliedjobs",
        localField: "_id",
        foreignField: "job_id",
        as: "job_details",
      }
    },
    {"$match":{"job_details.candidate_response":"Reject"}}

  ]);
  
return res.send(result2)
}



