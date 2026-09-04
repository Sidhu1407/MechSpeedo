import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { createVehicle, getMyVehicles, updateVehicle, deleteVehicle } from "../controllers/vehicleController.js";

const router = express.Router();

router.post("/", authenticate, createVehicle);
router.get("/", authenticate, getMyVehicles);
router.put("/:id", authenticate, updateVehicle);
router.delete("/:id", authenticate, deleteVehicle);

export default router;