import express from 'express';
import { importApplications, exportApplications, getExportTemplate } from '../controllers/importExportController.js';
import { protect, restrictTo } from '../controllers/authController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Protect all routes
router.use(protect);
router.use(restrictTo('admin'));

router.post('/applications/import', upload.single('file'), importApplications);
router.get('/applications/export', exportApplications);
router.get('/applications/export/template', getExportTemplate);

export default router;