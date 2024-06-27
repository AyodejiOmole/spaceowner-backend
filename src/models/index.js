const Warehouse = require("./warehouses.model");
const User = require("./user.model");
const Inquirer = require("./inquiry-contact");
const Notification = require("./notification.model");
const Booking = require("./booking.model");
const Wallet = require("./wallet.model");
const Transaction = require("./transaction.model");
const WithdrawalRequest = require("./withdrawal.model");
const Disabled = require("./disable.model");

module.exports = {
  Warehouse,
  User,
  Inquirer,
  Notification,
  Booking,
  Wallet,
  Transaction,
  WithdrawalRequest,
  Disabled,
};