const express = require("express");
const router = express.Router();
const { spaceseekerControllerMain } = require("../../controllers");

router.get('/warehouse/search', spaceseekerControllerMain.searchWarehouses);
router.get('/warehouse/:id', spaceseekerControllerMain.getWarehouse);
router.get('/warehouse/:id/calculate', spaceseekerControllerMain.calculate);
router.post('/warehouse/:id/reserve-warehouse', spaceseekerControllerMain.reserveIt);
router.get('/booking/:id/cancel-reservation', spaceseekerControllerMain.cancelReservation);
router.get('/booking/:id/pay-now', spaceseekerControllerMain.payNow);
router.get('/booking/:id/verify-payment', spaceseekerControllerMain.verifyPayment);
router.get('/dashboard', spaceseekerControllerMain.dashboard);
router.post("/warehouse/:id/rate-warehouse", spaceseekerControllerMain.rateWarehouse);

module.exports = router;
