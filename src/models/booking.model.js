const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true,
  },
  warehouseName: {
    type: String,
    required: true,
  },
  pricingPlan: {
    type: String,
    required: true,
    enum: ["monthly", "yearly"],
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["current", "pending", "cancelled", "completed"],
  },
  spaceCost: {
    type: Number,
    required: true,
  },
  transactionFee: {
    type: Number,
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  rentedSize: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["paid", "pending", "failed"],
    default: "pending",
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
  }],
}, {
  timestamps: true,
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;