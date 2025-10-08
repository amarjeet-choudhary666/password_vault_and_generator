"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async (mongoUri) => {
    try {
        if (!mongoUri) {
            throw new Error("❌ MongoDB URI is missing. Please set MONGO_URI in your environment variables.");
        }
        const connection = await mongoose_1.default.connect(mongoUri, {
            dbName: process.env.DB_NAME || "Password_generator",
            autoIndex: false, // Disable auto-creation of indexes in production
            maxPoolSize: 10, // Limit concurrent DB connections
            serverSelectionTimeoutMS: 5000, // Fail quickly if DB is unreachable
            socketTimeoutMS: 45000,
            family: 4,
        });
        console.log(`✅ MongoDB connected successfully to host: ${connection.connection.host}`);
    }
    catch (error) {
        console.error("❌ MongoDB connection failed.");
        // Avoid logging sensitive connection strings
        if (process.env.NODE_ENV !== "production") {
            console.error("Error details:", error.message);
        }
        // Graceful shutdown
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=index.js.map