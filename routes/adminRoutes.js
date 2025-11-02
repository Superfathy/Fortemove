import express from "express";
import { getAdminDashboard } from "../controllers/adminController.js";
import { protect, restrictTo } from "../controllers/authController.js";
import {
  getAllTalents,
  deleteTalent,
  getAllQuestionnaires,
  deleteQuestionnaire,
} from "../controllers/formController.js";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllApplications,
  getApplication,
  updateApplicationStatus,
  deleteApplication,
} from "../controllers/adminController.js";

const router = express.Router();


router.use(protect);
// Only allow 'admin'to access the admin routes
// router.use(restrictTo("admin"));
// Admin Dashboard Route
router.route("/dashboard").get(getAdminDashboard);
// Admin Users Management Routes
router.route("/users").get(getAllUsers);
router.route("/users/:id").patch(updateUserRole).delete(deleteUser);

// Application Management Routes
router.route("/applications").get(getAllApplications);
router
  .route("/applications/:id")
  .get(getApplication)
  .patch(updateApplicationStatus)
  .delete(deleteApplication);

// Questionnaire And Talent Management Routes

router.route("/questionnaires").get(getAllQuestionnaires);
router.route("/questionnaires/:id").delete(deleteQuestionnaire);
router.route("/talents").get(getAllTalents);
router.route("/talents/:id").delete(deleteTalent);

export default router;
