import multer from "multer";
import path from "path";
import AppError from "../utils/appError.js";
import fs from "fs";
import { promisify } from "util";

// Ensure upload directory exists
const uploadDir = "public/uploads/cvs";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Invalid file type. Only PDF and Word documents are allowed.",
        400
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1, // Only 1 file per upload
  },
});

// Middleware to clean up files if request fails
export const cleanupUploads = async (req, res, next) => {
  try {
    await next();
  } catch (err) {
    // If there was an error and a file was uploaded, delete it
    if (req.file) {
      await promisify(fs.unlink)(req.file.path);
    }
    throw err;
  }
};

export default upload;
