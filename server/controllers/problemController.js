const Problem = require('../models/problemDB');
const TestCase = require('../models/testCasesDB');
const User = require('../models/userDB');

const handleGetAllProblems = async (req, res) => {
    try {
        const problems = await Problem.find({ verified: true }).populate('createdBy', 'fullName');
        if (!problems || problems.length === 0) {
            return res.status(404).json({ message: 'No problems found' });
        }
        return res.status(200).json({ success: true, problems });
    } catch (error) {
        console.error('Error fetching problems:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const handleGetProblemById = async (req, res) => {
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ success: false, message: 'Problem ID is required.' });
    }
    try {
        const problem = await Problem.findById(id).populate('testCases');
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }
        return res.status(200).json({ success: true, problem });
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
        return res.status(201).json({ success: true, problem: newProblem });
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
    const { problemId, testCases } = req.body;
    if (!problemId || !Array.isArray(testCases) || testCases.length === 0) {
        return res.status(400).json({ success: false, message: 'Problem ID and test cases are required.' });
    }
    try {
        const createdTestCases = [];
        for (const { input, output } of testCases) {
            if (!input || !output) {
                return res.status(400).json({ success: false, message: 'Each test case must have input and output.' });
            }
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
        return res.status(201).json({ success: true, testCases: createdTestCases });
    } catch (error) {
        console.error('Error adding test cases:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const handleVerifyProblems = async (req, res) => {
    const { problemIds } = req.body;
    if (!problemIds || problemIds.length === 0){
        return res.status(400).json({ success: false, message: "Please Select Problems to verify" });
    }
    try {
        // Get all problems with their createdBy field
        const problems = await Problem.find({ _id: { $in: problemIds } });
        
        // Group problems by creator
        const problemsByCreator = problems.reduce((acc, problem) => {
            if (!acc[problem.createdBy]) {
                acc[problem.createdBy] = [];
            }
            acc[problem.createdBy].push(problem._id);
            return acc;
        }, {});

        // Update each creator's problemsCreated array
        for (const [creatorId, createdProblemIds] of Object.entries(problemsByCreator)) {
            await User.findByIdAndUpdate(
                creatorId,
                { $addToSet: { problemsCreated: { $each: createdProblemIds } } }
            );
        }

        // Mark problems as verified
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
    const { problemIds } = req.body;
    if (!problemIds || problemIds.length === 0){
        return res.status(400).json({ success: false, message: "Please Select Problems to verify" });
    }
    try {
        await Problem.deleteMany({ _id: { $in: problemIds } });
        await TestCase.deleteMany({ problem: { $in: problemIds } });
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
        return res.status(200).json({ success: true, problems: unverifiedProblems });
    } catch (error) {
        console.error('Error fetching problems:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = {
    handleGetAllProblems,
    handleGetProblemById,
    handleAddProblem,
    handleAddTestCase,
    handleVerifyProblems,
    handleDeleteProblems,
    handleGetUnverifiedProblems
};