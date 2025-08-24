import express from "express";
import morgan from "morgan";
import { fileURLToPath } from "url";
import { dirname } from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
// import mongoSanitize from "express-mongo-sanitize";
// import xss from "xss-clean";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import formRoutes from "./routes/formRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import globalErrorHandler from "./controllers/errorController.js";
import AppError from "./utils/appError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3001", // Your React app's URL
    credentials: true, // Allow cookies to be sent
  })
);

// Rate Limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000, // 1 15 minutes
  message: "Too many requests from this IP, please try again in an hour-!",
});
app.use("/api", limiter);

// Data Sanitization against NoSQL query injection
// app.use(mongoSanitize());
// app.use(xss());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body Parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use("/api/v1/users", authRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/forms", formRoutes);
app.use("/api/v1/admin", adminRoutes);

// Error handling middleware
// app.all("*", (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });
app.use(globalErrorHandler);

export default app;
