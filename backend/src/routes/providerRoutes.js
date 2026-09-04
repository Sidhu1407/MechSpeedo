import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { createServiceProvider, getAvailableRequests,acceptAssistanceRequest, updateAssistanceStatus, updateProviderAvailability} from "../controllers/providerController.js";

const router = express.Router();

router.post("/", authenticate, createServiceProvider);
router.get("/requests", authenticate, getAvailableRequests);
router.put("/requests/:id/accept", authenticate, acceptAssistanceRequest);
router.put("/requests/:id/status", authenticate, updateAssistanceStatus);
router.put("/availability", authenticate, updateProviderAvailability);

export default router;