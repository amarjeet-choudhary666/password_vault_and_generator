"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passwordController_1 = require("../controllers/passwordController");
const router = (0, express_1.Router)();
// Password generation endpoint (no auth required)
router.post("/generate", passwordController_1.generatePasswordEndpoint);
exports.default = router;
//# sourceMappingURL=passwordRoutes.js.map