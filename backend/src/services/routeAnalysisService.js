export const analyzeRoute = ({
  distanceKm,
  networkGaps = [],
  serviceGaps = [],
  fuelGaps = []
}) => {
  const vulnerabilities = [];

  if (distanceKm >= 100) {
    vulnerabilities.push({
      type: "LONG_DISTANCE",
      severity: "MEDIUM",
      message: "Long journey detected. Prepare essential vehicle and emergency supplies."
    });
  }

  if (networkGaps.length > 0) {
    vulnerabilities.push({
      type: "LOW_NETWORK",
      severity: "HIGH",
      message: "Low or no-network areas detected along the route."
    });
  }

  if (serviceGaps.length > 0) {
    vulnerabilities.push({
      type: "SERVICE_GAP",
      severity: "HIGH",
      message: "Long stretches without nearby vehicle service support detected."
    });
  }

  if (fuelGaps.length > 0) {
    vulnerabilities.push({
      type: "FUEL_GAP",
      severity: "MEDIUM",
      message: "Long stretches without nearby fuel stations detected."
    });
  }

  let riskLevel = "LOW";

  if (vulnerabilities.some((item) => item.severity === "HIGH")) {
    riskLevel = "HIGH";
  } else if (vulnerabilities.some((item) => item.severity === "MEDIUM")) {
    riskLevel = "MEDIUM";
  }

  return {
    distanceKm,
    riskLevel,
    vulnerabilities,
    recommendedPreparation: {
      fuelCheck: fuelGaps.length > 0,
      emergencyKit: vulnerabilities.length > 0,
      offlinePack: networkGaps.length > 0,
      vehicleCheck: distanceKm >= 100
    }
  };
};