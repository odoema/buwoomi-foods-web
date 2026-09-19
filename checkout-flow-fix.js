/* BUWOOMI checkout sequencing guard.
   Single reliable order path. Never reloads the document after an order.
   Runs before delivery-features.js and intercepts #place in capture phase. */
(() => {
  let busy = false;
  const KEY_TIME = 'buwoomi-delivery-requested-at';
  const KEY_ADDR = 'buwoomi-checkout-address-id';

  const toast = (msg) => {
    if (typeof showToast === 'function') showToast(msg);
    else window.alert(msg);
  };

  async function place(button) {
    if (busy) return;
    busy = true;
    button.disabled = true;

    try {
      if (!Array.isArray(state.cart) || !state.cart.length) throw new Error('Your cart is empty.');

      const { sub } = typeof cartTotals === 'function' ? cartTotals() : { sub: 0 };
      const minOrder = Number(state.settings?.minimum_order_ugx || state.adminSettings?.minimum_order_ugx || 0);
      if (minOrder > 0 && sub < minOrder) throw new Error(`Minimum order is UGX ${minOrder.toLocaleString('en-UG')}.`);

      const backendOn = !!(window.BuwoomiBackend && window.BuwoomiBackend.ready);

      // Resolve session
      let session = state.session || null;
      if (backendOn && !session) {
        session = await window.BuwoomiBackend.getSession();
        state.session = session;
      }
      if (backendOn && !session) throw new Error('Please sign in first.');

      // Resolve address: state → localStorage → default saved address
      let addressId =
        state.addressId ||
        localStorage.getItem(KEY_ADDR) ||
        state.profileData?.addresses?.find((a) => a.is_default)?.id ||
        null;

      if (backendOn && !addressId) {
        // Try loading addresses once more
        try {
          const addrs = await window.BuwoomiBackend.fetchAddresses();
          if (addrs?.length) {
            state.profileData.addresses = addrs;
            addressId = addrs.find((a) => a.is_default)?.id || addrs[0].id;
            state.addressId = addressId;
          }
        } catch (_) {}
      }

      if (backendOn && !addressId) throw new Error('Please select a delivery address first.');

      const payment = state.pay || document.querySelector('.pay-opt.on')?.dataset.pay || 'mtn';
      const requested = localStorage.getItem(KEY_TIME);
      // Scheduling is stored for UI; primary RPC may not accept it yet.
      // We still clear it after success.

      let result;
      if (backendOn) {
        result = await window.BuwoomiBackend.placeOrder({
          cart: state.cart,
          paymentMethod: payment,
          addressId: addressId,
        });
      } else {
        result = {
          orderNo: `BW-${new Date().getFullYear()}-` + String(Math.floor(Math.random() * 999999)).padStart(6, '0'),
          orderId: null,
          persisted: false,
        };
      }

      state.orderNo = result.orderNo;
      state.orderId = result.orderId || null;
      if (addressId) state.addressId = addressId;
      state.cart = [];
      if (typeof persistCart === 'function') persistCart();
      localStorage.removeItem(KEY_TIME);
      localStorage.removeItem(KEY_ADDR);

      try {
        if (backendOn && result.persisted && window.BuwoomiBackend?.createNotification) {
          await window.BuwoomiBackend.createNotification({
            title: 'Order placed',
            body: `${result.orderNo} has been received and is being prepared.`,
            kind: 'order',
          });
        }
      } catch (_) {}

      toast(requested ? `Order ${result.orderNo} scheduled.` : `Order ${result.orderNo} placed.`);

      // Stay inside the SPA. Never use location.reload().
      if (typeof go === 'function') {
        go('confirmed', { orderNo: result.orderNo }, 'forward');
      }
    } catch (e) {
      button.disabled = false;
      toast(e.message || 'Could not place your order.');
    } finally {
      busy = false;
    }
  }

  // Capture before any bubble handlers (including app.js onclick).
  document.addEventListener(
    'click',
    (event) => {
      const button = event.target.closest?.('#place');
      if (!button) return;
      const title = document.querySelector('#screen .topbar h2')?.textContent?.trim();
      if (title !== 'Checkout') return;
      event.preventDefault();
      event.stopImmediatePropagation();
      place(button);
    },
    true
  );

  // Mark that the guard is active so app.js can skip its own place handler if desired.
  window.__buwoomiCheckoutGuard = true;
})();
