let postjob = require("../modals/postjob")

let company = require("../modals/company")

let candidate = require("../modals/candidate")

let mongoosePaginate = require("mongoose-paginate-v2");

let applyjobs = require("../modals/applyjob")

let userModel = require("../modals/user");

let posts = require("../modals/post")







// ####################post job##################
exports.post_job = async (req, res) => {

    let { job_title, job_discription, required_qualification, salary, required_hardskills, questions } = req.body

    if (!job_title || !job_discription || !required_qualification || !salary || !required_hardskills || !questions) {

        return res.send("fill all the parameters")
    }

    let companydetails = await company.findOne({ userID: req.result.id })
    let job = "job"
    let jobdetails = {
        companyID: companydetails._id,
        company_name: companydetails.company_name,
        company_contact: companydetails.company_contact_no,
        job_title: job_title,
        job_discription: job_discription,
        required_qualification: required_qualification,
        salary: salary,
        required_hardskills: required_hardskills,
        type: job,
        questions: questions
    }
    if (questions.length < 5) {
        return res.send("there must be 5 questions...")
    }
    if (questions.length > 5) {
        return res.send("you can only add 5 questions")
    }

    await postjob.create(jobdetails)
    return res.send("job posted succesfully")

}


// #################################get selected jobs########################
exports.get_jobs = async (req, res) => {

    let result = await postjob.findOne({ _id: req.query._id })
    if (!result) {
        return res.send("unidentified user")
    }

    return res.send(result)
}



// ################ get all data of jobs, candidate and company##########

exports.get_homepagedetails = async (req, res) => {


    //get job details

    let sort = { createdAt: -1 }
    let a = await postjob.paginate({}, { page: req.query.page, limit: 2, sort })
        .then(result => {

            return result
        })
        .catch(error => {
            console.log(error)
        });
    if (!a) {
        return res.status(204).send("no job posted yet...")
    }

    //get company details
    let b = await company.paginate({}, { page: req.query.page, limit: 2, sort })
        .then(result => {

            return result

        })
        .catch(error => {
            console.log(error)
        });

    if (!b) {
        return res.status(204).send("no company registered yet...")
    }

    //get candidate details
    let c = await candidate.paginate({}, { page: req.query.page, limit: 2, sort })
        .then(result => {

            return result

        })
        .catch(error => {
            console.log(error)
        });
    if (!c) {
        return res.status(204).send(" no candidate registered yet....")
    }

    //get posts details
    let d = await posts.paginate({}, { page: req.query.page, limit: 2, sort })
        .then(result => {

            return result

        })
        .catch(error => {
            console.log(error)
        });
    if (!d) {
        return res.status(204).send(" no post uploaded yet....")
    }
   
    //conversion of object into array
    let arr1 = Object.values(a.docs)


    let arr2 = Object.values(b.docs)


    let arr3 = Object.values(c.docs)


    let arr4 = Object.values(d.docs)



    // //merge all the three array to get resultant single array

    let merge1 = arr1.concat(arr2)

    let merge2 = merge1.concat(arr3)

    let merge3 = merge2.concat(arr4)

    let final_result = merge3.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return res.status(200).send(final_result)

}




// ################ delete job###############
exports.delete_job = async (req, res) => {
    let result = await postjob.findOneAndDelete({ _id: req.query.id })

    if (result) {
        return res.send("job deleted successfully...")
    } else {
        return res.send("Unidentified user")
    }
}




// // ###########################edit job #########################

exports.edit_job = async (req, res) => {
    let job = "job"
    let { job_title, job_discription, required_qualification, salary, required_hardskills, questions } = req.body

    if (!job_title || !job_discription || !required_qualification || !salary || !required_hardskills || !questions) {

        return res.send("fill all the parameters")
    }
    let companydetails = await company.findOne({ userID: req.result.id })

    if (companydetails) {
        let posts = await postjob.findOneAndUpdate({ _id: req.query.id }, {
            $set: {
                companyID: companydetails._id,
                job_title: job_title,
                job_discription: job_discription,
                required_qualification: required_qualification,
                salary: salary,
                required_hardskills: required_hardskills,
                type: job,
                questions: questions,
            }
        })

        if (questions.length < 5) {
            return res.send("there must be 5 questions...")

        }

        if (questions.length > 5) {

            return res.send("you can only add 5 questions")
        }
        else {
            return res.send("record updated successfully")
        }
    } else {
        return res.send("Unidentified user")
    }
}





//get jobs that is posted by particular company
exports.get_company_jobs = async (req, res) => {
    let result1 = await company.findOne({ userID: req.result.id })
    if (result1) {
        let result2 = await postjob.aggregate([
            { "$match": { "companyID": result1._id } },
            {
                $lookup: {
                    from: "appliedjobs",
                    localField: "_id",
                    foreignField: "job_id",
                    as: "applicant_count"
                }
            },
            {
                $addFields: {
                    applicant_count: { $size: "$applicant_count" }


                }
            }
        ])
        return res.send(result2)
    } else {
        return res.send("Unidentifined company ")
    }

}



exports.get_job_details = async (req, res) => {
    let result = await postjob.findOne({ _id: req.query.id })
    if (!result) {
        return res.send("Unidentified user")
    }
    return res.send(result)
}



// #################  like dislike job   ################
exports.like_dislike_job = async (req, res) => {

    let { like_status } = req.body;
    let result = await postjob.findOne({ _id: req.query.id })
    if (!result) {
        return res.send("unidentified user")
    } else {
        if (like_status === 1) {
            if (result.user_liked.includes(req.result.id)) {
                await postjob.findOneAndUpdate({ _id: req.query.id }, {
                    $pull: {
                        user_liked: req.result.id,
                    },
                    $inc: {
                        likes: -1
                    }

                })
                return res.send("you unlike the post")
            } else {
                await postjob.findOneAndUpdate({ _id: req.query.id }, {
                    $push: {
                        user_liked: req.result.id,
                    },
                    $inc: {
                        likes: 1,
                    },
                    $pull: {
                        user_disliked: req.result.id,
                    },
                    $inc: {
                        dislikes: -1,
                    }


                })
                return res.send("you liked this post")
            }

        }
        else if (like_status === -1) {
            if (result.user_disliked.includes(req.result.id)) {
                await postjob.findOneAndUpdate({ _id: req.query.id }, {
                    $pull: {
                        user_disliked: req.result.id,
                    },
                    $inc: {
                        dislikes: -1
                    }

                })
                return res.send("you un-dislike this post")
            } else {
                await postjob.findOneAndUpdate({ _id: req.query.id }, {
                    $push: {
                        user_disliked: req.result.id,
                    },
                    $inc: {
                        dislikes: 1,
                    },
                    $pull: {
                        user_liked: req.result.id
                    },
                    $inc: {
                        liked: -1
                    }

                })
                return res.send("you dislike this post")
            }

        }

    }
}