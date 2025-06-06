const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const menuRoutes = require("./routes/menuRoutes");
const cartRoutes = require("./routes/cartRoutes");
const chefRoutes = require("./routes/chefRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const tableRoutes = require("./routes/tableRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRouter = require("./routes/paymentRoutes");
const userAuthRoutes = require("./routes/userAuthRoutes");

const app = express();
require("dotenv").config();

// Kết nối đến MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" })); // Giới hạn 10MB
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/menus", menuRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/chefs", chefRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRouter);
app.use("/api/auth/user", userAuthRoutes);

// Thêm route upload ảnh
app.use("/api", uploadRoutes);

// Upload: Cho phép truy cập vào thư mục uploads
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
