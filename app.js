/* ==========================================================================
   BUWOOMI FOODS — production customer app
   ========================================================================== */

const $ = (sel, el = document) => el.querySelector(sel);
const screenEl = $("#screen");
const toastEl = $("#toast");

/* --------------------------------------------------------------------------
   Icons — small inline SVGs so the UI never depends on emoji rendering
   -------------------------------------------------------------------------- */
const ICON = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
  orders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h9l3 3v15H6z"/><path d="M9 9h6M9 13h6M9 17h3"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="9.5" cy="20.5" r="1.4"/><circle cx="17" cy="20.5" r="1.4"/></svg>',
  profile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10Z"/><path d="M10.3 19a1.8 1.8 0 0 0 3.4 0"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.6-3.6"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 19 8 12l7-7"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.2s-7.6-4.5-10-9.4C.5 6.9 2.6 3.5 6.3 3.2 8.7 3 10.8 4.3 12 6.3 13.2 4.3 15.3 3 17.7 3.2c3.7.3 5.8 3.7 4.3 7.6-2.4 4.9-10 9.4-10 9.4Z"/></svg>',
  star: '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6.3 6.8.7-5.1 4.6 1.5 6.7L12 17.3l-6.1 3.5 1.5-6.7-5.1-4.6 6.8-.7Z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5 9.5 18 20 6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 8.5 8.5 0 0 0 2.66.43 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A16 16 0 0 1 3 5a1 1 0 0 1 1-1h3.6a1 1 0 0 1 1 1 8.5 8.5 0 0 0 .43 2.66 1 1 0 0 1-.25 1Z"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M21 11.5a7.5 7.5 0 0 1-11.4 6.4L4 19l1.2-4.3A7.5 7.5 0 1 1 21 11.5Z"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="m9 6 6 6-6 6"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l1 12.5a1 1 0 0 1-1 1.1H6a1 1 0 0 1-1-1.1L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  google: '<svg viewBox="0 0 24 24" width="15" height="15"><path fill="#4285F4" d="M23.5 12.3c0-.85-.08-1.66-.22-2.44H12v4.62h6.46a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.56-5.18 3.56-8.81Z"/><path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.94-2.9l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.96H1.26v3.1A12 12 0 0 0 12 24Z"/><path fill="#FBBC05" d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29v-3.1H1.26A12 12 0 0 0 0 12c0 1.94.46 3.77 1.26 5.39Z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.6 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.26 6.6l4.01 3.1C6.22 6.86 8.87 4.75 12 4.75Z"/></svg>',
  apple: '<svg viewBox="0 0 24 24" width="15" height="15"><path d="M16.4 1c.1 1.1-.32 2.2-1 3-.7.83-1.85 1.46-2.85 1.38-.13-1.06.38-2.17 1.02-2.9C14.3 1.6 15.42 1.05 16.4 1Zm3.87 16.9c-.36.84-.79 1.63-1.36 2.4-.78 1.06-1.6 2.13-2.9 2.15-1.24.03-1.65-.74-3.06-.74-1.42 0-1.87.72-3.05.77-1.26.05-2.2-1.15-3-2.2-1.63-2.16-2.9-6.13-1.2-8.9.83-1.36 2.3-2.22 3.9-2.24 1.24-.03 2.4.82 3.06.82.66 0 2.05-1.02 3.46-.87.59.02 2.24.23 3.3 1.77-.09.05-1.97 1.13-1.95 3.4.02 2.7 2.4 3.6 2.42 3.61l-.02.03Z"/></svg>',
  mapPin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"/><circle cx="12" cy="9" r="2.4"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
  flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c1 3-2 4.3-2 7.3a4 4 0 0 0 8 0c0-1.7-.7-2.7-.7-2.7s.5 3.4-1.8 3.4c-1.7 0-1.8-1.6-1-3-2.6 1.2-4.5 4-4.5 6.8a5 5 0 0 0 10 0c0-5.2-4-7.4-4-11.8Z"/></svg>',
  drumstick: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 4.2c3 .2 5.8 3 5.6 6-.1 1.9-1.2 3.1-2.5 4.1l-3.8 3.8a2.6 2.6 0 1 1-3.7-3.7l3.8-3.8c1-1.3 2.2-2.4 2.1-4.3-.1-1.1-.7-2.1-1.5-2.1Z"/><circle cx="6.8" cy="17.2" r="2.4"/></svg>',
  beef: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.2c0-3 3.2-5.2 8-5.2s8 2.2 8 5.2-3.2 8.6-8 8.6-8-5.6-8-8.6Z"/><path d="M8 8.6 14.2 14M9 13.2l4-4"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14Z"/><path d="M5 19c2-4.2 5-7.2 9-9.2"/></svg>',
  cup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9h11l-1 8.6a2 2 0 0 1-2 1.9H9a2 2 0 0 1-2-1.9Z"/><path d="M17 10.5h1.3a2.3 2.3 0 0 1 0 4.6H17"/><path d="M9 5.3v2M12 5.3v2M15 5.3v2"/></svg>',
  chefHat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 21h10M8 21v-6M16 21v-6M6 10.6a3.5 3.5 0 0 1 3.4-4.3 3 3 0 0 1 5.2 0A3.5 3.5 0 0 1 18 10.6c0 2-1.4 3.3-3 3.9v.5H9v-.5c-1.6-.6-3-1.9-3-3.9Z"/></svg>',
  scooter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="18" r="2.2"/><path d="M6 18h6l2-6h4M12 12l-2-4H7"/></svg>',
};
function icon(name, cls) { return `<span class="i${cls ? " " + cls : ""}" aria-hidden="true">${ICON[name] || ""}</span>`; }

/* --------------------------------------------------------------------------
   Data
   -------------------------------------------------------------------------- */
