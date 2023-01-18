let industry1 = require("../modals/industry")
const hardskill = require("../modals/hardskill");
const { Types } = require("mongoose");




exports.create_data = async (req, res) => {
    let industry_ = ["IT", "FINANCE"]
    for (let i = 0; i < industry_.length; i++) {
        let industry = new industry1({ name: industry_[i] })
        industry.save().then(async (data) => {
            if (data.name == "IT") {
                let arr = ["backend", "frontend", "UI/UX"]
                for (let i = 0; i < arr.length; i++) {

                    await hardskill.create([
                        {
                            industry_id: data._id,
                            skill: arr[i]
                        },

                    ])
                }
            }

            if (data.name == "FINANCE") {
                let arr2 = ["ledge", "sheet"]
                for (let i = 0; i < arr2.length; i++)
                    await hardskill.create([
                        {
                            industry_id: data._id,
                            skill: arr2[i]
                        },

                    ]);

            }

            res.json("success");

        })
    }
}




// ######################## get_industry################
exports.get_industry = async (req, res) => {
    let result = await industry1.find()
    res.json(result)
}

// exports.get_industry = async (req, res) => {

//     let result = await industry1.aggregate([
    
//         {
//             $lookup: {
//                 from: "hardskills",
//                 localField: "_id",
//                 foreignField: "industry_id",
//                 as: "details",
//             },
//         },
        
        // {
        //     $lookup:{
        //         from:"hardskill",
        //         pipeline:[
        //             {$match:{"$expr":{"$in":["$industry_id","$_id"]}}},
        //         ],
        //         as:"filter"
        //     }
        // },

        // {
        //     $project:{
        //          skill:1,
        //          _id:1
        //     }
        // }
//     ])
//     res.json(result)
// }










