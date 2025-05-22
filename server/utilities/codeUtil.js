const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const { exec } = require("child_process");

const codeDirectory = path.join(__dirname, "../codes");
if(!fs.existsSync(codeDirectory)) {
    fs.mkdirSync(codeDirectory, { recursive: true });
}

const outputDirectory = path.join(__dirname, "../outputs");
if(!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
}

const generateFile = ({ code, language }) => {
    const jobId = uuid();
    const fileName = `${jobId}.${language}`;
    const filePath = path.join(codeDirectory, fileName);
    fs.writeFileSync(filePath, code);
    return filePath;
};

const generateOutputFile = (filePath) => {
    const jobId = path.basename(filePath).split(".")[0];
    const outputFileName = `${jobId}.out`;
    const outputFilePath = path.join(outputDirectory, outputFileName);
    // fs.writeFileSync(outputFilePath, "");
    return outputFilePath;
};

const executeCpp = (filePath) => {
    const outputFilePath = generateOutputFile(filePath);
    const compileCommand = `g++ ${filePath} -o ${outputFilePath}`;

    return new Promise((resolve, reject) => {
        exec(compileCommand, (compileError, _, compileStderr) => {
            if (compileError) {
                return reject({
                    type: "compile_error",
                    message: compileStderr || compileError.message,
                });
            }
            exec(outputFilePath, { timeout: 3000 }, (runError, stdout, runStderr) => {
                if (runError) {
                    if (runError.signal === 'SIGTERM') {
                        return reject({
                            type: "time_limit_exceeded",
                            message: "Time limit exceeded",
                        });
                    }
                    return reject({
                        type: "runtime_error",
                        message: runStderr || runError.message,
                    });
                }
                if (runStderr) {
                    return reject({
                        type: "runtime_error",
                        message: runStderr,
                    });
                }
                return resolve(stdout);
            });
        });
    });
};

const executePython = (filePath) => {
    const outputFilePath = generateOutputFile(filePath);
    const command = `python3 ${filePath}`;

    return new Promise((resolve, reject) => {
        exec(command, { timeout: 3000 }, (error, stdout, stderr) => {
            if (error) {
                if (error.signal === 'SIGTERM') {
                    return reject({
                        type: "time_limit_exceeded",
                        message: "Time limit exceeded",
                    });
                }
                const fullError = `${stderr}\n${error.message}`;
                if (/SyntaxError|IndentationError|NameError/.test(fullError)) {
                    return reject({
                        type: "compile_error",
                        message: fullError,
                    });
                }
                return reject({
                    type: "runtime_error",
                    message: fullError,
                });
            }
            fs.writeFileSync(outputFilePath, stdout);
            resolve(stdout);
        });
    });
};

const executeJavaScript = (filePath) => {
    const outputFilePath = generateOutputFile(filePath);
    const command = `node ${filePath}`;

    return new Promise((resolve, reject) => {
        exec(command, { timeout: 3000 }, (error, stdout, stderr) => {
            if (error) {
                if (error.signal === 'SIGTERM') {
                    return reject({
                        type: "time_limit_exceeded",
                        message: "Time limit exceeded",
                    });
                }
                if (/SyntaxError|ReferenceError/.test(stderr)) {
                    return reject({
                        type: "compile_error",
                        message: stderr,
                    });
                }
                return reject({
                    type: "runtime_error",
                    message: stderr || error.message,
                });
            }
            fs.writeFileSync(outputFilePath, stdout);
            resolve(stdout);
        });
    });
};

const executeJava = (filePath) => {
    const outputFilePath = generateOutputFile(filePath);
    const command = `java ${filePath}`;

    return new Promise((resolve, reject) => {
        exec(command, { timeout: 3000 }, (error, stdout, stderr) => {
            if (error) {
                if (error.signal === 'SIGTERM') {
                    return reject({
                        type: "time_limit_exceeded",
                        message: "Time limit exceeded",
                    });
                }
                if (/SyntaxError|ReferenceError/.test(stderr)) {
                    return reject({
                        type: "compile_error",
                        message: stderr,
                    });
                }
                return reject({
                    type: "runtime_error",
                    message: stderr || error.message,
                });
            }
            fs.writeFileSync(outputFilePath, stdout);
            resolve(stdout);
        });
    });
}

module.exports = {
    generateFile,
    executeCpp,
    executePython,
    executeJavaScript,
    executeJava,
};