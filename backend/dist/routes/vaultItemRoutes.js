"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vaultItemController_1 = require("../controllers/vaultItemController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// All vault item routes require authentication
router.use(authMiddleware_1.protect);
// CRUD operations for vault items
router.post("/", vaultItemController_1.createVaultItem);
router.get("/", vaultItemController_1.getVaultItems);
router.get("/:id", vaultItemController_1.getVaultItem);
router.put("/:id", vaultItemController_1.updateVaultItem);
router.delete("/:id", vaultItemController_1.deleteVaultItem);
exports.default = router;
//# sourceMappingURL=vaultItemRoutes.js.map