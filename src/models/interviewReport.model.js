const mongoose = require("mongoose");

/**
 * - job description schema : string
 * - resume text : string
 * - self description : string
 * - matchScore : Number 
 * - Technical questions : 
 *      [{
 *          question :"",
 *          intention :"",
 *          answer :"",
 *      }]
 * 
 * - Behvioral questiopns :
 *          [{
 *          question :"",
 *          intention :"",
 *          answer :"",
 *      }]
 * - Skill gaps : 
 *      [{
 *      skill :"",
 *      severity:{
 *          type: string,
 *          enum : ["low","medium","high"]
 *          }
 *      }]
 * - preparation plan : [{
 *      day : number,
 *      focus : String,
 *      tasks : [String]
 * }]
 * 
 */
const technicalQuestionsSchema = new mongoose.Schema({
    question :{
        type: String,
        required: [true, " Techical question is required"],
    },
    intention:{
        type: String,
        required:[true, "Intention is required"]
    },
    answer:{
        type: String,
        required:[true, "Answer is required"]
    }
},{
    _id : false
})

const behavioralQuestionsSchema = new mongoose.Schema({
    question :{
        type: String,
        required: [true, "Behavioral question is required"],
    },
    intention:{
        type: String,
        required:[true, "Intention is required"]
    },
    answer:{
        type: String,
        required:[true, "Answer is required"]
    }
},{
    _id : false
})

const skillGapSchema = new mongoose.Schema({
    skill :{
        type: String,
        required: [true, "Skill is required"]
    },
    severity:{
        type: String,
        enum : ["low","medium","high"],
        required:[true, "Severity is required"]
    }
},{
    _id : false
})

const preparationPlanSchema = new mongoose.Schema({
    day:{
        type: Number,
        required:[true, "Day is required"]
    },
    focus:{
        type: String,
        required:[true, "Focus is required"]
    },
    tasks:{
        type: [String],
        required:[true, "Tasks are required"]
    }
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription:{
        type:String,
        required:[true,"Job Description Required"],
    },
    resume:{
        type: String,
    },
    selfDescription: {
            type: String,
    },
    matchScore:{
        type : Number,
        min: 0,
        max:100,
    },
    technicalQuestions:[technicalQuestionsSchema],
    behavioralQuestions:[behavioralQuestionsSchema],
    skillGaps:[skillGapSchema],
    preparationPlan:[preparationPlanSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    title:{
        type:String,
        required:[true,"Job title is required"],
    }
},{
    timestamps:true
})

const interviewReportModel = mongoose.model("interviewReport", interviewReportSchema)

module.exports = interviewReportModel;