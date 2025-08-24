import express from "express";
import upload from "../upload/upload.js"; // Adjust the path as necessary
import {
  getJob,
  createJob,
  updateJob,
  deleteJob,
  applyForJob,
  getAllJobs,
} from "../controllers/jobController.js";
import { protect, restrictTo } from "../controllers/authController.js";
import {
  uploadJobImages,
  resizeJobImages,
  cleanupJobImages,
} from "../utils/upload.js";

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);
// Only allow 'admin' users to create, update, or delete jobs

router
  .route("/")
  .get(getAllJobs)
  .post(restrictTo("admin"), uploadJobImages, resizeJobImages, createJob);

router
  .route("/:id")
  .get(getJob)
  .patch(restrictTo("admin"), uploadJobImages, resizeJobImages, updateJob)
  .delete(restrictTo("admin"), deleteJob);

router.post(
  "/:id/apply",
  restrictTo("candidate"),
  upload.single("cv"),
  applyForJob
);

export default router;
