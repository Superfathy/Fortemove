<<<<<<< HEAD
import express from 'express';
import {
  getMyApplications,
  getMyApplication,
  candidateDashboard
} from '../controllers/jobController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

// Protect all routes
router.use(protect);
router.use(restrictTo('candidate'));

router.get('/my-applications', getMyApplications);
router.get('/my-applications/:id', getMyApplication);
router.get('/dashboard', candidateDashboard);

export default router;
=======
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
>>>>>>> 44a21e240e5a6f2fdd3666f6230223e4da13d923
