import express from "express";
import {
  signup,
  login,
  googleLogin,
  updatePassword,
  protect,
  forgotPassword,
  resetPassword,
  logout,
} from "../controllers/authController.js";
const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/googleLogin").post(googleLogin);
router.route("/logout").get(logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").patch(resetPassword);

router.use(protect); // Protect all routes after this middleware
router.route("/updatePassword").patch(updatePassword);

export default router;
