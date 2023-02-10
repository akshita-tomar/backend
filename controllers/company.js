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
        status: status
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








