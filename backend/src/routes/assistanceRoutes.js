import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { createAssistanceRequest,  getMyAssistanceRequests, cancelAssistanceRequest } from "../controllers/assistanceController.js";

const router = express.Router();

router.post("/", authenticate, createAssistanceRequest);
router.get("/", authenticate, getMyAssistanceRequests);
router.put("/:id/cancel", authenticate, cancelAssistanceRequest);

export default router;