const express = require("express");
const router = express.Router();
const { userController } = require("../../controllers");

router.get("/profile/:id", userController.viewProfile);
router.put("/profile/:id", userController.editProfile);
router.get("/total-revenue",userController.totalRevenue);

module.exports = router;
