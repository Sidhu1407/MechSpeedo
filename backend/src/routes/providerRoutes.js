import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { createServiceProvider, getAvailableRequests,acceptAssistanceRequest} from "../controllers/providerController.js";

const router = express.Router();

router.post("/", authenticate, createServiceProvider);
router.get("/requests", authenticate, getAvailableRequests);
router.put("/requests/:id/accept", authenticate, acceptAssistanceRequest);

export default router;