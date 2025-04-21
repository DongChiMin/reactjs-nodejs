const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const menuRoutes = require("./routes/menuRoutes");
const cartRoutes = require("./routes/cartRoutes");
const chefRoutes = require("./routes/chefRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");


const app = express();
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

// Kết nối đến MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/menus", menuRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/chefs", chefRoutes);
app.use("/api/auth", authRoutes);
app.use("api/admin", adminRoutes);

app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
