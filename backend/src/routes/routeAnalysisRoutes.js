import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { analyzeRouteController } from "../controllers/routeAnalysisController.js";

const router = express.Router();

router.post("/", authenticate, analyzeRouteController);

export default router;