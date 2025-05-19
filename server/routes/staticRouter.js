const express = require('express');
const app = express();
const userRouter = require('./userRouter')

app.get('/', (req, res) => {
    res.send('Welcome to static router!');
});

app.use('/user', userRouter);

module.exports = app;