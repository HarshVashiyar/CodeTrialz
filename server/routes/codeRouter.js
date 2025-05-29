const express = require("express");
const app = express.Router();
const {
    handleRunCode,
    handleSubmitCode,
} = require("../controllers/codeController");
const { authenticateUser } = require("../utilities/userUtil");

app.get("/", (req, res) => {
    res.send("Welcome to the code router!");
});

app.post("/run", authenticateUser, handleRunCode);

app.post("/submit", authenticateUser, handleSubmitCode);

module.exports = app;
