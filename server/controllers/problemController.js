const Problem = require('../models/problemDB');
const TestCase = require('../models/testCasesDB');
const User = require('../models/userDB');

const handleGetAllProblems = async (req, res) => {
    try {
        const problems = await Problem.find({ verified: true }).populate('createdBy', 'fullName');
        if (!problems || problems.length === 0) {
            return res.status(404).json({ message: 'No problems found' });
        }
        return res.status(200).json({
            success: true,
            problems : problems.map(problem => ({
                name: problem.name,
                difficulty: problem.difficulty,
                tags: problem.tags,
                createdBy: problem.createdBy.fullName,
            }))
        });
    } catch (error) {
        console.error('Error fetching problems:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const handleGetProblemByName = async (req, res) => {
    const { name, allTestCases } = req.query;
    if (!name) {
        return res.status(400).json({ success: false, message: 'Problem name is required.' });
    }
    try {
        const problem = await Problem.findOne({ name }).populate('testCases');
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }
        let testCasesToSend;
        if (allTestCases == 'true') {
            testCasesToSend = problem.testCases.map(testCase => ({
                input: testCase.input,
                output: testCase.output
            }));
        } else {
            testCasesToSend = problem.testCases.map((testCase, idx) => {
            if (idx < 2) {
                return {
                    input: testCase.input,
                    output: testCase.output
                };
            } else {
                return {
                    input: '',
                    output: ''
                };
            }
            });
        }
        return res.status(200).json({
            success: true,
            problem: {
                name: problem.name,
                difficulty: problem.difficulty,
                tags: problem.tags,
                statement: problem.statement,
                inputFormat: problem.inputFormat,
                outputFormat: problem.outputFormat,
                testCases: testCasesToSend,
                createdBy: problem.createdBy.fullName,
            }
        });
    }
    catch (error) {
        console.error('Error fetching problem:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const handleAddProblem = async (req, res) => {
    const { name, difficulty, tags, statement, inputFormat, outputFormat } = req.body;
    const user = req.user;
    if (!name || !difficulty || !tags || !statement || !inputFormat || !outputFormat) {
        return res.status(400).json({ success: false, message: 'Please fill all the fields.' });
    }
    const existingProblem = await Problem.findOne({ name });
    if (existingProblem) {
        return res.status(400).json({ success: false, message: 'Problem with this name already exists.' });
    }
    const existingUser = await User.findById(user.id);
    if (!existingUser) {
        return res.status(404).json({ success: false, message: 'User not found.' });
    }
    try {
        const newProblem = new Problem({
            name,
            difficulty,
            tags,
            statement,
            inputFormat,
            outputFormat,
            createdBy: user.id,
        });
        await newProblem.save();
        return res.status(201).json({ success: true, message: 'Problem added successfully!', problemName: newProblem.name });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((el) => el.message);
            return res.status(400).json({ success: false, error: 'Validation Error', message: errors });
        }
        console.error('Error adding problem:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const handleAddTestCase = async (req, res) => {
    const { problemName, testCases } = req.body;
    if (!problemName || !Array.isArray(testCases) || testCases.length === 0) {
        return res.status(400).json({ success: false, message: 'Problem name and test cases are required.' });
    }
    try {
        const createdTestCases = [];
        for (const { input, output } of testCases) {
            if (!input || !output) {
                return res.status(400).json({ success: false, message: 'Each test case must have input and output.' });
            }
            const problem = await Problem.findOne({ name: problemName });
            if (!problem) {
                return res.status(404).json({ success: false, message: 'Problem not found.' });
            }
            const problemId = problem._id;
            const newTestCase = new TestCase({
                input,
                output,
                problem: problemId,
            });
            await newTestCase.save();
            await Problem.findByIdAndUpdate(problemId, {
                $push: { testCases: newTestCase._id }
            });
            createdTestCases.push(newTestCase);
        }
        return res.status(201).json({ success: true, message: 'Test cases added successfully!' });
    } catch (error) {
        console.error('Error adding test cases:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const handleVerifyProblems = async (req, res) => {
    const { problemNames } = req.body;
    if (!problemNames || problemNames.length === 0){
        return res.status(400).json({ success: false, message: "Please Select Problems to verify" });
    }
    try {
        const problems = await Problem.find({ name: { $in: problemNames } });
        const problemIds = problems.map(problem => problem._id);
        if (problemIds.length === 0) {
            return res.status(404).json({ success: false, message: "No problems found with the provided names." });
        }
        // Group problems by creator
        const problemsByCreator = problems.reduce((acc, problem) => {
            if (!acc[problem.createdBy]) {
                acc[problem.createdBy] = [];
            }
            acc[problem.createdBy].push(problem._id);
            return acc;
        }, {});

        for (const [creatorId, createdProblemIds] of Object.entries(problemsByCreator)) {
            await User.findByIdAndUpdate(
                creatorId,
                { $addToSet: { problemsCreated: { $each: createdProblemIds } } }
            );
        }

        await Problem.updateMany(
            { _id: { $in: problemIds } },
            { $set: { verified: true } }
        );
        await TestCase.updateMany(
            { problem: { $in: problemIds } },
            { $set: { verified: true } }
        );
        
        return res.status(200).json({ success: true, message:"Problems Verified Successfully!" });
    } catch (error) {
        console.error('Error verifying problems:', error);
        return res.status(500).json({ success: false, message:'Internal server Error' });
    }
};

const handleDeleteProblems = async (req, res) => {
    const { problemNames } = req.body;
    if (!problemNames || problemNames.length === 0){
        return res.status(400).json({ success: false, message: "Please Select Problems to remove" });
    }
    try {
        const problemsToDelete = await Problem.find({ name: { $in: problemNames } }, '_id');
        const problemIdsToDelete = problemsToDelete.map(p => p._id);
        await Problem.deleteMany({ name: { $in: problemNames } });
        await TestCase.deleteMany({ problem: { $in: problemIdsToDelete } });
        return res.status(200).json({ success: true, message:"Problems Deleted Successfully!" });
    } catch (error) {
        console.error('Error verifying problems:', error);
        return res.status(500).json({ success: false, message:'Internal server Error' });
    }
};

const handleGetUnverifiedProblems = async (req, res) => {
    try {
        const unverifiedProblems = await Problem.find({ verified: false }).populate('createdBy', 'fullName');
        if (!unverifiedProblems || unverifiedProblems.length === 0) {
            return res.status(404).json({ message: 'No problems found' });
        }
        return res.status(200).json({
            success: true,
            problems: unverifiedProblems.map(problem => ({
                name: problem.name,
                difficulty: problem.difficulty,
                tags: problem.tags,
                createdBy: problem.createdBy.fullName,
                createdAt: problem.createdAt,
                updatedAt: problem.updatedAt,
                verified: problem.verified
            }))
        });
    } catch (error) {
        console.error('Error fetching problems:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const handleGetSolutions = async (req, res) => {
    const { problemName } = req.query;
    if (!problemName) {
        return res.status(400).json({ success: false, message: "Problem name is required." });
    }
    try {
        const problem = await Problem.findOne({ name: problemName })
            .populate({
                path: 'solutions',
                populate: {
                    path: 'user',
                    select: 'fullName'
                }
            })
            .select('name difficulty solutions');
        if (!problem || !problem.solutions || problem.solutions.length === 0) {
            return res.status(404).json({ success: false, message: "No solutions found for this problem." });
        }
        return res.status(200).json({
            success: true,
            solutions: {
                solutions: problem.solutions.map(solution => ({
                    code: solution.code,
                    language: solution.language,
                    user: solution.user.fullName,
                    executionTime: solution.executionTime,
                    score: solution.score,
                    verdict: solution.verdict,
                    createdAt: solution.createdAt,
                })),
                problemName: problem.name,
                difficulty: problem.difficulty
            }
        });
    } catch (error) {
        console.error('Error fetching solutions:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = {
    handleGetAllProblems,
    handleGetProblemByName,
    handleAddProblem,
    handleAddTestCase,
    handleVerifyProblems,
    handleDeleteProblems,
    handleGetUnverifiedProblems,
    handleGetSolutions
};