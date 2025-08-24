import express from "express";
import {
  submitBusinessForm,
  submitTalentForm,
} from "../controllers/formController.js";

import { protect, restrictTo } from "../controllers/authController.js";
import upload from "../upload/upload.js";

const router = express.Router();
router.route("/business").post(submitBusinessForm);
router.route("/talent").post(upload.single("cv"), submitTalentForm);

export default router;
