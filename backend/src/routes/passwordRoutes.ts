import { Router } from "express";
import { generatePasswordEndpoint } from "../controllers/passwordController";

const router = Router();

// Password generation endpoint (no auth required)
router.post("/generate", generatePasswordEndpoint);

export default router;