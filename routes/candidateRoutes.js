import express from "express";
const router = express.Router();
import { protect, restrictTo } from "../controllers/authController.js";

router.use(protect);
router.use(restrictTo("candidate"));
import {
  getMyApplications,
  getMyApplication,
} from "../controllers/jobController.js";

router.route("/my-applications").get(getMyApplications);
router.route("/my-applications/:id").get(getMyApplication);
export default router;
