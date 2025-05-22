const express = require('express');
const app = express();
const userRouter = require('./userRouter')
const emailRouter = require('./emailRouter')
const codeRouter = require('./codeRouter')

app.get('/', (req, res) => {
    res.send('Welcome to static router!');
});

app.use('/user', userRouter);

app.use('/email', emailRouter);

app.use('/code', codeRouter);

module.exports = app;