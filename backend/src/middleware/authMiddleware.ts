import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { ApiError } from "../utils/apiError";
import { User } from "../models/userModel";

export const protect = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // Check Authorization header
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } 
    // Fallback to cookies
    else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new ApiError(401, "Not authorized, token missing");
    }

    // Verify JWT token
    const decoded = verifyAccessToken(token) as { userId: string };

    if (!decoded || !decoded.userId) {
      throw new ApiError(401, "Invalid token");
    }

    // Fetch user from DB and exclude sensitive fields
    const user = await User.findById(decoded.userId).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    req.user = user;

    next();
  } catch (error) {
    // Pass the error to your error handler
    next(error);
  }
};
