(() => {
  const timeEl = document.querySelector(".sb-time");
  const batteryEl = document.querySelector(".sb-battery");
  const signalEl = document.querySelector(".sb-signal");
  const wifiEl = document.querySelector(".sb-wifi");

  const pad = n => String(n).padStart(2, "0");

  function updateClock() {
    if (!timeEl) return;
    const now = new Date();
    timeEl.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  function updateNetwork() {
    const online = navigator.onLine;
    if (signalEl) {
      signalEl.style.opacity = online ? "1" : "0.28";
      signalEl.setAttribute("aria-label", online ? "Network connected" : "Network offline");
    }
    if (wifiEl) {
      wifiEl.style.opacity = online ? "1" : "0.28";
      wifiEl.setAttribute("aria-label", online ? "Internet connected" : "Internet offline");
    }
  }

  function renderBattery(level = 1, charging = false) {
    if (!batteryEl) return;
    const pct = Math.round(Math.max(0, Math.min(1, level)) * 100);
    const fill = Math.max(1, Math.round(16 * pct / 100));
    const inner = batteryEl.querySelector(".battery-fill");
    if (inner) inner.setAttribute("width", String(fill));
    batteryEl.setAttribute("aria-label", `Battery ${pct}%${charging ? ", charging" : ""}`);
    batteryEl.style.opacity = pct <= 10 ? "0.75" : "1";
  }

  async function updateBattery() {
    if (!navigator.getBattery) {
      renderBattery(1, false);
      return;
    }
    try {
      const battery = await navigator.getBattery();
      const sync = () => renderBattery(battery.level, battery.charging);
      sync();
      battery.addEventListener("levelchange", sync);
      battery.addEventListener("chargingchange", sync);
    } catch (_) {
      renderBattery(1, false);
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
  updateNetwork();
  window.addEventListener("online", updateNetwork);
  window.addEventListener("offline", updateNetwork);
  updateBattery();
})();