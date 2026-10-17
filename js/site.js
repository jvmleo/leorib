// leorib — texturas, animações de entrada, menu mobile, formulário e player.
(() => {
  const root = document.documentElement;

  /* ---------- texturas (grão, linho, seixo, musgo, folha) ---------- */

  const D = [.13, .15, .12];
  const svgUrl = s => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;
  const tex = (w, layers) => svgUrl(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${w}'>` + layers.map((l, i) =>
      `<filter id='f${i}'><feTurbulence type='fractalNoise' baseFrequency='${l.f}' numOctaves='${l.o}' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 ${l.c[0]} 0 0 0 0 ${l.c[1]} 0 0 0 0 ${l.c[2]} 0 0 0 ${l.a}'/></filter><rect width='100%' height='100%' filter='url(#f${i})'/>`).join('') + `</svg>`);

  const TX = {
    grao: tex(240, [{ f: '.85', o: 3, c: D, a: '.14 0' }]),
    graoLuz: tex(240, [{ f: '.8', o: 3, c: [1, 1, 1], a: '.2 0' }]),
    graoForte: tex(240, [{ f: '.85', o: 3, c: D, a: '.24 0' }]),
    linho: tex(200, [{ f: '.012 .8', o: 2, c: D, a: '.26 0' }, { f: '.8 .012', o: 2, c: D, a: '.22 0' }]),
  };
  const SEIXO = svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><defs><radialGradient id='g' cx='34%' cy='28%' r='75%'><stop offset='0' stop-color='#DCD7CB'/><stop offset='.6' stop-color='#C9C4B7'/><stop offset='1' stop-color='#B5B0A3'/></radialGradient><radialGradient id='h' cx='34%' cy='28%' r='75%'><stop offset='0' stop-color='#D2CEC1'/><stop offset='1' stop-color='#ABA79B'/></radialGradient><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .13 0 0 0 0 .15 0 0 0 0 .12 0 0 0 .13 0'/></filter></defs><rect width='220' height='220' fill='#BEB9AC'/><g><ellipse cx='42' cy='38' rx='36' ry='26' transform='rotate(-14 42 38)' fill='url(#g)'/><ellipse cx='128' cy='30' rx='30' ry='22' transform='rotate(10 128 30)' fill='url(#h)'/><ellipse cx='192' cy='86' rx='26' ry='32' transform='rotate(-8 192 86)' fill='url(#g)'/><ellipse cx='84' cy='112' rx='40' ry='28' transform='rotate(18 84 112)' fill='url(#g)'/><ellipse cx='160' cy='162' rx='36' ry='25' transform='rotate(-20 160 162)' fill='url(#h)'/><ellipse cx='34' cy='184' rx='30' ry='22' transform='rotate(6 34 184)' fill='url(#g)'/><ellipse cx='100' cy='200' rx='22' ry='16' fill='url(#h)'/><ellipse cx='210' cy='212' rx='18' ry='14' fill='url(#g)'/></g><rect width='220' height='220' filter='url(#n)'/></svg>`);
  const NAT = {
    seixo: SEIXO,
    musgo: tex(200, [{ f: '.55', o: 4, c: [.12, .26, .12], a: '.5 -.18' }, { f: '.9', o: 2, c: [.86, .93, .62], a: '.32 -.1' }]),
    folha: TX.graoLuz + ',repeating-linear-gradient(58deg,rgba(214,227,195,0) 0 30px,rgba(214,227,195,.1) 30px 31px),radial-gradient(80% 60% at 70% 20%,rgba(141,176,110,.42),rgba(141,176,110,0) 70%)',
  };

  const vars = {
    '--tx-grao': TX.grao, '--tx-grao-luz': TX.graoLuz, '--tx-grao-forte': TX.graoForte, '--tx-linho': TX.linho,
    '--nat-seixo': NAT.seixo, '--nat-musgo': NAT.musgo, '--nat-folha': NAT.folha,
  };
  for (const k in vars) root.style.setProperty(k, vars[k]);

  /* ---------- animações de entrada ---------- */

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animated = document.querySelectorAll('[data-reveal],[data-line],[data-strip],[data-orb]');
  if (reduced || !('IntersectionObserver' in window)) {
    animated.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, d = +(el.dataset.delay || 0);
      if (d) {
        el.style.transitionDelay = d + 'ms';
        setTimeout(() => { el.style.transitionDelay = ''; }, d + 1500);
      }
      el.classList.add('in');
      io.unobserve(el);
    }), { threshold: 0.15 });
    animated.forEach(el => io.observe(el));
  }

  /* ---------- menu mobile ---------- */

  const menu = document.getElementById('menu');
  const openBtn = document.querySelector('.menu-btn');
  if (menu && openBtn) {
    const closeBtn = menu.querySelector('.close-btn');
    const setOpen = open => {
      menu.hidden = !open;
      openBtn.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
      (open ? closeBtn : openBtn).focus();
    };
    openBtn.addEventListener('click', () => setOpen(true));
    closeBtn.addEventListener('click', () => setOpen(false));
    menu.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) setOpen(false); });
  }

  /* ---------- formulário de contato ----------
     Sem servidor: monta a mensagem e abre o app de e-mail da pessoa. */

  const form = document.querySelector('[data-contato]');
  if (form) {
    const status = form.querySelector('.form-status');
    form.addEventListener('submit', e => {
      e.preventDefault();
      let first = null;
      form.querySelectorAll('.field').forEach(field => {
        const input = field.querySelector('input,textarea');
        const empty = !input.value.trim();
        field.toggleAttribute('data-error', empty);
        input.setAttribute('aria-invalid', String(empty));
        if (empty && !first) first = input;
      });
      if (first) { first.focus(); return; }
      const v = name => form.elements[name].value.trim();
      const body = `${v('mensagem')}\n\n${v('nome')}\nContato: ${v('contato')}`;
      const href = `mailto:${form.dataset.email}?subject=${encodeURIComponent('Projeto · ' + v('nome'))}&body=${encodeURIComponent(body)}`;
      window.location.href = href;
      if (status) status.textContent = 'Abrindo o seu app de e-mail com a mensagem pronta. Se nada abrir, escreva direto para ' + form.dataset.email + '.';
    });
    form.addEventListener('input', e => {
      const field = e.target.closest('.field');
      if (field && e.target.value.trim()) { field.removeAttribute('data-error'); e.target.setAttribute('aria-invalid', 'false'); }
    });
  }

  /* ---------- trilha da quinzena ---------- */

  const player = document.querySelector('[data-player]');
  if (player) {
    const btn = player.querySelector('.play');
    const estado = player.querySelector('.estado-txt');
    const fill = player.querySelector('.progresso .fill');
    const tempo = player.querySelector('.tempo');
    const total = +player.dataset.duracao || 214;
    let prog = .34, timer = null;
    const render = () => {
      const t = Math.round(prog * total);
      fill.style.width = (prog * 100).toFixed(1) + '%';
      tempo.textContent = Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0');
    };
    btn.addEventListener('click', () => {
      const tocando = !player.classList.contains('tocando');
      player.classList.toggle('tocando', tocando);
      btn.setAttribute('aria-label', tocando ? 'Pausar' : 'Tocar');
      btn.textContent = tocando ? '❚❚' : '▶';
      estado.textContent = tocando ? 'Pausar' : 'Tocar';
      clearInterval(timer);
      if (tocando) timer = setInterval(() => { prog = prog >= 1 ? 0 : prog + .004; render(); }, 400);
    });
    render();
  }

  /* ---------- retrato: toque mostra a foto original ---------- */

  const retrato = document.querySelector('.retrato');
  if (retrato) {
    const b = retrato.querySelector('button');
    b && b.addEventListener('click', () => {
      const on = retrato.classList.toggle('show');
      b.setAttribute('aria-pressed', String(on));
    });
  }
})();
