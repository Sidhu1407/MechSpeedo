import prisma from "../utils/prisma.js";

export const createAssistanceRequest = async (req, res) => {
  try {
    const {
      vehicleId,
      type,
      problemDescription,
      latitude,
      longitude,
      estimatedCost
    } = req.body;

    if (
      !vehicleId ||
      !type ||
      !problemDescription ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Vehicle, assistance type, problem description and location are required"
      });
    }

    const validTypes = ["MECHANIC", "TECHNICIAN", "TOW"];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assistance type"
      });
    }

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
        userId: req.user.userId
      }
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }

    const assistanceRequest = await prisma.assistanceRequest.create({
      data: {
        userId: req.user.userId,
        vehicleId,
        type,
        problemDescription,
        latitude: Number(latitude),
        longitude: Number(longitude),
        estimatedCost:
          estimatedCost !== undefined
            ? Number(estimatedCost)
            : null
      }
    });

    return res.status(201).json({
      success: true,
      message: "Assistance request created successfully",
      assistanceRequest
    });
  } catch (error) {
    console.error("Create assistance request error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the assistance request"
    });
  }
};
export const getMyAssistanceRequests = async (req, res) => {
  try {
    const assistanceRequests = await prisma.assistanceRequest.findMany({
      where: {
        userId: req.user.userId
      },
      include: {
        vehicle: true,
        provider: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.status(200).json({
      success: true,
      assistanceRequests
    });
  } catch (error) {
    console.error("Get assistance requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching assistance requests"
    });
  }
};