const moment = require("moment");
const crypto = require("crypto");
let { vnp_TmnCode, vnp_HashSecret, vnp_Url, vnp_ReturnUrl } = require("../config/vnpConfig");
const { sortObject } = require("../utils/vnpay");
const Order = require("../models/orderModel");

exports.createPayment = (req, res) => {
  const { amount, bankCode, language, currency, orderId } = req.body;

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ message: "Số tiền không hợp lệ." });
  }

  if (!orderId) {
    return res.status(400).json({ message: "Thiếu orderId." });
  }

  // Đổi từ USD sang VND nếu cần
  const exchangeRate = 23500; // USD → VND
  const amountVND = Math.round(amount * exchangeRate) * 100; // Nhân 100 theo yêu cầu của VNPay

  const date = new Date();
  const createDate = moment(date).format("YYYYMMDDHHmmss");
  const ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress;

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: vnp_TmnCode,
    vnp_Amount: amountVND,
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId, // Sử dụng orderId thật từ frontend
    vnp_OrderInfo: `Payment for order ${orderId}`,
    vnp_OrderType: "billpayment",
    vnp_Locale: language || "vn",
    vnp_ReturnUrl: vnp_ReturnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode) {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  // Sắp xếp và ký
  vnp_Params = sortObject(vnp_Params);

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(vnp_Params)) {
    if (value !== "" && value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  }

  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac
    .update(Buffer.from(params.toString(), "utf-8"))
    .digest("hex");
  params.append("vnp_SecureHash", signed);

  const paymentUrl = `${vnp_Url}?${params.toString()}`;
  res.status(200).json({ paymentUrl });
};


exports.vnpayReturn = async (req, res) => {
  let vnp_Params = req.query;
  let secureHash = vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  // Sort
  vnp_Params = sortObject(vnp_Params);

  // Verify signature
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac.update(Buffer.from(new URLSearchParams(vnp_Params).toString(), "utf-8")).digest("hex");

  if (secureHash === signed) {
    if (vnp_Params["vnp_ResponseCode"] === "00") {
      try {
        const orderId = vnp_Params["vnp_TxnRef"]; // Giả sử bạn truyền orderId trong vnp_TxnRef

        await Order.findByIdAndUpdate(orderId, {
          paymentMethod: "vnpay",
          status: "paid",
        });

        return res.redirect(`${process.env.VNP_RETURNURL}/?paymentStatus=success`);
      } catch (err) {
        console.error("Error updating order:", err);
        return res.redirect(`${process.env.VNP_RETURNURL}/?paymentStatus=failed`);
      }
    } else {
      return res.redirect(`${process.env.VNP_RETURNURL}/?paymentStatus=failed`);
    }
  } else {
    return res.redirect(`${process.env.VNP_RETURNURL}/?paymentStatus=checksum_failed`);
  }
};

