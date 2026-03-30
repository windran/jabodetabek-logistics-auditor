/**
 * Jabodetabek Toll Database — 2026 Estimated Prices (Golongan I)
 * All prices in IDR (Rupiah).
 */

/** @typedef {{ from: string, to: string, price: number, distanceKm: number }} TollSegment */

/** @type {TollSegment[]} */
export const TOLL_SEGMENTS = [
  // === JAGORAWI (Jakarta – Bogor – Ciawi) ===
  { from: 'Cawang', to: 'Cibubur', price: 11000, distanceKm: 12 },
  { from: 'Cibubur', to: 'Cimanggis', price: 7500, distanceKm: 5 },
  { from: 'Cimanggis', to: 'Citeureup', price: 10500, distanceKm: 9 },
  { from: 'Citeureup', to: 'Sentul', price: 5500, distanceKm: 4 },
  { from: 'Sentul', to: 'Bogor', price: 12000, distanceKm: 14 },
  { from: 'Bogor', to: 'Ciawi', price: 5000, distanceKm: 5 },

  // === JORR (Jakarta Outer Ring Road) ===
  { from: 'Pondok Pinang', to: 'TMII', price: 16000, distanceKm: 22 },
  { from: 'TMII', to: 'Cikunir', price: 11000, distanceKm: 10 },
  { from: 'Cikunir', to: 'Jatiasih', price: 8000, distanceKm: 7 },
  { from: 'Jatiasih', to: 'Jatiwarna', price: 5500, distanceKm: 5 },
  { from: 'Pondok Pinang', to: 'Ulujami', price: 5000, distanceKm: 4 },
  { from: 'Ulujami', to: 'Kebon Jeruk', price: 12500, distanceKm: 12 },
  { from: 'Kebon Jeruk', to: 'Cengkareng', price: 10000, distanceKm: 9 },
  { from: 'Cengkareng', to: 'Pluit', price: 11500, distanceKm: 11 },
  { from: 'Pluit', to: 'Ancol', price: 8500, distanceKm: 6 },
  { from: 'Ancol', to: 'Cakung', price: 14500, distanceKm: 13 },

  // === Jakarta – Tangerang ===
  { from: 'Tomang', to: 'Kebon Jeruk', price: 5500, distanceKm: 5 },
  { from: 'Kebon Jeruk', to: 'Tangerang', price: 9000, distanceKm: 10 },
  { from: 'Tangerang', to: 'Bitung', price: 7500, distanceKm: 7 },

  // === Jakarta – Cikampek ===
  { from: 'Cawang', to: 'Bekasi Timur', price: 15000, distanceKm: 17 },
  { from: 'Bekasi Timur', to: 'Cikarang Barat', price: 17500, distanceKm: 15 },
  { from: 'Cikarang Barat', to: 'Cikarang Utama', price: 10500, distanceKm: 9 },
  { from: 'Cikarang Utama', to: 'Karawang Barat', price: 19500, distanceKm: 18 },
  { from: 'Karawang Barat', to: 'Karawang Timur', price: 7500, distanceKm: 7 },
  { from: 'Karawang Timur', to: 'Cikampek', price: 12000, distanceKm: 12 },

  // === BSD / Serpong ===
  { from: 'Pondok Pinang', to: 'Pondok Aren', price: 7000, distanceKm: 7 },
  { from: 'Pondok Aren', to: 'BSD', price: 6000, distanceKm: 6 },
  { from: 'BSD', to: 'Serpong', price: 5000, distanceKm: 4 },

  // === Depok – Antasari ===
  { from: 'Antasari', to: 'Brigif', price: 12500, distanceKm: 10 },
  { from: 'Brigif', to: 'Sawangan', price: 18000, distanceKm: 15 },
  { from: 'Sawangan', to: 'Depok', price: 8500, distanceKm: 8 },

  // === Jakarta Elevated / Dalam Kota ===
  { from: 'Semanggi', to: 'Cawang', price: 9500, distanceKm: 8 },
  { from: 'Semanggi', to: 'Tomang', price: 10000, distanceKm: 9 },
  { from: 'Cawang', to: 'Tanjung Priok', price: 16500, distanceKm: 15 },
  { from: 'Tomang', to: 'Pluit', price: 12000, distanceKm: 12 },
];

/** Fuel price per liter (Pertamax estimate 2026) */
export const FUEL_PRICE_PER_LITER = 13900;

/** Average fuel consumption for MPV (km per liter) */
export const KM_PER_LITER = 12;

/**
 * Build adjacency map from segments (bidirectional)
 * @returns {Map<string, {to: string, price: number, distanceKm: number}[]>}
 */
export function buildTollGraph() {
  const graph = new Map();
  for (const seg of TOLL_SEGMENTS) {
    if (!graph.has(seg.from)) graph.set(seg.from, []);
    if (!graph.has(seg.to)) graph.set(seg.to, []);
    graph.get(seg.from).push({ to: seg.to, price: seg.price, distanceKm: seg.distanceKm });
    graph.get(seg.to).push({ to: seg.from, price: seg.price, distanceKm: seg.distanceKm });
  }
  return graph;
}

/**
 * Get all unique toll gate names
 * @returns {string[]}
 */
export function getAllTollGates() {
  const gates = new Set();
  for (const seg of TOLL_SEGMENTS) {
    gates.add(seg.from);
    gates.add(seg.to);
  }
  return [...gates].sort();
}

/**
 * Find cheapest path between two toll gates using Dijkstra
 * @param {string} from
 * @param {string} to
 * @returns {{ path: string[], totalPrice: number, totalDistance: number } | null}
 */
export function findCheapestTollPath(from, to) {
  const graph = buildTollGraph();
  if (!graph.has(from) || !graph.has(to)) return null;

  const dist = new Map();
  const prev = new Map();
  const visited = new Set();

  for (const node of graph.keys()) {
    dist.set(node, Infinity);
  }
  dist.set(from, 0);

  while (true) {
    let current = null;
    let minDist = Infinity;
    for (const [node, d] of dist) {
      if (!visited.has(node) && d < minDist) {
        minDist = d;
        current = node;
      }
    }
    if (current === null || current === to) break;
    visited.add(current);

    for (const edge of graph.get(current) || []) {
      const newDist = dist.get(current) + edge.price;
      if (newDist < dist.get(edge.to)) {
        dist.set(edge.to, newDist);
        prev.set(edge.to, current);
      }
    }
  }

  if (dist.get(to) === Infinity) return null;

  const path = [];
  let node = to;
  while (node) {
    path.unshift(node);
    node = prev.get(node);
  }

  let totalDistance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const edges = graph.get(path[i]);
    const edge = edges.find(e => e.to === path[i + 1]);
    if (edge) totalDistance += edge.distanceKm;
  }

  return { path, totalPrice: dist.get(to), totalDistance };
}

/**
 * Calculate fuel cost for a given distance
 * @param {number} distanceKm
 * @returns {number}
 */
export function calculateFuelCost(distanceKm) {
  const litersNeeded = distanceKm / KM_PER_LITER;
  return Math.round(litersNeeded * FUEL_PRICE_PER_LITER);
}
