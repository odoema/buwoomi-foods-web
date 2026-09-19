/* BUWOOMI UI fix v10 — photo icons restored */
(function(){
  const PHOTOS={
    popular:'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    chicken:'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    beef:'https://images.pexels.com/photos/3535380/pexels-photo-3535380.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    'burgers & wraps':'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    burgers:'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    sides:'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    veggie:'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    snacks:'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    pizza:'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    drinks:'https://images.pexels.com/photos/2789328/pexels-photo-2789328.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    desserts:'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
  };
  const ALL={
    chicken:{id:'chicken',label:'Extra Chicken',price:5000},
    beef:{id:'beef',label:'Extra Beef',price:6000},
    cheese:{id:'cheese',label:'Extra Cheese',price:3000},
    avo:{id:'avo',label:'Avocado',price:2500},
    sauce:{id:'sauce',label:'Extra Sauce',price:1500},
    chili:{id:'chili',label:'Chili / Hot Sauce',price:1000},
    bacon:{id:'bacon',label:'Crispy Bacon',price:4000},
    onion:{id:'onion',label:'Caramelised Onion',price:1500},
    egg:{id:'egg',label:'Fried Egg',price:2000},
    olives:{id:'olives',label:'Olives',price:2000},
    pepperoni:{id:'pepperoni',label:'Extra Pepperoni',price:4000},
    ice:{id:'ice',label:'Extra Ice',price:0},
    lemon:{id:'lemon',label:'Lemon Slice',price:500},
    sugar:{id:'sugar',label:'Less Sugar',price:0},
    cream:{id:'cream',label:'Whipped Cream',price:2000},
    choc:{id:'choc',label:'Chocolate Drizzle',price:1500},
    scoop:{id:'scoop',label:'Ice Cream Scoop',price:3000},
    dip:{id:'dip',label:'Dipping Sauce',price:1500}
  };
  const BY={
    chicken:['chicken','cheese','sauce','chili'],
    beef:['beef','cheese','onion','sauce','chili'],
    'burgers & wraps':['cheese','bacon','avo','egg','sauce','chili'],
    sides:['cheese','sauce','chili','dip'],
    veggie:['avo','cheese','sauce','onion'],
    snacks:['dip','sauce','chili'],
    pizza:['cheese','pepperoni','olives','chili','onion'],
    drinks:['ice','lemon','sugar'],
    desserts:['cream','choc','scoop'],
    popular:['cheese','sauce','chili','avo']
  };
  const NO_SIZE={drinks:1,desserts:1};
  const BELL='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10Z"/><path d="M10.3 19a1.8 1.8 0 0 0 3.4 0"/></svg>';
  let lockY=null,lockUntil=0,lockCatX=null;

  function css(){
    if(document.getElementById('bw-cat-icon-css'))return;
    const s=document.createElement('style');
    s.id='bw-cat-icon-css';
    s.textContent=[
      '.app-brand-header{position:relative!important}',
      '@media(max-width:900px){.app-brand-header{padding-top:22px!important;padding-bottom:6px!important;min-height:108px!important;height:auto!important;align-items:flex-end!important}.app-brand-button{margin-top:6px!important}.app-brand-button img{margin-top:4px!important}}',
      '.bw-header-notify{position:absolute!important;right:14px!important;top:50%!important;transform:translateY(-40%)!important;width:42px!important;height:42px!important;border-radius:50%!important;border:1px solid rgba(11,77,42,.12)!important;background:#fff!important;color:#0B4D2A!important;display:flex!important;align-items:center!important;justify-content:center!important;box-shadow:0 4px 12px rgba(11,77,42,.08)!important;cursor:pointer!important;z-index:5!important;padding:0!important}',
      '.bw-header-notify .bw-badge{position:absolute!important;top:6px!important;right:6px!important;width:9px!important;height:9px!important;border-radius:50%!important;background:#E53935!important;border:1.5px solid #fff!important}',
      '.home-search-row>#homeNotifications,.home-search-row>.icon-btn[aria-label="Notifications"]{display:none!important}',
      '.cat-icon-btn .circle-ic.bw-photo-cat{width:56px!important;height:56px!important;min-width:56px!important;min-height:56px!important;border-radius:50%!important;background-size:cover!important;background-position:center!important;background-repeat:no-repeat!important;border:2px solid #fff!important;box-shadow:0 6px 16px rgba(11,77,42,.14)!important;display:block!important;overflow:hidden!important;background-color:#eef3ef!important;transform:none!important;animation:none!important}',
      '.cat-icon-btn.on .circle-ic.bw-photo-cat{box-shadow:0 0 0 3px #0B4D2A,0 8px 18px rgba(11,77,42,.2)!important;transform:none!important}',
      '.cat-icon-btn{width:64px!important;flex-shrink:0!important}',
      '.cat-icon-btn .food-category-photo{background-image:none!important;transform:none!important}',
      '.cat-icon-btn .circle-ic,.cat-icon-btn.on .circle-ic{transform:none!important;animation:none!important}',
      '.product-info .extras{margin-bottom:28px!important;padding-bottom:12px!important;display:flex!important;flex-direction:column!important;gap:10px!important}',
      '.product-details .product-info{padding-bottom:140px!important}'
    ].join('');
    document.head.appendChild(s);
  }

  function norm(n){return String(n||'').trim().toLowerCase().replace(/\s+/g,' ')}
  function photo(n){const k=norm(n);if(PHOTOS[k])return PHOTOS[k];if(k.indexOf('burger')!==-1||k.indexOf('wrap')!==-1)return PHOTOS['burgers & wraps'];return PHOTOS.veggie}
  function catStrip(){return document.querySelector('.cat-icons')}
  function screenEl(){return document.getElementById('screen')}
  function saveCat(){const s=catStrip();if(s)lockCatX=s.scrollLeft}
  function restoreCat(){const s=catStrip();if(s&&lockCatX!=null)s.scrollLeft=lockCatX}

  function placeNotify(){
    const header=document.querySelector('.app-brand-header');
    if(!header)return;
    const home=header.classList.contains('is-home')||!!document.querySelector('.home');
    let btn=header.querySelector('.bw-header-notify');
    if(!home){if(btn)btn.remove();return}
    if(!btn){
      btn=document.createElement('button');
      btn.type='button';btn.className='bw-header-notify';btn.setAttribute('aria-label','Notifications');
      btn.innerHTML=BELL+'<span class="bw-badge" aria-hidden="true"></span>';
      header.appendChild(btn);
      btn.onclick=function(e){
        e.preventDefault();e.stopPropagation();
        if(typeof openProfileSection==='function')openProfileSection('notifications');
        else if(typeof go==='function')go('profileDetail',{profileSection:'notifications'});
      };
    }
  }

  function pcat(p){
    if(!p)return'popular';
    const c=norm(p.cat||p.category||'');
    if(BY[c])return c;
    const n=norm(p.name||'');
    if(/juice|soda|drink|cola|water|smoothie|shake|tea|coffee|fanta|sprite/.test(n))return'drinks';
    if(/cake|dessert|ice cream|brownie|cookie|sweet/.test(n))return'desserts';
    if(/pizza/.test(n))return'pizza';
    if(/burger|wrap/.test(n))return'burgers & wraps';
    if(/chicken|wing|nugget/.test(n))return'chicken';
    if(/beef|steak/.test(n))return'beef';
    if(/fries|side|salad/.test(n))return'sides';
    if(/samosa|snack/.test(n))return'snacks';
    return c||'popular';
  }

  function syncExtras(list){
    try{
      if(typeof EXTRAS!=='undefined'){EXTRAS.length=0;list.forEach(function(x){EXTRAS.push(x)})}
      else window.EXTRAS=list.slice();
    }catch(e){window.EXTRAS=list.slice()}
  }

  function ugxFmt(n){
    if(typeof ugx==='function')return ugx(n);
    return 'UGX '+Number(n||0).toLocaleString();
  }

  function smartExtras(){
    if(!document.querySelector('.product-details,.details.product-details'))return;
    const p=(typeof state!=='undefined'&&state.product)||(window.state&&window.state.product);
    if(!p)return;
    const c=pcat(p);
    const list=(BY[c]||BY.popular).map(function(id){return ALL[id]}).filter(Boolean);
    syncExtras(list);
    document.querySelectorAll('.product-info .custom-section').forEach(function(sec){
      const head=((sec.querySelector('.custom-head strong')||{}).textContent)||'';
      if(/size/i.test(head)){
        sec.style.display=NO_SIZE[c]?'none':'';
        if(NO_SIZE[c]&&typeof state!=='undefined')state.size='Regular';
      }
      if(sec.querySelector('.extras')||/make it yours|optional|drink|sweet/i.test(head)){
        let box=sec.querySelector('.extras');
        if(!box){box=document.createElement('div');box.className='extras';sec.appendChild(box)}
        const selected=(typeof state!=='undefined'&&state.extras)||{};
        box.innerHTML=list.map(function(x){
          const checked=selected[x.id]?'checked':'';
          const pl=x.price>0?('+'+ugxFmt(x.price)):'Free';
          return '<label class="opt product-extra"><span><b>'+x.label+'</b><small>'+pl+'</small></span><input type="checkbox" data-ex="'+x.id+'" '+checked+' /></label>';
        }).join('');
        box.querySelectorAll('[data-ex]').forEach(function(input){
          input.onchange=function(){
            if(typeof state==='undefined')return;
            state.extras[input.dataset.ex]=input.checked;
            Object.keys(state.extras).forEach(function(k){if(!list.find(function(x){return x.id===k}))delete state.extras[k]});
            if(typeof render==='function')render(true);
          };
        });
        const strong=sec.querySelector('.custom-head strong');
        if(strong){
          if(c==='drinks')strong.textContent='Drink options';
          else if(c==='desserts')strong.textContent='Sweet add-ons';
          else strong.textContent='Make it yours';
        }
      }
    });
  }

  function fill(){
    css();
    placeNotify();
    smartExtras();
    const strip=catStrip();
    const prevX=strip?strip.scrollLeft:(lockCatX!=null?lockCatX:0);
    document.querySelectorAll('.cat-icon-btn').forEach(function(btn){
      const raw=btn.getAttribute('data-cat')||((btn.querySelector('span:last-child')||{}).textContent)||'';
      const url=photo(raw);
      let circle=btn.querySelector('.circle-ic');
      if(!circle){circle=document.createElement('span');circle.className='circle-ic bw-photo-cat';btn.insertBefore(circle,btn.firstChild)}
      circle.className='circle-ic bw-photo-cat';
      circle.innerHTML='';
      circle.style.backgroundImage="url('"+url+"')";
      circle.style.backgroundSize='cover';
      circle.style.backgroundPosition='center';
      circle.style.transform='none';
    });
    if(strip){
      const x=lockCatX!=null?lockCatX:prevX;
      strip.scrollLeft=x;
      requestAnimationFrame(function(){strip.scrollLeft=x});
    }
  }

  function restoreScroll(){
    const s=screenEl();
    if(s&&lockY!=null&&Date.now()<=lockUntil&&Math.abs(s.scrollTop-lockY)>1)s.scrollTop=lockY;
    restoreCat();
  }

  document.addEventListener('click',function(e){
    const t=e.target.closest('[data-cat],[data-mtab],[data-add],[data-pay],[data-sizebtn],[data-q],[data-cq],[data-ex],.chip,.add');
    if(!t)return;
    if(t.closest('[data-go]')&&!t.hasAttribute('data-cat')&&!t.hasAttribute('data-mtab'))return;
    saveCat();
    const s=screenEl();
    if(s){lockY=s.scrollTop;lockUntil=Date.now()+900}
    restoreScroll();
    requestAnimationFrame(function(){restoreScroll();requestAnimationFrame(restoreScroll)});
  },true);

  document.addEventListener('scroll',function(e){
    if(e.target&&e.target.classList&&e.target.classList.contains('cat-icons'))lockCatX=e.target.scrollLeft;
  },true);

  function patch(){
    if(typeof window.render!=='function'||window.render.__bwFix)return false;
    const orig=window.render;
    window.render=function(preserveScroll){
      const s=screenEl();
      const y=preserveScroll&&s?s.scrollTop:lockY;
      saveCat();
      if(preserveScroll&&s){lockY=s.scrollTop;lockUntil=Date.now()+900}
      const out=orig.apply(this,arguments);
      fill();
      restoreCat();
      if(preserveScroll||(lockY!=null&&Date.now()<lockUntil)){
        const target=y!=null?y:lockY;
        if(s&&target!=null){
          s.scrollTop=target;
          requestAnimationFrame(function(){s.scrollTop=target;restoreCat();fill()});
        }
      }
      return out;
    };
    window.render.__bwFix=true;
    fill();
    return true;
  }

  const id=setInterval(function(){fill();patch()},200);
  setTimeout(function(){clearInterval(id)},15000);
  const obs=new MutationObserver(function(){fill();restoreScroll()});
  function watch(){
    css();
    const s=screenEl();
    if(s)obs.observe(s,{childList:true,subtree:true});
    fill();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch);
  else watch();
})();
