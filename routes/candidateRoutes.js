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

