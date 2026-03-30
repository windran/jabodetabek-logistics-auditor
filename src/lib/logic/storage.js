/**
 * Local Storage Manager — saves last 3 calculated routes
 */

const STORAGE_KEY = 'skywhite_route_history';
const MAX_HISTORY = 3;

/**
 * @typedef {Object} SavedRoute
 * @property {string} id
 * @property {string[]} stops
 * @property {number} totalCost
 * @property {number} totalDistanceKm
 * @property {number} totalTollCost
 * @property {number} totalFuelCost
 * @property {string} timestamp
 */

/**
 * Get storage API (chrome.storage.local or fallback to localStorage)
 */
function getStorage() {
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    return {
      async get(key) {
        return new Promise((resolve) => {
          chrome.storage.local.get([key], (result) => resolve(result[key]));
        });
      },
      async set(key, value) {
        return new Promise((resolve) => {
          chrome.storage.local.set({ [key]: value }, resolve);
        });
      },
    };
  }
  // Fallback for development
  return {
    async get(key) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : undefined;
      } catch {
        return undefined;
      }
    },
    async set(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
  };
}

/**
 * Save a route to history
 * @param {import('./optimizer.js').RouteResult} route
 */
export async function saveRoute(route) {
  const storage = getStorage();
  const history = (await storage.get(STORAGE_KEY)) || [];

  /** @type {SavedRoute} */
  const entry = {
    id: crypto.randomUUID(),
    stops: route.orderedStops,
    totalCost: route.totalCost,
    totalDistanceKm: route.totalDistanceKm,
    totalTollCost: route.totalTollCost,
    totalFuelCost: route.totalFuelCost,
    timestamp: new Date().toISOString(),
  };

  history.unshift(entry);
  if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;

  await storage.set(STORAGE_KEY, history);
  return entry;
}

/**
 * Get route history
 * @returns {Promise<SavedRoute[]>}
 */
export async function getRouteHistory() {
  const storage = getStorage();
  return (await storage.get(STORAGE_KEY)) || [];
}

/**
 * Clear all route history
 */
export async function clearHistory() {
  const storage = getStorage();
  await storage.set(STORAGE_KEY, []);
}
