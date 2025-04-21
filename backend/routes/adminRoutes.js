const express = require("express");
const adminOnly = require("../middlewares/adminMiddleware");
const { getUsers, deleteUser, updateUser } = require("../controllers/userController");


const router = express.Router();

// Example admin-only route
router.get("/dashboard", adminOnly, (req, res) => {
  res.json({ message: "Welcome to the admin dashboard" });
});

// Manage users
router.get("/users", adminOnly, getUsers);
router.delete("/users/:id", adminOnly, deleteUser);
router.put("/users/:id", adminOnly, updateUser);

module.exports = router;