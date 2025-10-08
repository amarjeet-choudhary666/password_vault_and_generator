/// <reference path="../types/express.d.ts" />
import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { VaultItem } from "../models/vaultItem";

// Using global Request type with user property

// Create a new vault item
export const createVaultItem = asyncHandler(async (req: Request, res: Response) => {
  const { title, username, password, url, notes } = req.body;

  if (!req.user) throw new ApiError(401, "Unauthorized");
  if (!title || !username || !password) throw new ApiError(400, "Title, username, and password are required");

  const vaultItem = await VaultItem.create({
    userId: req.user._id,
    title,
    username,
    password, // Encrypted client-side
    url,
    notes,
  });

  return res.status(201).json(new ApiResponse(201, vaultItem, "Vault item created successfully"));
});

// Get all vault items (with optional search)
export const getVaultItems = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const { search } = req.query;
  const query: any = { userId: req.user._id };

  if (search && typeof search === "string") {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { username: { $regex: search, $options: "i" } },
      { url: { $regex: search, $options: "i" } },
    ];
  }

  const vaultItems = await VaultItem.find(query).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, vaultItems, "Vault items retrieved successfully"));
});

// Get a single vault item by ID
export const getVaultItem = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const { id } = req.params;
  const vaultItem = await VaultItem.findOne({ _id: id, userId: req.user._id });

  if (!vaultItem) throw new ApiError(404, "Vault item not found");

  return res.status(200).json(new ApiResponse(200, vaultItem, "Vault item retrieved successfully"));
});

// Update a vault item
export const updateVaultItem = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const { id } = req.params;
  const { title, username, password, url, notes } = req.body;

  const vaultItem = await VaultItem.findOne({ _id: id, userId: req.user._id });
  if (!vaultItem) throw new ApiError(404, "Vault item not found");

  const updatedVaultItem = await VaultItem.findByIdAndUpdate(
    id,
    {
      title: title ?? vaultItem.title,
      username: username ?? vaultItem.username,
      password: password ?? vaultItem.password,
      url: url ?? vaultItem.url,
      notes: notes ?? vaultItem.notes,
    },
    { new: true }
  );

  return res.status(200).json(new ApiResponse(200, updatedVaultItem, "Vault item updated successfully"));
});

// Delete a vault item
export const deleteVaultItem = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const { id } = req.params;
  const vaultItem = await VaultItem.findOne({ _id: id, userId: req.user._id });
  if (!vaultItem) throw new ApiError(404, "Vault item not found");

  await VaultItem.findByIdAndDelete(id);

  return res.status(200).json(new ApiResponse(200, null, "Vault item deleted successfully"));
});

