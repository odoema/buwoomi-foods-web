/* BUWOOMI checkout sequencing guard.
   Runs before delivery-features.js so checkout has one reliable order path.
   It never reloads the document after an order. */
(() => {
  let busy = false;
  const KEY_TIME = 'buwoomi-delivery-requested-at';
  const KEY_ADDR = 'buwoomi-checkout-address-id';

  const toast = (msg) => {
    if (typeof showToast === 'function') showToast(msg);
    else window.alert(msg);
  };

  const client = () => {
    if (!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY || window.SUPABASE_ANON_KEY === 'PASTE-YOUR-ANON-PUBLIC-KEY-HERE') return null;
    if (!window.__buwoomiCheckoutClient) window.__buwoomiCheckoutClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
    return window.__buwoomiCheckoutClient;
  };

  async function place(button) {
    if (busy) return;
    busy = true;
    button.disabled = true;
    try {
      const backendOn = !!(window.BuwoomiBackend && window.BuwoomiBackend.ready);
      if (!backendOn) throw new Error('Please connect to BUWOOMI before placing an order.');

      const session = await window.BuwoomiBackend.getSession();
      if (!session) throw new Error('Please sign in first.');
      if (!Array.isArray(state.cart) || !state.cart.length) throw new Error('Your cart is empty.');

      const addressId = state.addressId || localStorage.getItem(KEY_ADDR) || state.profileData?.addresses?.find(a => a.is_default)?.id || null;
      if (!addressId) throw new Error('Please select a delivery address first.');

      const requested = localStorage.getItem(KEY_TIME);
      const requestedAt = requested ? new Date(requested).toISOString() : null;
      const payment = state.pay || document.querySelector('.pay-opt.on')?.dataset.pay || 'mtn';
      const c = client();
      if (!c) throw new Error('Backend not configured.');

      const { data, error } = await c.rpc('place_order_secure_v2', {
        p_cart: state.cart,
        p_payment_method: payment,
        p_address_id: addressId,
        p_requested_delivery_at: requestedAt,
      });
      if (error) throw error;

      state.orderNo = data.orderNo;
      state.orderId = data.orderId || null;
      state.addressId = addressId;
      state.cart = [];
      if (typeof persistCart === 'function') persistCart();
      localStorage.removeItem(KEY_TIME);
      localStorage.removeItem(KEY_ADDR);

      try {
        if (window.BuwoomiBackend?.createNotification) {
          await window.BuwoomiBackend.createNotification({
            title: 'Order placed',
            body: `${data.orderNo} has been received and is being prepared.`,
            kind: 'order',
          });
        }
      } catch (_) {}

      toast(requestedAt ? `Order ${data.orderNo} scheduled.` : `Order ${data.orderNo} placed.`);
      // Stay inside the SPA. Never use location.reload() here: a reload restarts the splash sequence.
      go('confirmed', { orderNo: data.orderNo }, 'forward');
    } catch (e) {
      button.disabled = false;
      toast(e.message || 'Could not place your order.');
    } finally {
      busy = false;
    }
  }

  // Capture before delivery-features.js. This prevents two checkout handlers
  // competing for the same #place button.
  document.addEventListener('click', (event) => {
    const button = event.target.closest?.('#place');
    if (!button) return;
    const title = document.querySelector('#screen .topbar h2')?.textContent?.trim();
    if (title !== 'Checkout') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    place(button);
  }, true);
})();
