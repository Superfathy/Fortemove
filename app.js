import express from "express";
import morgan from "morgan";
import { fileURLToPath } from "url";
import { dirname } from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import cookieParser from "cookie-parser";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());

// Rate Limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000, // 1 15 minutes
  message: "Too many requests from this IP, please try again in an hour-!",
});
app.use("/api", limiter);

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());
app.use(xss());

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

export default app;
