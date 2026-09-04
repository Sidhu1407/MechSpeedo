export const generateOfflinePack = ({
  destination,
  route = {},
  networkGaps = [],
  servicePoints = [],
  fuelStations = [],
  assistancePoints = [],
  emergencyContacts = []
}) => {
  return {
    generatedAt: new Date().toISOString(),

    destination,

    route: {
      distanceKm: route.distanceKm ?? null,
      estimatedDurationMinutes: route.estimatedDurationMinutes ?? null,
      startLocation: route.startLocation ?? null
    },

    networkGaps,

    servicePoints,

    fuelStations,

    assistancePoints,

    emergencyContacts,

    preparationChecklist: [
      "Check fuel level before starting the journey",
      "Check spare tyre and tyre pressure",
      "Check battery condition",
      "Carry an emergency toolkit",
      "Download or save this Offline Pack before entering low-network areas"
    ]
  };
};