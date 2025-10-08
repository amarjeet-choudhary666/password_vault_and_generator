"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
exports.app = app;
if (process.env.NODE_ENV === "production") {
    app.use((0, morgan_1.default)("combined"));
}
else {
    app.use((0, morgan_1.default)("dev"));
}
// Simple CORS - allow all origins in development
app.use((0, cors_1.default)({
    origin: ["http://localhost:3001"],
    credentials: true
}));
// Middleware
app.use(express_1.default.json({ limit: "16kb" }));
app.use(express_1.default.urlencoded({ limit: "16kb", extended: true }));
app.use((0, cookie_parser_1.default)());
// Routes
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const vaultItemRoutes_1 = __importDefault(require("./routes/vaultItemRoutes"));
const passwordRoutes_1 = __importDefault(require("./routes/passwordRoutes"));
const apiError_1 = require("./utils/apiError");
// Health check endpoint
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running" });
});
// Test CORS endpoint
app.get("/test-cors", (_req, res) => {
    res.status(200).json({
        status: "OK",
        message: "CORS is working",
        timestamp: new Date().toISOString()
    });
});
// Main API routes
app.use("/v1/api/user", userRoutes_1.default);
app.use("/v1/api/vault", vaultItemRoutes_1.default);
app.use("/v1/api/password", passwordRoutes_1.default);
// Global error handler
app.use((err, _req, res, _next) => {
    if (err instanceof apiError_1.ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
        });
    }
    console.error("Unhandled error:", err);
    return res.status(500).json({
        success: false,
        message: "Internal server error",
    });
});
//# sourceMappingURL=app.js.map