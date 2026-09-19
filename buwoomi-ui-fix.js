/* BUWOOMI UI fix v3 — force category icons + scroll lock */
(function () {
  const SVGS = {
    popular: '<svg viewBox="0 0 24 24" width="26" height="26" fill="#F4A300"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/></svg>',
    chicken: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#0B4D2A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 4.2c3 .2 5.8 3 5.6 6-.1 1.9-1.2 3.1-2.5 4.1l-3.8 3.8a2.6 2.6 0 1 1-3.7-3.7l3.8-3.8c1-1.3 2.2-2.4 2.1-4.3-.1-1.1-.7-2.1-1.5-2.1Z"/><circle cx="6.8" cy="17.2" r="2.4"/></svg>',
    'burgers & wraps': '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#0B4D2A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10.5h16"/><path d="M5 14.5h14"/><path d="M6 7.5c1.3-2 3.3-3 6-3s4.7 1 6 3"/><path d="M5 17.5h14l-1 2H6l-1-2Z"/></svg>',
    burgers: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#0B4D2A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10.5h16"/><path d="M5 14.5h14"/><path d="M6 7.5c1.3-2 3.3-3 6-3s4.7 1 6 3"/><path d="M5 17.5h14l-1 2H6l-1-2Z"/></svg>',
    beef: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#0B4D2A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8c2.2-3.1 7.2-4.4 11-2.4 2.8 1.5 3.7 4.9 2.1 7.4-1.2 1.9-3.3 3-5.6 3H8.8c-2.6 0-5.8-1.8-5.1-4.7.2-1 .7-2.2 1.3-3.3Z"/><circle cx="13.8" cy="10.2" r="1.8"/></svg>',
    veggie: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#2E7D32" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14Z"/><path d="M5 19c2-4.2 5-7.2 9-9.2"/></svg>',
    sides: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#0B4D2A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m7 4 1 8M10 3v9M13 4v8M16 3v9M5 11h14l-1 9H6l-1-9Z"/></svg>',
    snacks: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#0B4D2A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m5 17 5.9-10.2a1.3 1.3 0 0 1 2.2 0L19 17a1.2 1.2 0 0 1-1 1.8H6A1.2 1.2 0 0 1 5 17Z"/><path d="M8.2 15.8h7.6"/></svg>',
    pizza: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#0B4D2A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5C10 3 16 3 20 5.5L12 20 4 5.5Z"/><circle cx="10" cy="9" r="1" fill="#0B4D2A"/><circle cx="14.5" cy="12" r="1" fill="#0B4D2A"/><circle cx="12" cy="15.5" r="1" fill="#0B4D2A"/></svg>',
    drinks: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#0B4D2A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l-1 13H7L6 7Z"/><path d="M9 4h6M12 4v3"/></svg>',
    desserts: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#0B4D2A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16v8H4z"/><path d="M4 12c0-2 2-3 4-3s4 1 4 3c0-2 2-3 4-3s4 1 4 3"/><path d="M8 6v2M12 5v2M16 6v2"/></svg>'
  };

  let lockY = null;
  let lockUntil = 0;

  function injectCss() {
    if (document.getElementById("bw-cat-icon-css")) return;
    const style = document.createElement("style");
    style.id = "bw-cat-icon-css";
    style.textContent = [
      ".cat-icon-btn .circle-ic.category-icon-circle{",
      "width:52px!important;height:52px!important;min-width:52px!important;min-height:52px!important;",
      "border-radius:50%!important;background:#eef3ef!important;",
      "display:flex!important;align-items:center!important;justify-content:center!important;",
      "border:1px solid rgba(11,77,42,.1)!important;box-shadow:0 6px 14px rgba(11,77,42,.1)!important;",
      "background-image:none!important;overflow:visible!important;",
      "}",
      ".cat-icon-btn.on .circle-ic.category-icon-circle{",
      "background:#0B4D2A!important;outline:2px solid #0B4D2A;outline-offset:2px;",
      "}",
      ".cat-icon-btn.on .circle-ic.category-icon-circle svg{stroke:#fff!important;}",
      ".cat-icon-btn.on .circle-ic.category-icon-circle svg[fill='#F4A300']{fill:#F4A300!important;}",
      ".cat-icon-btn .circle-ic.category-icon-circle .i{",
      "display:flex!important;align-items:center!important;justify-content:center!important;",
      "width:26px!important;height:26px!important;",
      "}",
      ".cat-icon-btn .circle-ic.category-icon-circle svg{",
      "width:26px!important;height:26px!important;display:block!important;",
      "}",
      ".cat-icon-btn .food-category-photo{background-image:none!important;}"
    ].join("");
    document.head.appendChild(style);
  }

  function screenEl() {
    return document.getElementById("screen");
  }

  function normalize(name) {
    return String(name || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function fillIcons() {
    injectCss();
    document.querySelectorAll(".cat-icon-btn").forEach((btn) => {
      const raw = btn.getAttribute("data-cat") || (btn.querySelector("span:last-child") || {}).textContent || "";
      const key = normalize(raw);
      let svg = SVGS[key];
      if (!svg && key.indexOf("burger") !== -1) svg = SVGS["burgers & wraps"];
      if (!svg && key.indexOf("wrap") !== -1) svg = SVGS["burgers & wraps"];
      if (!svg) svg = SVGS.veggie;

      let circle = btn.querySelector(".circle-ic");
      if (!circle) {
        circle = document.createElement("span");
        circle.className = "circle-ic category-icon-circle";
        btn.insertBefore(circle, btn.firstChild);
      }

      circle.className = "circle-ic category-icon-circle";
      circle.removeAttribute("style");
      circle.style.cssText =
        "width:52px;height:52px;min-width:52px;min-height:52px;border-radius:50%;" +
        "display:flex;align-items:center;justify-content:center;" +
        "background:#eef3ef;background-image:none;overflow:visible;";

      if (circle.dataset.bwIcon === key && circle.querySelector("svg")) return;
      circle.dataset.bwIcon = key;
      circle.innerHTML = '<span class="i" style="display:flex;align-items:center;justify-content:center;width:26px;height:26px">' + svg + "</span>";
    });
  }

  function restoreScroll() {
    const s = screenEl();
    if (!s || lockY === null) return;
    if (Date.now() > lockUntil) return;
    if (Math.abs(s.scrollTop - lockY) > 1) s.scrollTop = lockY;
  }

  function armScrollLock() {
    const s = screenEl();
    if (!s) return;
    lockY = s.scrollTop;
    lockUntil = Date.now() + 900;
    restoreScroll();
    requestAnimationFrame(() => {
      restoreScroll();
      requestAnimationFrame(() => {
        restoreScroll();
        setTimeout(restoreScroll, 40);
        setTimeout(restoreScroll, 120);
        setTimeout(restoreScroll, 280);
      });
    });
  }

  document.addEventListener(
    "click",
    (e) => {
      const t = e.target.closest(
        "[data-cat],[data-mtab],[data-add],[data-pay],[data-sizebtn],[data-q],[data-cq],[data-ex],.chip,.add"
      );
      if (!t) return;
      if (t.closest("[data-go]") && !t.hasAttribute("data-cat") && !t.hasAttribute("data-mtab")) return;
      armScrollLock();
    },
    true
  );

  function patchRender() {
    if (typeof window.render !== "function" || window.render.__bwFix) return false;
    const orig = window.render;
    window.render = function (preserveScroll) {
      const s = screenEl();
      const y = preserveScroll && s ? s.scrollTop : lockY;
      const ae = document.activeElement;
      if (ae && s && s.contains(ae) && ae !== document.body) {
        try {
          ae.blur();
        } catch (err) {}
      }
      if (preserveScroll && s) {
        lockY = s.scrollTop;
        lockUntil = Date.now() + 900;
      }
      const out = orig.apply(this, arguments);
      fillIcons();
      if (preserveScroll || (lockY !== null && Date.now() < lockUntil)) {
        const target = y != null ? y : lockY;
        if (s && target != null) {
          s.scrollTop = target;
          requestAnimationFrame(() => {
            s.scrollTop = target;
            fillIcons();
            requestAnimationFrame(() => {
              s.scrollTop = target;
              fillIcons();
            });
          });
        }
      } else {
        fillIcons();
      }
      return out;
    };
    window.render.__bwFix = true;
    fillIcons();
    return true;
  }

  const id = setInterval(() => {
    fillIcons();
    if (patchRender()) {
      /* keep filling a bit longer for async home render */
    }
  }, 200);
  setTimeout(() => clearInterval(id), 15000);

  const obs = new MutationObserver(() => {
    fillIcons();
    restoreScroll();
  });

  function watch() {
    injectCss();
    const s = screenEl();
    if (s) obs.observe(s, { childList: true, subtree: true });
    fillIcons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", watch);
  } else {
    watch();
  }
})();
