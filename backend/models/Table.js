const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: true,
      default: 4,
    },
    status: {
      type: String,
      enum: ["free", "occupied", "reserved"],
      default: "free",
    },
    location: {
      type: String,
      default: "Main Hall",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Table", tableSchema);