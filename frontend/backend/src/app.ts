import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes";
import vaultItemRoutes from "./routes/vaultItemRoutes";
import passwordRoutes from "./routes/passwordRoutes";
import { ApiError } from "./utils/apiError";

const app = express();

// Logging setup
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ✅ Fix CORS: allow both local and production frontend origins
const allowedOrigins = [
  "http://localhost:3000", // Next.js local frontend
  "http://localhost:3001", // Optional dev variant
  process.env.FRONTEND_URL || "", // Production frontend URL from env
].filter(Boolean); // remove empty strings

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true, // important if you're using cookies / tokens
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(cookieParser());

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Test CORS endpoint
app.get("/test-cors", (_req, res) => {
  res.status(200).json({
    status: "OK",
    message: "CORS is working",
    timestamp: new Date().toISOString(),
  });
});

// Test login endpoint
app.post("/v1/api/user/test-login", (_req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Test login endpoint working",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/v1/api/user", userRoutes);
app.use("/v1/api/vault", vaultItemRoutes);
app.use("/v1/api/password", passwordRoutes);

// Global Error Handler
app.use(
  (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        errors: err.errors,
      });
    }

    console.error("Unhandled error:", err.message || err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
);

export { app };
