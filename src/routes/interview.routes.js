const express = require("express");
const interviewRouter =  express.Router();
const {authUser} = require("../middlewares/auth.middleware");
const {generateResumePdf,generateInterviewReportController, getInterviewReportByIdController,getAllInterviewReports} = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware")

/*
* @route POST /api/interview/generate-report
* @desc Generate an interview report based on resume, self-description, and job description
* @access private
*/

interviewRouter.post("/generate-report", authUser, upload.single("resume") , generateInterviewReportController);

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId
 * @access Private
 */

interviewRouter.get("/report/:interviewId", authUser , getInterviewReportByIdController);

/**
 * @route GET /api/interview/getAllReports/
 * @description get all interview reports of logged in user
 * @access private
 */

interviewRouter.get("/getAllReports", authUser , getAllInterviewReports);

/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.get("/resume/pdf/:interviewReportId", authUser , generateResumePdf);

module.exports = interviewRouter;