let MENU = [
  { id: "gcb", name: "Grilled Chicken Bowl", price: 18000, cat: "Chicken", popular: true, desc: "Juicy grilled chicken, steamed rice, fresh salad and our special sauce.", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80" },
  { id: "cb", name: "Chicken Burger", price: 15000, cat: "Chicken", popular: false, desc: "Crispy chicken fillet, house sauce, fresh lettuce — served with fries.", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80" },
  { id: "bs", name: "Beef Stew", price: 16000, cat: "Beef", popular: true, desc: "Slow-cooked beef stew, served with rice or matooke.", img: "https://images.unsplash.com/photo-1604908177522-040670eb827d?w=800&q=80" },
  { id: "ff", name: "Fish Fillet", price: 20000, cat: "Beef", popular: true, desc: "Pan-seared fish fillet with fries and a fresh garden salad.", img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80" },
  { id: "vp", name: "Veggie Pasta", price: 14000, cat: "Veggie", popular: false, desc: "Fresh seasonal vegetables tossed with pasta in a light herb sauce.", img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80" },
  { id: "cw", name: "Chicken Wings", price: 16000, cat: "Chicken", popular: true, desc: "6-piece grilled wings tossed in our special sauce.", img: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800&q=80" },
  { id: "fj", name: "Fresh Juice", price: 5000, cat: "Drinks", popular: false, desc: "Seasonal fruit, freshly pressed to order.", img: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80" },
];

let CATEGORIES = ["Popular", "Chicken", "Beef", "Veggie", "Drinks"];
const CATEGORY_ICON = { Popular: "flame", Chicken: "drumstick", Beef: "beef", Veggie: "leaf", Drinks: "cup" };
const CATEGORY_ID_TO_NAME = { chicken: "Chicken", beef: "Beef", veggie: "Veggie", drinks: "Drinks", popular: "Popular" };

const PAY_METHODS = [
  ["mtn", "MTN Mobile Money", "#FFC700", "#212121", "M"],
  ["airtel", "Airtel Money", "#E4002B", "#fff", "A"],
  ["card", "Visa / Mastercard", "#1A1F71", "#fff", "V"],
  ["cash", "Cash on Delivery", "#2E7D32", "#fff", "$"],
];

let EXTRAS = [
  { id: "chicken", label: "Extra Chicken", price: 5000 },
  { id: "avo", label: "Avocado", price: 2000 },
];

/* --------------------------------------------------------------------------
   Backend sync — replaces the mock arrays above with live data when
   supabase-config.js has a real anon key. Fails silently to the mock data.
   -------------------------------------------------------------------------- */
async function syncMenuFromBackend() {
  if (!window.BuwoomiBackend || !window.BuwoomiBackend.ready) return;
  try {
    const [items, extras, categories, settings] = await Promise.all([
      window.BuwoomiBackend.fetchMenuItems(),
      window.BuwoomiBackend.fetchExtras(),
      window.BuwoomiBackend.fetchCategories(),
      window.BuwoomiBackend.fetchSettings(),
    ]);
    if (categories && categories.length) { CATEGORIES = ["Popular", ...categories.sort((a,b)=>a.sort_order-b.sort_order).map(c=>c.name)]; CATEGORIES.forEach(c=>{ if(!CATEGORY_ICON[c]) CATEGORY_ICON[c]="leaf"; }); }
    if (settings) state.settings = settings;
    if (items && items.length) {
      const catMap = Object.fromEntries((categories||[]).map(c=>[c.id,c.name]));
      MENU = items.map((m) => ({
        id: m.id,
        name: m.name,
        price: m.price_ugx,
        cat: catMap[m.category_id] || CATEGORY_ID_TO_NAME[m.category_id] || m.category_id,
        popular: !!m.is_popular,
        desc: m.description || "",
        img: m.image_url || "",
      }));
      state.product = MENU[0];
    }
    if (extras && extras.length) {
      EXTRAS = extras.map((x) => ({ id: x.id, label: x.label, price: x.price_ugx }));
    }
    render();
  } catch (e) {
    console.warn("Menu sync skipped:", e.message);
  }
}

async function syncOrdersFromBackend() {
  if (!window.BuwoomiBackend || !window.BuwoomiBackend.ready) return;
  try {
    state.session = await window.BuwoomiBackend.getSession();
    const [profile, orders, addresses, favorites] = await Promise.all([
      window.BuwoomiBackend.fetchProfile(),
      window.BuwoomiBackend.fetchOrders(),
      window.BuwoomiBackend.fetchAddresses(),
      window.BuwoomiBackend.fetchFavorites(),
    ]);
    if (profile) state.profile = profile;
    if (orders) state.orders = orders;
    if (Array.isArray(addresses)) { state.profileData.addresses = addresses; state.addressId = addresses.find((a) => a.is_default || a.isDefault)?.id || null; }
    if (favorites) state.liked = Object.fromEntries(favorites.map((f) => [f.menu_item_id, true]));
    render();
  } catch (e) {
    console.warn("Order sync skipped:", e.message);
  }
}

/* --------------------------------------------------------------------------
   State
   -------------------------------------------------------------------------- */
const state = {
  screen: "splash",
  prevScreen: null,
  cart: [],
  qty: 1,
  size: "Regular",
  extras: { chicken: false, avo: false },
  product: MENU[0],
  cat: "Popular",
  menuTab: "All",
  pay: "mtn",
  orderNo: null,
  orderId: null,
  rating: 5,
  nav: "home",
  liked: {},
  cameFrom: "home",
  authMode: "signin",
  authError: null,
  authBusy: false,
  session: null,
  orders: [],
  profileSection: null,
  profileLoading: false,
  profileData: { addresses: [], payments: [], favorites: [], notifications: [], orders: [] },
  settings: { delivery_fee_ugx: 5000, minimum_order_ugx: 0, estimated_delivery_min: 25, estimated_delivery_max: 35, service_area: "Kampala", support_email: "support@buwoomifoods.online" },
  addressId: null,
  profile: null,
  adminItems: [],
  adminExtras: [],
  adminCategories: [],
  adminEditing: null,
  adminOrders: [],
  adminSettings: null,
  searchQuery: "",
  orderTab: "active",
  profileEditOpen: false,
};

try {
  const saved = JSON.parse(localStorage.getItem("buwoomi-cart") || "null");
  if (Array.isArray(saved)) state.cart = saved;
} catch (e) { /* ignore corrupt storage */ }

function persistCart() {
  try { localStorage.setItem("buwoomi-cart", JSON.stringify(state.cart)); } catch (e) { /* storage unavailable */ }
}

function ugx(n) { return "UGX " + n.toLocaleString("en-UG"); }

function cartTotals() {
  const sub = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const fee = state.cart.length ? Number(state.adminSettings?.delivery_fee_ugx ?? state.settings?.delivery_fee_ugx ?? 5000) : 0;
  return { sub, fee, total: sub + fee };
}

function cartCount() { return state.cart.reduce((s, i) => s + i.qty, 0); }

/* --------------------------------------------------------------------------
   Navigation + View Transitions
   -------------------------------------------------------------------------- */
function reducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function go(name, extra = {}, direction = "forward") {
  const prev = state.screen;
  const apply = () => {
    Object.assign(state, extra, { screen: name, prevScreen: prev });
    render();
    if (name === "orders" || name === "profile") syncOrdersFromBackend();
    if (name === "checkout") ensureCheckoutReady();
  };

  if (document.startViewTransition && !reducedMotion()) {
    document.documentElement.setAttribute("data-transition", direction);
    const t = document.startViewTransition(apply);
    t.finished.finally(() => document.documentElement.removeAttribute("data-transition"));
  } else if (!reducedMotion()) {
    screenEl.classList.add("screen-fade-out");
    setTimeout(() => {
      apply();
      screenEl.classList.remove("screen-fade-out");
      screenEl.classList.add("screen-fade-in");
      setTimeout(() => screenEl.classList.remove("screen-fade-in"), 280);
    }, 130);
  } else {
    apply();
  }
}

/** Ensure session + addresses are loaded before checkout can place an order. */
async function ensureCheckoutReady() {
  if (!window.BuwoomiBackend || !window.BuwoomiBackend.ready) return;
  try {
    if (!state.session) {
      state.session = await window.BuwoomiBackend.getSession();
    }
    if (state.session && (!state.profileData.addresses || !state.profileData.addresses.length || !state.addressId)) {
      const addresses = await window.BuwoomiBackend.fetchAddresses();
      if (addresses) {
        state.profileData.addresses = addresses;
        const stored = localStorage.getItem("buwoomi-checkout-address-id");
        state.addressId = stored || addresses.find((a) => a.is_default)?.id || addresses[0]?.id || state.addressId || null;
        render();
      }
    }
  } catch (e) {
    console.warn("Checkout prep skipped:", e.message);
  }
}

function tabbar(active) {
  const items = [
    ["home", "home", "Home"],
    ["menu", "menu", "Menu"],
    ["orders", "orders", "Orders"],
    ["cart", "cart", "Cart"],
    ["profile", "profile", "Profile"],
  ];
  const count = cartCount();
  return `<nav class="tabbar">${items.map(([id, ic, l]) =>
    `<button class="${active === id ? "on" : ""}" data-go="${id}">
      ${icon(ic)}${id === "cart" && count ? `<span class="cart-badge${state.bumpBadge ? " bump" : ""}">${count}</span>` : ""}
      ${l}
    </button>`
  ).join("")}</nav>`;
}

function bindNav() {
  document.querySelectorAll("[data-go]").forEach((b) => {
    b.onclick = async () => {
      let id = b.dataset.go;
      const tabIds = ["home", "menu", "orders", "cart", "profile"];

      // Checkout requires sign-in when backend is live
      if (id === "checkout" && window.BuwoomiBackend?.ready) {
        if (!state.session) {
          try {
            state.session = await window.BuwoomiBackend.getSession();
          } catch (_) {}
        }
        if (!state.session) {
          showToast("Please sign in to checkout.");
          id = "login";
        }
      }

      const dir = tabIds.includes(id)
        ? "fade"
        : b.classList.contains("icon-btn") || b.dataset.back
          ? "back"
          : "forward";
      if (tabIds.includes(id)) state.nav = id;
      go(id, {}, dir);
    };
  });
}

/* --------------------------------------------------------------------------
   Toast
   -------------------------------------------------------------------------- */
let toastTimer = null;
function showToast(msg) {
  toastEl.innerHTML = `<span class="tick">${ICON.check}</span><span>${msg}</span>`;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
}

const PROFILE_SECTIONS = [
  ["addresses", "Saved Addresses"],
  ["payments", "Payment Methods"],
  ["favorites", "Favourite Meals"],
  ["notifications", "Notifications"],
  ["orders", "Order History"],
  ["help", "Help & Support"],
  ["terms", "Terms & Privacy"],
  ["about", "About BUWOOMI"],
];

function esc(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
}

function profileTitle(section) {
  return PROFILE_SECTIONS.find(([id]) => id === section)?.[1] || "Profile";
}

async function openProfileSection(section) {
  state.profileSection = section;
  state.profileLoading = true;
  go("profileDetail", {}, "forward");
  const backend = window.BuwoomiBackend;
  try {
    if (!backend || !backend.ready) return;
    if (section === "addresses") {
      const addresses = await backend.fetchAddresses();
      state.profileData.addresses = Array.isArray(addresses) ? addresses : [];
      state.addressId = state.profileData.addresses.find((a) => a.is_default || a.isDefault)?.id || state.addressId || null;
    } else if (section === "payments") {
      state.profileData.payments = await backend.fetchSavedPaymentMethods() || [];
    } else if (section === "favorites") {
      state.profileData.favorites = await backend.fetchFavorites() || [];
      state.liked = Object.fromEntries(state.profileData.favorites.map((f) => [f.menu_item_id, true]));
    } else if (section === "notifications") {
      state.profileData.notifications = await backend.fetchNotifications() || [];
    } else if (section === "orders") {
      state.profileData.orders = await backend.fetchOrders() || [];
    }
  } catch (e) {
    showToast(e.message || "Could not load this section.");
  } finally {
    state.profileLoading = false;
    render();
  }
}

async function openAdminMenu() {
  if (!state.profile?.is_admin) return showToast("Admin access required.");
  state.adminEditing = null;
  go("adminMenu", {}, "forward");
  try {
    const b = window.BuwoomiBackend;
    const [items, extras, categories, settings] = await Promise.all([b.fetchAllMenuItems(), b.fetchExtras(), b.fetchCategories(), b.fetchSettings()]);
    state.adminItems = items || []; state.adminExtras = extras || []; state.adminCategories = categories || []; state.adminSettings = settings || state.settings; state.settings = settings || state.settings;
    render();
  } catch (e) { showToast(e.message || "Could not load menu management."); }
}

function adminMenuView() {
  const items = state.adminItems || [];
  const cats = state.adminCategories || [];
  const extras = state.adminExtras || [];
  const editing = state.adminEditing;
  return `<div class="page admin-page">
    <div class="topbar"><button class="icon-btn" data-go="profile" data-back="1">${icon("back")}</button><h2>Menu Management</h2><span></span></div>
    <div class="admin-wrap">
      <div class="admin-head"><div><h3>Menu Items</h3><p>Control what customers see and order.</p></div><button class="cta" id="adminNewItem">+ Add Item</button></div>
      ${editing ? `<div class="summary admin-form"><h3>${editing.existingId ? "Edit Menu Item" : "Add Menu Item"}</h3>
        <div class="admin-grid">
          <div class="field"><label>Name</label><input id="miName" value="${esc(editing.name)}" placeholder="Chicken Burger" /></div>
          <div class="field"><label>Price (UGX)</label><input id="miPrice" type="number" min="0" value="${esc(editing.price_ugx)}" /></div>
          <div class="field"><label>Category</label><select id="miCategory">${cats.map(c => `<option value="${esc(c.id)}" ${c.id === editing.category_id ? "selected" : ""}>${esc(c.name)}</option>`).join("")}</select></div>
          <div class="field"><label>Image URL</label><input id="miImage" value="${esc(editing.image_url)}" placeholder="https://..." /><input id="miImageFile" type="file" accept="image/*" style="margin-top:8px" /><small style="color:var(--muted)">Choose a file to upload to BUWOOMI Storage, or paste an image URL.</small></div>
          <div class="field admin-full"><label>Description</label><textarea id="miDesc" placeholder="Short description">${esc(editing.description)}</textarea></div>
        </div>
        <div class="admin-checks"><label><input id="miPopular" type="checkbox" ${editing.is_popular ? "checked" : ""}/> Popular</label><label><input id="miAvailable" type="checkbox" ${editing.is_available !== false ? "checked" : ""}/> Available to order</label></div>
        <div style="display:flex;gap:10px"><button class="cta ghost" id="adminCancel">Cancel</button><button class="cta" id="adminSave">Save Item</button></div>
      </div>` : ""}
      <div class="admin-items">${items.length ? items.map(m => `<div class="admin-item"><div class="admin-thumb" style="background-image:url('${esc(m.image_url || "")}')"></div><div class="admin-info"><strong>${esc(m.name)}</strong><span>${ugx(m.price_ugx)} · ${esc(cats.find(c=>c.id===m.category_id)?.name || m.category_id || "Uncategorised")}</span><span class="admin-status ${m.is_available ? "on" : "off"}">${m.is_available ? "Available" : "Unavailable"}${m.is_popular ? " · Popular" : ""}</span></div><div class="admin-actions"><button class="cta ghost" data-admin-edit="${esc(m.id)}">Edit</button><button class="cta ghost danger" data-admin-delete="${esc(m.id)}">Delete</button></div></div>`).join("") : `<div class="empty"><h3>No menu items</h3><p>Add your first item above.</p></div>`}</div>
      <div class="admin-head" style="margin-top:28px"><div><h3>Extras</h3><p>Manage add-ons customers can select.</p></div><button class="cta ghost" id="adminNewExtra">+ Add Extra</button></div>
      <div class="admin-extra-list">${extras.map(x => `<div class="summary admin-extra"><div><strong>${esc(x.label)}</strong><span>${ugx(x.price_ugx)}</span></div><div style="display:flex;gap:8px"><button class="cta ghost" data-admin-extra-edit="${esc(x.id)}">Edit</button><button class="cta ghost danger" data-admin-extra-delete="${esc(x.id)}">Delete</button></div></div>`).join("")}</div>
      <div class="admin-head" style="margin-top:28px"><div><h3>Categories</h3><p>Control menu sections and ordering.</p></div><button class="cta ghost" id="adminNewCategory">+ Add Category</button></div>
      <div class="admin-extra-list">${cats.map(x => `<div class="summary admin-extra"><div><strong>${esc(x.name)}</strong><span>${esc(x.id)} · order ${x.sort_order}</span></div><div style="display:flex;gap:8px"><button class="cta ghost" data-admin-cat-edit="${esc(x.id)}">Edit</button><button class="cta ghost danger" data-admin-cat-delete="${esc(x.id)}">Delete</button></div></div>`).join("")}</div>
    </div></div>`;
}

function profileDetailView() {
  const section = state.profileSection || "addresses";
  const title = profileTitle(section);
  const backendOn = !!(window.BuwoomiBackend && window.BuwoomiBackend.ready);
  const loading = state.profileLoading;
  let body = "";

  if (!backendOn && ["addresses", "payments", "favorites", "notifications", "orders"].includes(section)) {
    body = `<div class="empty"><h3>Backend not connected</h3><p>Connect Supabase to use ${esc(title)}.</p></div>`;
  } else if (loading) {
    body = `<div class="empty"><h3>Loading…</h3><p>Syncing your ${esc(title.toLowerCase())}.</p></div>`;
  } else if (section === "addresses") {
    const rows = state.profileData.addresses || [];
    body = `
      <div class="section">
        ${rows.length ? rows.map(a => `<div class="summary" style="margin:10px 0">
          <div class="sr"><strong>${esc(a.label || "Home")}</strong>${(a.is_default || a.isDefault) ? `<span style="color:var(--green);font-size:12px">Default</span>` : ""}</div>
          <p style="margin:8px 0;color:var(--muted)">${esc(a.line1 || a.address || "")}<br>${esc(a.city || "Kampala")}</p>
          <div style="display:flex;gap:8px">
            ${!(a.is_default || a.isDefault) ? `<button class="cta ghost" style="flex:1;margin:0" data-address-default="${a.id}">Make Default</button>` : ""}
            <button class="cta ghost" style="flex:1;margin:0" data-address-delete="${a.id}">Delete</button>
          </div>
        </div>`).join("") : `<div class="empty"><h3>No saved addresses</h3><p>Add one for faster checkout.</p></div>`}
        <div class="summary">
          <h4>Add Address</h4>
          <p id="placesStatus" style="font-size:12px;color:var(--muted);margin:0 0 8px">Search a real place (Google) or type manually</p>
          <div class="field"><label>Label</label><input id="addressLabel" placeholder="Home / Office" /></div>
          <div class="field"><label>Delivery address</label><input id="addressLine1" placeholder="e.g. Plot 12, Kampala Road…" autocomplete="street-address" /><button type="button" class="cta ghost" id="useLocationBtn" style="margin-top:8px">Use my current location</button><p id="locationStatus" style="font-size:12px;color:var(--muted);margin:7px 0 0">You can also pin your current location.</p></div>
          <div class="field"><label>City</label><input id="addressCity" placeholder="Kampala" value="Kampala" /></div>
          <label style="display:flex;gap:8px;align-items:center;font-size:13px;margin:10px 0"><input id="addressDefault" type="checkbox" checked /> Make default</label>
          <button class="cta" id="saveAddressBtn">Save Address</button>
        </div>
      </div>`;
  } else if (section === "payments") {
    const rows = state.profileData.payments || [];
    body = `<div class="section">
      ${rows.length ? rows.map(pm => `<div class="summary" style="margin:10px 0">
        <div class="sr"><strong>${esc(pm.label)}</strong>${pm.is_default ? `<span style="color:var(--green);font-size:12px">Default</span>` : ""}</div>
        <p style="margin:8px 0;color:var(--muted)">${esc(pm.method_type.toUpperCase())}${pm.last4 ? ` · •••• ${esc(pm.last4)}` : ""}</p>
        <button class="cta ghost" style="margin:0;width:100%" data-payment-delete="${pm.id}">Remove</button>
      </div>`).join("") : `<div class="empty"><h3>No saved payment methods</h3><p>Only masked details are stored; full card numbers are never saved here.</p></div>`}
      <div class="summary">
        <h4>Save a Payment Method</h4>
        <div class="field"><label>Type</label><select id="paymentType" style="width:100%;padding:12px;border:1px solid var(--border);border-radius:12px;background:#fff"><option value="mtn">MTN Mobile Money</option><option value="airtel">Airtel Money</option><option value="card">Visa / Mastercard</option><option value="cash">Cash on Delivery</option></select></div>
        <div class="field"><label>Label</label><input id="paymentLabel" placeholder="My main payment" /></div>
        <div class="field"><label>Last 4 digits (optional)</label><input id="paymentLast4" inputmode="numeric" maxlength="4" placeholder="1234" /></div>
        <label style="display:flex;gap:8px;align-items:center;font-size:13px;margin:10px 0"><input id="paymentDefault" type="checkbox" /> Make default</label>
        <button class="cta" id="savePaymentBtn">Save Payment Method</button>
      </div>
    </div>`;
  } else if (section === "favorites") {
    const rows = state.profileData.favorites || [];
    body = `<div class="section">${rows.length ? rows.map(f => {
      const m = f.menu_items || MENU.find(x => x.id === f.menu_item_id) || {};
      return `<div class="row-item" style="margin:10px 0" data-item="${esc(m.id || f.menu_item_id)}"><div class="th" style="background-image:url('${esc(m.image_url || m.img || "")}')"></div><div style="flex:1"><h5>${esc(m.name || "Favourite meal")}</h5><div class="meta">${m.price_ugx ? ugx(m.price_ugx) : (m.price ? ugx(m.price) : "")}</div><button class="link" data-fav-remove="${esc(f.menu_item_id)}">Remove from favourites</button></div></div>`;
    }).join("") : `<div class="empty"><h3>No favourite meals yet</h3><p>Tap the heart on any meal to save it here.</p><button class="cta" style="max-width:220px;margin:16px auto 0" data-go="menu">Browse Menu</button></div>`}</div>`;
  } else if (section === "notifications") {
    const rows = state.profileData.notifications || [];
    body = `<div class="section">${rows.length ? rows.map(n => `<button class="summary" style="text-align:left;width:calc(100% - 32px);border:0;cursor:pointer;opacity:${n.read_at ? .65 : 1}" data-notification="${n.id}"><strong>${esc(n.title)}</strong><p style="margin:7px 0;color:var(--muted)">${esc(n.body)}</p><small style="color:var(--muted)">${new Date(n.created_at).toLocaleString()}</small></button>`).join("") : `<div class="empty"><h3>You're all caught up</h3><p>Order updates and important messages will appear here.</p></div>`}</div>`;
  } else if (section === "orders") {
    const rows = state.profileData.orders || [];
    body = `<div class="section">${rows.length ? rows.map(o => `<div class="summary" style="margin:10px 0"><div class="sr"><strong>${esc(o.order_no)}</strong><span style="color:var(--muted);font-size:12px">${new Date(o.placed_at).toLocaleDateString()}</span></div><p style="margin:8px 0;color:var(--muted)">${esc((o.status || "").replace(/_/g, " "))} · ${ugx(o.total_ugx)}</p></div>`).join("") : `<div class="empty"><h3>No order history yet</h3><p>Your completed orders will appear here.</p><button class="cta" style="max-width:220px;margin:16px auto 0" data-go="menu">Order Now</button></div>`}</div>`;
  } else if (section === "help") {
    body = `<div class="section"><div class="summary"><h3>Help & Support</h3><p style="margin:10px 0;color:var(--muted)">Need help with an order, delivery, payment or your account?</p><p><strong>BUWOOMI Support</strong><br>We're here to help with your next meal.</p><button class="cta" style="margin-top:16px" onclick="window.location.href='mailto:support@buwoomifoods.online'">Email Support</button></div></div>`;
  } else if (section === "terms") {
    body = `<div class="section"><div class="summary"><h3>Terms & Privacy</h3><p style="margin:10px 0;color:var(--muted)">Use BUWOOMI responsibly and provide accurate delivery and contact information. Payment credentials and passwords should never be shared with support staff.</p><p style="color:var(--muted);font-size:13px">Your account data is stored in Supabase and protected with row-level security. Saved payment methods store only masked references such as the last four digits; full card numbers are not stored by this app.</p></div></div>`;
  } else {
    body = `<div class="section"><div class="summary"><h3>About BUWOOMI</h3><p style="margin:10px 0;color:var(--muted)">Fresh food, delivered around Kampala.</p><p style="color:var(--muted);font-size:13px">BUWOOMI connects customers to the menu, ordering, delivery and account tools in one place.</p></div></div>`;
  }
  return `<div class="page"><div class="topbar"><button class="icon-btn" data-go="profile" data-back="1">${icon("back")}</button><h2>${esc(title)}</h2><span></span></div>${body}</div>`;
}

/* --------------------------------------------------------------------------
   Screen templates
   -------------------------------------------------------------------------- */
async function openAdminOrders() {
  if (!state.profile?.is_admin) return showToast("Admin access required.");
  state.screen = "adminOrders"; state.adminOrders = []; render();
  try { state.adminOrders = await window.BuwoomiBackend.fetchAllOrders() || []; render(); } catch (e) { showToast(e.message || "Could not load orders."); }
}

function adminOrdersView() {
  const active = state.adminOrders.filter(o => !["delivered","cancelled"].includes(o.status));
  const past = state.adminOrders.filter(o => ["delivered","cancelled"].includes(o.status));
  const rows = state.orderTab === "active" ? active : past;
  const statuses = ["placed","preparing","out_for_delivery","delivered","cancelled"];
  return `<div class="page admin-page"><div class="topbar"><button class="icon-btn" data-go="profile" data-back="1">${icon("back")}</button><h2>Order Management</h2><span></span></div><div class="admin-wrap"><div class="cats"><button class="chip ${state.orderTab === "active" ? "on" : ""}" data-admin-ordertab="active">Active (${active.length})</button><button class="chip ${state.orderTab === "past" ? "on" : ""}" data-admin-ordertab="past">Past (${past.length})</button></div>${rows.length ? rows.map(o => `<div class="summary" style="margin:10px 0"><div class="sr"><strong>${esc(o.order_no)}</strong><span>${ugx(o.total_ugx)}</span></div><p style="font-size:13px;color:var(--muted);margin:6px 0">${esc(o.profiles?.full_name || o.user_id)} · ${new Date(o.placed_at).toLocaleString()}</p><select data-admin-status="${o.id}" style="width:100%;padding:11px;border:1px solid var(--border);border-radius:10px">${statuses.map(s => `<option value="${s}" ${o.status===s?"selected":""}>${s.replace(/_/g," ")}</option>`).join("")}</select>${o.rider_name || o.rider_phone ? `<p style="font-size:12px;color:var(--muted)">Rider: ${esc(o.rider_name || "")} ${esc(o.rider_phone || "")}</p>` : ""}</div>`).join("") : `<div class="empty"><h3>No ${state.orderTab} orders</h3><p>New customer orders will appear here.</p></div>`}</div></div>`;
}

async function openAdminSettings() {
  if (!state.profile?.is_admin) return showToast("Admin access required.");
  state.screen = "adminSettings"; state.adminSettings = await window.BuwoomiBackend.fetchSettings() || state.settings; render();
}
function adminSettingsView() {
  const s = state.adminSettings || state.settings;
  return `<div class="page admin-page"><div class="topbar"><button class="icon-btn" data-go="profile" data-back="1">${icon("back")}</button><h2>Restaurant Settings</h2><span></span></div><div class="admin-wrap"><div class="summary"><h3>Delivery & Support</h3><div class="field"><label>Delivery fee (UGX)</label><input id="setDeliveryFee" type="number" min="0" value="${esc(s.delivery_fee_ugx)}" /></div><div class="field"><label>Minimum order (UGX)</label><input id="setMinimumOrder" type="number" min="0" value="${esc(s.minimum_order_ugx)}" /></div><div class="admin-grid"><div class="field"><label>Min delivery time</label><input id="setMinTime" type="number" min="1" value="${esc(s.estimated_delivery_min)}" /></div><div class="field"><label>Max delivery time</label><input id="setMaxTime" type="number" min="1" value="${esc(s.estimated_delivery_max)}" /></div></div><div class="field"><label>Service area</label><input id="setArea" value="${esc(s.service_area)}" /></div><div class="field"><label>Support email</label><input id="setSupport" type="email" value="${esc(s.support_email)}" /></div><button class="cta" id="saveSettingsBtn">Save Settings</button></div></div></div>`;
}

function views() {
  const morphBack = ["menu", "home"].includes(state.prevScreen) === false; // unused placeholder guard

  const v = {
    splash: () => `
      <div class="splash">
        <img src="assets/logo-on-green.png" alt="BUWOOMI FOODS LTD" width="210" height="140" />
        <div class="tag">Good Food. Closer to You.</div>
        <div class="loader" role="status" aria-label="Loading"></div>
      </div>`,

    onb1: () => `
      <div class="onb">
        <div class="onb-top"><button class="skip" data-go="login">Skip</button></div>
        <h1>Delicious Meals<br><span class="gold">Delivered<br>to You</span></h1>
        <p class="sub">Your favourite meals,<br>from our kitchen to your<br>doorstep.</p>
        <div class="hero-photo" style="background-image:url('${MENU[0].img}')"></div>
        <div class="onb-foot">
          <div class="dots"><i class="dot on"></i><i class="dot"></i><i class="dot"></i></div>
          <button class="round-next" data-go="onb2" aria-label="Next">${icon("chevronRight")}</button>
        </div>
        <div class="logo-foot"><img src="assets/logo-transparent.png" alt="" /></div>
      </div>`,

    onb2: () => `
      <div class="onb">
        <div class="onb-top"><button class="skip" data-go="login">Skip</button></div>
        <h1>Fresh<br>Quality.<br><span class="gold">Convenient</span></h1>
        <p class="sub">Real ingredients.<br>Great taste. Always.</p>
        <div class="hero-photo" style="background-image:url('https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80')"></div>
        <div class="onb-foot">
          <div class="dots"><i class="dot"></i><i class="dot on"></i><i class="dot"></i></div>
          <button class="round-next" data-go="onb3" aria-label="Next">${icon("chevronRight")}</button>
        </div>
        <div class="logo-foot"><img src="assets/logo-transparent.png" alt="" /></div>
      </div>`,

    onb3: () => `
      <div class="onb">
        <div class="onb-top"><button class="skip" data-go="login">Skip</button></div>
        <h1>Good Food.<br><span class="gold">Closer to You.</span></h1>
        <p class="sub">Order. Relax.<br>We'll take care of the rest.</p>
        <div class="hero-photo" style="background-image:url('https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&q=80')"></div>
        <button class="cta" data-go="login">Get Started</button>
      </div>`,

    login: () => {
      const isSignup = state.authMode === "signup";
      const backendOn = !!(window.BuwoomiBackend && window.BuwoomiBackend.ready);
      return `
      <div class="auth">
        <img class="logo" src="assets/logo-transparent.png" alt="BUWOOMI FOODS LTD" />
        <h2>${isSignup ? "Create Account" : "Welcome Back!"}</h2>
        <p class="lead">${backendOn ? (isSignup ? "Sign up to get started" : "Sign in to continue") : "Demo mode — no backend connected yet"}</p>
        ${isSignup ? `<div class="field"><label>Full Name</label><input id="authName" placeholder="Your name" /></div>` : ""}
        <div class="field"><label>Email</label><input id="authEmail" type="email" placeholder="you@email.com" /></div>
        <div class="field"><label>Password</label><input id="authPassword" type="password" placeholder="••••••••" /></div>
        ${!isSignup ? `<div class="row-between"><span></span><button class="link" id="forgotPasswordBtn">Forgot password?</button></div>` : ""}
        ${state.authError ? `<p style="color:var(--danger);font-size:13px;margin-top:8px">${state.authError}</p>` : ""}
        <button class="cta" id="authSubmit" style="margin-top:16px" ${state.authBusy ? "disabled" : ""}>
          ${state.authBusy ? "Please wait…" : backendOn ? (isSignup ? "Sign Up" : "Sign In") : "Continue (demo)"}
        </button>
        <p class="or">or continue with</p>
        <div class="socials"><button id="googleAuth">${icon("google")} Google</button><button id="appleAuth">${icon("apple")} Apple</button></div>
        <p class="signup-line">${isSignup ? "Already have an account?" : "Don't have an account?"} <button class="link" id="authToggle">${isSignup ? "Sign In" : "Sign Up"}</button></p>
      </div>`;
    },

    home: () => `
      <div class="home">
        <div class="home-head">
          <div class="home-search-row">
            <div class="search">${icon("search")}<input id="homeSearch" value="${esc(state.searchQuery)}" placeholder="Search for meals, cuisine..." /></div>
            <button class="icon-btn" aria-label="Notifications" id="homeNotifications">${icon("bell")}</button>
          </div>
        </div>
        <div class="promo">
          <div class="copy">
            <h3>Good Food.<br>Closer to You.</h3>
            <button class="btn" data-go="menu">Order Now</button>
          </div>
          <div class="img" style="background-image:url('${MENU[0].img}')"></div>
        </div>
        <div class="section">
          <div class="cat-icons">
            ${CATEGORIES.map(c => `
              <button class="cat-icon-btn ${state.cat === c ? "on" : ""}" data-cat="${c}">
                <span class="circle-ic">${icon(CATEGORY_ICON[c])}</span><span>${c}</span>
              </button>`).join("")}
          </div>
        </div>
        <div class="section">
          <div class="section-h"><h4>Today's Picks</h4><button class="link" data-go="menu">See All</button></div>
          <div class="picks">
            ${filterByCat(state.cat).slice(0, 4).map((p, i) => `
              <article class="card stagger" style="--i:${i}" data-item="${p.id}" role="button" tabindex="0">
                <div class="ph" style="${p.id === state.product.id ? "view-transition-name:morph-hero;" : ""}background-image:url('${p.img}')"></div>
                <div class="body">
                  <h5>${p.name}</h5>
                  <div class="desc">${p.desc.slice(0, 26)}…</div>
                  <div class="price-row"><span class="price">${ugx(p.price)}</span>
                  <button class="add" data-add="${p.id}" aria-label="Add ${p.name} to cart">+</button></div>
                </div>
              </article>`).join("") || `<p style="color:var(--muted);font-size:13px;padding:12px 0">No picks in this category yet.</p>`}
          </div>
        </div>
        ${tabbar("home")}
      </div>`,

    menu: () => {
      const baseItems = state.menuTab === "All" ? MENU : filterByCat(state.menuTab);
      const q = state.searchQuery.trim().toLowerCase();
      const items = q ? baseItems.filter(p => `${p.name} ${p.desc} ${p.cat}`.toLowerCase().includes(q)) : baseItems;
      return `
      <div class="page">
        <div class="topbar"><h2>Menu</h2></div>
        <div class="menu-search"><div class="search">${icon("search")}<input id="menuSearchInput" value="${esc(state.searchQuery)}" placeholder="Search for meals, cuisine..." /></div></div>
        <div class="section"><div class="cats">
          ${["All", ...CATEGORIES].map(c => `<button class="chip ${state.menuTab === c ? "on" : ""}" data-mtab="${c}">${c}</button>`).join("")}
        </div></div>
        <div class="list">
          ${items.map((p, i) => `
            <article class="row-item stagger" style="--i:${i}" data-item="${p.id}" role="button" tabindex="0">
              <div class="th" style="${p.id === state.product.id ? "view-transition-name:morph-hero;" : ""}background-image:url('${p.img}')"></div>
              <div>
                <h5>${p.name}</h5>
                <div class="meta">${p.desc}</div>
                <div class="price">${ugx(p.price)}</div>
              </div>
              <button class="add" data-add="${p.id}" aria-label="Add ${p.name} to cart">+</button>
            </article>`).join("") || `<p style="color:var(--muted);font-size:13px;padding:12px">Nothing here yet.</p>`}
        </div>
        ${tabbar("menu")}
      </div>`;
    },

    details: () => {
      const p = state.product;
      const liked = !!state.liked[p.id];
      return `
      <div class="details">
        <div class="hero-big" style="view-transition-name:morph-hero;background-image:url('${p.img}')">
          <div class="abs">
            <button class="circle" data-go="${state.cameFrom}" data-back="1" aria-label="Back">${icon("back")}</button>
            <button class="circle ${liked ? "liked" : ""}" id="likeBtn" aria-label="Save to favourites" aria-pressed="${liked}">${icon("heart")}</button>
          </div>
        </div>
        <div class="pad">
          <h1>${p.name}</h1>
          <div class="price" style="font-size:18px;margin:6px 0">${ugx(p.price)}</div>
          <p style="color:var(--muted);font-size:14px;line-height:1.5">${p.desc}</p>
          <div class="sizes"><strong>Choose size</strong>
            <div class="size-toggle">
              <button type="button" class="size-btn ${state.size === "Regular" ? "on" : ""}" data-sizebtn="Regular">Regular</button>
              <button type="button" class="size-btn ${state.size === "Large" ? "on" : ""}" data-sizebtn="Large">Large&nbsp;+ UGX 4,000</button>
            </div>
          </div>
          <div class="extras"><strong>Add extras</strong>
            ${EXTRAS.map(x => `<label class="opt"><span>${x.label} &nbsp;+ ${ugx(x.price)}</span><input type="checkbox" data-ex="${x.id}" ${state.extras[x.id] ? "checked" : ""} /></label>`).join("")}
          </div>
          <div class="qty">
            <button data-q="-" aria-label="Decrease quantity">−</button><strong>${state.qty}</strong><button data-q="+" aria-label="Increase quantity">+</button>
          </div>
          <button class="cta" id="addCart">Add to Cart · ${ugx(detailsLineTotal())}</button>
        </div>
      </div>`;
    },

    cart: () => {
      if (!state.cart.length) {
        return `<div class="page"><div class="topbar"><h2>Your Cart</h2></div>
          <div class="empty">${icon("bag")}<h3>Your cart is waiting for something delicious.</h3>
          <p>Browse the menu and add a favourite meal.</p>
          <button class="cta" style="margin-top:18px;max-width:220px" data-go="menu">Browse Menu</button></div>
          ${tabbar("cart")}</div>`;
      }
      const t = cartTotals();
      return `
      <div class="page">
        <div class="topbar"><h2>Your Cart</h2><button class="link" id="clear">Clear</button></div>
        <div class="list">
          ${state.cart.map((i, idx) => `
            <article class="cart-row stagger" style="--i:${idx}">
              <div class="th" style="background-image:url('${i.img}')"></div>
              <div>
                <h5>${i.name}</h5>
                <div class="price">${ugx(i.price)}</div>
                <div class="cart-qty">
                  <button data-cq="${idx}|-" aria-label="Decrease">−</button><span>${i.qty}</span><button data-cq="${idx}|+" aria-label="Increase">+</button>
                </div>
              </div>
              <button class="rm" data-rm="${idx}" aria-label="Remove item">✕</button>
            </article>`).join("")}
        </div>
        <div class="summary">
          <div class="sr"><span>Subtotal</span><span>${ugx(t.sub)}</span></div>
          <div class="sr"><span>Delivery Fee</span><span>${ugx(t.fee)}</span></div>
          <div class="sr total"><span>Total</span><span>${ugx(t.total)}</span></div>
        </div>
        <div style="padding:0 16px 16px"><button class="cta" data-go="checkout">Proceed to Checkout</button></div>
        ${tabbar("cart")}
      </div>`;
    },

    checkout: () => {
      const t = cartTotals();
      if (!state.cart.length) {
        return `<div class="page"><div class="topbar"><button class="icon-btn" data-go="cart" data-back="1">${icon("back")}</button><h2>Checkout</h2><span></span></div>
          <div class="empty">${icon("bag")}<h3>Your cart is empty.</h3><p>Add something tasty first.</p>
          <button class="cta" style="margin-top:18px;max-width:220px" data-go="menu">Browse Menu</button></div></div>`;
      }
      return `
      <div class="page" style="padding-bottom:24px">
        <div class="topbar"><button class="icon-btn" data-go="cart" data-back="1">${icon("back")}</button><h2>Checkout</h2><span></span></div>
        <div class="summary">
          <strong>${icon("mapPin")} Delivery Address</strong>
          ${(() => { const a = state.profileData.addresses?.find((x) => x.id === state.addressId) || state.profileData.addresses?.find((x) => x.is_default); return a ? `<p style="margin-top:8px"><strong>${esc(a.label)}</strong><br>${esc(a.line1)}, ${esc(a.city)}</p>` : `<p style="margin-top:8px">No saved address selected.</p>`; })()}
          <button class="link" data-profile-section="addresses">Change</button>
        </div>
        <div class="summary">
          <strong>${icon("clock")} Delivery Time</strong>
          <p style="margin-top:8px;color:var(--green-2)">Deliver now (25–35 mins)</p>
          <p style="color:var(--muted);font-size:13px">Schedule for later</p>
        </div>
        <div class="summary">
          <strong>Payment Method</strong>
          <div style="margin-top:10px">
            ${PAY_METHODS.map(([id, l, bg, fg, letter]) =>
              `<div class="pay-opt ${state.pay === id ? "on" : ""}" data-pay="${id}">
                <span class="pay-badge" style="background:${bg};color:${fg}">${letter}</span>${l}
              </div>`).join("")}
          </div>
          <div class="sr total"><span>Total</span><span>${ugx(t.total)}</span></div>
        </div>
        <div style="padding:0 16px"><button class="cta" id="place">Place Order</button></div>
      </div>`;
    },

    confirmed: () => `
      <div class="center-page">
        <div class="check-wrap"><div class="burst-ring"></div><div class="check">${icon("check")}</div></div>
        <h2>Order Confirmed!</h2>
        <p style="color:var(--muted);margin:10px 0 16px">Thank you for your order.<br>We're preparing your meal.</p>
        <p style="font-weight:600">Order Number<br>${state.orderNo || "BW-2026-000001"}</p>
        <button class="cta" style="margin-top:28px" data-go="preparing">Track Order</button>
        <button class="cta ghost" data-go="home">Back to Home</button>
      </div>`,

    preparing: () => `
      <div class="page" style="background:#fff;padding-bottom:24px">
        <div class="topbar"><button class="icon-btn" data-go="home" data-back="1">${icon("back")}</button><h2>Order Tracking</h2><span></span></div>
        <div class="timeline">
          <div class="tl">
            <div class="tl-dot on">${icon("check")}</div><div><strong>Order Placed</strong><div style="font-size:12px;color:var(--muted)">Just now</div></div>
            <div class="tl-line on"></div><div></div>
            <div class="tl-dot gold">${icon("chefHat")}</div><div><strong>Preparing Your Meal</strong><div style="font-size:12px;color:var(--muted)">Our chefs are on it!</div></div>
            <div class="tl-line"></div><div></div>
            <div class="tl-dot">${icon("bag")}</div><div><strong>Out for Delivery</strong></div>
            <div class="tl-line"></div><div></div>
            <div class="tl-dot">${icon("home")}</div><div><strong>Delivered</strong></div>
          </div>
        </div>
        <p style="text-align:center;margin-top:24px;color:var(--muted)">Freshly cooked. Just for you.</p>
        <div style="padding:24px"><button class="cta ghost" data-go="delivery">Simulate rider pickup</button></div>
      </div>`,

    delivery: () => `
      <div class="page" style="padding-bottom:0;background:#fff">
        <div class="topbar"><button class="icon-btn" data-go="preparing" data-back="1">${icon("back")}</button><h2>Order Tracking</h2><span></span></div>
        <div class="map">
          <div class="map-route">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M18 62 C 32 50, 40 46, 48 42 S 66 32, 78 28" fill="none" stroke="#0B4D2A" stroke-width="0.8" stroke-dasharray="2.4 2.2" stroke-linecap="round" opacity="0.55" vector-effect="non-scaling-stroke"/>
            </svg>
            <span class="map-pin start" style="left:18%;top:62%">${icon("mapPin")}</span>
            <span class="map-pin end" style="left:78%;top:28%">${icon("home")}</span>
            <span class="map-pin rider" style="left:48%;top:42%">${icon("scooter")}</span>
          </div>
        </div>
        <div class="sheet">
          <h3>Your order is on the way!</h3>
          <p style="color:var(--muted);font-size:14px">Estimated arrival <strong>15 mins</strong></p>
          <div class="rider">
            <div class="avatar">D</div>
            <div style="flex:1"><strong>Daniel K.</strong><div style="font-size:12px;color:var(--muted)">★ 4.8 · Rider is nearby</div></div>
            <button class="circle" aria-label="Call rider">${icon("phone")}</button>
            <button class="circle" aria-label="Message rider">${icon("chat")}</button>
          </div>
          <p style="margin-top:12px;font-size:13px;color:var(--green)">Fresh food, happy people.</p>
          <button class="cta" style="margin-top:12px" data-go="delivered">Mark delivered (demo)</button>
        </div>
      </div>`,

    delivered: () => `
      <div class="center-page">
        <img src="assets/logo-transparent.png" alt="" style="height:70px;margin:0 auto 12px" />
        <h2>Delivered!</h2>
        <p style="color:var(--muted);margin:8px 0">Hope you enjoyed your meal!</p>
        <div class="stars" id="stars">${[1, 2, 3, 4, 5].map(n => `<button data-star="${n}" aria-label="${n} star${n > 1 ? "s" : ""}">${icon(n <= state.rating ? "star" : "star", n <= state.rating ? "filled" : "outline")}</button>`).join("")}</div>
        <textarea id="ratingComment" placeholder="Tell us about your experience..."></textarea>
        <button class="cta" style="margin-top:16px" id="submitRating">Submit</button>
        <p style="margin:16px 0 8px">Order again?</p>
        <button class="cta ghost" data-go="menu">Reorder Now</button>
      </div>`,

    orders: () => `
      <div class="page">
        <div class="topbar"><h2>Orders</h2></div>
        <div class="section"><div class="cats">
          <button class="chip ${state.orderTab === "active" ? "on" : ""}" data-customer-ordertab="active">Active</button><button class="chip ${state.orderTab === "past" ? "on" : ""}" data-customer-ordertab="past">Past</button>
        </div></div>
        ${(() => { const active = state.orders.filter(o => !["delivered","cancelled"].includes(o.status)); const past = state.orders.filter(o => ["delivered","cancelled"].includes(o.status)); const rows = state.orderTab === "active" ? active : past; return rows.length ? rows.map(o => `<div class="summary" style="margin:10px 0"><div class="sr"><strong>${esc(o.order_no)}</strong><span>${ugx(o.total_ugx)}</span></div><p style="font-size:13px;color:var(--muted);margin:6px 0">${esc((o.status || "").replace(/_/g," "))} · ${new Date(o.placed_at).toLocaleString()}</p>${!['delivered','cancelled'].includes(o.status) ? `<button class="cta" data-track-order="${o.id}">Track Order</button>` : `<button class="cta ghost" data-reorder-order="${o.id}">Order Again</button>`}</div>`).join("") : `<div class="empty">${icon("orders")}<h3>${state.orderTab === "active" ? "No active orders" : "No past orders"}</h3><button class="cta" style="margin-top:16px;max-width:220px" data-go="menu">Order Now</button></div>`; })()}
        ${tabbar("orders")}
      </div>`,

    profile: () => {
      const email = state.session?.user?.email;
      const initial = (email || "G").charAt(0).toUpperCase();
      return `
      <div class="page">
        <div class="profile-head">
          <div class="big-av">${initial}</div>
          <h3>${esc(state.profile?.full_name || email || "Guest")}</h3>
          <p style="color:var(--muted);font-size:13px">${esc(state.profile?.phone || "Kampala")}</p>
          <button class="link" id="editProfileBtn">Edit profile</button>
          ${state.profileEditOpen ? `<div class="summary" style="margin-top:12px;text-align:left"><div class="field"><label>Full Name</label><input id="profileName" value="${esc(state.profile?.full_name || "")}" /></div><div class="field"><label>Phone</label><input id="profilePhone" value="${esc(state.profile?.phone || "")}" /></div><button class="cta" id="saveProfileBtn">Save Profile</button></div>` : ""}
        </div>
        <div class="menu-list">
          ${state.profile?.is_admin ? `<button data-admin-menu="1" style="font-weight:700;color:var(--green)">Menu Management${icon("chevronRight")}</button><button data-admin-orders="1" style="font-weight:700;color:var(--green)">Order Management${icon("chevronRight")}</button><button data-admin-settings="1" style="font-weight:700;color:var(--green)">Restaurant Settings${icon("chevronRight")}</button>` : ""}
          ${PROFILE_SECTIONS.map(([id, label]) => `<button data-profile-section="${id}">${label}${icon("chevronRight")}</button>`).join("")}
          <button id="logoutBtn" style="color:var(--danger)">Logout</button>
        </div>
        ${tabbar("profile")}
      </div>`;
    },

    profileDetail: () => profileDetailView(),
    adminMenu: () => adminMenuView(),
    adminOrders: () => adminOrdersView(),
    adminSettings: () => adminSettingsView(),
  };

  const content = (v[state.screen] || v.home)();
  const appScreens = ["home","menu","orders","cart","profile","profileDetail","details","checkout","confirmed","preparing","delivery","delivered","adminMenu","adminOrders","adminSettings"];
  if (!appScreens.includes(state.screen)) return content;
  return `<div class="app-shell">
    <header class="app-brand-header">
      <button class="app-brand-button" data-go="home" aria-label="Go to BUWOOMI FOODS home">
        <img src="assets/logo-transparent.png" alt="BUWOOMI FOODS" />
      </button>
    </header>
    ${content}
  </div>`;
}

function filterByCat(cat) {
  if (cat === "Popular") return MENU.filter((m) => m.popular);
  return MENU.filter((m) => m.cat === cat);
}

function detailsLineTotal() {
  const p = state.product;
  const sizeExtra = state.size === "Large" ? 4000 : 0;
  const extrasTotal = EXTRAS.reduce((s, x) => s + (state.extras[x.id] ? x.price : 0), 0);
  return (p.price + sizeExtra + extrasTotal) * state.qty;
}

/* --------------------------------------------------------------------------
   Actions
   -------------------------------------------------------------------------- */
function addToCart(id, opts = {}) {
  const p = MENU.find((m) => m.id === id);
  if (!p) return;
  const existing = state.cart.find((c) => c.baseId === id && !opts.custom);
  if (existing && !opts.custom) {
    existing.qty += 1;
  } else {
    state.cart.push({
      ...p,
      baseId: id,
      qty: opts.qty || 1,
      price: opts.price ?? p.price,
      name: opts.name || p.name,
      size: opts.size || "Regular",
      extras: opts.extras || [],
    });
  }
  persistCart();
  state.bumpBadge = true;
  showToast(`${p.name} added to cart`);
}

function bind() {
  const adminBtn = $("[data-admin-menu]");
  if (adminBtn) adminBtn.onclick = openAdminMenu;
  const adminOrdersBtn = $("[data-admin-orders]");
  if (adminOrdersBtn) adminOrdersBtn.onclick = openAdminOrders;
  const adminSettingsBtn = $("[data-admin-settings]");
  if (adminSettingsBtn) adminSettingsBtn.onclick = openAdminSettings;
  const newItem = $("#adminNewItem");
  if (newItem) newItem.onclick = () => { state.adminEditing = { id: "", name: "", description: "", price_ugx: 0, category_id: state.adminCategories[0]?.id || "", image_url: "", is_popular: false, is_available: true }; render(); };
  const cancelAdmin = $("#adminCancel");
  if (cancelAdmin) cancelAdmin.onclick = () => { state.adminEditing = null; render(); };
  const saveAdmin = $("#adminSave");
  if (saveAdmin) saveAdmin.onclick = async () => {
    const name = $("#miName")?.value.trim(); const price = Number($("#miPrice")?.value);
    if (!name || !Number.isFinite(price) || price < 0) return showToast("Enter a valid name and price.");
    try {
      saveAdmin.disabled = true;
      const existingId = state.adminEditing.existingId;
      const id = existingId || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);
      let imageUrl = $("#miImage")?.value.trim() || null;
      const imageFile = $("#miImageFile")?.files?.[0];
      if (imageFile) imageUrl = await window.BuwoomiBackend.uploadMenuImage(imageFile, id);
      await window.BuwoomiBackend.saveMenuItem({ existingId, id, name, price_ugx: price, category_id: $("#miCategory")?.value || null, image_url: imageUrl, description: $("#miDesc")?.value.trim() || null, is_popular: $("#miPopular")?.checked, is_available: $("#miAvailable")?.checked });
      state.adminEditing = null; await openAdminMenu(); showToast("Menu item saved.");
    } catch (e) { saveAdmin.disabled = false; showToast(e.message || "Could not save item."); }
  };
  document.querySelectorAll("[data-admin-edit]").forEach(b => b.onclick = () => { const m = state.adminItems.find(x => x.id === b.dataset.adminEdit); if (m) { state.adminEditing = {...m, existingId: m.id}; render(); } });
  document.querySelectorAll("[data-admin-delete]").forEach(b => b.onclick = async () => { if (!confirm("Delete this menu item? Existing order records keep their saved item details.")) return; try { await window.BuwoomiBackend.deleteMenuItem(b.dataset.adminDelete); await openAdminMenu(); showToast("Menu item deleted."); } catch(e) { showToast(e.message || "Could not delete item."); } });
  document.querySelectorAll("[data-admin-extra-delete]").forEach(b => b.onclick = async () => { if (!confirm("Delete this extra?")) return; try { await window.BuwoomiBackend.deleteExtra(b.dataset.adminExtraDelete); await openAdminMenu(); showToast("Extra deleted."); } catch(e) { showToast(e.message || "Could not delete extra."); } });
  const newExtra = $("#adminNewExtra");
  if (newExtra) newExtra.onclick = async () => { const label = prompt("Extra name"); if (!label) return; const price = Number(prompt("Price in UGX", "2000")); if (!Number.isFinite(price) || price < 0) return showToast("Invalid price."); try { await window.BuwoomiBackend.saveExtra({ id: label.toLowerCase().replace(/[^a-z0-9]+/g,"-")+"-"+Date.now().toString(36), label, price_ugx: price }); await openAdminMenu(); showToast("Extra added."); } catch(e){ showToast(e.message || "Could not add extra."); } };
  document.querySelectorAll("[data-admin-extra-edit]").forEach(b => b.onclick = async () => { const x = state.adminExtras.find(v => v.id === b.dataset.adminExtraEdit); if (!x) return; const label = prompt("Extra name", x.label); if (label === null) return; const price = Number(prompt("Price in UGX", x.price_ugx)); if (!Number.isFinite(price) || price < 0) return showToast("Invalid price."); try { await window.BuwoomiBackend.saveExtra({ existingId:x.id, id:x.id, label, price_ugx:price }); await openAdminMenu(); showToast("Extra updated."); } catch(e){ showToast(e.message || "Could not update extra."); } });
  const newCat = $("#adminNewCategory");
  if (newCat) newCat.onclick = async () => { const name = prompt("Category name"); if (!name) return; const id = name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); try { await window.BuwoomiBackend.saveCategory({ id, name, icon:"leaf", sort_order: state.adminCategories.length }); await openAdminMenu(); showToast("Category added."); } catch(e){ showToast(e.message || "Could not add category."); } };
  document.querySelectorAll("[data-admin-cat-edit]").forEach(b => b.onclick = async () => { const x=state.adminCategories.find(v=>v.id===b.dataset.adminCatEdit); if(!x)return; const name=prompt("Category name",x.name); if(name===null)return; const sort=Number(prompt("Sort order",x.sort_order)); try { await window.BuwoomiBackend.saveCategory({id:x.id,name,icon:x.icon,sort_order:Number.isFinite(sort)?sort:x.sort_order,existingId:x.id}); await openAdminMenu(); showToast("Category updated."); } catch(e){showToast(e.message||"Could not update category.");} });
  document.querySelectorAll("[data-admin-cat-delete]").forEach(b => b.onclick = async () => { if(!confirm("Delete this category? Items will become uncategorised.")) return; try { await window.BuwoomiBackend.deleteCategory(b.dataset.adminCatDelete); await openAdminMenu(); showToast("Category deleted."); } catch(e){showToast(e.message||"Could not delete category.");} });
  document.querySelectorAll("[data-admin-ordertab]").forEach(b => b.onclick=()=>{state.orderTab=b.dataset.adminOrdertab;render();});
  document.querySelectorAll("[data-customer-ordertab]").forEach(b=>b.onclick=()=>{state.orderTab=b.dataset.customerOrdertab;render();});
  document.querySelectorAll("[data-admin-status]").forEach(b => b.onchange=async()=>{ try { await window.BuwoomiBackend.updateOrderStatus(b.dataset.adminStatus,b.value); await openAdminOrders(); showToast("Order status updated."); } catch(e){showToast(e.message||"Could not update order.");} });
  const saveSettingsBtn=$("#saveSettingsBtn");
  if(saveSettingsBtn) saveSettingsBtn.onclick=async()=>{ try { const s={delivery_fee_ugx:Number($("#setDeliveryFee")?.value),minimum_order_ugx:Number($("#setMinimumOrder")?.value),estimated_delivery_min:Number($("#setMinTime")?.value),estimated_delivery_max:Number($("#setMaxTime")?.value),service_area:$("#setArea")?.value.trim(),support_email:$("#setSupport")?.value.trim()}; if(Object.values(s).some(v=>typeof v==='number'&&!Number.isFinite(v)||typeof v==='number'&&v<0)||!s.service_area||!s.support_email) throw new Error("Enter valid settings."); await window.BuwoomiBackend.saveSettings(s); state.settings={...state.settings,...s}; state.adminSettings={...state.adminSettings,...s}; render(); showToast("Settings saved."); } catch(e){showToast(e.message||"Could not save settings.");} };

  bindNav();

  document.querySelectorAll("[data-item]").forEach((el) => {
    const open = () => {
      if (state.screen === "home" || state.screen === "menu") state.cameFrom = state.screen;
      state.product = MENU.find((m) => m.id === el.dataset.item);
      state.qty = 1;
      state.extras = { chicken: false, avo: false };
      state.size = "Regular";
      go("details", {}, "forward");
    };
    el.addEventListener("click", (e) => { if (!e.target.closest("[data-add]")) open(); });
    el.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && !e.target.closest("[data-add]")) { e.preventDefault(); open(); } });
  });

  document.querySelectorAll("[data-add]").forEach((b) => {
    b.onclick = (e) => {
      e.stopPropagation();
      addToCart(b.dataset.add);
      b.classList.add("pop");
      render();
    };
  });

  document.querySelectorAll("[data-mtab]").forEach((b) => { b.onclick = () => { state.menuTab = b.dataset.mtab; render(); }; });
  document.querySelectorAll("[data-cat]").forEach((b) => { b.onclick = () => { state.cat = b.dataset.cat; render(); }; });
  document.querySelectorAll("[data-pay]").forEach((b) => { b.onclick = () => { state.pay = b.dataset.pay; render(); }; });
  document.querySelectorAll("[data-sizebtn]").forEach((b) => { b.onclick = () => { state.size = b.dataset.sizebtn; render(); }; });
  document.querySelectorAll("[data-ex]").forEach((b) => { b.onchange = () => { state.extras[b.dataset.ex] = b.checked; render(); }; });

  document.querySelectorAll("[data-q]").forEach((b) => {
    b.onclick = () => { state.qty = Math.max(1, state.qty + (b.dataset.q === "+" ? 1 : -1)); render(); };
  });

  document.querySelectorAll("[data-cq]").forEach((b) => {
    b.onclick = () => {
      const [idx, dir] = b.dataset.cq.split("|");
      const item = state.cart[+idx];
      if (!item) return;
      item.qty += dir === "+" ? 1 : -1;
      if (item.qty < 1) state.cart.splice(+idx, 1);
      persistCart();
      render();
    };
  });

  document.querySelectorAll("[data-rm]").forEach((b) => {
    b.onclick = () => { state.cart.splice(+b.dataset.rm, 1); persistCart(); render(); };
  });

  document.querySelectorAll("[data-star]").forEach((b) => {
    b.onclick = () => { state.rating = +b.dataset.star; render(); };
  });

  const likeBtn = $("#likeBtn");
  if (likeBtn) likeBtn.onclick = async () => {
    const id = state.product.id;
    const next = !state.liked[id];
    state.liked[id] = next;
    render();
    try {
      if (window.BuwoomiBackend?.ready && state.session) await window.BuwoomiBackend.toggleFavorite(id, next);
    } catch (e) {
      state.liked[id] = !next;
      showToast(e.message || "Could not update favourites.");
      render();
    }
  };

  const clear = $("#clear");
  if (clear) clear.onclick = () => { state.cart = []; persistCart(); render(); };

  const addCart = $("#addCart");
  if (addCart) addCart.onclick = () => {
    const p = state.product;
    const sizeExtra = state.size === "Large" ? 4000 : 0;
    const extrasTotal = EXTRAS.reduce((s, x) => s + (state.extras[x.id] ? x.price : 0), 0);
    const extraLabels = EXTRAS.filter((x) => state.extras[x.id]).map((x) => x.label);
    let name = p.name;
    if (state.size === "Large") name += " (Large)";
    if (extraLabels.length) name += ` + ${extraLabels.join(" + ")}`;
    addToCart(p.id, {
      custom: true,
      qty: state.qty,
      price: p.price + sizeExtra + extrasTotal,
      name,
      size: state.size,
      extras: EXTRAS.filter((x) => state.extras[x.id]).map((x) => ({
        id: x.id,
        label: x.label,
        price_ugx: x.price,
      })),
    });
    go("cart", {}, "forward");
  };

  document.querySelectorAll("[data-track-order]").forEach(b=>b.onclick=()=>{ const o=state.orders.find(x=>x.id===b.dataset.trackOrder); if(o){state.orderId=o.id;state.orderNo=o.order_no;go("preparing",{},"forward");} });
  document.querySelectorAll("[data-reorder-order]").forEach(b=>b.onclick=()=>{ const o=state.orders.find(x=>x.id===b.dataset.reorderOrder); if(!o) return; state.cart=(o.order_items||[]).map(i=>({id:i.menu_item_id,baseId:i.menu_item_id,name:i.name_snapshot,price:i.price_snapshot,qty:i.qty,size:i.size||"Regular",extras:i.extras||[]})); persistCart(); go("cart",{},"forward"); });

  document.querySelectorAll("[data-profile-section]").forEach((b) => {
    b.onclick = () => openProfileSection(b.dataset.profileSection);
  });

  document.querySelectorAll("[data-address-default]").forEach((b) => {
    b.onclick = async () => {
      try {
        const a = state.profileData.addresses.find((x) => x.id === b.dataset.addressDefault);
        if (!a) return;
        await window.BuwoomiBackend.saveAddress({ id: a.id, label: a.label, line1: a.line1, city: a.city, isDefault: true });
        state.addressId = a.id;
        try { localStorage.setItem("buwoomi-checkout-address-id", a.id); } catch (_) {}
        await openProfileSection("addresses");
        showToast("Default delivery address updated.");
      } catch (e) { showToast(e.message || "Could not update address."); }
    };
  });

  document.querySelectorAll("[data-address-delete]").forEach((b) => {
    b.onclick = async () => {
      try {
        await window.BuwoomiBackend.deleteAddress(b.dataset.addressDelete);
        await openProfileSection("addresses");
      } catch (e) { showToast(e.message || "Could not delete address."); }
    };
  });

  const useLocationBtn = $("#useLocationBtn");
  if (useLocationBtn) useLocationBtn.onclick = async () => {
    const input = $("#addressLine1");
    const label = $("#addressLabel");
    const city = $("#addressCity");
    const status = $("#locationStatus");
    useLocationBtn.disabled = true;
    useLocationBtn.textContent = "Finding you…";
    if (status) status.textContent = "Requesting your browser location…";
    try {
      if (!navigator.geolocation) throw new Error("Location is not supported by this browser.");
      const pos = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }));
      const lat = Number(pos.coords.latitude.toFixed(6));
      const lng = Number(pos.coords.longitude.toFixed(6));
      if (input) { input.value = `Pinned location (${lat}, ${lng})`; input.dataset.latitude = String(lat); input.dataset.longitude = String(lng); }
      if (label && !label.value.trim()) label.value = "Current Location";
      if (city && !city.value.trim()) city.value = "Kampala";
      if (status) status.textContent = `Location pinned at ${lat}, ${lng}. Tap Save Address to keep it.`;
      showToast("Current location added.");
    } catch (e) {
      if (status) status.textContent = e.message || "Could not get your location.";
      showToast(e.message || "Could not get your location.");
    } finally {
      useLocationBtn.disabled = false;
      useLocationBtn.textContent = "Use my current location";
    }
  };

  const saveAddressBtn = $("#saveAddressBtn");
  if (saveAddressBtn) saveAddressBtn.onclick = async () => {
    const line1 = $("#addressLine1")?.value.trim();
    if (!line1) { showToast("Enter an address first."); return; }
    saveAddressBtn.disabled = true;
    try {
      const place = window.BuwoomiPlaces?.getPending?.() || null;
      const addressInput = $("#addressLine1");
      const inputLat = Number(addressInput?.dataset.latitude);
      const inputLng = Number(addressInput?.dataset.longitude);
      const hasInputCoords = Number.isFinite(inputLat) && Number.isFinite(inputLng);
      const saved = await window.BuwoomiBackend.saveAddress({
        label: $("#addressLabel")?.value.trim() || place?.name || "Home",
        line1: place?.formatted || line1,
        city: $("#addressCity")?.value.trim() || place?.city || "Kampala",
        isDefault: !!$("#addressDefault")?.checked,
        latitude: place?.lat ?? (hasInputCoords ? inputLat : null),
        longitude: place?.lng ?? (hasInputCoords ? inputLng : null),
      });
      if (saved?.id) {
        state.addressId = saved.id;
        try { localStorage.setItem("buwoomi-checkout-address-id", saved.id); } catch (_) {}
      }
      window.BuwoomiPlaces?.clearPending?.();
      showToast(place ? "Place saved with map pin." : "Address saved.");
      await openProfileSection("addresses");

      // If checkout sent the user here to add an address, return only after
      // the freshly saved address has been synced back into state/localStorage.
      try {
        if (localStorage.getItem("buwoomi-checkout-address-return") === "1" && saved?.id) {
          localStorage.removeItem("buwoomi-checkout-address-return");
          go("checkout", {}, "forward");
        }
      } catch (_) {}
    } catch (e) { saveAddressBtn.disabled = false; showToast(e.message || "Could not save address."); }
  };

  document.querySelectorAll("[data-payment-delete]").forEach((b) => {
    b.onclick = async () => {
      try {
        await window.BuwoomiBackend.deletePaymentMethod(b.dataset.paymentDelete);
        await openProfileSection("payments");
      } catch (e) { showToast(e.message || "Could not remove payment method."); }
    };
  });

  const savePaymentBtn = $("#savePaymentBtn");
  if (savePaymentBtn) savePaymentBtn.onclick = async () => {
    savePaymentBtn.disabled = true;
    try {
      const last4 = $("#paymentLast4")?.value.trim() || "";
      if (last4 && !/^\d{4}$/.test(last4)) throw new Error("Last 4 digits must be four numbers.");
      await window.BuwoomiBackend.savePaymentMethod({
        methodType: $("#paymentType")?.value,
        label: $("#paymentLabel")?.value.trim() || "Saved payment method",
        last4,
        isDefault: !!$("#paymentDefault")?.checked,
      });
      showToast("Payment method saved.");
      await openProfileSection("payments");
    } catch (e) { savePaymentBtn.disabled = false; showToast(e.message || "Could not save payment method."); }
  };

  document.querySelectorAll("[data-fav-remove]").forEach((b) => {
    b.onclick = async (e) => {
      e.stopPropagation();
      try {
        await window.BuwoomiBackend.toggleFavorite(b.dataset.favRemove, false);
        await openProfileSection("favorites");
      } catch (err) { showToast(err.message || "Could not update favourites."); }
    };
  });

  document.querySelectorAll("[data-notification]").forEach((b) => {
    b.onclick = async () => {
      try {
        await window.BuwoomiBackend.markNotificationRead(b.dataset.notification);
        state.profileData.notifications = await window.BuwoomiBackend.fetchNotifications() || [];
        render();
      } catch (e) { showToast(e.message || "Could not update notification."); }
    };
  });

  const editProfileBtn = $("#editProfileBtn");
  if (editProfileBtn) editProfileBtn.onclick = () => { state.profileEditOpen = !state.profileEditOpen; render(); };
  const saveProfileBtn = $("#saveProfileBtn");
  if (saveProfileBtn) saveProfileBtn.onclick = async () => { try { state.profile = await window.BuwoomiBackend.updateProfile({ full_name: $("#profileName")?.value.trim() || null, phone: $("#profilePhone")?.value.trim() || null }); state.profileEditOpen=false; render(); showToast("Profile updated."); } catch(e){showToast(e.message||"Could not update profile.");} };

  const forgotPasswordBtn = $("#forgotPasswordBtn");
  if (forgotPasswordBtn) forgotPasswordBtn.onclick = async () => { const email=$("#authEmail")?.value.trim(); if(!email) return showToast("Enter your email first."); try { await window.BuwoomiBackend.resetPassword(email); showToast("Password reset email sent."); } catch(e){showToast(e.message||"Could not send reset email.");} };
  const homeNotifications=$("#homeNotifications");
  if(homeNotifications) homeNotifications.onclick=()=>openProfileSection("notifications");
  const homeSearch=$("#homeSearch");
  if(homeSearch) {
    homeSearch.oninput=()=>{ state.searchQuery=homeSearch.value; };
    homeSearch.onkeydown=e=>{
      if(e.key==="Enter"){
        e.preventDefault();
        e.stopPropagation();
        state.menuTab="All";
        go("menu");
      }
    };
    homeSearch.onclick=e=>e.stopPropagation();
    homeSearch.onmousedown=e=>e.stopPropagation();
    homeSearch.ontouchstart=e=>e.stopPropagation();
  }

  const menuSearchInput=$("#menuSearchInput");
  if(menuSearchInput) {
    menuSearchInput.oninput=()=>{
      state.searchQuery=menuSearchInput.value;
      state.menuTab="All";
      render();
      requestAnimationFrame(()=>{
        const input=$("#menuSearchInput");
        if(input){
          input.focus();
          input.setSelectionRange(input.value.length,input.value.length);
        }
      });
    };
    menuSearchInput.onkeydown=e=>{
      if(e.key==="Escape"){
        e.preventDefault();
        state.searchQuery="";
        render();
        requestAnimationFrame(()=>$("#menuSearchInput")?.focus());
      }
    };
  }


  const submitRating=$("#submitRating");
  if(submitRating) submitRating.onclick=async()=>{ try { if(state.orderId && window.BuwoomiBackend?.ready) await window.BuwoomiBackend.saveOrderRating(state.orderId,state.rating,$("#ratingComment")?.value.trim()); showToast("Thanks for rating your order."); go("home",{},"back"); } catch(e){showToast(e.message||"Could not save rating.");} };

  const logoutBtn = $("#logoutBtn");
  if (logoutBtn) logoutBtn.onclick = async () => {
    if (window.BuwoomiBackend) await window.BuwoomiBackend.signOut();
    state.session = null;
    state.orders = [];
    go("login", {}, "back");
  };

  const googleAuth=$("#googleAuth"); if(googleAuth) googleAuth.onclick=async()=>{try{await window.BuwoomiBackend.signInOAuth("google");}catch(e){showToast(e.message||"Google sign-in is unavailable.");}};
  const appleAuth=$("#appleAuth"); if(appleAuth) appleAuth.onclick=async()=>{try{await window.BuwoomiBackend.signInOAuth("apple");}catch(e){showToast(e.message||"Apple sign-in is unavailable.");}};

  const authToggle = $("#authToggle");
  if (authToggle) authToggle.onclick = () => {
    state.authMode = state.authMode === "signup" ? "signin" : "signup";
    state.authError = null;
    render();
  };

  const authSubmit = $("#authSubmit");
  if (authSubmit) authSubmit.onclick = async () => {
    const backendOn = !!(window.BuwoomiBackend && window.BuwoomiBackend.ready);
    if (!backendOn) { go("home"); return; }

    const email = ($("#authEmail")?.value || "").trim();
    const password = $("#authPassword")?.value || "";
    const fullName = $("#authName")?.value || "";
    if (!email || !password) { state.authError = "Enter your email and password."; render(); return; }

    state.authBusy = true; state.authError = null; render();
    try {
      const result = state.authMode === "signup"
        ? await window.BuwoomiBackend.signUp(email, password, fullName)
        : await window.BuwoomiBackend.signIn(email, password);
      state.session = result.session || null;
      state.authBusy = false;
      if (state.authMode === "signup" && !result.session) {
        state.authError = "Account created. Check your email to confirm your account, then sign in.";
        render();
        return;
      }
      // Load profile + addresses immediately so checkout works on first try
      try { await syncOrdersFromBackend(); } catch (_) {}
      go("home", {}, "forward");
    } catch (e) {
      state.authBusy = false;
      state.authError = e.message || "Something went wrong. Try again.";
      render();
    }
  };

  // If checkout-flow-fix.js is active it owns #place (capture listener).
  // Keep a fallback only when the guard is missing (e.g. script blocked).
  const place = $("#place");
  if (place && !window.__buwoomiCheckoutGuard) {
    place.onclick = async () => {
      place.disabled = true;
      const { sub } = cartTotals();
      if (sub < Number(state.settings?.minimum_order_ugx || 0)) {
        place.disabled = false;
        return showToast(`Minimum order is ${ugx(Number(state.settings.minimum_order_ugx))}.`);
      }
      if (!state.addressId && state.session) {
        place.disabled = false;
        return showToast("Please select a delivery address first.");
      }
      try {
        const backendOn = !!(window.BuwoomiBackend && window.BuwoomiBackend.ready);
        const result = backendOn
          ? await window.BuwoomiBackend.placeOrder({
              cart: state.cart,
              paymentMethod: state.pay,
              addressId: state.addressId,
            })
          : { orderNo: `BW-${new Date().getFullYear()}-` + String(Math.floor(Math.random() * 999999)).padStart(6, "0") };
        state.orderNo = result.orderNo;
        state.orderId = result.orderId || null;
        state.cart = [];
        persistCart();
        if (backendOn && result.persisted) {
          try {
            await window.BuwoomiBackend.createNotification({
              title: "Order placed",
              body: `${result.orderNo} has been received and is being prepared.`,
              kind: "order",
            });
          } catch (_) {}
        }
        go("confirmed", { orderNo: result.orderNo }, "forward");
      } catch (e) {
        place.disabled = false;
        showToast(e.message || "Couldn't place order — try again.");
      }
    };
  }
}

