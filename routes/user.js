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




 
module.exports=(app)=>{
      



    //user registeration........
    app.post("/register", user.register)
     
    //user login..........
    app.post("/login",user.login)

    //forget pasword
    app.post("/forget_password",auth,user.forget_password)

    //reset password
    app.post('/reset_password',user.reset_password)

    //resend otp
    app.post('/resend_otp',user.resend_otp)

    //verify otp
    app.post("/verify_otp",user.verify_otp)

    //change password
    app.post('/change_password',auth,user.change_password)

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

 //get candidates
 app.get("/get_candidates",auth,candidate.get_candidates)

 //post job 
 app.post("/post_job",auth,postjob.post_job)

 //get jobs
 app.get("/get_jobs",auth,postjob.get_jobs)


 //get jobs candidate and companies
 app.get("/get_data",auth,postjob.get_data)

}

