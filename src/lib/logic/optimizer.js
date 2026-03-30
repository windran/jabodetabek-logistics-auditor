/**
 * Multi-Stop Route Optimizer
 * Finds the most efficient route through 3-5 stops minimizing toll + fuel cost.
 */

import {
  findCheapestTollPath,
  calculateFuelCost,
  getAllTollGates,
  FUEL_PRICE_PER_LITER,
  KM_PER_LITER,
} from './tollDatabase.js';

/**
 * @typedef {Object} RouteResult
 * @property {string[]} orderedStops - The optimized order of stops
 * @property {{ from: string, to: string, tollCost: number, fuelCost: number, distanceKm: number, path: string[] }[]} legs
 * @property {number} totalTollCost
 * @property {number} totalFuelCost
 * @property {number} totalCost
 * @property {number} totalDistanceKm
 */

/**
 * Calculate cost between two stops
 * @param {string} from
 * @param {string} to
 * @returns {{ tollCost: number, fuelCost: number, distanceKm: number, path: string[] } | null}
 */
function calcLegCost(from, to) {
  const result = findCheapestTollPath(from, to);
  if (!result) {
    // Fallback: estimate with average distance
    const estimatedKm = 25;
    return {
      tollCost: 15000,
      fuelCost: calculateFuelCost(estimatedKm),
      distanceKm: estimatedKm,
      path: [from, to],
    };
  }
  return {
    tollCost: result.totalPrice,
    fuelCost: calculateFuelCost(result.totalDistance),
    distanceKm: result.totalDistance,
    path: result.path,
  };
}

/**
 * Generate all permutations of an array
 * @template T
 * @param {T[]} arr
 * @returns {T[][]}
 */
function permutations(arr) {
  if (arr.length <= 1) return [arr];
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const perm of permutations(rest)) {
      result.push([arr[i], ...perm]);
    }
  }
  return result;
}

/**
 * Find the most efficient route through all given stops.
 * First stop is treated as start, last as destination.
 * Intermediate stops are reordered for efficiency.
 * @param {string[]} stops - Array of 3-5 location names
 * @returns {RouteResult}
 */
export function optimizeRoute(stops) {
  if (stops.length < 2) {
    throw new Error('Need at least 2 stops');
  }

  const start = stops[0];
  const end = stops[stops.length - 1];
  const midStops = stops.slice(1, -1);

  let bestRoute = null;
  let bestCost = Infinity;

  // For 1-3 intermediate stops, brute-force permutation is fine (max 6 permutations)
  const midPerms = midStops.length > 0 ? permutations(midStops) : [[]];

  for (const perm of midPerms) {
    const ordered = [start, ...perm, end];
    let totalToll = 0;
    let totalFuel = 0;
    let totalDist = 0;
    const legs = [];
    let valid = true;

    for (let i = 0; i < ordered.length - 1; i++) {
      const leg = calcLegCost(ordered[i], ordered[i + 1]);
      if (!leg) {
        valid = false;
        break;
      }
      totalToll += leg.tollCost;
      totalFuel += leg.fuelCost;
      totalDist += leg.distanceKm;
      legs.push({
        from: ordered[i],
        to: ordered[i + 1],
        ...leg,
      });
    }

    if (!valid) continue;

    const totalCost = totalToll + totalFuel;
    if (totalCost < bestCost) {
      bestCost = totalCost;
      bestRoute = {
        orderedStops: ordered,
        legs,
        totalTollCost: totalToll,
        totalFuelCost: totalFuel,
        totalCost,
        totalDistanceKm: totalDist,
      };
    }
  }

  if (!bestRoute) {
    // Fallback: just use the original order
    const ordered = [...stops];
    const legs = [];
    let totalToll = 0;
    let totalFuel = 0;
    let totalDist = 0;

    for (let i = 0; i < ordered.length - 1; i++) {
      const leg = calcLegCost(ordered[i], ordered[i + 1]);
      const legData = leg || { tollCost: 15000, fuelCost: 29000, distanceKm: 25, path: [ordered[i], ordered[i + 1]] };
      totalToll += legData.tollCost;
      totalFuel += legData.fuelCost;
      totalDist += legData.distanceKm;
      legs.push({ from: ordered[i], to: ordered[i + 1], ...legData });
    }

    bestRoute = {
      orderedStops: ordered,
      legs,
      totalTollCost: totalToll,
      totalFuelCost: totalFuel,
      totalCost: totalToll + totalFuel,
      totalDistanceKm: totalDist,
    };
  }

  return bestRoute;
}

/**
 * Get a cost summary string
 * @param {RouteResult} route
 * @returns {string}
 */
export function formatCostSummary(route) {
  return `Rp ${route.totalCost.toLocaleString('id-ID')} (Toll: Rp ${route.totalTollCost.toLocaleString('id-ID')} + BBM: Rp ${route.totalFuelCost.toLocaleString('id-ID')})`;
}

/** Re-export for convenience */
export { getAllTollGates, FUEL_PRICE_PER_LITER, KM_PER_LITER };
