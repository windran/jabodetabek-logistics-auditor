<script>
  import RouteInput from './components/RouteInput.svelte';
  import RouteResults from './components/RouteResults.svelte';
  import TollAuditor from './components/TollAuditor.svelte';
  import VehicleRecommender from './components/VehicleRecommender.svelte';
  import RouteHistory from './components/RouteHistory.svelte';
  import { optimizeRoute } from '$lib/logic/optimizer.js';
  import { saveRoute } from '$lib/logic/storage.js';
  import skyWhiteLogo from '$lib/assets/sky-white-logo.webp';
  import skyWhiteThumbnail from '$lib/assets/sky-white-thumbnail.webp';

  let stops = $state(['', '', '']);
  let routeResult = $state(null);
  let isCalculating = $state(false);
  let activeTab = $state('route');
  let trafficStatus = $state('unknown');

  const siteLinks = {
    home: 'https://www.skywhiterentcar.com/',
    privacy: 'https://www.skywhiterentcar.com/privacy',
    terms: 'https://www.skywhiterentcar.com/terms',
    faq: 'https://www.skywhiterentcar.com/faq',
  };

  // Check traffic status from service worker
  $effect(() => {
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'GET_TRAFFIC_STATUS' }, (response) => {
        if (response?.status) {
          trafficStatus = response.status;
        }
      });
    }
  });

  async function handleCalculate(inputStops) {
    isCalculating = true;
    try {
      // Small delay for UX feedback
      await new Promise(r => setTimeout(r, 300));
      routeResult = optimizeRoute(inputStops);
      await saveRoute(routeResult);
      activeTab = 'results';
    } catch (err) {
      console.error('Route optimization failed:', err);
    } finally {
      isCalculating = false;
    }
  }

  function handleLoadRoute(savedStops) {
    stops = [...savedStops];
    activeTab = 'route';
    routeResult = null;
  }

  let trafficBadgeClass = $derived(
    trafficStatus === 'light' ? 'badge-green' :
    trafficStatus === 'heavy' ? 'badge-red' :
    'badge-amber'
  );

  let trafficLabel = $derived(
    trafficStatus === 'light' ? 'Lancar' :
    trafficStatus === 'heavy' ? 'Padat' :
    trafficStatus === 'moderate' ? 'Sedang' :
    'Memantau...'
  );

  const tabs = [
    { id: 'route', label: 'Rute', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
    { id: 'results', label: 'Hasil', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'vehicle', label: 'Unit', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  ];
</script>

<div class="flex flex-col h-full min-h-[600px]">
  <!-- Header -->
  <header class="px-4 pt-4 pb-3 border-b border-surface-800/80">
    <div class="flex items-center justify-between mb-1">
      <div class="flex items-center gap-2.5">
        <div class="w-10 h-10 rounded-xl overflow-hidden bg-surface-900 ring-1 ring-white/10 shadow-glow">
          <img src={skyWhiteThumbnail} alt="Sky White Rent Car" class="h-full w-full object-cover" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-sm font-bold text-surface-50 tracking-tight">Sky White Trip Auditor</h1>
            <span class="badge-sky text-[10px]">Official</span>
          </div>
          <p class="text-[10px] text-surface-500">skywhiterentcar.com · Logistics & Cost Optimizer</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class={trafficBadgeClass}>
          <span class="w-1.5 h-1.5 rounded-full {trafficStatus === 'light' ? 'bg-emerald-400' : trafficStatus === 'heavy' ? 'bg-red-400' : 'bg-amber-400'} animate-pulse"></span>
          {trafficLabel}
        </span>
      </div>
    </div>
  </header>

  <!-- Tab Navigation -->
  <nav class="px-4 pt-2 pb-1 flex gap-1">
    {#each tabs as tab}
      <button
        class="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
          {activeTab === tab.id
            ? 'bg-brand-500/15 text-brand-400 border border-brand-500/25'
            : 'text-surface-400 hover:text-surface-300 hover:bg-surface-800/50 border border-transparent'}"
        onclick={() => activeTab = tab.id}
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d={tab.icon} />
        </svg>
        {tab.label}
      </button>
    {/each}
  </nav>

  <!-- Content -->
  <main class="flex-1 overflow-y-auto px-4 py-3 space-y-3">
    {#if isCalculating}
      <div class="card-bento flex flex-col items-center justify-center py-10 space-y-3">
        <div class="w-10 h-10 border-3 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
        <div>
          <p class="text-sm font-semibold text-surface-200 text-center">Mengoptimasi Rute...</p>
          <p class="text-[10px] text-surface-500 text-center mt-1">Menghitung biaya tol & BBM terbaik</p>
        </div>
      </div>
    {:else if activeTab === 'route'}
      <RouteInput bind:stops onCalculate={handleCalculate} />
      <RouteHistory onLoadRoute={handleLoadRoute} />
    {:else if activeTab === 'results'}
      {#if routeResult}
        <RouteResults route={routeResult} />
        <TollAuditor
          totalDistanceKm={routeResult.totalDistanceKm}
          totalTollCost={routeResult.totalTollCost}
          totalFuelCost={routeResult.totalFuelCost}
        />
      {:else}
        <div class="card-bento text-center py-10">
          <svg class="w-10 h-10 text-surface-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-sm text-surface-400">Belum ada hasil.</p>
          <p class="text-xs text-surface-500 mt-1">Masukkan rute dan klik "Hitung" di tab Rute.</p>
        </div>
      {/if}
    {:else if activeTab === 'vehicle'}
      <VehicleRecommender />
    {/if}
  </main>

  <!-- Footer -->
  <footer class="px-4 py-2.5 border-t border-surface-800/80 space-y-2">
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-2 min-w-0">
        <img src={skyWhiteLogo} alt="Sky White Rent Car" class="h-4 w-auto max-w-[138px] object-contain opacity-90" />
        <span class="text-[10px] text-surface-600 whitespace-nowrap">v1.0.0 · Data Tol 2026</span>
      </div>
      <a
        href={siteLinks.home}
        target="_blank"
        rel="noopener noreferrer"
        class="text-[10px] text-brand-500 hover:text-brand-400 font-medium transition-colors"
      >
        skywhiterentcar.com ↗
      </a>
    </div>
    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-surface-500">
      <a href={siteLinks.privacy} target="_blank" rel="noopener noreferrer" class="hover:text-brand-400 transition-colors">Privasi</a>
      <a href={siteLinks.terms} target="_blank" rel="noopener noreferrer" class="hover:text-brand-400 transition-colors">Ketentuan</a>
      <a href={siteLinks.faq} target="_blank" rel="noopener noreferrer" class="hover:text-brand-400 transition-colors">FAQ</a>
    </div>
  </footer>
</div>
