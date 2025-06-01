const {
    generateFile,
    generateInputFile,
    executeCpp,
    executePython,
    executeJavaScript,
    executeJava,
} = require("../utilities/codeUtil");
const Problem = require("../models/problemDB");
const Submission = require("../models/submissionDB");
const User = require("../models/userDB");
const TestCase = require("../models/testCasesDB");
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const executeCode = async (language, filePath, inputFilePath) => {
    switch(language.toLowerCase()) {
        case "cpp":
            return await executeCpp(filePath, inputFilePath);
        case "python":
            return await executePython(filePath, inputFilePath);
        case "javascript":
            return await executeJavaScript(filePath, inputFilePath);
        case "java":
            return await executeJava(filePath, inputFilePath);
        default:
            throw new Error("Unsupported language");
    }
};

const handleRunCode = async (req, res) => {
    const { language = "cpp", code, input = "" } = req.body;
    if(code === undefined) {
        return res.status(400).json({ success: false, message: "Code is required" });
    }
    try {
        const filePath = generateFile({ code, language });
        const inputFilePath = generateInputFile(input);
        if (!filePath) {
            return res.status(500).json({ success: false, message: "Failed to generate file" });
        }
        const output = await executeCode(language, filePath, inputFilePath);
        return res.status(200).json({ success: true, output });
    }
    catch (error) {
        console.error("Error running code:", error);
        let statusCode = 500;
        let errorType = error.type || "internal_error";
        let errorMessage = error.message || "Internal server error";

        if (errorType === "compile_error") statusCode = 400;
        else if (errorType === "runtime_error") statusCode = 400;
        else if (errorType === "time_limit_exceeded") statusCode = 408;

        return res.status(statusCode).json({ success: false, type: errorType, message: errorMessage });
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

        const filePath = generateFile({ code, language });
        const executionStartTime = Date.now();
        let maxExecutionTime = 0;
        let verdict = "Accepted";
        let failedTestCase = 0;

        for (const [index, testCase] of testCases.entries()) {
            try {
                const inputFilePath = generateInputFile(testCase.input);
                const testCaseStartTime = Date.now();
                
                const output = await executeCode(language, filePath, inputFilePath);
                const testCaseExecutionTime = Date.now() - testCaseStartTime;
                maxExecutionTime = Math.max(maxExecutionTime, testCaseExecutionTime);

                if (output.trim() !== testCase.output.trim()) {
                    verdict = "Wrong Answer";
                    failedTestCase = index + 1;
                    break;
                }
            } catch (error) {
                verdict = error.type === "compile_error" ? "Compilation Error" :
                         error.type === "time_limit_exceeded" ? "Time Limit Exceeded" :
                         "Runtime Error";
                failedTestCase = index + 1;
                break;
            }
        }

        const totalExecutionTime = Date.now() - executionStartTime;

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
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
            { role: "user", parts: [
                { text: "Give me suggestions to improve the following code. Keep it point-wise, concise, and return in plain text format without any extra code or remarks like 'better code is'.\n\nCode:\n" + code }
            ]}
        ]
    });
    const candidates = response.candidates;
    const suggestions = candidates?.[0]?.content?.parts?.[0]?.text || "Upgrade to pro to get AI suggestions";
    return res.status(200).json({ success: true, suggestions });
};

module.exports = {
    handleRunCode,
    handleSubmitCode,
    handleGetSuggestions,
};