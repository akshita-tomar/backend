let postjob =require("../modals/postjob")
let hardskill=require("../modals/hardskill")




exports.post_job=async(req,res)=>{
    let{job_title,job_discription,required_qualification,salary,required_hardskills}=req.body

    if(!job_title||!job_discription||!required_qualification||!salary||!required_hardskills){
        
        return res.send("fill all the parameters")

    }


    let jobdetails={
        companyID:req.result.id,
        job_title:job_title,
        job_discription:job_discription,
        required_qualification:required_qualification,
        salary:salary,
        required_hardskills:required_hardskills
    }
    
    await postjob.create(jobdetails)
    return res.send("job posted succesfully")
   
}