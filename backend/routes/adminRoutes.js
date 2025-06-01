const express = require("express");
const router = express.Router();

const adminMiddleware = require("../middleware/adminMiddleware");

const {
  adminLogin,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/authController");

router.post("/login", adminLogin);
router.get("/users", adminMiddleware, getAllUsers);
router.post("/users", adminMiddleware, createUser);
router.put("/users/:id", adminMiddleware, updateUser);
router.delete("/users/:id", adminMiddleware, deleteUser);

module.exports = router;
