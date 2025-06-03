const express = require("express");
const app = express.Router();
const { 
    handleExecuteCodeForRun, 
    handleExecuteCodeForSubmit 
} = require("../controllers/execController");

app.get("/", (req, res) => {
    res.send("Welcome to the exec router!");
});

app.post("/run", handleExecuteCodeForRun);

app.post("/submit", handleExecuteCodeForSubmit);

module.exports = app;