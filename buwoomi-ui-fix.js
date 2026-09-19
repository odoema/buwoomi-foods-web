/* BUWOOMI UI fix v7 — photo icons, logo, cat scroll, notify, smart extras */
(function () {
  const PHOTOS = {
    popular: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    chicken: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    beef: 'https://images.pexels.com/photos/3535380/pexels-photo-3535380.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    'burgers & wraps': 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    burgers: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    sides: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    veggie: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    snacks: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    pizza: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    drinks: 'https://images.pexels.com/photos/2789328/pexels-photo-2789328.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    desserts: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
  };

  const BELL_SVG =
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10Z"/><path d="M10.3 19a1.8 1.8 0 0 0 3.4 0"/></svg>';

  /* ---- Category-aware extras (UGX) ---- */
  const ALL_EXTRAS = {
    chicken: { id: 'chicken', label: 'Extra Chicken', price: 5000 },
    beef: { id: 'beef', label: 'Extra Beef', price: 6000 },
    cheese: { id: 'cheese', label: 'Extra Cheese', price: 3000 },
    avo: { id: 'avo', label: 'Avocado', price: 2500 },
    sauce: { id: 'sauce', label: 'Extra Sauce', price: 1500 },
    chili: { id: 'chili', label: 'Chili / Hot Sauce', price: 1000 },
    bacon: { id: 'bacon', label: 'Crispy Bacon', price: 4000 },
    onion: { id: 'onion', label: 'Caramelised Onion', price: 1500 },
    egg: { id: 'egg', label: 'Fried Egg', price: 2000 },
    olives: { id: 'olives', label: 'Olives', price: 2000 },
    pepperoni: { id: 'pepperoni', label: 'Extra Pepperoni', price: 4000 },
    ice: { id: 'ice', label: 'Extra Ice', price: 0 },
    lemon: { id: 'lemon', label: 'Lemon Slice', price: 500 },
    sugar: { id: 'sugar', label: 'Less Sugar', price: 0 },
    cream: { id: 'cream', label: 'Whipped Cream', price: 2000 },
    choc: { id: 'choc', label: 'Chocolate Drizzle', price: 1500 },
    scoop: { id: 'scoop', label: 'Ice Cream Scoop', price: 3000 },
    dip: { id: 'dip', label: 'Dipping Sauce', price: 1500 }
  };

  const EXTRAS_BY_CAT = {
    chicken: ['chicken', 'cheese', 'sauce', 'chili'],
    beef: ['beef', 'cheese', 'onion', 'sauce', 'chili'],
    'burgers & wraps': ['cheese', 'bacon', 'avo', 'egg', 'sauce', 'chili'],
    sides: ['cheese', 'sauce', 'chili', 'dip'],
    veggie: ['avo', 'cheese', 'sauce', 'onion'],
    snacks: ['dip', 'sauce', 'chili'],
    pizza: ['cheese', 'pepperoni', 'olives', 'chili', 'onion'],
    drinks: ['ice', 'lemon', 'sugar'],
    desserts: ['cream', 'choc', 'scoop'],
    popular: ['cheese', 'sauce', 'chili', 'avo']
  };

  // Categories that should not show meal size (Regular/Large)
  const NO_SIZE_CATS = { drinks: true, desserts: true };

  let lockY = null;
  let lockUntil = 0;
  let lockCatX = null;

  function ugxFmt(n) {
    if (typeof ugx === 'function') return ugx(n);
    return 'UGX ' + Number(n || 0).toLocaleString();
  }

  function injectCss() {
    if (document.getElementById('bw-cat-icon-css')) return;
    const style = document.createElement('style');
    style.id = 'bw-cat-icon-css';
    style.textContent = [
      '.app-brand-header{padding-top:22px!important;padding-bottom:6px!important;min-height:108px!important;height:auto!important;align-items:flex-end!important;position:relative!important;}',
      '.app-brand-button{margin-top:6px!important;}',
      '.app-brand-button img{margin-top:4px!important;}',
      '.bw-header-notify{position:absolute!important;right:14px!important;top:50%!important;transform:translateY(-40%)!important;width:42px!important;height:42px!important;border-radius:50%!important;border:1px solid rgba(11,77,42,.12)!important;background:#fff!important;color:#0B4D2A!important;display:flex!important;align-items:center!important;justify-content:center!important;box-shadow:0 4px 12px rgba(11,77,42,.08)!important;cursor:pointer!important;z-index:5!important;padding:0!important;}',
      '.bw-header-notify:active{transform:translateY(-40%) scale(.96)!important;}',
      '.bw-header-notify svg{width:22px!important;height:22px!important;display:block!important;}',
      '.bw-header-notify .bw-badge{position:absolute!important;top:6px!important;right:6px!important;width:9px!important;height:9px!important;border-radius:50%!important;background:#E53935!important;border:1.5px solid #fff!important;}',
      '.home-search-row > #homeNotifications,.home-search-row > .icon-btn[aria-label="Notifications"]{display:none!important;}',
      '.home-search-row .home-search{flex:1!important;width:100%!important;}',
      '.cat-icon-btn .circle-ic.bw-photo-cat{width:56px!important;height:56px!important;min-width:56px!important;min-height:56px!important;border-radius:50%!important;background-size:cover!important;background-position:center!important;background-repeat:no-repeat!important;border:2px solid #fff!important;box-shadow:0 6px 16px rgba(11,77,42,.14)!important;display:block!important;overflow:hidden!important;background-color:#eef3ef!important;transform:none!important;animation:none!important;}',
      '.cat-icon-btn.on .circle-ic.bw-photo-cat{box-shadow:0 0 0 3px #0B4D2A,0 8px 18px rgba(11,77,42,.2)!important;transform:none!important;}',
      '.cat-icon-btn{width:64px!important;flex-shrink:0!important;}',
      '.cat-icon-btn .food-category-photo{background-image:none!important;transform:none!important;}',
      '.cat-icon-btn .circle-ic,.cat-icon-btn.on .circle-ic{transform:none!important;}',

      /* Space below extras so they are not crushed by the add panel */
      '.product-info .custom-section{margin-bottom:8px!important;}',
      '.product-info .extras{',
      'display:flex!important;flex-direction:column!important;gap:10px!important;',
      'margin-bottom:28px!important;',
      'padding-bottom:12px!important;',
      '}',
      '.product-info .product-extra, .product-info .opt.product-extra{',
      'padding:12px 14px!important;',
      'border-radius:12px!important;',
      '}',
      '.product-info .add-panel{',
      'margin-top:8px!important;',
      'padding-top:16px!important;',
      '}',
      /* Breathing room at bottom of product sheet */
      '.product-details .product-info{',
      'padding-bottom:140px!important;',
      '}'
    ].join('');
    document.head.appendChild(style);
  }

  function screenEl() {
    return document.getElementById('screen');
  }

  function catStrip() {
    return document.querySelector('.cat-icons');
  }

  function normalize(name) {
    return String(name || '').trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function photoFor(name) {
    const key = normalize(name);
    if (PHOTOS[key]) return PHOTOS[key];
    if (key.indexOf('burger') !== -1 || key.indexOf('wrap') !== -1) return PHOTOS['burgers & wraps'];
    return PHOTOS.veggie;
  }

  function productCategory(p) {
    if (!p) return 'popular';
    const cat = normalize(p.cat || p.category || '');
    if (EXTRAS_BY_CAT[cat]) return cat;
    // Heuristic from name for drinks/desserts
    const n = normalize(p.name || '');
    if (/juice|soda|drink|cola|water|smoothie|shake|milk|tea|coffee|fanta|sprite/.test(n)) return 'drinks';
    if (/cake|dessert|ice cream|brownie|cookie|pastry|sweet/.test(n)) return 'desserts';
    if (/pizza/.test(n)) return 'pizza';
    if (/burger|wrap/.test(n)) return 'burgers & wraps';
    if (/chicken|wing|nugget|drum/.test(n)) return 'chicken';
    if (/beef|steak/.test(n)) return 'beef';
    if (/fries|side|coleslaw|salad/.test(n)) return 'sides';
    if (/samosa|spring|snack|finger/.test(n)) return 'snacks';
    return cat || 'popular';
  }

  function extrasForProduct(p) {
    const cat = productCategory(p);
    const ids = EXTRAS_BY_CAT[cat] || EXTRAS_BY_CAT.popular;
    return ids.map((id) => ALL_EXTRAS[id]).filter(Boolean);
  }

  function syncGlobalExtras(list) {
    // Keep app pricing helpers in sync with the active product's extras
    try {
      if (typeof EXTRAS !== 'undefined') {
        EXTRAS.length = 0;
        list.forEach((x) => EXTRAS.push(x));
      } else {
        window.EXTRAS = list.slice();
      }
    } catch (e) {
      window.EXTRAS = list.slice();
    }
  }

  function applySmartExtras() {
    if (!document.querySelector('.product-details, .details.product-details')) return;
    const p = (typeof state !== 'undefined' && state.product) || window.state?.product;
    if (!p) return;

    const list = extrasForProduct(p);
    syncGlobalExtras(list);

    // Hide size for drinks/desserts
    const cat = productCategory(p);
    const sizeSection = document.querySelector('.product-info .custom-section');
    // first custom-section is size, second is extras — mark by heading text
    document.querySelectorAll('.product-info .custom-section').forEach((sec) => {
      const head = (sec.querySelector('.custom-head strong') || {}).textContent || '';
      if (/size/i.test(head)) {
        if (NO_SIZE_CATS[cat]) {
          sec.style.display = 'none';
          if (typeof state !== 'undefined') state.size = 'Regular';
        } else {
          sec.style.display = '';
        }
      }
      if (/make it yours|extras|optional/i.test(head) || sec.querySelector('.extras')) {
        const box = sec.querySelector('.extras') || sec;
        // Rebuild extras list
        let extrasEl = sec.querySelector('.extras');
        if (!extrasEl) {
          extrasEl = document.createElement('div');
          extrasEl.className = 'extras';
          sec.appendChild(extrasEl);
        }
        const selected = (typeof state !== 'undefined' && state.extras) || {};
        extrasEl.innerHTML = list
          .map((x) => {
            const checked = selected[x.id] ? 'checked' : '';
            const priceLabel = x.price > 0 ? '+' + ugxFmt(x.price) : 'Free';
            return (
              '<label class="opt product-extra"><span><b>' +
              x.label +
              '</b><small>' +
              priceLabel +
              '</small></span><input type="checkbox" data-ex="' +
              x.id +
              '" ' +
              checked +
              ' /></label>'
            );
          })
          .join('');

        // Wire checkboxes to state + re-render total
        extrasEl.querySelectorAll('[data-ex]').forEach((input) => {
          input.onchange = () => {
            if (typeof state === 'undefined') return;
            state.extras[input.dataset.ex] = input.checked;
            // Drop extras that are no longer relevant
            Object.keys(state.extras).forEach((k) => {
              if (!list.find((x) => x.id === k)) delete state.extras[k];
            });
            if (typeof render === 'function') render(true);
          };
        });

        // Update section title for drinks/desserts
        const strong = sec.querySelector('.custom-head strong');
        if (strong) {
          if (cat === 'drinks') strong.textContent = 'Drink options';
          else if (cat === 'desserts') strong.textContent = 'Sweet add-ons';
          else strong.textContent = 'Make it yours';
        }
      }
    });

    // Refresh add-to-cart total label if helper exists
    try {
      const totalBtn = document.getElementById('addCart');
      if (totalBtn && typeof detailsLineTotal === 'function') {
        const t = detailsLineTotal();
        const span = totalBtn.querySelector('span');
        if (span) span.textContent = '· ' + ugxFmt(t);
        else totalBtn.innerHTML = 'Add to Cart <span>· ' + ugxFmt(t) + '</span>';
      }
    } catch (e) {}
  }

  function saveCatScroll() {
    const strip = catStrip();
    if (strip) lockCatX = strip.scrollLeft;
  }

  function restoreCatScroll() {
    const strip = catStrip();
    if (!strip || lockCatX == null) return;
    strip.scrollLeft = lockCatX;
  }

  function placeNotification() {
    const header = document.querySelector('.app-brand-header');
    if (!header) return;
    const isHome = header.classList.contains('is-home') || !!document.querySelector('.home');
    let btn = header.querySelector('.bw-header-notify');
    if (!isHome) {
      if (btn) btn.remove();
      return;
    }
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bw-header-notify';
      btn.setAttribute('aria-label', 'Notifications');
      btn.id = 'bwHeaderNotifications';
      btn.innerHTML = BELL_SVG + '<span class="bw-badge" aria-hidden="true"></span>';
      header.appendChild(btn);
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof openProfileSection === 'function') openProfileSection('notifications');
        else if (typeof go === 'function') go('profileDetail', { profileSection: 'notifications' });
        else {
          const legacy = document.getElementById('homeNotifications');
          if (legacy) legacy.click();
        }
      });
    }
  }

  function fillIcons() {
    injectCss();
    placeNotification();
    applySmartExtras();
    const strip = catStrip();
    const prevX = strip ? strip.scrollLeft : lockCatX != null ? lockCatX : 0;

    document.querySelectorAll('.cat-icon-btn').forEach((btn) => {
      const raw =
        btn.getAttribute('data-cat') ||
        (btn.querySelector('span:last-child') || {}).textContent ||
        '';
      const url = photoFor(raw);
      let circle = btn.querySelector('.circle-ic');
      if (!circle) {
        circle = document.createElement('span');
        circle.className = 'circle-ic bw-photo-cat';
        btn.insertBefore(circle, btn.firstChild);
      }
      circle.className = 'circle-ic bw-photo-cat';
      circle.innerHTML = '';
      circle.removeAttribute('style');
      circle.style.backgroundImage = "url('" + url + "')";
      circle.style.backgroundSize = 'cover';
      circle.style.backgroundPosition = 'center';
      circle.style.transform = 'none';
      circle.dataset.bwPhoto = url;
    });

    if (strip) {
      const x = lockCatX != null ? lockCatX : prevX;
      strip.scrollLeft = x;
      requestAnimationFrame(() => {
        strip.scrollLeft = x;
      });
    }
  }

  function restoreScroll() {
    const s = screenEl();
    if (s && lockY != null && Date.now() <= lockUntil) {
      if (Math.abs(s.scrollTop - lockY) > 1) s.scrollTop = lockY;
    }
    restoreCatScroll();
  }

  function armScrollLock() {
    const s = screenEl();
    if (s) {
      lockY = s.scrollTop;
      lockUntil = Date.now() + 900;
    }
    saveCatScroll();
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
    'click',
    (e) => {
      const t = e.target.closest(
        '[data-cat],[data-mtab],[data-add],[data-pay],[data-sizebtn],[data-q],[data-cq],[data-ex],.chip,.add'
      );
      if (!t) return;
      if (t.closest('[data-go]') && !t.hasAttribute('data-cat') && !t.hasAttribute('data-mtab')) return;
      saveCatScroll();
      armScrollLock();
    },
    true
  );

  document.addEventListener(
    'scroll',
    (e) => {
      if (e.target && e.target.classList && e.target.classList.contains('cat-icons')) {
        lockCatX = e.target.scrollLeft;
      }
    },
    true
  );

  function patchRender() {
    if (typeof window.render !== 'function' || window.render.__bwFix) return false;
    const orig = window.render;
    window.render = function (preserveScroll) {
      const s = screenEl();
      const y = preserveScroll && s ? s.scrollTop : lockY;
      saveCatScroll();
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
      restoreCatScroll();
      if (preserveScroll || (lockY != null && Date.now() < lockUntil)) {
        const target = y != null ? y : lockY;
        if (s && target != null) {
          s.scrollTop = target;
          requestAnimationFrame(() => {
            s.scrollTop = target;
            restoreCatScroll();
            fillIcons();
            requestAnimationFrame(() => {
              s.scrollTop = target;
              restoreCatScroll();
              fillIcons();
            });
          });
        }
      } else {
        fillIcons();
        restoreCatScroll();
      }
      return out;
    };
    window.render.__bwFix = true;
    fillIcons();
    return true;
  }

  // Expand default EXTRAS once when app is ready (fallback before product-specific filter)
  function seedExtras() {
    try {
      const expanded = [
        ALL_EXTRAS.chicken,
        ALL_EXTRAS.cheese,
        ALL_EXTRAS.avo,
        ALL_EXTRAS.sauce,
        ALL_EXTRAS.chili,
        ALL_EXTRAS.bacon,
        ALL_EXTRAS.dip
      ];
      syncGlobalExtras(expanded);
    } catch (e) {}
  }

  const id = setInterval(() => {
    seedExtras();
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
    seedExtras();
    const s = screenEl();
    if (s) obs.observe(s, { childList: true, subtree: true });
    fillIcons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watch);
  } else {
    watch();
  }
})();
