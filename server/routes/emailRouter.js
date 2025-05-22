const express = require("express");
const app = express.Router();
const { 
    handleSendOTP,
    handleVerifyOTP,
    handleResetPassword
} = require("../controllers/emailController");

app.get("/", (req, res) => {
    res.send('Welcome to email router');
});

app.post("/sendotp", handleSendOTP);

app.post("/verifyotp", handleVerifyOTP);

app.post("/resetpassword", handleResetPassword);

module.exports = app;