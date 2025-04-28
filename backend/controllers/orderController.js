const Order = require("../models/orderModel"); // import model

// Controller để thêm một order
const addOrder = async (req, res) => {
  try {
    const {
      customerName,
      phoneNumber,
      emailAddress,
      address,
      paymentMethod,
      note,
      agreeTerms,
      items,
      date,
      totalPrice,
    } = req.body;

    // Lấy userId từ middleware authenticateToken
    const userId = req.user.id;

    // Tạo đối tượng order mới
    const newOrder = new Order({
      userId, // Gắn userId vào đơn hàng
      customerName,
      phoneNumber,
      emailAddress,
      address,
      paymentMethod,
      note,
      agreeTerms,
      items,
      totalPrice,
      date: date || new Date(),
    });

    // Lưu vào database
    await newOrder.save();

    res.status(201).json({
      message: "Đặt hàng thành công!",
      order: newOrder,
    });
  } catch (error) {
    console.error("Lỗi khi thêm order:", error);
    res.status(500).json({ message: "Lỗi server, không thể đặt hàng." });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find(); // Lấy tất cả đơn hàng từ database
    res.json(orders);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", err);
    res.status(500).json({ message: "Lỗi server, không thể lấy danh sách đơn hàng." });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user` is populated by middleware
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Failed to fetch user orders:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { addOrder, getOrders, getUserOrders };
