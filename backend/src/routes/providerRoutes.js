import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { createServiceProvider, getAvailableRequests,acceptAssistanceRequest, updateAssistanceStatus, updateProviderAvailability, getMyProviderProfile, updateAssistanceCost, updateFinalCost} from "../controllers/providerController.js";

const router = express.Router();

router.post("/", authenticate, createServiceProvider);
router.get("/requests", authenticate, getAvailableRequests);
router.put("/requests/:id/accept", authenticate, acceptAssistanceRequest);
router.put("/requests/:id/status", authenticate, updateAssistanceStatus);
router.put("/availability", authenticate, updateProviderAvailability);
router.get("/me", authenticate, getMyProviderProfile);
router.put("/requests/:id/cost", authenticate, updateAssistanceCost);
router.put("/requests/:id/final-cost", authenticate, updateFinalCost);

export default router;