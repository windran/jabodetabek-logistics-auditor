/**
 * Smart Vehicle Unit Recommender
 */

/**
 * @typedef {Object} VehicleRecommendation
 * @property {string} category
 * @property {string[]} vehicles
 * @property {string} reason
 * @property {string} icon
 * @property {string} priceRange
 */

/**
 * Recommend vehicle based on passengers and luggage count
 * @param {number} passengers
 * @param {number} luggage - Number of large luggage items
 * @returns {VehicleRecommendation}
 */
export function recommendVehicle(passengers, luggage) {
  if (passengers > 5 || luggage > 3) {
    return {
      category: 'Premium / Large',
      vehicles: ['Toyota Innova Zenix', 'Toyota HiAce Premio'],
      reason: passengers > 5
        ? `${passengers} penumpang membutuhkan kendaraan besar`
        : `${luggage} bagasi besar membutuhkan ruang ekstra`,
      icon: '🚐',
      priceRange: 'Rp 850.000 – Rp 1.800.000 / hari',
    };
  }

  return {
    category: 'Standard MPV',
    vehicles: ['Toyota Avanza', 'Mitsubishi Xpander'],
    reason: `${passengers} penumpang & ${luggage} bagasi — MPV standar cukup nyaman`,
    icon: '🚗',
    priceRange: 'Rp 450.000 – Rp 650.000 / hari',
  };
}

/**
 * Get the Sky White booking URL
 * @returns {string}
 */
export function getBookingUrl() {
  return 'https://skywhiterentcar.com/';
}
