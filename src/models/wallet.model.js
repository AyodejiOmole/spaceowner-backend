const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const walletSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  balance: {
    type: Number,
    min: 0,
  },

  transactions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    }
  ],
});

const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;