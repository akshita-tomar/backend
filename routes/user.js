// let express=require("express")
// let router=require("router")
// const { Router } = require('express');
let user=require('../controllers/user');
let industry=require("../controllers/industry")
let language=require("../controllers/language")
let softskill=require("../controllers/softskill")
let hardskill=require("../controllers/hardskill")




 
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

   //create data
   app.post("/create_data",industry.create_data)

   //get languages 
   app.get("/get_language",language.get_language)

  // get softskills
  app.get("/get_softskill",softskill.get_softskill)

   //get industry
 app.get("/get_industry",industry.get_industry)


 //get hardskills
  app.get("/get_hardskill",hardskill.get_hardskill)

 
}

