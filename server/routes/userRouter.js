const express = require("express");
const app = express.Router();

const {
  handleUserSignUp,
  handleUserSignIn,
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUser,
  handleDeleteUser,
  handleLogout,
} = require("../controllers/userController");

const { 
    authenticateUser,
    authorizeAdmin,
    loginLimiter,
} = require("../utilities/userUtil");
    
app.get("/", (req, res) => {
  res.send("Welcome to user router!");
});

app.post("/signup", handleUserSignUp);

app.post("/signin", handleUserSignIn);

app.get("/getall", authenticateUser, authorizeAdmin, handleGetAllUsers);

app.get("/:id", authenticateUser, handleGetUserById);

app.put("/:id", authenticateUser, handleUpdateUser);

app.delete("/:id", authenticateUser, authorizeAdmin, handleDeleteUser);

app.post("/logout", authenticateUser, handleLogout);

module.exports = app;
