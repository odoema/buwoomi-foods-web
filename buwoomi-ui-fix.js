/* BUWOOMI UI fix — category icons + scroll stay-in-place */
(function () {
  const SVGS = {'Popular': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/></svg>', 'Chicken': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M13.5 4.2c3 .2 5.8 3 5.6 6-.1 1.9-1.2 3.1-2.5 4.1l-3.8 3.8a2.6 2.6 0 1 1-3.7-3.7l3.8-3.8c1-1.3 2.2-2.4 2.1-4.3-.1-1.1-.7-2.1-1.5-2.1Z"/><circle cx="6.8" cy="17.2" r="2.4"/></svg>', 'Burgers & Wraps': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 10.5h16"/><path d="M5 14.5h14"/><path d="M6 7.5c1.3-2 3.3-3 6-3s4.7 1 6 3"/><path d="M5 17.5h14l-1 2H6l-1-2Z"/></svg>', 'Beef': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 8c2.2-3.1 7.2-4.4 11-2.4 2.8 1.5 3.7 4.9 2.1 7.4-1.2 1.9-3.3 3-5.6 3H8.8c-2.6 0-5.8-1.8-5.1-4.7.2-1 .7-2.2 1.3-3.3Z"/><circle cx="13.8" cy="10.2" r="1.8"/></svg>', 'Veggie': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14Z"/><path d="M5 19c2-4.2 5-7.2 9-9.2"/></svg>', 'Sides': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m7 4 1 8M10 3v9M13 4v8M16 3v9M5 11h14l-1 9H6l-1-9Z"/></svg>', 'Snacks': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m5 17 5.9-10.2a1.3 1.3 0 0 1 2.2 0L19 17a1.2 1.2 0 0 1-1 1.8H6A1.2 1.2 0 0 1 5 17Z"/><path d="M8.2 15.8h7.6"/></svg>', 'Pizza': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5.5C10 3 16 3 20 5.5L12 20 4 5.5Z"/><circle cx="10" cy="9" r="1"/><circle cx="14.5" cy="12" r="1"/><circle cx="12" cy="15.5" r="1"/></svg>', 'Drinks': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 7h12l-1 13H7L6 7Z"/><path d="M9 4h6M12 4v3"/></svg>', 'Desserts': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12h16v8H4z"/><path d="M4 12c0-2 2-3 4-3s4 1 4 3c0-2 2-3 4-3s4 1 4 3"/><path d="M8 6v2M12 5v2M16 6v2"/></svg>'};

  function fillIcons() {
    document.querySelectorAll(".cat-icon-btn").forEach((btn) => {
      const name = btn.getAttribute("data-cat") || "";
      let circle = btn.querySelector(".circle-ic");
      if (!circle) return;
      const svg = SVGS[name];
      if (!svg) return;
      circle.className = "circle-ic category-icon-circle";
      circle.removeAttribute("style");
      circle.innerHTML = '<span class="i" aria-hidden="true">' + svg + "</span>";
    });
  }

  function patchRender() {
    if (typeof window.render !== "function" || window.render.__bwFix) return false;
    const orig = window.render;
    window.render = function (preserveScroll) {
      const screen = document.getElementById("screen");
      const y = preserveScroll && screen ? screen.scrollTop : 0;
      const ae = document.activeElement;
      if (ae && screen && screen.contains(ae) && ae !== document.body) {
        try { ae.blur(); } catch (e) {}
      }
      const out = orig.apply(this, arguments);
      const restore = () => {
        if (preserveScroll && screen) screen.scrollTop = y;
        fillIcons();
      };
      restore();
      requestAnimationFrame(() => {
        restore();
        requestAnimationFrame(restore);
      });
      return out;
    };
    window.render.__bwFix = true;
    fillIcons();
    return true;
  }

  const id = setInterval(() => { if (patchRender()) clearInterval(id); }, 40);
  setTimeout(() => clearInterval(id), 20000);

  const obs = new MutationObserver(() => fillIcons());
  document.addEventListener("DOMContentLoaded", () => {
    const screen = document.getElementById("screen");
    if (screen) obs.observe(screen, { childList: true, subtree: true });
    fillIcons();
  });
  if (document.getElementById("screen")) {
    obs.observe(document.getElementById("screen"), { childList: true, subtree: true });
    fillIcons();
  }
})();
