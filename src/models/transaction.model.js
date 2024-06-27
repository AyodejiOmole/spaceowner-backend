const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema(
  {
    booking_id: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    booking_status: {
      type: String,
      required: true,
      enum: ["current", "pending", "cancelled", "completed"],
    },
    start_date: {
      type: Date,
    },
    end_date: {
      type: Date,
    },
    warehouse: {
      type: Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    warehouse_owners_name: {
      type: String,
    },
    warehouse_name: {
      type: String,
    },
    balance: {
      type: Number,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["success", "failed", "pending"],
    },
    reference: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    spaceCost: {
      type: Number,
      required: true,
    },
    warehouszitFee: {
      type: Number,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    paystackFee: {
      type: Number,
      required: true,
    },
    rentedSpaceSize: {
      type: Number,
      required: true,
    },
    customers_email: {
      type: String,
      required: true,
    },
    customers_name: {
      type: String,
    },
    customer_code: {
      type: String,
    },
    payment_channel: {
      type: String,
    },
    card_type: {
      type: String,
    },
    bank: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
