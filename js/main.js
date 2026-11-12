(function(){
  document.body.classList.remove('no-js');

  /* WhatsApp-links met vooraf ingevuld bericht */
  var msg = encodeURIComponent('Hallo! Ik wil graag een afspraak maken bij Nails by Belladonna.');
  document.querySelectorAll('.wa-link').forEach(function(a){ a.href = 'https://wa.me/31615463503?text=' + msg; });

  /* Mobiel menu */
  var toggle = document.querySelector('.menu-toggle');
  toggle.addEventListener('click', function(){
    var open = document.body.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
  });
  document.querySelectorAll('.nav a').forEach(function(a){
    a.addEventListener('click', function(){
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* Nagel-illustraties (tijdelijk, tot er echte foto's zijn) */
  var palettes = {
    nude:   {bg:'#EBD9CC', polish:'#E3B5A8', shine:'#F6DCD3'},
    french: {bg:'#EDE3D3', polish:'#F2D9CF', shine:'#FBEDE7', tip:'#FFFDF8'},
    biab:   {bg:'#E9DCCB', polish:'#E8BFB4', shine:'#F7E0D8'},
    red:    {bg:'#E7D6C6', polish:'#B3202E', shine:'#E2525C'},
    wine:   {bg:'#E3D4C3', polish:'#6E1424', shine:'#A23446'},
    coral:  {bg:'#EFE1D3', polish:'#F08C8C', shine:'#F8B9B4'},
    glitter:{bg:'#EADBC8', polish:'#D9B57A', shine:'#F3DDB0', glitter:'#FFF4D6'},
    rosegl: {bg:'#EEDDD3', polish:'#E4A9A9', shine:'#F5CFCB', glitter:'#FFFFFF'}
  };
  var uid = 0;
  function rand(seed){ return function(){ seed = (seed*9301+49297)%233280; return seed/233280; }; }
  function art(key, label){
    var p = palettes[key] || palettes.nude, id = 'n' + (uid++), r = rand(uid*7+3);
    var fingers = [[38,92,24],[70,62,27],[102,52,28],[134,62,27],[164,98,23]];
    var s = '<svg viewBox="0 0 200 200" role="img" aria-label="'+label+'" preserveAspectRatio="xMidYMid slice"><title>'+label+'</title>';
    s += '<defs><radialGradient id="'+id+'g" cx="50%" cy="30%" r="80%"><stop offset="0" stop-color="#FBF6EE"/><stop offset="1" stop-color="'+p.bg+'"/></radialGradient>';
    s += '<linearGradient id="'+id+'s" x1="0" x2="1"><stop offset="0" stop-color="#F1D4BF"/><stop offset=".5" stop-color="#F6DFCD"/><stop offset="1" stop-color="#E7C2A9"/></linearGradient></defs>';
    s += '<rect width="200" height="200" fill="url(#'+id+'g)"/>';
    s += '<circle cx="160" cy="40" r="46" fill="#fff" opacity=".25"/>';
    fingers.forEach(function(f, i){
      var x = f[0], y = f[1], w = f[2], nw = w - 8, nh = w * 1.15, nx = x - nw/2, ny = y + 5, cid = id + 'c' + i;
      s += '<rect x="'+(x-w/2)+'" y="'+y+'" width="'+w+'" height="'+(215-y)+'" rx="'+(w/2)+'" fill="url(#'+id+'s)"/>';
      s += '<clipPath id="'+cid+'"><rect x="'+nx+'" y="'+ny+'" width="'+nw+'" height="'+nh+'" rx="'+(nw/2)+'"/></clipPath>';
      s += '<g clip-path="url(#'+cid+')"><rect x="'+nx+'" y="'+ny+'" width="'+nw+'" height="'+nh+'" fill="'+p.polish+'"/>';
      if (p.tip) s += '<path d="M'+nx+' '+(ny+nh*.32)+'Q'+x+' '+(ny+nh*.5)+' '+(nx+nw)+' '+(ny+nh*.32)+'V'+ny+'H'+nx+'z" fill="'+p.tip+'"/>';
      if (p.glitter) for (var k=0;k<14;k++) s += '<circle cx="'+(nx+r()*nw).toFixed(1)+'" cy="'+(ny+r()*nh).toFixed(1)+'" r="'+(.5+r()*1.3).toFixed(2)+'" fill="'+p.glitter+'" opacity="'+(.5+r()*.5).toFixed(2)+'"/>';
      s += '<rect x="'+(nx+nw*.22)+'" y="'+(ny+3)+'" width="'+(nw*.18)+'" height="'+(nh*.55)+'" rx="2" fill="'+p.shine+'" opacity=".7"/></g>';
      s += '<rect x="'+nx+'" y="'+ny+'" width="'+nw+'" height="'+nh+'" rx="'+(nw/2)+'" fill="none" stroke="#000" stroke-opacity=".06"/>';
    });
    if (p.glitter) for (var j=0;j<18;j++) s += '<circle cx="'+(r()*200).toFixed(1)+'" cy="'+(r()*60).toFixed(1)+'" r="'+(.6+r()*1.4).toFixed(2)+'" fill="#C5A572" opacity="'+(.3+r()*.5).toFixed(2)+'"/>';
    return s + '</svg>';
  }
  document.querySelectorAll('[data-art]').forEach(function(el){
    var svg = art(el.dataset.art, el.dataset.alt || 'Nagels van Nails by Belladonna');
    if (el.hasAttribute('data-square')) { el.outerHTML = svg; } else { el.innerHTML = svg; }
  });

  /* Afspraakformulier → WhatsApp */
  var form = document.getElementById('booking-form');
  if (form) {
  var datum = document.getElementById('f-datum');
  var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  datum.min = today.toISOString().slice(0, 10);

  function setError(name, text){
    var input = form.elements[name], err = document.getElementById('e-' + name);
    err.textContent = text || '';
    input.closest('.field').classList.toggle('invalid', !!text);
    input.setAttribute('aria-invalid', text ? 'true' : 'false');
    if (text) input.setAttribute('aria-describedby', 'e-' + name); else input.removeAttribute('aria-describedby');
  }
  ['naam','behandeling','datum'].forEach(function(n){
    form.elements[n].addEventListener('input', function(){ setError(n, ''); });
    form.elements[n].addEventListener('change', function(){ setError(n, ''); });
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var f = form.elements, first = null;
    var naam = f.naam.value.trim(), beh = f.behandeling.value, d = f.datum.value;
    if (!naam) { setError('naam', 'Vul je naam in.'); first = first || f.naam; }
    if (!beh) { setError('behandeling', 'Kies een behandeling.'); first = first || f.behandeling; }
    if (!d) { setError('datum', 'Kies een datum.'); first = first || f.datum; }
    else if (d < datum.min) { setError('datum', 'Kies een datum vanaf vandaag.'); first = first || f.datum; }
    if (first) { first.focus(); return; }

    var datumTekst = new Date(d + 'T12:00:00').toLocaleDateString('nl-NL', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
    var lines = [
      'Hallo! Ik wil graag een afspraak maken bij Nails by Belladonna.',
      '',
      '*Naam:* ' + naam,
      '*Behandeling:* ' + beh,
      '*Gewenste datum:* ' + datumTekst,
      '*Voorkeur tijdstip:* ' + f.tijd.value
    ];
    var opm = f.opmerking.value.trim();
    if (opm) lines.push('*Opmerking:* ' + opm);
    lines.push('', 'Alvast bedankt!');
    var url = 'https://wa.me/31615463503?text=' + encodeURIComponent(lines.join('\n'));
    var win = window.open(url, '_blank', 'noopener');
    if (!win) window.location.href = url;
  });
  }

  /* Tweede hero-video alleen laden op grotere schermen; afspelen tot data-end en opnieuw beginnen */
  var v2 = document.querySelector('.hero-vid--2');
  if (v2 && window.matchMedia('(min-width:768px)').matches) {
    var end = parseFloat(v2.dataset.end) || 0;
    v2.src = v2.dataset.src; v2.preload = 'auto';
    if (end) v2.addEventListener('timeupdate', function(){ if (v2.currentTime >= end) v2.currentTime = 0; });
    var p = v2.play(); if (p && p.catch) p.catch(function(){});
  }

  /* Header: transparant boven de video, effen na scrollen */
  var header = document.querySelector('.header');
  function onScroll(){ header.classList.toggle('scrolled', window.scrollY > 40); }
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});

  /* Fade-in bij scrollen */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
    items.forEach(function(el){ io.observe(el); });
  } else {
    items.forEach(function(el){ el.classList.add('visible'); });
  }
})();
