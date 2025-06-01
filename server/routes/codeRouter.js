const express = require("express");
const app = express.Router();
const {
    handleRunCode,
    handleSubmitCode,
    handleGetSuggestions,
} = require("../controllers/codeController");
const { authenticateUser } = require("../utilities/userUtil");

app.get("/", (req, res) => {
    res.send("Welcome to the code router!");
});

app.post("/run", authenticateUser, handleRunCode);

app.post("/submit", authenticateUser, handleSubmitCode);

app.post("/suggestions", authenticateUser, handleGetSuggestions);

module.exports = app;
