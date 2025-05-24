const express = require('express');
const app = express();
const userRouter = require('./userRouter');
const emailRouter = require('./emailRouter');
const codeRouter = require('./codeRouter');
const problemRouter = require('./problemRouter');

app.get('/', (req, res) => {
    res.send('Welcome to static router!');
});

app.use('/user', userRouter);

app.use('/email', emailRouter);

app.use('/code', codeRouter);

app.use('/problem', problemRouter);

module.exports = app;