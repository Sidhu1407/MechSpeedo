import { generateOfflinePack } from "../services/offlinePackService.js";

export const createOfflinePack = async (req, res) => {
  try {
    const {
      destination,
      route,
      networkGaps,
      servicePoints,
      fuelStations,
      assistancePoints,
      emergencyContacts
    } = req.body;

    if (!destination) {
      return res.status(400).json({
        success: false,
        message: "destination is required"
      });
    }

    const offlinePack = generateOfflinePack({
      destination,
      route,
      networkGaps,
      servicePoints,
      fuelStations,
      assistancePoints,
      emergencyContacts
    });

    return res.status(200).json({
      success: true,
      offlinePack
    });
  } catch (error) {
    console.error("Offline pack error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while generating the offline pack"
    });
  }
};