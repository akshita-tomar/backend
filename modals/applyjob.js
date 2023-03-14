let mongoose = require("mongoose")


let applyjobSchema = new mongoose.Schema({
    job_id: { type: mongoose.Schema.ObjectId },
    candidate_id: { type: mongoose.Schema.ObjectId },
    replied_answers: { type: Object },
    company_id: { type: mongoose.Schema.ObjectId },
    username: { type: String },
    applicant_profile: { type: String },
    status: { type: String, default: null },
    slot: { type: String },
    url: { type: String },
    hireing_message: { type: String },
    rejection_message: { type: String },
    candidate_response: { type: String, default: "pending" },
    job_rejection_reason: { type: String }


}, { timestamps: true })
let applyjob = mongoose.model("appliedjob", applyjobSchema)
module.exports = applyjob