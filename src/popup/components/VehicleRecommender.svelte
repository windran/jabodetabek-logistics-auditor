<script>
  import { recommendVehicle, getBookingUrl } from '$lib/logic/vehicleRecommender.js';

  let passengers = $state(4);
  let luggage = $state(2);

  let recommendation = $derived(recommendVehicle(passengers, luggage));

  function openBooking() {
    window.open(getBookingUrl(), '_blank', 'noopener,noreferrer');
  }
</script>

<div class="card-bento">
  <div class="flex items-center gap-2 mb-3">
    <div class="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
      <svg class="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    </div>
    <h3 class="text-sm font-semibold text-surface-100">Smart Unit Recommender</h3>
  </div>

  <!-- Inputs -->
  <div class="grid grid-cols-2 gap-3 mb-3">
    <div>
      <label class="block text-[10px] text-surface-400 uppercase tracking-wider mb-1" for="passengers">Penumpang</label>
      <div class="flex items-center gap-1">
        <button class="w-7 h-7 rounded-md bg-surface-800 hover:bg-surface-700 text-surface-300 text-sm font-bold transition-colors"
          onclick={() => passengers = Math.max(1, passengers - 1)}>−</button>
        <input id="passengers" type="number" class="input-field text-center text-sm font-mono w-12 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          bind:value={passengers} min="1" max="15" />
        <button class="w-7 h-7 rounded-md bg-surface-800 hover:bg-surface-700 text-surface-300 text-sm font-bold transition-colors"
          onclick={() => passengers = Math.min(15, passengers + 1)}>+</button>
      </div>
    </div>
    <div>
      <label class="block text-[10px] text-surface-400 uppercase tracking-wider mb-1" for="luggage">Bagasi Besar</label>
      <div class="flex items-center gap-1">
        <button class="w-7 h-7 rounded-md bg-surface-800 hover:bg-surface-700 text-surface-300 text-sm font-bold transition-colors"
          onclick={() => luggage = Math.max(0, luggage - 1)}>−</button>
        <input id="luggage" type="number" class="input-field text-center text-sm font-mono w-12 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          bind:value={luggage} min="0" max="10" />
        <button class="w-7 h-7 rounded-md bg-surface-800 hover:bg-surface-700 text-surface-300 text-sm font-bold transition-colors"
          onclick={() => luggage = Math.min(10, luggage + 1)}>+</button>
      </div>
    </div>
  </div>

  <!-- Recommendation Card -->
  <div class="rounded-lg bg-surface-800/60 p-3 space-y-2">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-xl">{recommendation.icon}</span>
        <div>
          <p class="text-xs font-semibold text-surface-100">{recommendation.category}</p>
          <p class="text-[10px] text-surface-400">{recommendation.reason}</p>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap gap-1.5">
      {#each recommendation.vehicles as vehicle}
        <span class="badge-sky text-[10px]">{vehicle}</span>
      {/each}
    </div>

    <div class="flex items-center justify-between pt-1">
      <span class="text-[10px] font-mono text-surface-400">{recommendation.priceRange}</span>
    </div>
  </div>

  <!-- Book Now -->
  <button class="w-full mt-3 btn-primary flex items-center justify-center gap-2 text-xs" onclick={openBooking}>
    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
    Book via Sky White Rent Car
  </button>
</div>
