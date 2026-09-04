import prisma from "../utils/prisma.js";

export const createVehicle = async (req, res) => {
  try {
    const {
      make,
      model,
      year,
      registrationNumber
    } = req.body;

    if (!make || !model) {
      return res.status(400).json({
        success: false,
        message: "Make and model are required"
      });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        userId: req.user.userId,
        make,
        model,
        year: year ? Number(year) : null,
        registrationNumber: registrationNumber || null
      }
    });

    return res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      vehicle
    });
  } catch (error) {
    console.error("Create vehicle error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while adding the vehicle"
    });
  }
};
export const getMyVehicles = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        userId: req.user.userId
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.status(200).json({
      success: true,
      vehicles
    });
  } catch (error) {
    console.error("Get vehicles error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching vehicles"
    });
  }
};
export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      make,
      model,
      year,
      registrationNumber
    } = req.body;

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id,
        userId: req.user.userId
      }
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: {
        id
      },
      data: {
        ...(make !== undefined && { make }),
        ...(model !== undefined && { model }),
        ...(year !== undefined && {
          year: year === null ? null : Number(year)
        }),
        ...(registrationNumber !== undefined && {
          registrationNumber: registrationNumber || null
        })
      }
    });

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      vehicle: updatedVehicle
    });
  } catch (error) {
    console.error("Update vehicle error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the vehicle"
    });
  }
};
export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id,
        userId: req.user.userId
      }
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }

    await prisma.vehicle.delete({
      where: {
        id
      }
    });

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully"
    });
  } catch (error) {
    console.error("Delete vehicle error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the vehicle"
    });
  }
};