/**
 * NATIONAL GRID: GEOSPATIAL INTELLIGENCE ENGINE
 * High-precision coordinate mathematics for tactical response coordination.
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface DistanceResult {
  kilometers: number;
  meters: number;
  miles: number;
  formatted: string;
}

/**
 * THE HAVERSINE PROTOCOL
 * Calculates the great-circle distance between two points on a sphere 
 * given their longitudes and latitudes. Essential for high-accuracy 
 * field deployment.
 */
export const calculatePreciseDistance = (
  origin: Coordinates,
  destination: Coordinates
): DistanceResult => {
  const R = 6371; // Earth's radius in KM
  const dLat = toRad(destination.lat - origin.lat);
  const dLon = toRad(destination.lng - origin.lng);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(origin.lat)) *
      Math.cos(toRad(destination.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return {
    kilometers: parseFloat(d.toFixed(2)),
    meters: parseFloat((d * 1000).toFixed(0)),
    miles: parseFloat((d * 0.621371).toFixed(2)),
    formatted: d < 1 ? `${(d * 1000).toFixed(0)}m` : `${d.toFixed(1)}km`
  };
};

/**
 * RADIUS CHECKER
 * Determines if a field agent is within a specific tactical radius of a mission node.
 */
export const isWithinTacticalRange = (
  agentLoc: Coordinates,
  missionLoc: Coordinates,
  radiusKm: number = 15
): boolean => {
  const distance = calculatePreciseDistance(agentLoc, missionLoc);
  return distance.kilometers <= radiusKm;
};

/**
 * BOUNDING BOX GENERATOR
 * Used for map filtering. Returns coordinates for a square area around a center point.
 */
export const getTacticalBounds = (center: Coordinates, radiusKm: number) => {
  const kmInDeg = 1 / 111.32; // Approx degrees per KM at equator
  return {
    north: center.lat + radiusKm * kmInDeg,
    south: center.lat - radiusKm * kmInDeg,
    east: center.lng + radiusKm * kmInDeg / Math.cos(center.lat * (Math.PI / 180)),
    west: center.lng - radiusKm * kmInDeg / Math.cos(center.lat * (Math.PI / 180)),
  };
};

/**
 * ANGLE CALCULATOR (Bearing)
 * Calculates the compass direction from Agent to Mission Node.
 */
export const getTacticalBearing = (start: Coordinates, end: Coordinates): number => {
  const startLat = toRad(start.lat);
  const startLng = toRad(start.lng);
  const endLat = toRad(end.lat);
  const endLng = toRad(end.lng);

  const dLng = endLng - startLng;
  const y = Math.sin(dLng) * Math.cos(endLat);
  const x = Math.cos(startLat) * Math.sin(endLat) -
            Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
  
  let brng = Math.atan2(y, x);
  brng = toDeg(brng);
  return (brng + 360) % 360;
};

// Internal Conversion Utilities
const toRad = (value: number) => (value * Math.PI) / 180;
const toDeg = (value: number) => (value * 180) / Math.PI;

/**
 * MOCK GRID OFFSET
 * Simulates movement or slight coordinate drift for testing proximity alerts.
 */
export const applyTacticalOffset = (coord: number): number => {
  const offset = (Math.random() - 0.5) * 0.01;
  return coord + offset;
};