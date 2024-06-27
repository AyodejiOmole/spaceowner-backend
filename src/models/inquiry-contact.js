const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inquirerSchema = new Schema({
  fullName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["potential_customer", "complaint"],
    default: "complaint",
  },
  status: {
    type: String,
    enum: ["pending", "resolved", "declined"],
    default: "pending",
  },
  handledBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reason: {
    type: String,
  }
}, {
  timestamps: true,
});

const Inquirer = mongoose.model("Inquirer", inquirerSchema);
module.exports = Inquirer;