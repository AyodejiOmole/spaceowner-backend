const argon2Service = require("./hashPassword.service");
const jwtService = require("./jwt.service");
const nodemailer = require("./nodemailer.service");
const googleService = require('./google.service');
const facebookService = require('./facebook.service');
const WarehouseService = require('./warehouse.service');
const UserProfileService = require('./userProfile.service');
const WalletService = require('./wallet.service');
const PaystackService = require('./paystack.service');
const BookingService = require('./booking.service');
const Services = require('./app.services'); 

module.exports = {
  jwtService,
  argon2Service,
  nodemailer,
  googleService,
  facebookService,
  WarehouseService,
  UserProfileService,
  WalletService,
  PaystackService,
  BookingService,
  Services,
};
