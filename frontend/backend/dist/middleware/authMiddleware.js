"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jwt_1 = require("../utils/jwt");
const apiError_1 = require("../utils/apiError");
const userModel_1 = require("../models/userModel");
const protect = async (req, _res, next) => {
    try {
        let token;
        // Check Authorization header
        if (req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }
        // Fallback to cookies
        else if (req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        }
        if (!token) {
            throw new apiError_1.ApiError(401, "Not authorized, token missing");
        }
        // Verify JWT token
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        if (!decoded || !decoded.userId) {
            throw new apiError_1.ApiError(401, "Invalid token");
        }
        // Fetch user from DB and exclude sensitive fields
        const user = await userModel_1.User.findById(decoded.userId).select("-password -refreshToken");
        if (!user) {
            throw new apiError_1.ApiError(401, "User not found");
        }
        req.user = user;
        next();
    }
    catch (error) {
        // Pass the error to your error handler
        next(error);
    }
};
exports.protect = protect;
//# sourceMappingURL=authMiddleware.js.map