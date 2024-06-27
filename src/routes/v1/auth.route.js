const express = require("express");
const router = express.Router();
const {
  authController
} = require("../../controllers");
const {
  googleService,
  facebookService,
  jwtService,
} = require("../../services");
const { protect } = jwtService;
const {
  handleGoogleLogin,
  handleGoogleCallback
} = googleService();
const {
  handleFacebookLogin,
  handleFacebookCallback
} = facebookService();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotpassword);
router.post("/reset-password/:token", authController.resetPassword);
router.post("/change-password", protect, authController.resetOldPassword);
router.get("/verify", authController.verify);
router.get("/google", handleGoogleLogin);
router.get("/facebook", handleFacebookLogin);
router.get("/google/callback", handleGoogleCallback);
router.get("/facebook/callback", handleFacebookCallback);

module.exports = router;