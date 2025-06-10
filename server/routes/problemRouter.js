const express = require('express');
const app = express.Router();
const {
    handleGetAllProblems,
    handleGetProblemByName,
    handleAddProblem,
    handleAddTestCase,
    handleVerifyProblems,
    handleDeleteProblems,
    handleGetUnverifiedProblems,
    handleGetSolutions
} = require("../controllers/problemController");
const { authenticateUser, authorizeAdmin } = require('../utilities/userUtil');

app.get('/', (req, res) => {
    res.send('Welcome to problem router!');
});

app.get('/getall', handleGetAllProblems);

app.get('/get', handleGetProblemByName);

app.post('/addproblem', authenticateUser, handleAddProblem);

app.post('/addtestcase', authenticateUser, handleAddTestCase);

app.patch('/verify', authenticateUser, authorizeAdmin, handleVerifyProblems);

app.delete('/delete', authenticateUser, authorizeAdmin, handleDeleteProblems);

app.get('/getunverified', authenticateUser, authorizeAdmin, handleGetUnverifiedProblems);

app.get('/getsolutions', handleGetSolutions);

module.exports = app;
