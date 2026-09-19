/* ==========================================================================
   BUWOOMI FOODS — Google Maps / Places API config
   ==========================================================================
   1. Go to Google Cloud Console → APIs & Services → Credentials
   2. Create an API key (or use an existing one)
   3. Enable these APIs for the project:
        - Maps JavaScript API
        - Places API
   4. (Recommended) Restrict the key to your domain + those APIs
   5. Paste the key below.

   Without a key, place search is disabled and the app falls back to
   manual address entry + "Use my current location".
   ========================================================================== */
window.GOOGLE_MAPS_API_KEY = "3a7727f3340675252d564bc4fe629b763da34395c784db666dcf614130176d7f";

/* Optional: bias search to Uganda / Kampala (used by Places Autocomplete) */
window.GOOGLE_PLACES_COUNTRY = "ug";
window.GOOGLE_PLACES_CENTER = { lat: 0.3476, lng: 32.5825 }; // Kampala
window.GOOGLE_PLACES_RADIUS_M = 40000; // ~40 km around Kampala
