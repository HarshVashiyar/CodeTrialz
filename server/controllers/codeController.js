const Problem = require("../models/problemDB");
const Submission = require("../models/submissionDB");
const User = require("../models/userDB");
const TestCase = require("../models/testCasesDB");
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
const CODE_BACKEND_URL = process.env.CODEBACKEND_URL || "http://localhost:8080/exec";
const fetch = require("node-fetch");

const handleRunCode = async (req, res) => {
    const { language = "cpp", code, input = "" } = req.body;
    const { id } = req.user;
    if (!id) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (code === undefined || code === null || code.trim() === "") {
        return res.status(400).json({ success: false, message: "Code is required" });
    }
    
    try {
        const response = await fetch(`${CODE_BACKEND_URL}/run`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ language, code, input })
        });
        const result = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                type: result.type || "internal_error",
                message: result.message || "Code execution failed"
            });
        }
        return res.status(200).json({
            success: true,
            output: result.output
        });
    } catch (error) {
        console.error("Error communicating with code execution service:", error);
        return res.status(500).json({
            success: false,
            type: "internal_error",
            message: "Failed to connect to code execution service"
        });
    }
};

const handleSubmitCode = async (req, res) => {
    const { problemId, language = "cpp", code } = req.body;
    const { id } = req.user;
    if (!id || !problemId || !code) {
        return res.status(400).json({ 
            success: false, 
            message: "Missing required fields: user, problemId, and code are required" 
        });
    }
    try {
        const problem = await Problem.findById(problemId).select('testCases');
        if (!problem) {
            return res.status(404).json({ 
                success: false, 
                message: "Problem not found" 
            });
        }

        const testCases = await TestCase.find({
            '_id': { $in: problem.testCases }
        });
        if (!testCases || testCases.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "No test cases found for this problem" 
            });
        }

        const response = await fetch(`${CODE_BACKEND_URL}/submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ testCases, language, code })
        });
        const result = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                type: result.type || "internal_error",
                message: result.message || "Code execution failed"
            });
        }
        const { verdict, maxExecutionTime, totalExecutionTime, failedTestCase } = result;

        const hasAlreadySolved = await Submission.findOne({
            problem: problemId,
            user: id,
            verdict: "Accepted"
        });

        const submission = await Submission.create({
            code,
            language,
            verdict,
            problem: problemId,
            user: id,
            executionTime: maxExecutionTime,
            score: verdict === "Accepted" ? problem.difficulty : 0,
            failedTestCase: failedTestCase
        });

        await Promise.all([
            User.findByIdAndUpdate(
                id,
                {
                    $push: {
                        submissions: submission._id,
                        ...(verdict === "Accepted" ? { solutions: submission._id } : {})
                    },
                    ...(verdict === "Accepted" && !hasAlreadySolved ? { $inc: { numberOfProblemsSolved: 1 } } : {})
                }
            ),
            ...(verdict === "Accepted" 
                ? [Problem.findByIdAndUpdate(
                    problemId,
                    { $push: { solutions: submission._id } }
                  )]
                : []
            )
        ]);

        return res.status(200).json({
            success: verdict === "Accepted",
            verdict,
            message: verdict === "Accepted" 
                ? "All test cases passed!" 
                : `Failed at test case ${failedTestCase}`,
            submissionId: submission._id,
            executionTime: maxExecutionTime,
            totalTime: totalExecutionTime,
            failedTestCase: failedTestCase
        });

    } catch (error) {
        console.error("Error in submission:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while processing submission",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const handleGetSuggestions = async (req, res) => {
    const { submissionId } = req.body;
    const submission = await Submission.findById(submissionId);
    if(submission.verdict !== "Accepted") {
        return res.json({ success: false, message: "Get your code accepted to unlock ai suggestions"});
    }
    const code = submission.code;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [
                { role: "user", parts: [
                    { text: "Give point-wise, concise suggestions to improve the following code. Return in plain text format only—no extra remarks or commentary. At the end, include the improved version of the code. Code: " + code }
                ]}
            ]
        });
        const candidates = response.candidates;
        const suggestions = candidates?.[0]?.content?.parts?.[0]?.text || "Upgrade to pro to get AI suggestions";
        return res.status(200).json({ success: true, suggestions });
    } catch (error) {
        console.error("Error generating suggestions:", error);
        if (
            error.message &&
            error.message.includes("503") &&
            error.message.includes("The model is overloaded")
          ) {
            return res.status(503).json({ success: false, message: "Service temporarily unavailable. Please try again in a few seconds." });
        }
        return res.status(500).json({ success: false, message: "Internal server error while generating suggestions" });
    }
};

module.exports = {
    handleRunCode,
    handleSubmitCode,
    handleGetSuggestions,
};