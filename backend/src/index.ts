import { app } from "./app"
import dotenv from "dotenv";
import { connectDB } from "./db";

dotenv.config()

// Start server first, then connect to DB
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    
    // Connect to database after server starts
    if (process.env.MONGO_URI) {
        connectDB(process.env.MONGO_URI)
            .then(() => {
                console.log("✅ Database connected successfully");
            })
            .catch((error: any) => {
                console.log("❌ Database connection failed:", error.message);
                console.log("⚠️  Server running without database connection");
            });
    } else {
        console.log("⚠️  No MONGO_URI found, running without database");
    }
});
