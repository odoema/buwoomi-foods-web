/* ==========================================================================
   BUWOOMI FOODS — Supabase client
   Small wrapper around supabase-js. Every function fails soft (returns null
   / throws a plain Error with a friendly message) so app.js can fall back
   to local mock data when the backend isn't configured yet or is offline.
   ========================================================================== */

const BACKEND_READY =
  typeof window.SUPABASE_URL === "string" &&
  typeof window.SUPABASE_ANON_KEY === "string" &&
  window.SUPABASE_ANON_KEY !== "PASTE-YOUR-ANON-PUBLIC-KEY-HERE";

const sb = BACKEND_READY
  ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY)
  : null;

/* --------------------------------------------------------------------------
   Auth
   -------------------------------------------------------------------------- */
async function getSession() {
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data.session;
}

async function signUp(email, password, fullName) {
  if (!sb) throw new Error("Backend not configured");
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName || "" } },
  });
  if (error) throw error;
  return data;
}

async function signInOAuth(provider) {
  if (!sb) throw new Error("Backend not configured");
  const { data, error } = await sb.auth.signInWithOAuth({ provider, options: { redirectTo: window.location.origin } });
  if (error) throw error; return data;
}

async function resetPassword(email) {
  if (!sb) throw new Error("Backend not configured");
  const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
  if (error) throw error;
}

