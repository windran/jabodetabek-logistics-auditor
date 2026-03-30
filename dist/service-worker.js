/**
 * Sky White Trip Auditor — Background Service Worker
 * Manifest V3 compatible for Chrome & Firefox
 *
 * Features:
 * - Periodic traffic status check via Alarms API
 * - Message handler for popup communication
 */

// ── Traffic Monitoring ────────────────────────────────────────────

const ALARM_NAME = 'traffic-check';
const CHECK_INTERVAL_MINUTES = 15;

/** @type {'light' | 'moderate' | 'heavy' | 'unknown'} */
let currentTrafficStatus = 'unknown';
let lastChecked = null;

/**
 * Simulate traffic status check.
 * In production, this would call a real traffic API
 * (e.g., Google Maps Directions API with departure_time).
 */
function checkTrafficStatus() {
  const hour = new Date().getHours();

  // Peak hours simulation for Jabodetabek
  if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 20)) {
    currentTrafficStatus = 'heavy';
  } else if ((hour >= 6 && hour < 7) || (hour >= 9 && hour <= 11) || (hour >= 15 && hour < 17)) {
    currentTrafficStatus = 'moderate';
  } else {
    currentTrafficStatus = 'light';
  }

  lastChecked = new Date().toISOString();
  console.log(`[Sky White] Traffic status: ${currentTrafficStatus} (checked at ${lastChecked})`);
}

// ── Alarms Setup ──────────────────────────────────────────────────

chrome.alarms.create(ALARM_NAME, {
  delayInMinutes: 0,
  periodInMinutes: CHECK_INTERVAL_MINUTES,
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    checkTrafficStatus();
  }
});

// ── Message Handler ───────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_TRAFFIC_STATUS') {
    // If we haven't checked yet, do it now
    if (currentTrafficStatus === 'unknown') {
      checkTrafficStatus();
    }
    sendResponse({
      status: currentTrafficStatus,
      lastChecked,
    });
    return true;
  }

  if (message.type === 'FORCE_TRAFFIC_CHECK') {
    checkTrafficStatus();
    sendResponse({
      status: currentTrafficStatus,
      lastChecked,
    });
    return true;
  }

  return false;
});

// ── Install / Startup ─────────────────────────────────────────────

chrome.runtime.onInstalled.addListener((details) => {
  console.log('[Sky White] Extension installed:', details.reason);
  checkTrafficStatus();
});

chrome.runtime.onStartup.addListener(() => {
  console.log('[Sky White] Browser started, checking traffic...');
  checkTrafficStatus();
});

// Initial check
checkTrafficStatus();
