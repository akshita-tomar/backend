const bcrypt = require("bcrypt")
let userModel = require("../modals/user")
let mongoose = require("mongoose");
const { TokenExpiredError } = require("jsonwebtoken");
let jwt = require("jsonwebtoken");
const { json } = require("body-parser");
let otpgenerator = require("otp-generator")
let nodemailer = require("nodemailer");
var dateTime = require('node-datetime');
const SMTPConnection = require("nodemailer/lib/smtp-connection");



//############### user registeration#################################
exports.register = async (req, res) => {
    let { username, email, password,profile} = req.body;
    let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let minNumberofChars = 8;

    if (!username || !email || !password||!profile) {
        res.json("paramaters can't be empty")
    }
    else if (!(emailFormat.test(email))) {
        res.json("please enter a valid email")
    }
    else if (!(password.length > minNumberofChars)) {
        res.json("password length must be above eight")
    }
    let result1 = await userModel.findOne({ email: email })
    if (result1) {
        res.json("this email is already taken please try with another email!!!")
    } else {
        
        let salt = await bcrypt.genSalt(10);
        let passhash = await bcrypt.hash(password, salt)
        let obj = {
            username: username,
            email: email,
            password: passhash,
            profile:profile,
        }
        
        let result2 = await userModel.create(obj)
        res.send(obj)
    }
}




// #########################user login###################
exports.login = async (req, res) => {
    let { email, password } = req.body;
    if (!password || !email) {
        res.json("parameters cannot be empty")
    }
    let result = await userModel.findOne({ email: email })

    if (!result) {
        res.send("this email is not registered")
    } else {
        let comparepass = await bcrypt.compare(password, result.password)
        if (comparepass) {
            let tok = await jwt.sign(req.body, "HHH")
            let obj = {
                token: tok,
            }
            res.json(obj)
        }
        else {
            res.json("password dosen't match")
        }
    }
}




// #######################forget password########################
exports.forget_password = async (req, res) => {
    let { email } = req.body;
    if (!email) {
        res.json("email is required ")
    }
    let result = await userModel.findOne({ email: email })
    if (!result) {
        res.json("user not found")
    }
    else {
        
        let date=new Date()
    
        let code = otpgenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        await userModel.findOneAndUpdate({ email: email }, {
            $set: {
                otp: code,
                otp_createdAt:date,
            }
        })

        let transporter = nodemailer.createTransport({
            host: "smtp.zoho.in",
            port: 465,
            secure: true,
            auth: {
                user: 'akshita.tomar@ultivic.com',
                pass: 'Ultivic@2001'
            }
        })
        let mailDetails = {
            from: "akshita.tomar@ultivic.com",
            to: email,
            subject: 'gig reset password',
            text: 'gig reset password',
            html: "<div style='padding:30px; text-align:center; color:black; background-color:blue;'> <h2> " + code + "</h2></div>"
        }
        transporter.sendMail(mailDetails,
            (error, data) => {
                if (error) {
                    res.json(" " + error)
                } else {
                    res.json("otp sent to your email")
                }
            })
    }
}





// ################################reset password###################
exports.reset_password = async (req, res) => {
 let { email, password, confirm_password} = req.body;
    if (!email || !password || !confirm_password) {

        res.json("fill all the parameters(email,password,confirm password)")
    }
    let result = await userModel.findOne({email: email})
    if (result) {
          if (result.otp_verified==false)
          {
            res.json("you cannot update password without verification")
        } 
        else {
            let pass = password;
            let confirm_pass = req.body.confirm_password;
            if (pass == confirm_pass) {
                let salt = await bcrypt.genSalt(10)
                let passhash = await bcrypt.hash(confirm_password, salt)
                let result2 = await userModel.findOneAndUpdate({ email: email }, {
                    $set: {
                        password: passhash,
                        otp_verified:false
                    }
                })
                res.json("password updated")
            } else {
                res.json("confirm password dosen't match with password")
            }
        }
    } else {
        res.json("email not recognised")
    }
}




// ########################resend otp##################
exports.resend_otp = async (req, res) => {
    let { email } = req.body;
    if (!email) {
        res.json("please fill the email ")
    }
    let result = await userModel.findOne({ email: email })
    if (result) {

        
        var formatted = new Date();
        let code = otpgenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        await userModel.findOneAndUpdate({ email: email }, {
            $set: {
                otp: code,
                otp_createdAt:formatted,
            }
        })
    
        let transporter = nodemailer.createTransport({
            host: "smtp.zoho.in",
            port: 465,
            secure: true,
            auth: {
                user: 'akshita.tomar@ultivic.com',
                pass: 'Ultivic@2001'
            }
        })
        let mailDetails = {
            from: "akshita.tomar@ultivic.com",
            to: email,
            subject: 'gig reset password',
            text: 'gig reset password',
            html: "<div style='padding:30px; text-align:center; color:black; background-color:blue;'> <h2> " + code + "</h2></div>"
        }
        transporter.sendMail(mailDetails,
            (error, data) => {
                if (error) {
                    res.json(" " + error)
                } else {
                    res.json("otp sent to your email")
                }
            })
    } else {
        res.json("email is not registered")
    }

}



// #######################verify otp###############
exports.verify_otp = async (req, res) => {
    let { email, otp } = req.body;
    if (!email || !otp) {
        res.json("parameters(email and otp) cannot be empty")
    }
    let result1 = await userModel.findOne({ email: email })
    if (result1) {
        // var dt = dateTime.create();
        // var formatted = dt.format('Y-m-d H:M:S');
        var createdAt = new Date(result1.otp_createdAt);
        let end_at=new Date()
        
        let otp_time=parseInt(Math.abs(end_at.getTime()-createdAt.getTime())/(1000));
        if(otp_time<120){
        if (otp == result1.otp) {
            await userModel.findOneAndUpdate({ email: email }, {
                $set: {
                    otp_verified: true,
                    otp_createdAt:new Date(),
                }
            })
            res.json("otp verified")

        } else {
            res.json("otp is not correct")
        }
    }else{
        res.json("otp time expired please resend otp")
    }
    } else {
        res.json("email is not recognised")
    }

}

