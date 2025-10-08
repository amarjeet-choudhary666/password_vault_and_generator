"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVaultItem = exports.updateVaultItem = exports.getVaultItem = exports.getVaultItems = exports.createVaultItem = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const vaultItem_1 = require("../models/vaultItem");
// Create a new vault item
exports.createVaultItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { title, username, password, url, notes } = req.body;
    if (!req.user)
        throw new apiError_1.ApiError(401, "Unauthorized");
    if (!title || !username || !password)
        throw new apiError_1.ApiError(400, "Title, username, and password are required");
    const vaultItem = await vaultItem_1.VaultItem.create({
        userId: req.user._id,
        title,
        username,
        password, // Encrypted client-side
        url,
        notes,
    });
    return res.status(201).json(new apiResponse_1.ApiResponse(201, vaultItem, "Vault item created successfully"));
});
// Get all vault items (with optional search)
exports.getVaultItems = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user)
        throw new apiError_1.ApiError(401, "Unauthorized");
    const { search } = req.query;
    const query = { userId: req.user._id };
    if (search && typeof search === "string") {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } },
            { url: { $regex: search, $options: "i" } },
        ];
    }
    const vaultItems = await vaultItem_1.VaultItem.find(query).sort({ createdAt: -1 });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, vaultItems, "Vault items retrieved successfully"));
});
// Get a single vault item by ID
exports.getVaultItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user)
        throw new apiError_1.ApiError(401, "Unauthorized");
    const { id } = req.params;
    const vaultItem = await vaultItem_1.VaultItem.findOne({ _id: id, userId: req.user._id });
    if (!vaultItem)
        throw new apiError_1.ApiError(404, "Vault item not found");
    return res.status(200).json(new apiResponse_1.ApiResponse(200, vaultItem, "Vault item retrieved successfully"));
});
// Update a vault item
exports.updateVaultItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user)
        throw new apiError_1.ApiError(401, "Unauthorized");
    const { id } = req.params;
    const { title, username, password, url, notes } = req.body;
    const vaultItem = await vaultItem_1.VaultItem.findOne({ _id: id, userId: req.user._id });
    if (!vaultItem)
        throw new apiError_1.ApiError(404, "Vault item not found");
    const updatedVaultItem = await vaultItem_1.VaultItem.findByIdAndUpdate(id, {
        title: title ?? vaultItem.title,
        username: username ?? vaultItem.username,
        password: password ?? vaultItem.password,
        url: url ?? vaultItem.url,
        notes: notes ?? vaultItem.notes,
    }, { new: true });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, updatedVaultItem, "Vault item updated successfully"));
});
// Delete a vault item
exports.deleteVaultItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user)
        throw new apiError_1.ApiError(401, "Unauthorized");
    const { id } = req.params;
    const vaultItem = await vaultItem_1.VaultItem.findOne({ _id: id, userId: req.user._id });
    if (!vaultItem)
        throw new apiError_1.ApiError(404, "Vault item not found");
    await vaultItem_1.VaultItem.findByIdAndDelete(id);
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, "Vault item deleted successfully"));
});
//# sourceMappingURL=vaultItemController.js.map