"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePasswordEndpoint = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const passwordGenerator_1 = require("../utils/passwordGenerator");
exports.generatePasswordEndpoint = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { length = 12, includeUppercase = true, includeLowercase = true, includeNumbers = true, includeSymbols = true, excludeSimilar = false, } = req.body;
    // Validate length
    if (length < 4 || length > 128) {
        throw new apiError_1.ApiError(400, "Password length must be between 4 and 128 characters");
    }
    // Ensure at least one character type is selected
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
        throw new apiError_1.ApiError(400, "At least one character type must be selected");
    }
    const options = {
        length,
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols,
        excludeSimilar,
    };
    try {
        const password = (0, passwordGenerator_1.generatePassword)(options);
        return res.status(200).json(new apiResponse_1.ApiResponse(200, { password }, "Password generated successfully"));
    }
    catch (error) {
        throw new apiError_1.ApiError(500, error.message || "Failed to generate password");
    }
});
//# sourceMappingURL=passwordController.js.map