/* --------------------------------------------------------------------------
   Render loop
   -------------------------------------------------------------------------- */
function render() {
  screenEl.innerHTML = views();
  bind();
  screenEl.scrollTop = 0;
  if (state.bumpBadge) { requestAnimationFrame(() => { state.bumpBadge = false; }); }
}

/* Star icon fill state needs its own tiny CSS hook */
const styleTag = document.createElement("style");
styleTag.textContent = `.i svg{width:20px;height:20px;display:block}
.stars .i.filled svg{fill:var(--gold);stroke:var(--gold)}
.stars .i.outline svg{fill:none;stroke:var(--gold);stroke-width:1.6}
.circle .i svg{width:18px;height:18px}
.menu-list .i svg{width:16px;height:16px}
.socials .i{display:inline-flex;vertical-align:-2px;margin-right:4px}`;
document.head.appendChild(styleTag);

/* --------------------------------------------------------------------------
   Boot — restore session, then splash → onboarding → login OR straight home
   -------------------------------------------------------------------------- */

render();
syncMenuFromBackend();

(async () => {
  try {
    const s = await window.BuwoomiBackend?.fetchSettings?.();
    if (s) {
      state.settings = s;
      state.adminSettings = s;
    }
  } catch (e) {}

  // Restore existing session so returning users skip onboarding/login
  let restored = false;
  try {
    if (window.BuwoomiBackend?.ready) {
      const session = await window.BuwoomiBackend.getSession();
      if (session) {
        state.session = session;
        await syncOrdersFromBackend();
        restored = true;
      }
    }
  } catch (e) {
    console.warn("Session restore skipped:", e.message);
  }

  // Brief splash, then route correctly
  setTimeout(() => {
    if (state.screen !== "splash") return;
    if (restored) {
      go("home", {}, "fade");
    } else {
      go("onb1", {}, "fade");
    }
  }, 1400);
})();
