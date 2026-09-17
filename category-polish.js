/* BUWOOMI category visual polish — no dependency on emoji fonts or image hosts. */
(function () {
  const ART = {
    Popular: '<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="bp-flame" x1="10" y1="6" x2="37" y2="43"><stop stop-color="#FFCB45"/><stop offset=".55" stop-color="#F39A17"/><stop offset="1" stop-color="#D94B18"/></linearGradient></defs><path fill="url(#bp-flame)" d="M25.4 4.8c3.5 8.7-2.8 10.9-1.7 16.2.4 2 2.2 3.5 4.1 3.5 2.8 0 4.5-2.4 4.1-5.3 5.1 5 7.1 9.2 7.1 14.1 0 7.5-6.1 12.4-13.7 12.4S11.6 40.9 11.6 33.4c0-6.5 3.5-11.5 9.5-16.4-.2 4.7 1.5 7.3 3.4 7.3 2.4 0 3.1-3.8.9-6.9-1.5-2.2-1.7-6.5 0-12.6Z"/><path fill="#FFE8A3" d="M25.1 25.1c1.5 3.1-1 4.7-.6 7.1.3 1.6 1.4 2.6 2.9 2.6 1.6 0 2.7-1.2 2.7-2.8 1.8 2 2.5 3.7 2.5 5.5 0 3.5-2.8 5.9-6.4 5.9s-6.4-2.4-6.4-5.9c0-3.3 1.9-6.1 5.3-8.9Z"/></svg>',
    Chicken: '<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="bp-chicken" x1="9" y1="8" x2="39" y2="42"><stop stop-color="#FFD98A"/><stop offset=".45" stop-color="#D9893B"/><stop offset="1" stop-color="#9B4D25"/></linearGradient><linearGradient id="bp-bone" x1="4" y1="31" x2="15" y2="42"><stop stop-color="#FFF4D6"/><stop offset="1" stop-color="#DDBD7A"/></linearGradient></defs><path fill="url(#bp-chicken)" d="M12.5 30.6c-2.7-2.7-2.7-7.2 0-9.9l10.8-10.8c3.6-3.6 9.5-3.6 13.1 0l1.8 1.8c3.6 3.6 3.6 9.5 0 13.1L27.4 35.6c-2.7 2.7-7.2 2.7-9.9 0l-5-5Z"/><path fill="url(#bp-bone)" d="M13.7 31.7 9.9 35.5l-2.7-.5-2.3 2.3 2.7 2.7 2.3-2.3-.5-2.7 3.8-3.8-1.8-1.8Z"/><ellipse cx="29.5" cy="17.5" rx="4.8" ry="2.1" fill="#FFE7B0" opacity=".55" transform="rotate(-45 29.5 17.5)"/><path d="M22 27c3.3 2.2 6.2 2 9.1-.7" fill="none" stroke="#7E351D" stroke-width="1.7" stroke-linecap="round" opacity=".55"/></svg>',
    Beef: '<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="bp-steak" x1="8" y1="8" x2="40" y2="40"><stop stop-color="#B94D39"/><stop offset=".45" stop-color="#8B2F25"/><stop offset="1" stop-color="#551A17"/></linearGradient></defs><path fill="url(#bp-steak)" d="M8.2 25.8c1.1-7.4 7.5-13.5 16.4-15.1 7.2-1.3 13.9.7 15.7 5.7 1.9 5.1-2.3 9.1-6.9 12.1-3.8 2.5-4.8 7.2-10.6 8.2-7.2 1.2-15.7-2.6-14.6-10.9Z"/><path fill="#F0B7A1" d="M15 25.2c.7-3.8 4.3-7 9-7.8 4.1-.7 7.8.3 8.5 2.8.7 2.2-1.8 4.1-4.3 5.7-2.6 1.6-3.6 4.7-6.8 5.1-4 .5-6.9-2-6.4-5.8Z"/><ellipse cx="25.2" cy="24.8" rx="3.4" ry="2.4" fill="#FFF1DD" opacity=".9"/><ellipse cx="25.2" cy="24.8" rx="1.5" ry="1.1" fill="#D6A77C"/><path d="M11 29c5.2 4.8 10.6 6.2 16.4 4.1" fill="none" stroke="#E77D55" stroke-width="1.8" stroke-linecap="round" opacity=".45"/></svg>',
    Veggie: '<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="bp-leaf" x1="8" y1="37" x2="39" y2="8"><stop stop-color="#1B8A4B"/><stop offset="1" stop-color="#78C84A"/></linearGradient></defs><path fill="url(#bp-leaf)" d="M8 37C8.7 21.2 18.4 10.2 38.5 8.1 36.4 27.9 25.4 37.7 8 37Z"/><path d="M10 36c7.2-8.3 13.8-14 24.1-21.4" fill="none" stroke="#E6F6C9" stroke-width="2" stroke-linecap="round" opacity=".8"/></svg>',
    Drinks: '<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="bp-drink" x1="12" y1="9" x2="35" y2="39"><stop stop-color="#FF6F61"/><stop offset=".5" stop-color="#E53B31"/><stop offset="1" stop-color="#A91E1B"/></linearGradient></defs><path fill="url(#bp-drink)" d="M11 15h25l-2.1 20.2a4 4 0 0 1-4 3.6H17.1a4 4 0 0 1-4-3.6L11 15Z"/><path d="M36 20h3a5 5 0 0 1 0 10h-4" fill="none" stroke="#C92D29" stroke-width="3" stroke-linecap="round"/><path d="M17 11c-1.3-2.3.6-3.1.1-5.1M24 11c-1.3-2.3.6-3.1.1-5.1M31 11c-1.3-2.3.6-3.1.1-5.1" fill="none" stroke="#B7A06C" stroke-width="2" stroke-linecap="round"/><path d="M15 18h17" stroke="#FFB2A8" stroke-width="2" stroke-linecap="round" opacity=".65"/></svg>'
  };

  const style = document.createElement('style');
  style.textContent = `
    .cat-icon-btn { width:64px !important; gap:7px !important; }
    .cat-icon-btn .circle-ic {
      width:52px !important; height:52px !important; border-radius:50% !important;
      background:#fff !important; color:var(--green) !important;
      border:1px solid rgba(11,77,42,.10) !important;
      box-shadow:0 5px 14px rgba(11,77,42,.10), inset 0 1px 0 rgba(255,255,255,.9) !important;
      transition:transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease !important;
    }
    .cat-icon-btn .circle-ic .i { display:flex; align-items:center; justify-content:center; }
    .cat-icon-btn .circle-ic .i svg { width:34px !important; height:34px !important; display:block; overflow:visible; }
    .cat-icon-btn:hover .circle-ic { transform:translateY(-2px); box-shadow:0 8px 18px rgba(11,77,42,.14) !important; }
    .cat-icon-btn.on .circle-ic {
      background:#fff !important; color:var(--green) !important; border:2px solid var(--gold) !important;
      box-shadow:0 0 0 4px rgba(244,163,0,.14), 0 8px 18px rgba(11,77,42,.13) !important;
      transform:translateY(-1px);
    }
    .cat-icon-btn.on .circle-ic svg { filter:drop-shadow(0 2px 2px rgba(0,0,0,.12)); }
  `;
  document.head.appendChild(style);

  function polish() {
    const buttons = Array.from(document.querySelectorAll('.cat-icon-btn'));
    const seen = new Set();
    buttons.forEach((button) => {
      const key = button.dataset.cat || button.textContent.trim();
      if (seen.has(key)) { button.remove(); return; }
      seen.add(key);
      const label = button.dataset.cat || button.textContent.trim();
      const iconHost = button.querySelector('.circle-ic');
      if (iconHost && ART[label]) iconHost.innerHTML = ART[label];
    });
  }

  const observer = new MutationObserver(polish);
  observer.observe(document.getElementById('screen') || document.body, { childList:true, subtree:true });
  polish();
})();
