import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import assistanceRoutes from "./routes/assistanceRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";
import routeAnalysisRoutes from "./routes/routeAnalysisRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/assistance", assistanceRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/route-analysis", routeAnalysisRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "MechSpeedo backend is running"
  });
});

export default app;