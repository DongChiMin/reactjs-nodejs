const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  customerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  emailAddress: { type: String },
  address: { type: String },
  paymentMethod: { type: String },
  note: { type: String },
  agreeTerms: { type: Boolean, default: false },
  items: [{ type: mongoose.Schema.Types.Mixed }],
  totalPrice: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
