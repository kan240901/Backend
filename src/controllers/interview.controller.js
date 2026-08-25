const {generateInterviewReport, generateResumePdfFromHTML} = require("../services/ai.service")
const { PDFParse } = require("pdf-parse")
const interviewReportModel = require("../models/interviewReport.model")

async function generateInterviewReportController(req, res) {
    try {
        const { resume, selfDescription, jobDescription } = req.body;
        if(!req.file || !selfDescription || !jobDescription){
            return res.status(400).json({ 
                message: 'Please provide a resume PDF, selfDescription, and jobDescription'
            });
        }
        const parser = new PDFParse({ data: req.file.buffer });
        const { text: resumeContent } = await parser.getText();
        await parser.destroy();

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent, 
            selfDescription, 
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user:req.user.id,
            resume:resumeContent,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        })

        return res.status(200).json({ 
                message: 'Interview report generated successfully.',
                interviewReport
            });;
    }catch(error){
        console.error('Error generating interview report:', error);
        return res.status(500).json({ 
                message: "Internal Server Error",
            });
    }
}

async function getInterviewReportByIdController(req, res){
    const {interviewId} = req.params;
    try{
        const interviewReport = await interviewReportModel.findOne({_id: interviewId, user: req.user.id})

        if(!interviewReport){
            return res.status(404).json({
                message:"Interview report not found."
            })
        }

        res.status(200).json({
            message:"Interview report fetched successfully",
            interviewReport
        })
    }catch(error){
        res.status(500).json({
            message:"Internal server error",
        })
    }
}

async function getAllInterviewReports(req,res){
    try{
        const interviewReports = await interviewReportModel.find({user: req.user.id}).
            sort({createdAt:-1}).
            select("-resume -selfDescription -jobDescription -__v -updatedAt -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")
        res.status(200).json({
            message:"Interview reports fetched succesfully.",
            interviewReports
        })
    }catch(error){
       res.status(500).json({
            message:"Internal server error.",
        })
    }
}

async function generateResumePdf(req,res){
    try {
        const {interviewReportId} = req.params;
        const interviewReport = await interviewReportModel.findOne({
            _id: interviewReportId,
            user: req.user.id
        });

        if(!interviewReport){
            return res.status(404).json({
                message:"Interview report not found",
            })
        }

        const {resume, jobDescription, selfDescription} = interviewReport
        const pdfBuffer = await generateResumePdfFromHTML({resume, jobDescription, selfDescription});
        res.set({
            "Content-Type":"application/pdf",
            "Content-Disposition":`attachment; filename=resume_${interviewReportId}.pdf`
        })

        res.send(pdfBuffer)
    } catch(error) {
        console.error('Error generating resume PDF:', error);
        res.status(500).json({
            message:"Unable to generate resume PDF",
        })
    }
}

module.exports={generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReports, generateResumePdf}