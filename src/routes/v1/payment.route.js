const express = require("express");
const router = express.Router();
const { spaceseekerControllerMain } = require("../../controllers");

router.get("/verify/:id", spaceseekerControllerMain.verifyPayment);

module.exports = router;
