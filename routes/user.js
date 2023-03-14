// let express=require("express")
// let router=require("router")
// const { Router } = require('express');
let user=require('../controllers/user');
let industry=require("../controllers/industry")
let language=require("../controllers/language")
let softskill=require("../controllers/softskill")
let hardskill=require("../controllers/hardskill")
let auth=require("../middleware/auth")
let company=require("../controllers/company")
let candidate=require("../controllers/candidate")
let postjob=require("../controllers/postjob")
let applyjob=require("../controllers/applyjob");
let post=require("../controllers/post")



 
module.exports=(app)=>{
      
    //user registeration........
    app.post("/register", user.register)
     
    //user login..........
    app.post("/login",user.login)

    //forget pasword
    app.post("/forget_password",user.forget_password)

    //reset password
    app.post('/reset_password',user.reset_password)

    //resend otp
    app.post('/resend_otp',user.resend_otp)

    //verify otp
    app.post("/verify_otp",user.verify_otp)

    //change password
    app.put('/change_password',auth,user.change_password)

   //create data
   app.post("/create_data",auth,industry.create_data)

   //get languages 
   app.get("/get_language",language.get_language)

  // get softskills
  app.get("/get_softskill",softskill.get_softskill)

   //get industry
 app.get("/get_industry",industry.get_industry)


 //get hardskills
  app.get("/get_hardskill",hardskill.get_hardskill)


//post company
 app.post("/post_company",auth,company.post_company)

 //get company details
 app.get("/get_company",auth,company.get_company)

 //update company
 app.post("/update_company",auth,company.update_company)

 //get companies
 app.get("/get_companies",auth,company.get_companies)

 //post candidate
 app.post("/post_candidate",auth,candidate.post_candidate)

 //update candidate
 app.post("/update_candidate",auth,candidate.update_candidate)

 //get candidates
 app.get("/get_candidates",auth,candidate.get_candidates)

 //get candidate
 app.get("/get_candidate",auth,candidate.get_candidate)

 //post job 
 app.post("/post_job",auth,postjob.post_job)

 //get jobs
 app.get("/get_jobs",postjob.get_jobs)


 //get jobs candidate and companies
 app.get("/get_homepagedetails", postjob.get_homepagedetails)

//post apply job details
app.post("/apply_job",auth,applyjob.apply_job)

//delete job by comppany
app.delete("/delete_job",auth,postjob.delete_job)

//get all jobs posted by a particular company
app.get("/get_company_jobs",auth,postjob.get_company_jobs)

//edit job that is posted by a particular company
app.post("/edit_job",auth,postjob.edit_job)

//get selected company profile 
app.get("/get_company_profile",auth,company.get_company_profile)

//get selected czndidate prdfile
app.get("/get_candidate_profile",auth,candidate.get_candidate_profile)


//get selected job
app.get("/get_job_details",auth,postjob.get_job_details)

//get job response
app.get("/get_jobresponse",auth,applyjob.get_jobresponse)

//send response for hire
app.post("/hire_candidate",auth,applyjob.hire_candidate)

//send response of rejection of candidate 
app.post("/reject_candidate",auth,applyjob.reject_candidate)


//get particular user
app.get("/get_user",auth,user.get_user)

//job invitations
app.get("/job_invitation",auth,applyjob.job_invitation)

//job rejections
app.get("/job_rejections",auth,applyjob.job_rejections)

//job accept  by candidate
app.post("/accept_job",auth,applyjob.accept_job)

//job rejected by candidate
app.post("/reject_job",auth,applyjob.reject_job)

//get accepted jobs by a particular company
app.get("/accepted_jobs",auth,applyjob.accepted_jobs)


//get rejected jobs by a particular company
app.get("/rejected_jobs",auth,applyjob.rejected_jobs)


//post educational details by candidate
app.post("/post_education_details",auth,candidate.post_education_details)

//post work experience by candidate
app.post("/post_workexperience",auth,candidate.post_workexperience)

//like dislike 
app.post("/like_dislike_job",auth,postjob.like_dislike_job)

//upload post 
app.post("/upload_post",auth,post.upload_post)



}


