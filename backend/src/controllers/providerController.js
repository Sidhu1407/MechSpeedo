import prisma from "../utils/prisma.js";

export const createServiceProvider = async (req, res) => {
  try {
    const {
      providerType,
      businessName,
      phone,
      latitude,
      longitude,
      serviceRadius
    } = req.body;

    if (!providerType) {
      return res.status(400).json({
        success: false,
        message: "Provider type is required"
      });
    }

    const validTypes = ["MECHANIC", "TECHNICIAN", "TOW_PROVIDER"];

    if (!validTypes.includes(providerType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid provider type"
      });
    }

    const existingProvider = await prisma.serviceProvider.findUnique({
      where: {
        userId: req.user.userId
      }
    });

    if (existingProvider) {
      return res.status(409).json({
        success: false,
        message: "Service provider profile already exists"
      });
    }

    const serviceProvider = await prisma.serviceProvider.create({
      data: {
        userId: req.user.userId,
        providerType,
        businessName: businessName || null,
        phone: phone || null,
        latitude:
          latitude !== undefined ? Number(latitude) : null,
        longitude:
          longitude !== undefined ? Number(longitude) : null,
        serviceRadius:
          serviceRadius !== undefined ? Number(serviceRadius) : null
      }
    });

    return res.status(201).json({
      success: true,
      message: "Service provider profile created successfully",
      serviceProvider
    });
  } catch (error) {
    console.error("Create service provider error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while creating the service provider profile"
    });
  }
};
export const getAvailableRequests = async (req, res) => {
  try {
    const provider = await prisma.serviceProvider.findUnique({
      where: {
        userId: req.user.userId
      }
    });

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Service provider profile not found"
      });
    }

    if (!provider.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Provider is currently unavailable"
      });
    }

    const assistanceType = provider.providerType === "TOW_PROVIDER"
      ? "TOW"
      : provider.providerType;

    const requests = await prisma.assistanceRequest.findMany({
      where: {
        status: "PENDING",
        type: assistanceType
      },
      include: {
        vehicle: true,
        user: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.status(200).json({
      success: true,
      requests
    });
  } catch (error) {
    console.error("Get available requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching available requests"
    });
  }
};
export const acceptAssistanceRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await prisma.serviceProvider.findUnique({
      where: {
        userId: req.user.userId
      }
    });

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Service provider profile not found"
      });
    }

    if (!provider.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Provider is currently unavailable"
      });
    }

    const assistanceRequest =
      await prisma.assistanceRequest.findUnique({
        where: {
          id
        }
      });

    if (!assistanceRequest) {
      return res.status(404).json({
        success: false,
        message: "Assistance request not found"
      });
    }

    if (assistanceRequest.status !== "PENDING") {
      return res.status(409).json({
        success: false,
        message: "Assistance request is no longer available"
      });
    }

    const expectedType =
      provider.providerType === "TOW_PROVIDER"
        ? "TOW"
        : provider.providerType;

    if (assistanceRequest.type !== expectedType) {
      return res.status(403).json({
        success: false,
        message: "This request does not match your provider type"
      });
    }

    const updatedRequest =
      await prisma.assistanceRequest.update({
        where: {
          id
        },
        data: {
          providerId: provider.id,
          status: "ACCEPTED"
        },
        include: {
          vehicle: true,
          user: {
            select: {
              id: true,
              name: true,
              phone: true
            }
          },
          provider: true
        }
      });

    return res.status(200).json({
      success: true,
      message: "Assistance request accepted successfully",
      assistanceRequest: updatedRequest
    });
  } catch (error) {
    console.error("Accept assistance request error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while accepting the assistance request"
    });
  }
};
export const updateAssistanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["IN_PROGRESS", "COMPLETED", "CANCELLED"];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assistance status"
      });
    }

    const provider = await prisma.serviceProvider.findUnique({
      where: {
        userId: req.user.userId
      }
    });

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Service provider profile not found"
      });
    }

    const assistanceRequest =
      await prisma.assistanceRequest.findUnique({
        where: {
          id
        }
      });

    if (!assistanceRequest) {
      return res.status(404).json({
        success: false,
        message: "Assistance request not found"
      });
    }

    if (assistanceRequest.providerId !== provider.id) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this assistance request"
      });
    }

    const validTransitions = {
      ACCEPTED: ["IN_PROGRESS", "CANCELLED"],
      IN_PROGRESS: ["COMPLETED", "CANCELLED"]
    };

    const allowedNextStatuses =
      validTransitions[assistanceRequest.status];

    if (!allowedNextStatuses?.includes(status)) {
      return res.status(409).json({
        success: false,
        message: `Cannot change status from ${assistanceRequest.status} to ${status}`
      });
    }

    const updatedRequest =
      await prisma.assistanceRequest.update({
        where: {
          id
        },
        data: {
          status
        },
        include: {
          vehicle: true,
          user: {
            select: {
              id: true,
              name: true,
              phone: true
            }
          },
          provider: true
        }
      });

    return res.status(200).json({
      success: true,
      message: "Assistance request status updated successfully",
      assistanceRequest: updatedRequest
    });
  } catch (error) {
    console.error("Update assistance status error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the assistance status"
    });
  }
};
export const updateProviderAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;

    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isAvailable must be a boolean"
      });
    }

    const provider = await prisma.serviceProvider.findUnique({
      where: {
        userId: req.user.userId
      }
    });

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Service provider profile not found"
      });
    }

    const updatedProvider = await prisma.serviceProvider.update({
      where: {
        id: provider.id
      },
      data: {
        isAvailable
      }
    });

    return res.status(200).json({
      success: true,
      message: `Provider is now ${
        isAvailable ? "available" : "unavailable"
      }`,
      serviceProvider: updatedProvider
    });
  } catch (error) {
    console.error("Update provider availability error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating provider availability"
    });
  }
};
export const getMyProviderProfile = async (req, res) => {
  try {
    const serviceProvider = await prisma.serviceProvider.findUnique({
      where: {
        userId: req.user.userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true
          }
        }
      }
    });

    if (!serviceProvider) {
      return res.status(404).json({
        success: false,
        message: "Service provider profile not found"
      });
    }

    return res.status(200).json({
      success: true,
      serviceProvider
    });
  } catch (error) {
    console.error("Get provider profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching provider profile"
    });
  }
};