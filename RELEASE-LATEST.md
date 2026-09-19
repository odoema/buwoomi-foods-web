# BUWOOMI Foods — Latest Build (Flow Fixed)

Source: GitHub `main` + full-cycle navigation/login/checkout fixes (2026-09-17).

## Included
- Current customer app build and existing desktop/mobile styling.
- Admin navigation fix.
- Delivery address/location + Google Maps helpers (UI only).
- Delivery-now and scheduled-delivery checkout UI.
- Cart order-count badge anchored to the cart icon.
- Supabase client/auth integration files.
- Existing BUWOOMI assets and Supabase setup files.

## Full-cycle fixes in this package
1. **Single checkout path** — `checkout-flow-fix.js` owns Place Order (capture). No more competing handlers or `location.reload()` after order.
2. **Login → home** — After sign-in/sign-up, profile and addresses are loaded immediately so checkout works on the first try.
3. **Session restore** — Returning users with a valid session skip splash/onboarding and land on Home.
4. **Checkout gate** — With backend live, Proceed to Checkout requires sign-in; otherwise user is sent to Login with a toast.
5. **Address readiness** — Opening Checkout loads saved addresses and resolves `addressId` (state + localStorage + default).
6. **Confirmed screen** — Order placement always navigates with `go('confirmed')` inside the SPA (no document reload that restarts splash).

## How to verify the cycle
1. Open `index.html` (or deploy the folder).
2. Splash → onboarding → Login (or automatic Home if already signed in).
3. Browse menu → add to cart → Cart → Checkout.
4. Select/confirm address + payment → Place Order → Order Confirmed → Track Order.
5. Orders tab and Profile show history after sync.

Netlify note: the current Netlify team is credit-limited; upload this package to any static host while production remains live.
