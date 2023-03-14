let company = require("../modals/company")
let candidate = require("../modals/candidate")
let posts = require("../modals/post")
let userModel= require("../modals/user")




//  ################################  upload post  #######################
exports.upload_post = async (req, res) => {


    var post = "";

    if (req.files) {

        var file = req.files.file;

        if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif" || file.mimetype == "image/jpg"|| file.mimetype == "video/mp4") {

            post = req.protocol + "://" + req.headers.host + '/uploadpost/' + file.name;

            file.mv('public/uploadpost/' + file.name, function (err) {

            });

        } else {
            return res.send("This format is not allowed , please upload file with '.png','.gif','.jpg','jpeg'")
        }
    }
    if(!post){
        return res.send("you have not select any")
    }
    let result = await userModel.findOne({ _id: req.result.id })
    if(!result){
        return res.send("unidentified user")
    }
    if (result.profile === "candidate") {
        let candidate_post="candidate_post"
        let result2 = await candidate.findOne({ candidateID: result._id })
        if(!result2){
            return res.send("unidentified user")
        }
        let obj={
              candidate_id:result2._id ,
              candidate_firstname:result2.firstname,
              candidate_lastname:result2.lastname,
              candidate_profile:result2.candidate_profile,
              type:candidate_post,
              candidate_post:[
                {
                    post:post,
                    post_status:req.body.status,
                }
              ]
        }
        await posts.create(obj)
        return res.send("post uploaded successfully")
    }else{
        let company_post="company_post"
        let result3= await company.findOne({userID:result._id})
         if(!result3){
            return res.send("unidentified user")
         }
         let obj={
            company_id:result3._id ,
            company_name:result3.company_name,
            company_profile:result3.company_logo,
            type: company_post,
            company_post:[
              {
                  post:post,
                  post_status:req.body.status,
              }
            ]
         }
         await posts.create(obj)
         return res.send("post uploaded successfully")
    }

}   
