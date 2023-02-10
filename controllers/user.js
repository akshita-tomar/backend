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
let alert = require("alert");
const company = require("../modals/company");
const user = require("../routes/user");
const { findOne } = require("../modals/postjob");



//############### user registeration#################################
exports.register = async (req, res) => {
    let { username, email, password, profile } = req.body;
    let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let minNumberofChars = 8;

    if (!username || !email || !password || !profile) {
        return res.json("paramaters can't be empty")

    }
    else if (!(emailFormat.test(email))) {
        return res.json("please enter a valid email")
    }
    else if (!(password.length > minNumberofChars)) {
        return res.json("password length must be above eight")
    }
    let result1 = await userModel.findOne({ email: email })
    if (result1) {
        return res.json("this email is already taken please try with another email")
    } else {

        let salt = await bcrypt.genSalt(10);
        let passhash = await bcrypt.hash(password, salt)
        let obj = {

            username: username,
            email: email,
            password: passhash,
            profile: profile,

        }

        let result2 = await userModel.create(obj)

        return res.send("user successfully registered you can login now")
        return res.send(obj)


    }
}




// #########################user login###################
exports.login = async (req, res) => {
    let { email, password } = req.body;
    if (!password || !email) {
        return res.json("parameters cannot be empty")
    }

    let result = await userModel.findOne({ email: email })

    if (!result) {
        return res.json("this email is not registered ")
    }

    else {
        let comparepass = await bcrypt.compare(password, result.password)
        if (comparepass) {
            // let tok = await jwt.sign(req.body, "HHH")
            // let obj = {
            //     token: tok,
            // }
            const token = jwt.sign({
                id: result._id,
                password
            }, "HHH");
            var objData = result.toObject();
            objData.token = token;
            res.status(200).json({
                message: "loggedIn",
                data: objData
            })

            // return res.json(obj)


        }
        else {
            return res.json("password dosen't match")
        }
    }
}




// #######################forget password########################
exports.forget_password = async (req, res) => {
    let { email } = req.body;
    if (!email) {
        return res.json("email is required ")
    }
    let result = await userModel.findOne({ email: email })
    if (!result) {
        return res.json("user not found")
    }
    else {

        let date = new Date()

        let code = otpgenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        await userModel.findOneAndUpdate({ email: email }, {
            $set: {
                otp: code,
                otp_createdAt: date,
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
                    return res.send("something went wrong " + error)
                } else {
                    return res.send("otp sent to your email")
                }
            })
    }
}





// ################################reset password###################
exports.reset_password = async (req, res) => {
    let { email, password, confirm_password } = req.body;
    if (!email || !password || !confirm_password) {

        return res.json(" please fill all the parameters")
    }
    let result = await userModel.findOne({ email: email })
    if (result) {
        if (result.otp_verified == false) {
            return res.json("you cannot update password without verification")
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
                        otp_verified: false
                    }
                })
                return res.send("password updated")
            } else {
                return res.json("confirm password dosen't match with password")
            }
        }
    } else {
        return res.json("email not recognised")
    }
}




// ########################resend otp##################
exports.resend_otp = async (req, res) => {
    let { email } = req.body;
    if (!email) {
        return res.json("please fill the email ")
    }
    let result = await userModel.findOne({ email: email })
    if (result) {


        var formatted = new Date();
        let code = otpgenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        await userModel.findOneAndUpdate({ email: email }, {
            $set: {
                otp: code,
                otp_createdAt: formatted,
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
                    return res.json(" " + error)
                } else {
                    return res.json("otp sent to your email")
                }
            })
    } else {
        return res.json("email is not registered")
    }

}



// #######################verify otp###############
exports.verify_otp = async (req, res) => {
    let { email, otp } = req.body;
    if (!email || !otp) {
        return res.json("Please fill all the parameters")
    }
    let result1 = await userModel.findOne({ email: email })
    if (result1) {
        // var dt = dateTime.create();
        // var formatted = dt.format('Y-m-d H:M:S');
        var createdAt = new Date(result1.otp_createdAt);
        let end_at = new Date()

        let otp_time = parseInt(Math.abs(end_at.getTime() - createdAt.getTime()) / (1000));
        if (otp_time < 120) {
            if (otp == result1.otp) {
                await userModel.findOneAndUpdate({ email: email }, {
                    $set: {
                        otp_verified: true,
                        otp_createdAt: new Date(),
                    }
                })
                return res.send("otp verified")

            } else {
                return res.send("otp is not correct")
            }
        } else {
            return res.json("otp time expired please resend otp")
        }
    } else {
        return res.json("email is not recognised")
    }

}


// ######################################## change password###################
exports.change_password = async (req, res) => {
    let { password, new_password } = req.body
    if (!password || !new_password) {

        return res.send("fill the parameter")
    }
    console.log(req.result.password)
    console.log(req.result.email)
    let result = await userModel.findById({ _id: req.result.id })
    if (result) {
        let newpass = new_password
        await bcrypt.compare({ password: req.result.password }, {
            $set: {
                password: newpass,
            }
        })

    } else {
        return res.send("unauthorized user")
    }

}