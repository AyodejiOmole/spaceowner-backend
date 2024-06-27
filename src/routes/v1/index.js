const express = require('express');
const app = express();

const warehouses = require('./warehouses.route');
const users = require('./users.route');
const auth = require('./auth.route');
const contactUs = require('./contact-us');
const notifications = require('./notifications.route');
const payment = require('./payment.route');
const admin = require('./admin.routes');
const spaceowner = require('./spaceowner.routes');
const spaceseeker = require('./spaceseeker.routes');
const { jwtService } = require("../../services");
const { protect, spaceownerProtect, spaceseekerProtect, adminProtect } = jwtService;


app.use('/auth', auth);
app.use('/contact-us', contactUs);
app.use('/users', protect, users);

app.use("/spaceseeker", protect, spaceseekerProtect, spaceseeker);
app.use("/admin", protect, adminProtect, admin);
app.use("/spaceowner", protect, spaceownerProtect, spaceowner);

app.use('/warehouses', warehouses);
app.use('/notifications', protect, notifications);
app.use("/payment", payment);



module.exports = app;