const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    vatPercent: {
      type: Number,
      default: 13,
    },
    vatAmount: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "esewa", "khalti", "fonepay"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid", "credit"],
      default: "unpaid",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", billSchema);