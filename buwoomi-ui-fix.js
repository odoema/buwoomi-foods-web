/* BUWOOMI UI fix v4 — photo category icons + scroll lock */
(function () {
  const PHOTOS = {'popular': 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop', 'chicken': 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop', 'beef': 'https://images.pexels.com/photos/3535380/pexels-photo-3535380.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop', 'burgers & wraps': 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop', 'burgers': 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop', 'sides': 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop', 'veggie': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop', 'snacks': 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop', 'pizza': 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop', 'drinks': 'https://images.pexels.com/photos/2789328/pexels-photo-2789328.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop', 'desserts': 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'};

  let lockY = null;
  let lockUntil = 0;

  function injectCss() {
    if (document.getElementById("bw-cat-icon-css")) return;
    const style = document.createElement("style");
    style.id = "bw-cat-icon-css";
    style.textContent = [
      ".cat-icon-btn .circle-ic.bw-photo-cat{",
      "width:56px!important;height:56px!important;min-width:56px!important;min-height:56px!important;",
      "border-radius:50%!important;",
      "background-size:cover!important;background-position:center!important;background-repeat:no-repeat!important;",
      "border:2px solid #fff!important;",
      "box-shadow:0 6px 16px rgba(11,77,42,.14)!important;",
      "display:block!important;overflow:hidden!important;",
      "background-color:#eef3ef!important;",
      "}",
      ".cat-icon-btn.on .circle-ic.bw-photo-cat{",
      "box-shadow:0 0 0 3px #0B4D2A,0 8px 18px rgba(11,77,42,.2)!important;",
      "}",
      ".cat-icon-btn{width:64px!important;}",
      ".cat-icon-btn .food-category-photo{background-image:none!important;}"
    ].join("");
    document.head.appendChild(style);
  }

  function screenEl() {
    return document.getElementById("screen");
  }

  function normalize(name) {
    return String(name || "").trim().toLowerCase().replace(/\s+/g, " ");
  }

  function photoFor(name) {
    const key = normalize(name);
    if (PHOTOS[key]) return PHOTOS[key];
    if (key.indexOf("burger") !== -1 || key.indexOf("wrap") !== -1) return PHOTOS["burgers & wraps"];
    return PHOTOS.veggie;
  }

  function fillIcons() {
    injectCss();
    document.querySelectorAll(".cat-icon-btn").forEach((btn) => {
      const raw = btn.getAttribute("data-cat") || (btn.querySelector("span:last-child") || {}).textContent || "";
      const url = photoFor(raw);
      let circle = btn.querySelector(".circle-ic");
      if (!circle) {
        circle = document.createElement("span");
        circle.className = "circle-ic bw-photo-cat";
        btn.insertBefore(circle, btn.firstChild);
      }
      circle.className = "circle-ic bw-photo-cat";
      circle.innerHTML = "";
      circle.removeAttribute("style");
      circle.style.backgroundImage = "url('" + url + "')";
      circle.style.backgroundSize = "cover";
      circle.style.backgroundPosition = "center";
      circle.dataset.bwPhoto = url;
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
        try { ae.blur(); } catch (err) {}
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
    patchRender();
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