async function signIn(email, password) {
  if (!sb) throw new Error("Backend not configured");
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function signOut() {
  if (!sb) return;
  await sb.auth.signOut();
}

/* --------------------------------------------------------------------------
   Menu
   -------------------------------------------------------------------------- */
async function updateProfile(fields) {
  if (!sb) throw new Error("Backend not configured");
  const session = await getSession(); if (!session) throw new Error("Please sign in first.");
  const { data, error } = await sb.from("profiles").update(fields).eq("id", session.user.id).select("id,full_name,phone,avatar_url,is_admin").single();
  if (error) throw error; return data;
}

async function fetchProfile() {
  if (!sb) return null;
  const session = await getSession();
  if (!session) return null;
  const { data, error } = await sb.from("profiles").select("id,full_name,phone,avatar_url,is_admin").eq("id", session.user.id).single();
  if (error) throw error;
  return data;
}

async function fetchAllMenuItems() {
  if (!sb) return null;
  const { data, error } = await sb.from("menu_items").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

async function saveMenuItem(item) {
  if (!sb) throw new Error("Backend not configured");
  const payload = {
    id: item.id, name: item.name, description: item.description || null,
    price_ugx: Number(item.price_ugx), category_id: item.category_id || null,
    image_url: item.image_url || null, is_popular: !!item.is_popular,
    is_available: item.is_available !== false,
  };
  const query = item.existingId
    ? sb.from("menu_items").update(payload).eq("id", item.existingId).select().single()
    : sb.from("menu_items").insert(payload).select().single();
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

async function deleteMenuItem(id) {
  if (!sb) throw new Error("Backend not configured");
  const { error } = await sb.from("menu_items").delete().eq("id", id);
  if (error) throw error;
}

async function saveExtra(extra) {
  if (!sb) throw new Error("Backend not configured");
  const payload = { id: extra.id, label: extra.label, price_ugx: Number(extra.price_ugx) };
  const query = extra.existingId
    ? sb.from("extras").update(payload).eq("id", extra.existingId).select().single()
    : sb.from("extras").insert(payload).select().single();
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

async function deleteExtra(id) {
  if (!sb) throw new Error("Backend not configured");
  const { error } = await sb.from("extras").delete().eq("id", id);
  if (error) throw error;
}

async function fetchCategories() {
  if (!sb) return null;
  const { data, error } = await sb.from("categories").select("*").order("sort_order");
  if (error) throw error;
  return data;
}

async function saveCategory(cat) {
  if (!sb) throw new Error("Backend not configured");
  const payload={id:cat.id,name:cat.name,icon:cat.icon||"leaf",sort_order:Number(cat.sort_order)||0};
  const q=cat.existingId ? sb.from("categories").update(payload).eq("id",cat.existingId).select().single() : sb.from("categories").insert(payload).select().single();
  const {data,error}=await q; if(error) throw error; return data;
}
async function deleteCategory(id) { if(!sb) throw new Error("Backend not configured"); const {error}=await sb.from("categories").delete().eq("id",id); if(error) throw error; }

async function fetchMenuItems() {
  if (!sb) return null;
  const { data, error } = await sb.from("menu_items").select("*").eq("is_available", true);
  if (error) throw error;
  return data;
}

async function fetchExtras() {
  if (!sb) return null;
  const { data, error } = await sb.from("extras").select("*");
  if (error) throw error;
  return data;
}


/* --------------------------------------------------------------------------
   Profile data
   -------------------------------------------------------------------------- */
async function fetchAddresses() {
  if (!sb) return null;
  const session = await getSession();
  if (!session) return [];
  const { data, error } = await sb.from("addresses").select("*").order("is_default", { ascending: false }).order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

async function saveAddress({ id, label, line1, city, isDefault }) {
  if (!sb) throw new Error("Backend not configured");
  const session = await getSession();
  if (!session) throw new Error("Please sign in first.");
  const userId = session.user.id;
  if (isDefault) {
    await sb.from("addresses").update({ is_default: false }).eq("user_id", userId);
  }
  const payload = { label: label || "Home", line1, city: city || "Kampala", is_default: !!isDefault };
  const query = id
    ? sb.from("addresses").update(payload).eq("id", id).eq("user_id", userId).select().single()
    : sb.from("addresses").insert({ ...payload, user_id: userId }).select().single();
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

async function deleteAddress(id) {
  if (!sb) throw new Error("Backend not configured");
  const { error } = await sb.from("addresses").delete().eq("id", id);
  if (error) throw error;
}

async function fetchFavorites() {
  if (!sb) return null;
  const session = await getSession();
  if (!session) return [];
  const { data, error } = await sb.from("favorites").select("id, menu_item_id, created_at, menu_items(*)").order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

async function toggleFavorite(menuItemId, enabled) {
  if (!sb) throw new Error("Backend not configured");
  const session = await getSession();
  if (!session) throw new Error("Please sign in first.");
  if (enabled) {
    const { error } = await sb.from("favorites").upsert({ user_id: session.user.id, menu_item_id: menuItemId }, { onConflict: "user_id,menu_item_id" });
    if (error) throw error;
  } else {
    const { error } = await sb.from("favorites").delete().eq("user_id", session.user.id).eq("menu_item_id", menuItemId);
    if (error) throw error;
  }
}

async function fetchSavedPaymentMethods() {
  if (!sb) return null;
  const session = await getSession();
  if (!session) return [];
  const { data, error } = await sb.from("saved_payment_methods").select("*").order("is_default", { ascending: false }).order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

async function savePaymentMethod({ id, methodType, label, last4, isDefault }) {
  if (!sb) throw new Error("Backend not configured");
  const session = await getSession();
  if (!session) throw new Error("Please sign in first.");
  const userId = session.user.id;
  if (isDefault) await sb.from("saved_payment_methods").update({ is_default: false }).eq("user_id", userId);
  const payload = { method_type: methodType, label, last4: last4 || null, is_default: !!isDefault };
  const query = id
    ? sb.from("saved_payment_methods").update(payload).eq("id", id).eq("user_id", userId).select().single()
    : sb.from("saved_payment_methods").insert({ ...payload, user_id: userId }).select().single();
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

async function deletePaymentMethod(id) {
  if (!sb) throw new Error("Backend not configured");
  const { error } = await sb.from("saved_payment_methods").delete().eq("id", id);
  if (error) throw error;
}

async function fetchNotifications() {
  if (!sb) return null;
  const session = await getSession();
  if (!session) return [];
  const { data, error } = await sb.from("notifications").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

async function markNotificationRead(id) {
  if (!sb) throw new Error("Backend not configured");
  const { error } = await sb.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id);
  if (error) throw error;
}

async function createNotification({ title, body, kind = "general" }) {
  if (!sb) return null;
  const session = await getSession();
  if (!session) return null;
  const { data, error } = await sb.from("notifications").insert({ user_id: session.user.id, title, body, kind }).select().single();
  if (error) throw error;
  return data;
}

/* --------------------------------------------------------------------------
   Orders
   -------------------------------------------------------------------------- */
function makeOrderNo() {
  const y = new Date().getFullYear();
  return `BW-${y}-` + String(Math.floor(Math.random() * 999999)).padStart(6, "0");
}

// cart: [{ id, name, price, qty, size, extras: [{id,label,price}] }]
async function placeOrder({ cart, paymentMethod, addressId }) {
  if (!sb) return { orderNo: `BW-${new Date().getFullYear()}-` + String(Math.floor(Math.random() * 999999)).padStart(6, "0"), persisted: false };
  const session = await getSession();
  if (!session) throw new Error("Please sign in first.");
  const { data, error } = await sb.rpc("place_order_secure", { p_cart: cart, p_payment_method: paymentMethod, p_address_id: addressId || null });
  if (error) throw error;
  return { orderNo: data.orderNo, orderId: data.orderId, subtotal: data.subtotal, fee: data.fee, total: data.total, persisted: true };
}

async function fetchOrders() {
  if (!sb) return null;
  const session = await getSession();
  if (!session) return [];
  const { data, error } = await sb
    .from("orders")
    .select("*, order_items(*)")
    .order("placed_at", { ascending: false });
  if (error) throw error;
  return data;
}


async function uploadMenuImage(file, itemId) {
  if (!sb) throw new Error("Backend not configured");
  if (!file || !file.type.startsWith("image/")) throw new Error("Choose an image file.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be 5MB or smaller.");
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `menu/${itemId}-${Date.now()}.${ext}`;
  const { error } = await sb.storage.from("menu-images").upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
  if (error) throw error;
  return sb.storage.from("menu-images").getPublicUrl(path).data.publicUrl;
}

async function fetchSettings() { if (!sb) return null; const {data,error}=await sb.from("app_settings").select("*").eq("id","default").maybeSingle(); if(error) throw error; return data; }
async function saveSettings(settings) { if(!sb) throw new Error("Backend not configured"); const session=await getSession(); if(!session) throw new Error("Please sign in first."); const payload={...settings, id:"default", updated_by:session.user.id, updated_at:new Date().toISOString()}; const {data,error}=await sb.from("app_settings").upsert(payload,{onConflict:"id"}).select().single(); if(error) throw error; return data; }
async function fetchAllOrders() { if(!sb) return []; const {data,error}=await sb.from("orders").select("*, order_items(*), profiles(full_name,phone)").order("placed_at",{ascending:false}); if(error) throw error; return data||[]; }
async function updateOrderStatus(id,status) { if(!sb) throw new Error("Backend not configured"); const {data:order,error}=await sb.from("orders").update({status}).eq("id",id).select("id,user_id,order_no,status").single(); if(error) throw error; const titles={placed:"Order received",preparing:"Your meal is being prepared",out_for_delivery:"Your order is on the way",delivered:"Order delivered",cancelled:"Order cancelled"}; const bodies={placed:`${order.order_no} has been received.`,preparing:`${order.order_no} is being prepared.`,out_for_delivery:`${order.order_no} is out for delivery.`,delivered:`${order.order_no} has been delivered.`,cancelled:`${order.order_no} has been cancelled.`}; await sb.from("notifications").insert({user_id:order.user_id,title:titles[status]||"Order update",body:bodies[status]||`Your order ${order.order_no} was updated.`,kind:"order"}); return order; }
async function saveOrderRating(id,rating,comment) { if(!sb) return; const {error}=await sb.from("orders").update({rating,rating_comment:comment||null}).eq("id",id); if(error) throw error; }

window.BuwoomiBackend = {
  ready: BACKEND_READY,
  getSession,
  fetchProfile,
  fetchAllMenuItems,
  saveMenuItem,
  deleteMenuItem,
  saveExtra,
  deleteExtra,
  signUp,
  signIn,
  resetPassword,
  signInOAuth,
  signOut,
  updateProfile,
  fetchCategories,
  saveCategory,
  deleteCategory,
  fetchSettings,
  uploadMenuImage,
  saveSettings,
  fetchAllOrders,
  updateOrderStatus,
  saveOrderRating,
  fetchMenuItems,
  fetchExtras,
  placeOrder,
  fetchOrders,
  fetchAddresses,
  saveAddress,
  deleteAddress,
  fetchFavorites,
  toggleFavorite,
  fetchSavedPaymentMethods,
  savePaymentMethod,
  deletePaymentMethod,
  fetchNotifications,
  markNotificationRead,
  createNotification,
};
