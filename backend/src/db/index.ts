import mongoose from "mongoose";

export const connectDB = async (mongoUri: string) => {
    try {
        if (!mongoUri) {
            throw new Error("❌ MongoDB URI is missing. Please set MONGO_URI in your environment variables.");
        }

        const connection = await mongoose.connect(mongoUri, {
            dbName: process.env.DB_NAME || "Password_generator",
            autoIndex: false, // Disable auto-creation of indexes in production
            maxPoolSize: 10, // Limit concurrent DB connections
            serverSelectionTimeoutMS: 5000, // Fail quickly if DB is unreachable
            socketTimeoutMS: 45000,
            family: 4,
        });

        console.log(`✅ MongoDB connected successfully to host: ${connection.connection.host}`);
    } catch (error: any) {
        console.error("❌ MongoDB connection failed.");

        // Avoid logging sensitive connection strings
        if (process.env.NODE_ENV !== "production") {
            console.error("Error details:", error.message);
        }

        // Graceful shutdown
        process.exit(1);
    }
};
