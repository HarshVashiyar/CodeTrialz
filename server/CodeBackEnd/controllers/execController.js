const {
    generateFile,
    generateInputFile,
    executeCpp,
    executePython,
    executeJavaScript,
    executeJava,
} = require("../utilities/codeUtil");

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

const handleExecuteCodeForRun = async (req, res) => {
    const { language, code, input = "" } = req.body;
    try {
        const filePath = generateFile({ code, language });
        const inputFilePath = generateInputFile(input);
        if (!filePath) {
            return res.status(500).json({  success: false,  message: "Failed to generate file"  });
        }
        const output = await executeCode(language, filePath, inputFilePath);
        return res.json({  success: true,  output: output  });
    } catch (error) {
        console.error("Error executing code:", error);
        
        let statusCode = 500;
        let errorType = error.type || "internal_error";
        let errorMessage = error.message || "Internal server error";
        
        if (errorType === "compile_error") statusCode = 400;
        else if (errorType === "runtime_error") statusCode = 400;
        else if (errorType === "time_limit_exceeded") statusCode = 408;

        return res.status(statusCode).json({ success: false,  type: errorType,  message: errorMessage  });
    }
};

const handleExecuteCodeForSubmit = async (req, res) => {
    const { testCases, language, code } = req.body;
    try {
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
        return res.json({ success: true, verdict, maxExecutionTime, totalExecutionTime, failedTestCase });
    }
    catch (error) {
        console.error("Error executing code:", error);
        return res.status(500).json({ success: false, type: error.type || "internal_error", message: error.message || "Internal server error" });
    }
};

module.exports = {
    handleExecuteCodeForRun,
    handleExecuteCodeForSubmit
};