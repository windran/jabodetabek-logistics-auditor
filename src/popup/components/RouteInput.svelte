<script>
  import { getAllTollGates } from '$lib/logic/tollDatabase.js';

  /** @type {{ stops: string[], onCalculate: (stops: string[]) => void }} */
  let { stops = $bindable([]), onCalculate } = $props();

  const tollGates = getAllTollGates();
  let showSuggestions = $state(-1);
  let filterText = $state('');

  function addStop() {
    if (stops.length < 5) {
      stops = [...stops, ''];
    }
  }

  function removeStop(index) {
    if (stops.length > 3) {
      stops = stops.filter((_, i) => i !== index);
    }
  }

  function updateStop(index, value) {
    stops = stops.map((s, i) => (i === index ? value : s));
  }

  function selectSuggestion(index, gate) {
    updateStop(index, gate);
    showSuggestions = -1;
    filterText = '';
  }

  function handleInput(index, value) {
    updateStop(index, value);
    filterText = value;
    showSuggestions = index;
  }

  function handleBlur() {
    // Delay to allow click on suggestion
    setTimeout(() => { showSuggestions = -1; }, 150);
  }

  let filteredGates = $derived(
    tollGates.filter(g => g.toLowerCase().includes(filterText.toLowerCase()))
  );

  let canCalculate = $derived(
    stops.length >= 3 && stops.every(s => s.trim().length > 0)
  );

  const stopLabels = ['Asal (Start)', 'Tujuan Akhir', 'Via Stop 1', 'Via Stop 2', 'Via Stop 3'];

  function getLabel(index) {
    if (index === 0) return stopLabels[0];
    if (index === stops.length - 1) return stopLabels[1];
    return stopLabels[index + 1];
  }
</script>

<div class="card-bento space-y-3">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center">
        <svg class="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      </div>
      <h3 class="text-sm font-semibold text-surface-100">Multi-Stop Route</h3>
    </div>
    <span class="badge-sky">{stops.length} stops</span>
  </div>

  <p class="text-[10px] text-surface-500">Masukkan 3 sampai 5 lokasi untuk menghitung rute paling efisien.</p>

  <div class="space-y-2">
    {#each stops as stop, i}
      <div class="relative">
        <div class="flex items-center gap-2">
          <div class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
            {i === 0 ? 'bg-emerald-500/20 text-emerald-400' : i === stops.length - 1 ? 'bg-red-500/20 text-red-400' : 'bg-brand-500/20 text-brand-400'}">
            {i + 1}
          </div>
          <div class="flex-1 relative">
            <input
              type="text"
              class="input-field text-xs pr-8"
              placeholder={getLabel(i)}
              value={stop}
              oninput={(e) => handleInput(i, e.target.value)}
              onfocus={() => { showSuggestions = i; filterText = stop; }}
              onblur={handleBlur}
            />
            {#if stops.length > 3}
              <button
                class="absolute right-2 top-1/2 -translate-y-1/2 text-surface-500 hover:text-red-400 transition-colors"
                onclick={() => removeStop(i)}
                title="Hapus stop"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            {/if}
          </div>
        </div>

        {#if showSuggestions === i && filteredGates.length > 0}
          <div class="absolute left-8 right-0 z-20 mt-1 bg-surface-800 border border-surface-600/50 rounded-lg shadow-xl max-h-32 overflow-y-auto">
            {#each filteredGates.slice(0, 8) as gate}
              <button
                class="w-full text-left px-3 py-1.5 text-xs text-surface-300 hover:bg-brand-500/10 hover:text-brand-300 transition-colors"
                onmousedown={() => selectSuggestion(i, gate)}
              >
                {gate}
              </button>
            {/each}
          </div>
        {/if}

        {#if i < stops.length - 1}
          <div class="ml-3 h-2 border-l-2 border-dashed border-surface-600"></div>
        {/if}
      </div>
    {/each}
  </div>

  <div class="flex gap-2 pt-1">
    {#if stops.length < 5}
      <button class="btn-secondary text-xs flex-1 flex items-center justify-center gap-1.5" onclick={addStop}>
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Tambah Stop
      </button>
    {/if}
    <button
      class="btn-primary text-xs flex-1 flex items-center justify-center gap-1.5"
      disabled={!canCalculate}
      onclick={() => onCalculate(stops)}
    >
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      Hitung Rute Optimal
    </button>
  </div>
</div>
