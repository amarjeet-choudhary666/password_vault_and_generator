"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
dotenv_1.default.config();
// Start server first, then connect to DB
const PORT = process.env.PORT || 8000;
app_1.app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    // Connect to database after server starts
    if (process.env.MONGO_URI) {
        (0, db_1.connectDB)(process.env.MONGO_URI)
            .then(() => {
            console.log("✅ Database connected successfully");
        })
            .catch((error) => {
            console.log("❌ Database connection failed:", error.message);
            console.log("⚠️  Server running without database connection");
        });
    }
    else {
        console.log("⚠️  No MONGO_URI found, running without database");
    }
});
//# sourceMappingURL=index.js.map