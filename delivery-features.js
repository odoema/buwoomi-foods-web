/* BUWOOMI delivery address + scheduling enhancement. No Google Maps API key required.
   UI-only: does NOT place orders (checkout-flow-fix.js owns #place). */
(() => {
  const KEY_ADDR = 'buwoomi-checkout-address-id';
  const KEY_TIME = 'buwoomi-delivery-requested-at';

  function client() {
    if (!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY || window.SUPABASE_ANON_KEY === 'PASTE-YOUR-ANON-PUBLIC-KEY-HERE') return null;
    if (!window.__buwoomiDeliveryClient) window.__buwoomiDeliveryClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
    return window.__buwoomiDeliveryClient;
  }

  const mapsUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

  const fmtTime = (iso) => {
    if (!iso) return 'Deliver now';
    const d = new Date(iso);
    return `Scheduled for ${d.toLocaleDateString('en-UG', { weekday: 'short', day: 'numeric', month: 'short' })} at ${d.toLocaleTimeString('en-UG', { hour: 'numeric', minute: '2-digit' })}`;
  };

  const nextHalfHour = () => {
    const d = new Date();
    d.setSeconds(0, 0);
    d.setMinutes(d.getMinutes() + 30 - (d.getMinutes() % 30));
    return d;
  };

  const timeOptions = () => {
    const d = nextHalfHour();
    let out = '';
    for (let i = 0; i < 16; i++) {
      const x = new Date(d.getTime() + i * 30 * 60000);
      out += `<option value="${x.toISOString()}">${x.toLocaleTimeString('en-UG', { hour: 'numeric', minute: '2-digit' })}</option>`;
    }
    return out;
  };

  async function getSession() {
    const c = client();
    if (!c) return null;
    const { data } = await c.auth.getSession();
    return data.session;
  }

  async function getAddresses() {
    const c = client();
    const s = await getSession();
    if (!c || !s) return [];
    const { data, error } = await c.from('addresses').select('*').order('is_default', { ascending: false }).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async function saveCurrentLocation() {
    const c = client();
    const s = await getSession();
    if (!c || !s) throw new Error('Please sign in first.');
    if (!navigator.geolocation) throw new Error('Location is not supported by this browser.');
    const pos = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 })
    );
    const lat = Number(pos.coords.latitude.toFixed(6));
    const lng = Number(pos.coords.longitude.toFixed(6));
    const existing = (await getAddresses()).find((a) => a.is_default) || null;
    if (existing) {
      const { data, error } = await c
        .from('addresses')
        .update({ line1: `Pinned location (${lat}, ${lng})`, city: 'Kampala', latitude: lat, longitude: lng })
        .eq('id', existing.id)
        .eq('user_id', s.user.id)
        .select()
        .single();
      if (error) throw error;
      localStorage.setItem(KEY_ADDR, data.id);
      if (typeof state !== 'undefined') state.addressId = data.id;
    } else {
      const { data, error } = await c
        .from('addresses')
        .insert({
          user_id: s.user.id,
          label: 'Current Location',
          line1: `Pinned location (${lat}, ${lng})`,
          city: 'Kampala',
          latitude: lat,
          longitude: lng,
          is_default: true,
        })
        .select()
        .single();
      if (error) throw error;
      localStorage.setItem(KEY_ADDR, data.id);
      if (typeof state !== 'undefined') state.addressId = data.id;
    }
  }

  function toast(msg) {
    if (typeof showToast === 'function') showToast(msg);
    else {
      const t = document.querySelector('#toast');
      if (t) {
        t.textContent = msg;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 2200);
      } else alert(msg);
    }
  }

  function enhanceAddressPage() {
    const input = document.querySelector('#addressLine1');
    const summary = input?.closest('.summary');
    if (!summary || summary.dataset.deliveryEnhanced) return;
    summary.dataset.deliveryEnhanced = '1';
    const tools = document.createElement('div');
    tools.style = 'display:flex;gap:8px;flex-wrap:wrap;margin:10px 0';
    tools.innerHTML =
      '<button type="button" class="cta ghost" id="useLocationBtn" style="flex:1;margin:0">Use my current location</button><button type="button" class="cta ghost" id="findOnMapsBtn" style="flex:1;margin:0">Find on Google Maps</button>';
    input.parentElement.after(tools);
    document.querySelector('#findOnMapsBtn').onclick = () => {
      const q = [input.value.trim(), document.querySelector('#addressCity')?.value.trim() || 'Kampala', 'Uganda'].filter(Boolean).join(', ');
      if (!input.value.trim()) return alert('Enter an address first.');
      window.open(mapsUrl(q), '_blank', 'noopener');
    };
    document.querySelector('#useLocationBtn').onclick = async () => {
      const b = document.querySelector('#useLocationBtn');
      b.disabled = true;
      b.textContent = 'Finding you…';
      try {
        await saveCurrentLocation();
        toast('Current location saved. Open Google Maps to verify the point.');
      } catch (e) {
        alert(e.message || 'Could not get your location.');
      } finally {
        b.disabled = false;
        b.textContent = 'Use my current location';
      }
    };
  }

  function enhanceSavedAddresses() {
    document.querySelectorAll('[data-address-delete]').forEach((del) => {
      const card = del.closest('.summary');
      if (!card || card.dataset.deliveryEnhanced) return;
      card.dataset.deliveryEnhanced = '1';
      const id = del.dataset.addressDelete;
      const row = document.createElement('div');
      row.style = 'display:flex;gap:8px;flex-wrap:wrap;margin-top:8px';
      const use = document.createElement('button');
      use.className = 'cta ghost';
      use.style = 'flex:1;margin:0';
      use.textContent = 'Use for checkout';
      use.onclick = () => {
        localStorage.setItem(KEY_ADDR, id);
        if (typeof state !== 'undefined') state.addressId = id;
        toast('Delivery address selected.');
      };
      row.appendChild(use);
      const map = document.createElement('button');
      map.className = 'cta ghost';
      map.style = 'flex:1;margin:0';
      map.textContent = 'Open in Google Maps';
      map.onclick = () => {
        const text = card.querySelector('p')?.innerText || '';
        window.open(mapsUrl(text + ', Uganda'), '_blank', 'noopener');
      };
      row.appendChild(map);
      card.appendChild(row);
    });
  }

  function enhanceCheckout() {
    const summaries = [...document.querySelectorAll('.summary')];
    const timeBox = summaries.find((x) => x.querySelector('strong')?.textContent.includes('Delivery Time'));
    if (timeBox && !timeBox.dataset.deliveryEnhanced) {
      timeBox.dataset.deliveryEnhanced = '1';
      const selected = localStorage.getItem(KEY_TIME) || '';
      timeBox.innerHTML = `<strong>Delivery Time</strong>
        <div style="margin-top:10px">
          <select id="deliveryMode" style="width:100%;padding:12px;border:1px solid var(--border);border-radius:12px;background:#fff">
            <option value="now">Deliver now (25–35 mins)</option>
            <option value="later">Schedule for later</option>
          </select>
        </div>
        <div id="deliverySchedule" style="display:${selected ? 'block' : 'none'};margin-top:10px">
          <label style="display:block;font-size:12px;margin-bottom:5px">Choose time</label>
          <select id="deliveryTime" style="width:100%;padding:12px;border:1px solid var(--border);border-radius:12px;background:#fff">${timeOptions()}</select>
        </div>
        <p id="deliveryTimeSummary" style="color:var(--muted);font-size:13px;margin-top:8px">${fmtTime(selected)}</p>`;
      const mode = document.querySelector('#deliveryMode');
      const sched = document.querySelector('#deliverySchedule');
      const ts = document.querySelector('#deliveryTime');
      const sum = document.querySelector('#deliveryTimeSummary');
      if (selected && ts) ts.value = selected;
      mode.value = selected ? 'later' : 'now';
      mode.onchange = () => {
        if (mode.value === 'later') {
          sched.style.display = 'block';
          localStorage.setItem(KEY_TIME, ts.value);
          sum.textContent = fmtTime(ts.value);
        } else {
          sched.style.display = 'none';
          localStorage.removeItem(KEY_TIME);
          sum.textContent = 'Deliver now (25–35 mins)';
        }
      };
      if (ts)
        ts.onchange = () => {
          localStorage.setItem(KEY_TIME, ts.value);
          sum.textContent = fmtTime(ts.value);
        };
    }

    const addrBox = summaries.find((x) => x.querySelector('strong')?.textContent.includes('Delivery Address'));
    if (addrBox && !addrBox.dataset.mapsEnhanced) {
      addrBox.dataset.mapsEnhanced = '1';
      const p = addrBox.querySelector('p');
      const q = p?.innerText?.replace(/\n/g, ', ');
      if (q && !/No saved address/.test(q)) {
        const b = document.createElement('button');
        b.className = 'cta ghost';
        b.style = 'margin-top:8px;width:100%';
        b.textContent = 'View delivery point in Google Maps';
        b.onclick = () => window.open(mapsUrl(q + ', Uganda'), '_blank', 'noopener');
        addrBox.appendChild(b);
      }
    }
  }

  // No #place click handler here — checkout-flow-fix.js owns order placement.
  const observer = new MutationObserver(() => {
    enhanceAddressPage();
    enhanceSavedAddresses();
    enhanceCheckout();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  enhanceAddressPage();
  enhanceSavedAddresses();
  enhanceCheckout();
})();
