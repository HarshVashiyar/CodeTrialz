const express = require("express");
const app = express.Router();

const {
  handleCheckAuthStatus,
  handleUserSignUp,
  handleUserSignIn,
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUser,
  handleDeleteUser,
  handleLogout,
  handleViewSubmissions,
} = require("../controllers/userController");

const { 
    authenticateUser,
    authorizeAdmin,
    loginLimiter,
} = require("../utilities/userUtil");
    
app.get("/", (req, res) => {
  res.send("Welcome to user router!");
});

app.get("/checkauth", authenticateUser, handleCheckAuthStatus);

app.post("/signup", handleUserSignUp);

app.post("/signin", handleUserSignIn);

app.get("/getall", authenticateUser, authorizeAdmin, handleGetAllUsers);

app.get("/getuser", authenticateUser, handleGetUserById);

app.put("/updateuser", authenticateUser, handleUpdateUser);

app.delete("/deleteuser", authenticateUser, handleDeleteUser);

app.post("/logout", authenticateUser, handleLogout);

app.get("/viewsubmissions", authenticateUser, handleViewSubmissions);

module.exports = app;
