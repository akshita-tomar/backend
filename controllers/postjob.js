let postjob = require("../modals/postjob")

let company = require("../modals/company")

let candidate = require("../modals/candidate")

let mongoosePaginate = require("mongoose-paginate-v2");



exports.post_job = async (req, res) => {

    let { job_title, job_discription, required_qualification, salary, required_hardskills } = req.body

    if (!job_title || !job_discription || !required_qualification || !salary || !required_hardskills) {

        return res.send("fill all the parameters")

    }

    let job = "job"
    let jobdetails = {

        companyID: req.result.id,
        job_title: job_title,
        job_discription: job_discription,
        required_qualification: required_qualification,
        salary: salary,
        required_hardskills: required_hardskills,
        type: job
    }

    await postjob.create(jobdetails)
    return res.send("job posted succesfully")

}



// #################################get all jobs########################
exports.get_jobs = async (req, res) => {
    let result = await postjob.find()
    let total_jobs = result.length;
    console.log(total_jobs)
    return res.send(result)
}




// ################ get all data of jobs candidate and company##########

exports.get_data = async (req, res) => {
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


    //conversion of object into array
    let arr1 = Object.values(a.docs)


    let arr2 = Object.values(b.docs)


    let arr3 = Object.values(c.docs)



    // //merge all the three array to get resultant single array

    let merge1 = arr1.concat(arr2)

    let merge2 = merge1.concat(arr3)

    return res.status(200).send(merge2)


}

