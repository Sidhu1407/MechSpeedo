import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { createAssistanceRequest,  getMyAssistanceRequests } from "../controllers/assistanceController.js";

const router = express.Router();

router.post("/", authenticate, createAssistanceRequest);
router.get("/", authenticate, getMyAssistanceRequests);

export default router;