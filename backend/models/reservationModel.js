const mongoose = require("mongoose");

// Định nghĩa schema cho Reservation
const reservationSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
    min: 0
  },
  numberOfGuest: {
    type: Number,
    required: true,
    min: 0
  },
  seatingArea: {
    type: String,
    required: true,
  },
  tableType: {
    type: String,
    required: true,
  },

  // ✅ Trường mới: selectedTable
  selectedTable: {
    type: Object,
    default: null,
  },

  note: {
    type: String,
    required: false,
  },

  dateTime: {
    type: Date,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  createdBy: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    default: "pending",
  },
});

// Tạo model từ schema
const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;
