# Google Places setup (SafeBoda-style place search)

## 1. Create / get an API key
1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or select one)
3. **APIs & Services → Library** → enable:
   - **Maps JavaScript API**
   - **Places API**
4. **APIs & Services → Credentials → Create credentials → API key**
5. (Recommended) Restrict the key:
   - Application restrictions: HTTP referrers → your domain(s)
   - API restrictions: Maps JavaScript API + Places API only

## 2. Put the key in the app
Edit `google-maps-config.js`:

```js
window.GOOGLE_MAPS_API_KEY = "AIza...your-real-key...";
```

Optional (already set for Kampala):

```js
window.GOOGLE_PLACES_COUNTRY = "ug";
window.GOOGLE_PLACES_CENTER = { lat: 0.3476, lng: 32.5825 };
window.GOOGLE_PLACES_RADIUS_M = 40000;
```

## 3. How customers use it
1. Sign in → Profile → **Saved Addresses**
2. In **Search place or address**, type e.g. `Acacia Mall` or `Nakasero Market`
3. Pick a Google suggestion
4. Label / city fill automatically; lat/lng are stored
5. **Save Address** → available at Checkout

Without a key, search is disabled and manual entry + “Use my current location” still work.

## Billing note
Google requires a billing account on the project. New accounts usually get monthly free credit; monitor usage in Cloud Console.
