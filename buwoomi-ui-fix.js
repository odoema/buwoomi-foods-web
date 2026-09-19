/* BUWOOMI UI fix v6 — photo icons, logo offset, cat scroll, header notification */
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

  let lockY = null;
  let lockUntil = 0;
  let lockCatX = null;

  function injectCss() {
    if (document.getElementById('bw-cat-icon-css')) return;
    const style = document.createElement('style');
    style.id = 'bw-cat-icon-css';
    style.textContent = [
      /* Logo: nudge down without changing side padding */
      '.app-brand-header{',
      'padding-top:22px!important;',
      'padding-bottom:6px!important;',
      'min-height:108px!important;',
      'height:auto!important;',
      'align-items:flex-end!important;',
      'position:relative!important;',
      '}',
      '.app-brand-button{',
      'margin-top:6px!important;',
      '}',
      '.app-brand-button img{',
      'margin-top:4px!important;',
      '}',

      /* Notification — top-right of brand header (mobile-friendly) */
      '.bw-header-notify{',
      'position:absolute!important;',
      'right:14px!important;',
      'top:50%!important;',
      'transform:translateY(-40%)!important;',
      'width:42px!important;',
      'height:42px!important;',
      'border-radius:50%!important;',
      'border:1px solid rgba(11,77,42,.12)!important;',
      'background:#fff!important;',
      'color:#0B4D2A!important;',
      'display:flex!important;',
      'align-items:center!important;',
      'justify-content:center!important;',
      'box-shadow:0 4px 12px rgba(11,77,42,.08)!important;',
      'cursor:pointer!important;',
      'z-index:5!important;',
      'padding:0!important;',
      '}',
      '.bw-header-notify:active{transform:translateY(-40%) scale(.96)!important;}',
      '.bw-header-notify svg{width:22px!important;height:22px!important;display:block!important;}',
      '.bw-header-notify .bw-badge{',
      'position:absolute!important;',
      'top:6px!important;',
      'right:6px!important;',
      'width:9px!important;',
      'height:9px!important;',
      'border-radius:50%!important;',
      'background:#E53935!important;',
      'border:1.5px solid #fff!important;',
      '}',
      /* Hide the old bell beside the search field on home */
      '.home-search-row > #homeNotifications,',
      '.home-search-row > .icon-btn[aria-label="Notifications"]{',
      'display:none!important;',
      '}',
      /* Give search full width now that bell is gone from the row */
      '.home-search-row .home-search{flex:1!important;width:100%!important;}',

      /* Category photo circles */
      '.cat-icon-btn .circle-ic.bw-photo-cat{',
      'width:56px!important;height:56px!important;min-width:56px!important;min-height:56px!important;',
      'border-radius:50%!important;',
      'background-size:cover!important;background-position:center!important;background-repeat:no-repeat!important;',
      'border:2px solid #fff!important;',
      'box-shadow:0 6px 16px rgba(11,77,42,.14)!important;',
      'display:block!important;overflow:hidden!important;',
      'background-color:#eef3ef!important;',
      'transform:none!important;',
      'animation:none!important;',
      '}',
      '.cat-icon-btn.on .circle-ic.bw-photo-cat{',
      'box-shadow:0 0 0 3px #0B4D2A,0 8px 18px rgba(11,77,42,.2)!important;',
      'transform:none!important;',
      '}',
      '.cat-icon-btn{width:64px!important;flex-shrink:0!important;}',
      '.cat-icon-btn .food-category-photo{background-image:none!important;transform:none!important;}',
      '.cat-icon-btn .circle-ic{transform:none!important;}',
      '.cat-icon-btn.on .circle-ic{transform:none!important;}'
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
    const header = document.querySelector('.app-brand-header.is-home, .app-brand-header');
    if (!header) return;

    // Only show on home brand header (not secondary/back screens)
    const isHome =
      header.classList.contains('is-home') ||
      !!document.querySelector('.home');
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
        // Prefer the app's own handler path
        if (typeof openProfileSection === 'function') {
          openProfileSection('notifications');
          return;
        }
        if (typeof go === 'function') {
          go('profileDetail', { profileSection: 'notifications' });
          return;
        }
        const legacy = document.getElementById('homeNotifications');
        if (legacy) legacy.click();
      });
    }
  }

  function fillIcons() {
    injectCss();
    placeNotification();
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watch);
  } else {
    watch();
  }
})();
