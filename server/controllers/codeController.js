const {
    generateFile,
    generateInputFile,
    executeCpp,
    executePython,
    executeJavaScript,
    executeJava,
} = require("../utilities/codeUtil");

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
        if (language == "cpp") {
            const output = await executeCpp(filePath, inputFilePath);
            res.status(200).json({ success: true, message: "Code generated successfully", output });
        }
        else if (language == "python") {
            const output = await executePython(filePath, inputFilePath);
            res.status(200).json({ success: true, message: "Python code executed successfully", output });
        }
        else if (language == "javascript") {
            const output = await executeJavaScript(filePath, inputFilePath);
            res.status(200).json({ success: true, message: "JavaScript code executed successfully", output });
        }
        else if (language == "java") {
            const output = await executeJava(filePath, inputFilePath);
            res.status(200).json({ success: true, message: "Java code executed successfully", output });
        }
        else {
            return res.status(400).json({ success: false, message: "Unsupported language" });
        }
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
}

module.exports = {
    handleRunCode,
};