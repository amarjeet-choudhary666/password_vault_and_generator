"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.route("/register").post(userController_1.registerUser);
router.route("/login").post(userController_1.loginUser);
router.route("/logout").post(userController_1.logoutUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map