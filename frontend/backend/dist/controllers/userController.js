"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiError_1 = require("../utils/apiError");
const userModel_1 = require("../models/userModel");
const apiResponse_1 = require("../utils/apiResponse");
const jwt_1 = require("../utils/jwt");
const crypto_1 = __importDefault(require("crypto"));
exports.registerUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        throw new apiError_1.ApiError(401, "All fields are required");
    }
    const existingUser = await userModel_1.User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
        throw new apiError_1.ApiError(409, "User already exists");
    }
    const encryptionSalt = crypto_1.default.randomBytes(16).toString("base64");
    const user = await userModel_1.User.create({
        fullName,
        email: email.toLowerCase(),
        password,
        encryptionSalt,
    });
    if (!user) {
        throw new apiError_1.ApiError(500, "Failed to create user");
    }
    const createdUser = await userModel_1.User.findById(user._id).select("-password -refreshToken");
    return res.status(200).json(new apiResponse_1.ApiResponse(200, createdUser, "User created successfully"));
});
exports.loginUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new apiError_1.ApiError(401, "All fields are required");
    }
    const user = await userModel_1.User.findOne({ email: email.toLowerCase() });
    if (!user) {
        throw new apiError_1.ApiError(404, "User does not exist with this email");
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new apiError_1.ApiError(401, "Invalid credentials");
    }
    const accessToken = (0, jwt_1.generateAccessToken)(String(user._id));
    const refreshToken = (0, jwt_1.generateRefreshToken)(String(user._id));
    const loggedInUser = await userModel_1.User.findById(user._id).select("-password -refreshToken");
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, {
        loggedInUser,
        accessToken,
        refreshToken,
        encryptionSalt: user.encryptionSalt,
    }, "User logged in successfully"));
});
exports.logoutUser = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, "User logged out successfully"));
});
//# sourceMappingURL=userController.js.map