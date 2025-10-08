import { Router } from "express";
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  testAuth,
  setupTwoFactor, 
  verifyTwoFactorSetup, 
  disableTwoFactor 
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// Public routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);

// Test authentication route
router.route("/test-auth").get(protect, testAuth);

// Protected 2FA routes
router.route("/2fa/setup").post(protect, setupTwoFactor);
router.route("/2fa/verify").post(protect, verifyTwoFactorSetup);
router.route("/2fa/disable").post(protect, disableTwoFactor);

export default router;