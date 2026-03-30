<script>
  import { getRouteHistory, clearHistory } from '$lib/logic/storage.js';

  let history = $state([]);
  let loading = $state(true);

  /** @type {{ onLoadRoute?: (stops: string[]) => void }} */
  let { onLoadRoute } = $props();

  async function loadHistory() {
    loading = true;
    history = await getRouteHistory();
    loading = false;
  }

  async function handleClear() {
    await clearHistory();
    history = [];
  }

  function formatRp(n) {
    return 'Rp ' + n.toLocaleString('id-ID');
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  // Load on mount
  $effect(() => { loadHistory(); });
</script>

<div class="card-bento">
  <div class="flex items-center justify-between mb-3">
    <div class="flex items-center gap-2">
      <div class="w-6 h-6 rounded-md bg-surface-700 flex items-center justify-center">
        <svg class="w-3.5 h-3.5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h4 class="text-xs font-semibold text-surface-200">Riwayat (3 Terakhir)</h4>
    </div>
    {#if history.length > 0}
      <button class="text-[10px] text-surface-500 hover:text-red-400 transition-colors" onclick={handleClear}>
        Hapus Semua
      </button>
    {/if}
  </div>

  {#if loading}
    <div class="text-center py-4">
      <div class="w-5 h-5 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto"></div>
    </div>
  {:else if history.length === 0}
    <p class="text-xs text-surface-500 text-center py-4">Belum ada riwayat rute.</p>
  {:else}
    <div class="space-y-2">
      {#each history as entry}
        <button
          class="w-full text-left p-2.5 rounded-lg bg-surface-800/40 hover:bg-surface-800/80 transition-colors group"
          onclick={() => onLoadRoute?.(entry.stops)}
        >
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] text-surface-500">{formatDate(entry.timestamp)}</span>
            <span class="text-xs font-mono font-semibold text-brand-400">{formatRp(entry.totalCost)}</span>
          </div>
          <div class="flex items-center gap-1 flex-wrap">
            {#each entry.stops as stop, i}
              <span class="text-[10px] text-surface-300">{stop}</span>
              {#if i < entry.stops.length - 1}
                <svg class="w-2.5 h-2.5 text-surface-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              {/if}
            {/each}
          </div>
          <div class="text-[10px] text-surface-500 mt-1">{entry.totalDistanceKm} km · Tol {formatRp(entry.totalTollCost)} · BBM {formatRp(entry.totalFuelCost)}</div>
        </button>
      {/each}
    </div>
  {/if}
</div>
