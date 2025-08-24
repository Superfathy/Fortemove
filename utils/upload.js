import multer from "multer";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import AppError from "./appError.js";
import catchAsync from "./catchAsync.js";

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1) Create directory if it doesn't exist
const jobsUploadDir = path.join(__dirname, "../public/img/jobs");
if (!fs.existsSync(jobsUploadDir)) {
  fs.mkdirSync(jobsUploadDir, { recursive: true });
}

// 2) Configure Multer
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// 3) Export middleware for job images
export const uploadJobImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 1 },
]);

// 4) Image processing middleware
export const resizeJobImages = catchAsync(async (req, res, next) => {
  if (!req.files || (!req.files.imageCover && !req.files.images)) return next();

  // Ensure directory exists (double check)
  if (!fs.existsSync(jobsUploadDir)) {
    fs.mkdirSync(jobsUploadDir, { recursive: true });
  }

  // A) Process cover image
  if (req.files.imageCover) {
    req.body.imageCover = `job-${req.params.id || "new"}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(path.join(jobsUploadDir, req.body.imageCover));
  }

  // B) Process other images
  if (req.files.images) {
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `job-${req.params.id || "new"}-${Date.now()}-${i + 1}.jpeg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(path.join(jobsUploadDir, filename));

        req.body.images.push(filename);
      })
    );
  }

  next();
});

// 5) Cleanup utility
export const cleanupJobImages = catchAsync(async (job) => {
  if (job.imageCover) {
    const coverPath = path.join(jobsUploadDir, job.imageCover);
    if (fs.existsSync(coverPath)) {
      fs.unlink(coverPath, (err) => {
        if (err) console.error("Error deleting cover image:", err);
      });
    }
  }

  if (job.images?.length > 0) {
    job.images.forEach((image) => {
      const imagePath = path.join(jobsUploadDir, image);
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) console.error("Error deleting job image:", err);
        });
      }
    });
  }
});
