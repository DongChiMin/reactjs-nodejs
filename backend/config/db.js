const mongoose = require("mongoose");
require("dotenv").config(); // Load biến môi trường từ .env

// Kết nối MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected...");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
