<script>
  import { FUEL_PRICE_PER_LITER, KM_PER_LITER } from '$lib/logic/tollDatabase.js';

  /** @type {{ totalDistanceKm: number, totalTollCost: number, totalFuelCost: number }} */
  let { totalDistanceKm = 0, totalTollCost = 0, totalFuelCost = 0 } = $props();

  let litersUsed = $derived((totalDistanceKm / KM_PER_LITER).toFixed(1));

  function formatRp(n) {
    return 'Rp ' + n.toLocaleString('id-ID');
  }
</script>

<div class="card-bento">
  <div class="flex items-center gap-2 mb-3">
    <div class="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
      <svg class="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    </div>
    <h3 class="text-sm font-semibold text-surface-100">Audit Tol & BBM</h3>
  </div>

  <div class="space-y-2.5">
    <!-- Toll Breakdown -->
    <div class="flex items-center justify-between p-2.5 rounded-lg bg-surface-800/60">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-amber-400"></div>
        <span class="text-xs text-surface-300">Biaya Tol (Gol. I)</span>
      </div>
      <span class="text-sm font-mono font-semibold text-amber-400">{formatRp(totalTollCost)}</span>
    </div>

    <!-- Fuel Breakdown -->
    <div class="flex items-center justify-between p-2.5 rounded-lg bg-surface-800/60">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-emerald-400"></div>
        <span class="text-xs text-surface-300">Biaya BBM (Pertamax)</span>
      </div>
      <span class="text-sm font-mono font-semibold text-emerald-400">{formatRp(totalFuelCost)}</span>
    </div>

    <!-- Fuel Details -->
    <div class="grid grid-cols-3 gap-2 pt-1">
      <div class="text-center p-2 rounded-lg bg-surface-800/40">
        <p class="text-[10px] text-surface-500 uppercase">Jarak</p>
        <p class="text-xs font-mono font-semibold text-surface-200">{totalDistanceKm} km</p>
      </div>
      <div class="text-center p-2 rounded-lg bg-surface-800/40">
        <p class="text-[10px] text-surface-500 uppercase">Konsumsi</p>
        <p class="text-xs font-mono font-semibold text-surface-200">{litersUsed} L</p>
      </div>
      <div class="text-center p-2 rounded-lg bg-surface-800/40">
        <p class="text-[10px] text-surface-500 uppercase">Harga/L</p>
        <p class="text-xs font-mono font-semibold text-surface-200">{formatRp(FUEL_PRICE_PER_LITER)}</p>
      </div>
    </div>

    <div class="text-[10px] text-surface-500 text-center pt-1">
      * Estimasi konsumsi 1:{KM_PER_LITER} km/L (MPV) · Harga Pertamax 2026
    </div>
  </div>
</div>
