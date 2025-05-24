const Problem = require('../models/problemDB');
const TestCase = require('../models/testCasesDB');
const User = require('../models/userDB');

const handleGetAllProblems = async (req, res) => {
    try {
        const problems = await Problem.find({ verified: false }).populate('createdBy', 'fullName');
        if (!problems || problems.lenght === 0) {
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
        existingUser.problemsCreated.push(newProblem.id);
        await existingUser.save();
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

module.exports = {
    handleGetAllProblems,
    handleGetProblemById,
    handleAddProblem,
    handleAddTestCase,
};