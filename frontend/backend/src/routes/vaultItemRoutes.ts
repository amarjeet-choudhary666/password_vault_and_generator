import { Router } from "express";
import {
  createVaultItem,
  getVaultItems,
  getVaultItem,
  updateVaultItem,
  deleteVaultItem,
} from "../controllers/vaultItemController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// All vault item routes require authentication
router.use(protect);

// CRUD operations for vault items
router.post("/", createVaultItem);
router.get("/", getVaultItems);
router.get("/:id", getVaultItem);
router.put("/:id", updateVaultItem);
router.delete("/:id", deleteVaultItem);

export default router;