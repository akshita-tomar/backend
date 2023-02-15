let company = require("../modals/company");
let fileupload = require("express-fileupload");
let userModel=require("../modals/user")





exports.post_company = async (req, res) => {
    

    var logo = "";

    if (req.files) {
        var file = req.files.company_logo;

        if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {

            logo = req.protocol + "://" + req.headers.host + '/uploads/logo/' + file.name;

            file.mv('uploads/logo/' + file.name, function (err) {

            });

        } else {
            return res.send({ message: "This format is not allowed , please upload file with '.png','.gif','.jpg'" })
        }
    }
    let {company_name, company_type, employee_strength, summary, vision, GST_identification_no, company_contact_no, company_address, website, status } = req.body;
    
    if (!company_name || !company_type || !employee_strength || !summary || !vision || !GST_identification_no || !company_contact_no || !company_address || !website || !status) {
        return res.send("Fill all the parameters")
    }
    let result1 = await company.findOne({ company_name: company_name })
    if (result1) {

        return res.send("This company name is already registered please register with another company name")
    }
    let result2 = await company.findOne({ website: website })
    if (result2) {
        return res.send("this website is already registered")
    }
    
    let companytype="companytype"
    
    let companydetails = {
        userID:req.result.id,
        company_name: company_name,
        company_logo: logo,
        company_type: company_type,
        employee_strength: employee_strength,
        summary: summary,
        vision: vision,
        GST_identification_no: GST_identification_no,
        company_contact_no: company_contact_no,
        company_address: company_address,
        website: website,
        status: status,
        type:companytype
    }
   
    await company.create(companydetails)
    .then(async(data)=>{
        await userModel.findOneAndUpdate({_id:req.result.id},{
            $set:{
                onboarding:true
            }
        })
    })
     
    return res.send("company regisrered successfully")


}




// #########################get company details#################
exports.get_company=async (req,res)=>{
   console.log(req.result.id)
 let result= await company.findOne({userID:req.result.id})
 if(result){
    return res.send(result)
 }else{
    return res.send("unauthorized user....")
 }

}


// ######################update company###################
exports.update_company=async (req,res)=>{
    var logo = "";

    if (req.files) {
        var file = req.files.company_logo;

    

        if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {

            logo = req.protocol + "://" + req.headers.host + '/uploads/logo/' + file.name;

            file.mv('uploads/logo/' + file.name, function (err) {

            });

        } else {
            return res.send({ message: "This format is not allowed , please upload file with '.png','.gif','.jpg'" })
        }
    }
    
    let {company_name, company_type, employee_strength, summary, vision, GST_identification_no, company_contact_no, company_address, website, status } = req.body;
    if (!company_name || !company_type || !employee_strength || !summary || !vision || !GST_identification_no || !company_contact_no || !company_address || !website || !status) {
        return res.send("Fill all the parameters")
    }
    
       await company.findOneAndUpdate({userID:req.result.id},{
        $set:{
            userID:req.result.id,
            company_name: company_name,
            company_logo: logo,
            company_type: company_type,
            employee_strength: employee_strength,
            summary: summary,
            vision: vision,
            GST_identification_no: GST_identification_no,
            company_contact_no: company_contact_no,
            company_address: company_address,
            website: website,
            status: status
        }

    })
    
    return res.send("record updated successfully")

}


// ########################### get all companies####################
exports.get_companies=async (req,res)=>{
      let result = await company.find()
      let total_companies=result.length;
      console.log(total_companies)
      return res.send(result)
}








