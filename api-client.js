/* Stage-2 HTTP adapter. Used when window.API_BASE_URL is set. */
(function (w) {
  function apiOn() {
    return typeof w.API_BASE_URL === "string" && w.API_BASE_URL.length > 0;
  }

  async function token() {
    const session = await (w.BuwoomiBackend?.getSession?.() || Promise.resolve(null));
    return session?.access_token || null;
  }

  async function api(path, opts) {
    if (!apiOn()) throw new Error("API_BASE_URL not set");
    const headers = Object.assign({ "Content-Type": "application/json" }, opts?.headers || {});
    const t = await token();
    if (t) headers.Authorization = "Bearer " + t;
    const res = await fetch(w.API_BASE_URL.replace(/\/$/, "") + path, Object.assign({}, opts, { headers }));
    const text = await res.text();
    let body = null;
    try { body = text ? JSON.parse(text) : null; } catch (_) { body = { message: text }; }
    if (!res.ok) {
      const msg = body?.message || body?.error || text || res.statusText;
      throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
    return body;
  }

  function cartToPayload(cart) {
    return (cart || []).map((i) => ({
      menu_item_id: i.baseId || i.id,
      qty: Number(i.qty) || 1,
      size: i.size || (/\(Large\)/.test(i.name || "") ? "Large" : "Regular"),
      extras: Array.isArray(i.extras)
        ? i.extras.map((e) => ({
            id: e.id,
            label: e.label,
            price_ugx: e.price_ugx ?? e.price,
          }))
        : [],
    }));
  }

  w.BuwoomiApi = {
    enabled: apiOn,
    menu: () => api("/api/v1/catalog/menu"),
    categories: () => api("/api/v1/catalog/categories"),
    extras: () => api("/api/v1/catalog/extras"),
    adminMenu: () => api("/api/v1/admin/menu"),
    adminCategories: () => api("/api/v1/admin/categories"),
    adminExtras: () => api("/api/v1/admin/extras"),
    saveMenuItem: (item) =>
      api("/api/v1/admin/menu", { method: "POST", body: JSON.stringify(item) }),
    uploadMenuImage: async (file, itemId) => {
      const headers = {};
      const session = await (window.BuwoomiBackend?.getSession?.() || Promise.resolve(null));
      if (session?.access_token) headers.Authorization = "Bearer " + session.access_token;
      const fd = new FormData();
      fd.append("file", file);
      fd.append("itemId", itemId || "item");
      const res = await fetch(
        (window.API_BASE_URL || "").replace(/\/$/, "") + "/api/v1/admin/menu/image",
        { method: "POST", headers: headers, body: fd },
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || body.error || "Upload failed");
      return body.url;
    },
    deleteMenuItem: (id) =>
      api("/api/v1/admin/menu/" + id, { method: "DELETE" }),
    saveCategory: (cat) =>
      api("/api/v1/admin/categories", { method: "POST", body: JSON.stringify(cat) }),
    deleteCategory: (id) =>
      api("/api/v1/admin/categories/" + id, { method: "DELETE" }),
    saveExtra: (extra) =>
      api("/api/v1/admin/extras", { method: "POST", body: JSON.stringify(extra) }),
    deleteExtra: (id) =>
      api("/api/v1/admin/extras/" + id, { method: "DELETE" }),
    adminOrders: () => api("/api/v1/admin/orders"),
    updateOrderStatus: (id, status) =>
      api("/api/v1/admin/orders/" + id, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    adminCustomers: () => api("/api/v1/admin/customers"),
    settings: () => api("/api/v1/settings"),
    saveSettings: (settings) =>
      api("/api/v1/admin/settings", {
        method: "PATCH",
        body: JSON.stringify(settings),
      }),
    notifications: () => api("/api/v1/notifications"),
    markNotificationRead: (id) =>
      api("/api/v1/notifications/" + id + "/read", { method: "PATCH" }),
    createNotification: (payload) =>
      api("/api/v1/notifications", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    favorites: () => api("/api/v1/favorites"),
    toggleFavorite: (menuItemId, enabled) =>
      api("/api/v1/favorites", {
        method: "PUT",
        body: JSON.stringify({ menu_item_id: menuItemId, enabled }),
      }),
    paymentMethods: () => api("/api/v1/payments/methods"),
    savePaymentMethod: ({ id, methodType, label, last4, isDefault }) =>
      api("/api/v1/payments/methods", {
        method: "POST",
        body: JSON.stringify({
          id: id || undefined,
          method_type: methodType,
          label,
          last4: last4 || null,
          is_default: !!isDefault,
        }),
      }),
    deletePaymentMethod: (id) =>
      api("/api/v1/payments/methods/" + id, { method: "DELETE" }),
    me: () => api("/api/v1/users/me"),
    updateMe: (fields) =>
      api("/api/v1/users/me", { method: "PATCH", body: JSON.stringify(fields) }),
    addresses: () => api("/api/v1/delivery/addresses"),
    deliveryOptions: () => api("/api/v1/delivery/options"),
    saveAddress: ({ id, label, line1, city, isDefault, latitude, longitude }) => {
      const body = {
        label: label || "Home",
        line1,
        city: city || "Kampala",
        is_default: !!isDefault,
      };
      if (latitude != null && Number.isFinite(Number(latitude))) body.latitude = Number(latitude);
      if (longitude != null && Number.isFinite(Number(longitude))) body.longitude = Number(longitude);
      if (id) {
        return api("/api/v1/delivery/addresses/" + id, {
          method: "PATCH",
          body: JSON.stringify(body),
        });
      }
      return api("/api/v1/delivery/addresses", {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
    deleteAddress: (id) =>
      api("/api/v1/delivery/addresses/" + id, { method: "DELETE" }),
    placeOrder: async ({ cart, paymentMethod, addressId }) => {
      const order = await api("/api/v1/orders", {
        method: "POST",
        body: JSON.stringify({
          items: cartToPayload(cart),
          payment_method: paymentMethod,
          delivery_address_id: addressId || undefined,
        }),
      });
      try {
        await api("/api/v1/payments/intent", {
          method: "POST",
          body: JSON.stringify({
            order_id: order.id,
            provider: paymentMethod || "mtn",
          }),
        });
      } catch (_) {}
      return {
        orderNo: order.order_no,
        orderId: order.id,
        subtotal: order.subtotal_ugx,
        fee: order.delivery_fee_ugx,
        total: order.total_ugx,
        persisted: true,
        via: "nestjs",
      };
    },
    orders: () => api("/api/v1/orders"),
    rate: (id, rating, comment) =>
      api("/api/v1/orders/" + id + "/rating", {
        method: "POST",
        body: JSON.stringify({ rating, comment }),
      }),
  };
})(window);
