/* BUWOOMI — Google Places Autocomplete (SafeBoda / Faras style place search)
   Attaches to #addressLine1 when the address form is visible.
   Requires window.GOOGLE_MAPS_API_KEY from google-maps-config.js. */
(() => {
  const PLACEHOLDER = "PASTE-YOUR-GOOGLE-MAPS-API-KEY-HERE";
  let mapsLoading = null;
  let mapsReady = false;
  let activeAutocomplete = null;
  let pendingCoords = null; // { lat, lng, formatted, city, name }

  function keyOk() {
    return typeof window.GOOGLE_MAPS_API_KEY === "string" &&
      window.GOOGLE_MAPS_API_KEY.length > 10 &&
      window.GOOGLE_MAPS_API_KEY !== PLACEHOLDER;
  }

  function toast(msg) {
    if (typeof showToast === "function") showToast(msg);
  }

  function loadMaps() {
    if (!keyOk()) return Promise.reject(new Error("Google Maps API key not set"));
    if (mapsReady && window.google?.maps?.places) return Promise.resolve();
    if (mapsLoading) return mapsLoading;

    mapsLoading = new Promise((resolve, reject) => {
      const existing = document.querySelector("script[data-buwoomi-maps]");
      if (existing) {
        const wait = () => {
          if (window.google?.maps?.places) {
            mapsReady = true;
            resolve();
          } else setTimeout(wait, 80);
        };
        wait();
        return;
      }

      window.__buwoomiMapsInit = () => {
        mapsReady = true;
        resolve();
      };

      const s = document.createElement("script");
      s.dataset.buwoomiMaps = "1";
      s.async = true;
      s.defer = true;
      s.src =
        "https://maps.googleapis.com/maps/api/js?key=" +
        encodeURIComponent(window.GOOGLE_MAPS_API_KEY) +
        "&libraries=places&callback=__buwoomiMapsInit";
      s.onerror = () => {
        mapsLoading = null;
        reject(new Error("Could not load Google Maps. Check your API key and enabled APIs."));
      };
      document.head.appendChild(s);
    });

    return mapsLoading;
  }

  function extractCity(components) {
    if (!components) return "Kampala";
    const city =
      components.find((c) => c.types.includes("locality")) ||
      components.find((c) => c.types.includes("administrative_area_level_2")) ||
      components.find((c) => c.types.includes("sublocality")) ||
      components.find((c) => c.types.includes("administrative_area_level_1"));
    return city?.long_name || "Kampala";
  }

  function attachAutocomplete(input) {
    if (!input || input.dataset.placesAttached === "1") return;
    if (!window.google?.maps?.places) return;

    input.dataset.placesAttached = "1";
    input.placeholder = "Search place — e.g. Acacia Mall, Nakasero…";

    const center = window.GOOGLE_PLACES_CENTER || { lat: 0.3476, lng: 32.5825 };
    const radius = window.GOOGLE_PLACES_RADIUS_M || 40000;
    const country = (window.GOOGLE_PLACES_COUNTRY || "ug").toLowerCase();

    const opts = {
      fields: ["formatted_address", "geometry", "name", "address_components", "place_id"],
      componentRestrictions: { country },
      bounds: new google.maps.Circle({ center, radius }).getBounds(),
      strictBounds: false,
    };

    // Prefer establishments + geocode so malls, markets, offices show up
    try {
      opts.types = ["geocode", "establishment"];
    } catch (_) {}

    const ac = new google.maps.places.Autocomplete(input, opts);
    activeAutocomplete = ac;

    // Keep dropdown above the phone chrome
    const pac = () => {
      document.querySelectorAll(".pac-container").forEach((el) => {
        el.style.zIndex = "100000";
      });
    };
    input.addEventListener("focus", pac);
    input.addEventListener("input", pac);

    ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      if (!place || !place.geometry || !place.geometry.location) {
        toast("Could not resolve that place. Try another search.");
        pendingCoords = null;
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const formatted = place.formatted_address || place.name || input.value;
      const city = extractCity(place.address_components);
      const name = place.name || "";

      input.value = formatted;
      const cityInput = document.querySelector("#addressCity");
      if (cityInput) cityInput.value = city;

      // Prefer place name as label if user left label empty / generic
      const labelInput = document.querySelector("#addressLabel");
      if (labelInput && (!labelInput.value.trim() || labelInput.value.trim() === "Home")) {
        if (name && name.length < 40) labelInput.value = name;
      }

      pendingCoords = { lat, lng, formatted, city, name, placeId: place.place_id || null };
      window.__buwoomiPendingPlace = pendingCoords;

      // Subtle confirmation under the field
      let hint = document.querySelector("#placesHint");
      if (!hint) {
        hint = document.createElement("p");
        hint.id = "placesHint";
        hint.style.cssText = "font-size:12px;color:var(--green-2,#0B4D2A);margin:6px 0 0";
        input.closest(".field")?.appendChild(hint);
      }
      hint.textContent = `📍 Selected · ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      toast("Place selected — save to use at checkout.");
    });
  }

  async function enhanceAddressForm() {
    const input = document.querySelector("#addressLine1");
    if (!input) return;

    // Status line under the form
    let status = document.querySelector("#placesStatus");
    if (!status && input.closest(".summary")) {
      status = document.createElement("p");
      status.id = "placesStatus";
      status.style.cssText = "font-size:12px;color:var(--muted);margin:0 0 8px";
      const h4 = input.closest(".summary")?.querySelector("h4");
      if (h4) h4.after(status);
      else input.closest(".summary")?.prepend(status);
    }

    if (!keyOk()) {
      if (status) status.textContent = "Place search off — add your Google Maps API key in google-maps-config.js";
      return;
    }

    if (status) status.textContent = "Type a place name and pick from Google suggestions";

    try {
      await loadMaps();
      attachAutocomplete(input);
    } catch (e) {
      if (status) status.textContent = e.message || "Place search unavailable";
      console.warn("Places:", e);
    }
  }

  // Expose coords for saveAddress handler in app.js
  window.BuwoomiPlaces = {
    getPending() {
      return pendingCoords || window.__buwoomiPendingPlace || null;
    },
    clearPending() {
      pendingCoords = null;
      window.__buwoomiPendingPlace = null;
      const hint = document.querySelector("#placesHint");
      if (hint) hint.remove();
    },
    isReady() {
      return keyOk() && mapsReady;
    },
  };

  const observer = new MutationObserver(() => {
    enhanceAddressForm();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  enhanceAddressForm();
})();
