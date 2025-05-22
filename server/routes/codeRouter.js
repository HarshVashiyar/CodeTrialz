const express = require("express");
const app = express.Router();
const {
    handleRunCode,
} = require("../controllers/codeController");

app.get("/", (req, res) => {
    res.send("Welcome to the code router!");
});

app.post("/run", handleRunCode);

module.exports = app;
