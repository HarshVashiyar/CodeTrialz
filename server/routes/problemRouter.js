const express = require('express');
const app = express.Router();
const {
    handleGetAllProblems,
    handleGetProblemById,
    handleAddProblem,
    handleAddTestCase,
} = require("../controllers/problemController");
const { authenticateUser } = require('../utilities/userUtil');

app.get('/', (req, res) => {
    res.send('Welcome to problem router!');
});

app.get('/getall', handleGetAllProblems);

app.get('/get', handleGetProblemById);

app.post('/addproblem', authenticateUser, handleAddProblem);

app.post('/addtestcase', authenticateUser, handleAddTestCase);

module.exports = app;
