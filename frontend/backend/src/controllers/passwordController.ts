import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { generatePassword, PasswordOptions } from "../utils/passwordGenerator";

export const generatePasswordEndpoint = asyncHandler(async (req: Request, res: Response) => {
  const {
    length = 12,
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = true,
    excludeSimilar = false,
  } = req.body;

  // Validate length
  if (length < 4 || length > 128) {
    throw new ApiError(400, "Password length must be between 4 and 128 characters");
  }

  // Ensure at least one character type is selected
  if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
    throw new ApiError(400, "At least one character type must be selected");
  }

  const options: PasswordOptions = {
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    excludeSimilar,
  };

  try {
    const password = generatePassword(options);
    
    return res.status(200).json(
      new ApiResponse(200, { password }, "Password generated successfully")
    );
  } catch (error: any) {
    throw new ApiError(500, error.message || "Failed to generate password");
  }
});