/* BUWOOMI saved-address flow fix.
   Keeps address selection inside the SPA and makes current-location fill the form
   instead of silently changing an existing default address. */
(() => {
  const KEY_ADDR = 'buwoomi-checkout-address-id';
  const KEY_RETURN = 'buwoomi-checkout-address-return';

  const toast = (msg) => {
    if (typeof showToast === 'function') showToast(msg);
    else window.alert(msg);
  };

  function isCheckout() {
    return document.querySelector('#screen .topbar h2')?.textContent?.trim() === 'Checkout';
  }

  function markCheckoutReturn(event) {
    const b = event.target.closest?.('[data-profile-section="addresses"]');
    if (b && isCheckout()) localStorage.setItem(KEY_RETURN, '1');
  }

  async function useCurrentLocation() {
    const button = document.querySelector('#useLocationBtn');
    const input = document.querySelector('#addressLine1');
    const label = document.querySelector('#addressLabel');
    const city = document.querySelector('#addressCity');
    if (!button || !input) return;
    button.disabled = true;
    button.textContent = 'Finding you…';
    try {
      if (!navigator.geolocation) throw new Error('Location is not supported by this browser.');
      const pos = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 30000,
      }));
      const lat = Number(pos.coords.latitude.toFixed(6));
      const lng = Number(pos.coords.longitude.toFixed(6));
      input.value = `Pinned location (${lat}, ${lng})`;
      if (label && !label.value.trim()) label.value = 'Current Location';
      if (city && !city.value.trim()) city.value = 'Kampala';
      input.dataset.latitude = String(lat);
      input.dataset.longitude = String(lng);
      toast('Location added to the form. Tap Save Address to keep it.');
    } catch (e) {
      toast(e.message || 'Could not get your location.');
    } finally {
      button.disabled = false;
      button.textContent = 'Use my current location';
    }
  }

  function bindLocationButton() {
    const b = document.querySelector('#useLocationBtn');
    if (!b || b.dataset.addressFixBound === '1') return;
    b.dataset.addressFixBound = '1';
    b.onclick = useCurrentLocation;
  }

  function bindSavedAddressButtons() {
    document.querySelectorAll('[data-address-delete]').forEach((del) => {
      const card = del.closest('.summary');
      if (!card || card.dataset.addressFixBound === '1') return;
      card.dataset.addressFixBound = '1';
      const id = del.dataset.addressDelete;

      // delivery-features.js used to append its own row here. Replace only that
      // generated row so the address card has one clean action area.
      card.querySelectorAll('button').forEach((button) => {
        const text = button.textContent.trim();
        if (text === 'Use for checkout' || text === 'Open in Google Maps' || text === '✓ Selected for checkout') {
          button.closest('div')?.remove();
        }
      });

      const row = document.createElement('div');
      row.className = 'address-actions-fix';

      const use = document.createElement('button');
      use.type = 'button';
      use.className = 'cta ghost';
      use.textContent = localStorage.getItem(KEY_ADDR) === id ? '✓ Selected for checkout' : 'Use for checkout';
      use.onclick = () => {
        localStorage.setItem(KEY_ADDR, id);
        if (typeof state !== 'undefined') state.addressId = id;
        const returning = localStorage.getItem(KEY_RETURN) === '1';
        localStorage.removeItem(KEY_RETURN);
        toast(returning ? 'Delivery address selected.' : 'Delivery address selected for checkout.');
        if (returning && typeof go === 'function') go('checkout', {}, 'forward');
      };

      const map = document.createElement('button');
      map.type = 'button';
      map.className = 'cta ghost';
      map.textContent = 'Open in Google Maps';
      map.onclick = () => {
        const text = card.querySelector('p')?.innerText || '';
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text + ', Uganda')}`, '_blank', 'noopener');
      };

      row.append(use, map);
      card.appendChild(row);
    });
  }

  function addReturnBanner() {
    if (localStorage.getItem(KEY_RETURN) !== '1') return;
    const page = document.querySelector('#screen .page');
    if (!page || page.dataset.addressReturnBanner === '1') return;
    page.dataset.addressReturnBanner = '1';
    const banner = document.createElement('div');
    banner.className = 'address-return-banner';
    banner.innerHTML = '<strong>Choose your delivery address</strong><span>Select an address below, then you’ll return to checkout.</span>';
    const first = page.querySelector('.summary');
    if (first) first.before(banner);
  }

  function enhance() {
    bindLocationButton();
    bindSavedAddressButtons();
    addReturnBanner();
    // No separate save-for-checkout hook is needed here; binding must remain self-contained.
  }

  document.addEventListener('click', markCheckoutReturn, true);
  const observer = new MutationObserver(enhance);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  enhance();
})();
