const express = require("express");
const router = express.Router();

const { addOrder, getOrders, getUserOrders } = require("../controllers/orderController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/add", authenticateToken, addOrder);
router.get("/getOrders", getOrders);
router.get("/user", authenticateToken, getUserOrders);

module.exports = router;
