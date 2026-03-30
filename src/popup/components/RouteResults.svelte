<script>
  /** @type {{ route: import('$lib/logic/optimizer.js').RouteResult | null }} */
  let { route } = $props();

  function formatRp(n) {
    return 'Rp ' + n.toLocaleString('id-ID');
  }
</script>

{#if route}
  <div class="space-y-3">
    <!-- Cost Summary Bento Grid -->
    <div class="grid grid-cols-3 gap-2">
      <div class="card-bento text-center">
        <p class="stat-label">Total Biaya</p>
        <p class="stat-value text-brand-400">{formatRp(route.totalCost)}</p>
      </div>
      <div class="card-bento text-center">
        <p class="stat-label">Tol</p>
        <p class="stat-value text-amber-400 text-lg">{formatRp(route.totalTollCost)}</p>
      </div>
      <div class="card-bento text-center">
        <p class="stat-label">BBM</p>
        <p class="stat-value text-emerald-400 text-lg">{formatRp(route.totalFuelCost)}</p>
      </div>
    </div>

    <!-- Distance Badge -->
    <div class="flex items-center justify-between px-1">
      <span class="badge-sky">
        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        {route.totalDistanceKm} km total
      </span>
      <span class="badge-green">
        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Rute Teroptimasi
      </span>
    </div>

    <!-- Route Steps Card -->
    <div class="card-bento">
      <div class="flex items-center gap-2 mb-3">
        <div class="w-6 h-6 rounded-md bg-brand-500/20 flex items-center justify-center">
          <svg class="w-3.5 h-3.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
        <h4 class="text-xs font-semibold text-surface-200 uppercase tracking-wider">Detail Rute</h4>
      </div>

      <div class="space-y-0">
        {#each route.legs as leg, i}
          <div class="relative pl-6 pb-4 last:pb-0">
            <!-- Timeline dot -->
            <div class="absolute left-0 top-0.5 w-4 h-4 rounded-full border-2 
              {i === 0 ? 'border-emerald-400 bg-emerald-400/20' : 'border-brand-400 bg-brand-400/20'}
              flex items-center justify-center">
              <div class="w-1.5 h-1.5 rounded-full {i === 0 ? 'bg-emerald-400' : 'bg-brand-400'}"></div>
            </div>
            <!-- Timeline line -->
            {#if i < route.legs.length - 1}
              <div class="absolute left-[7px] top-5 bottom-0 w-0.5 bg-surface-700"></div>
            {/if}

            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-xs font-semibold text-surface-100">{leg.from}</span>
                <svg class="w-3 h-3 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <span class="text-xs font-semibold text-surface-100">{leg.to}</span>
              </div>
              <div class="flex gap-3 text-[10px] text-surface-400">
                <span>{leg.distanceKm} km</span>
                <span>Tol: {formatRp(leg.tollCost)}</span>
                <span>BBM: {formatRp(leg.fuelCost)}</span>
              </div>
              {#if leg.path.length > 2}
                <div class="text-[10px] text-surface-500">
                  Via: {leg.path.slice(1, -1).join(' → ')}
                </div>
              {/if}
            </div>
          </div>
        {/each}

        <!-- Final destination dot -->
        <div class="relative pl-6">
          <div class="absolute left-0 top-0.5 w-4 h-4 rounded-full border-2 border-red-400 bg-red-400/20 flex items-center justify-center">
            <div class="w-1.5 h-1.5 rounded-full bg-red-400"></div>
          </div>
          <span class="text-xs font-semibold text-surface-100">{route.orderedStops[route.orderedStops.length - 1]}</span>
          <span class="badge-red ml-2 text-[10px]">Tujuan</span>
        </div>
      </div>
    </div>
  </div>
{/if}
