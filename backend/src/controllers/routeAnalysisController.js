import { analyzeRoute } from "../services/routeAnalysisService.js";

export const analyzeRouteController = async (req, res) => {
  try {
    const {
      distanceKm,
      networkGaps,
      serviceGaps,
      fuelGaps
    } = req.body;

    if (distanceKm === undefined || distanceKm === null) {
      return res.status(400).json({
        success: false,
        message: "distanceKm is required"
      });
    }

    if (Number.isNaN(Number(distanceKm)) || Number(distanceKm) < 0) {
      return res.status(400).json({
        success: false,
        message: "distanceKm must be a valid non-negative number"
      });
    }

    const result = analyzeRoute({
      distanceKm: Number(distanceKm),
      networkGaps,
      serviceGaps,
      fuelGaps
    });

    return res.status(200).json({
      success: true,
      analysis: result
    });
  } catch (error) {
    console.error("Route analysis error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while analyzing the route"
    });
  }
};