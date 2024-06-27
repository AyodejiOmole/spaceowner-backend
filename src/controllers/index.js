const userController = require('./user.controller');
const authController = require('./auth.controller');
const warehouseController = require('./warehouses.controller');
const contactUs = require('./contact-us');
const notificationController = require('./notification.controller');
const spaceseekerController = require('./bookingPayment.controller');
const adminController = require('./admin.controller');
const spaceownerController = require('./spaceowner.controller');
const spaceseekerControllerMain = require('./spaceseeker.controller');

module.exports = {
  authController,
  userController,
  warehouseController,
  contactUs,
  notificationController,
  spaceseekerController,
  adminController,
  spaceownerController,
  spaceseekerControllerMain
};