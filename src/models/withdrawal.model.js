const mongoose = require("mongoose");
const { Schema } = mongoose;

const WithdrawalRequestSchema = new Schema(
  {
    bank: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    customer_name: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
    accountBalance: {
      type: Number,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    declinedReason: {
      type: String,
    },
    declinedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const WithdrawalRequest = mongoose.model("WithdrawalRequest", WithdrawalRequestSchema);
module.exports = WithdrawalRequest;
