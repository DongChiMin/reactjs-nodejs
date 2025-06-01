const express = require("express");
const router = express.Router();
const { createPayment, vnpayReturn } = require("../controllers/paymentController");

router.post("/create_payment_url", createPayment);
router.get("/vnpay_return", vnpayReturn);

module.exports = router;
