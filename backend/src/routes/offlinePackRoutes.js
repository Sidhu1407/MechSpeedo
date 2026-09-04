import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { createOfflinePack } from "../controllers/offlinePackController.js";

const router = express.Router();

router.post("/", authenticate, createOfflinePack);

export default router;