/* BUWOOMI desktop layout fix — keep laptop view dense, not sparse */
(function () {
  if (document.getElementById('bw-desktop-css')) return;
  var s = document.createElement('style');
  s.id = 'bw-desktop-css';
  s.textContent = [
    '@media (min-width:901px){',
    '.onb{max-width:720px;margin:0 auto;padding:20px 36px 28px;box-sizing:border-box;display:flex;flex-direction:column;height:100%;}',
    '.onb h1{font-size:34px!important;margin-top:16px!important;}',
    '.onb p.sub{font-size:15px!important;max-width:420px;}',
    '.hero-photo{flex:1 1 auto!important;min-height:280px!important;height:clamp(280px,42vh,420px)!important;margin:20px 0 12px!important;background-size:cover!important;background-position:center!important;}',
    '.onb-foot{margin-top:12px!important;padding-bottom:8px;}',
    '.logo-foot{margin-top:8px!important;}',
    '}',
    '@media (max-width:900px){',
    '.app-brand-header{position:relative!important;}',
    '}'
  ].join('');
  document.head.appendChild(s);
})();
