// <leo-digital> — a "digital de árvore": anéis de tronco gerados a partir de um nome (seed).
// Atributos: size, seed, cor, aneis, semente ("false" desliga), cor-semente, motion ("false" desliga).
// Cores aceitam var(--token), então o símbolo acompanha o modo escuro.
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const EASE = 'cubic-bezier(.2,.7,.2,1)';
  const TAU = Math.PI * 2;

  const hash = s => { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rand = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

  const cache = {};
  function build(S, seed, N) {
    const key = [S, seed, N].join('|');
    if (cache[key]) return cache[key];
    const r = rand(hash(seed)), c = S / 2, maxR = S * 0.47;
    const a2 = .05 + r() * .06, rot = r() * Math.PI, a3 = .03 + r() * .05, p3 = r() * TAU, a5 = r() * .035, p5 = r() * TAU;
    const w = S < 64 ? Math.max(1.3, S * .045) : Math.max(1, S * .016);
    const step = maxR / (N + .6);
    const out = [];
    const sp = [], p0 = r() * TAU;
    for (let k = 0; k <= 70; k++) {
      const t = k / 70, th = p0 + t * TAU * 1.6, rr = step * (.15 + t * 1.05);
      sp.push([c + Math.cos(th) * rr, c + Math.sin(th) * rr * .9]);
    }
    out.push(sp);
    for (let i = 1; i <= N; i++) {
      const r0 = step * (i + .6), pts = [], j = r() * TAU, aj = .008 + r() * .012;
      for (let k = 0; k < 120; k++) {
        const th = k / 120 * TAU;
        const f = 1 + a2 * Math.cos(2 * (th - rot)) + a3 * Math.sin(3 * th + p3 + i * .14) + a5 * Math.sin(5 * th + p5 - i * .22) + aj * Math.sin(9 * th + j);
        pts.push([c + Math.cos(th) * r0 * f, c + Math.sin(th) * r0 * f * .92]);
      }
      pts.push(pts[0]);
      out.push(pts);
    }
    const rings = out.map((pts, i) => {
      const d = 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L');
      const L = i === 0 ? step * 6 : TAU * step * (i + .6);
      const last = i === N;
      const dash = (S < 64 || last) ? 'none' : [L * (.28 + r() * .3), S * .022, L * (.12 + r() * .2), S * .014, L].map(n => n.toFixed(1)).join(' ');
      return { d, width: last ? w * 1.35 : w, dash };
    });
    return (cache[key] = rings);
  }

  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  class LeoDigital extends HTMLElement {
    connectedCallback() {
      if (this._svg) return;
      const S = +this.getAttribute('size') || 160;
      const N = +this.getAttribute('aneis') || (S < 40 ? 3 : S < 100 ? 6 : 9);
      const cor = this.getAttribute('cor') || '#2B5633';
      const seed = this.getAttribute('seed') || 'leorib';
      this.still = this.getAttribute('motion') === 'false' || reduced();
      this.S = S;
      this.n = N + 1;
      this.on = false;
      this.hover = false;

      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('width', S);
      svg.setAttribute('height', S);
      svg.setAttribute('viewBox', `0 0 ${S} ${S}`);
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      svg.style.cssText = 'display:block;overflow:visible;flex:none';

      this.paths = build(S, seed, N).map(r => {
        const p = document.createElementNS(NS, 'path');
        p.setAttribute('d', r.d);
        Object.assign(p.style, {
          fill: 'none', stroke: cor, strokeWidth: r.width, strokeLinecap: 'round', strokeLinejoin: 'round',
          strokeDasharray: r.dash, transformBox: 'view-box', transformOrigin: `${S / 2}px ${S / 2}px`,
        });
        svg.appendChild(p);
        return p;
      });

      if (this.getAttribute('semente') !== 'false' && S >= 32) {
        const c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', S / 2);
        c.setAttribute('cy', S / 2);
        c.setAttribute('r', Math.max(1.5, S * .022));
        Object.assign(c.style, { fill: this.getAttribute('cor-semente') || '#9A4F33', transformBox: 'view-box', transformOrigin: `${S / 2}px ${S / 2}px` });
        svg.appendChild(c);
        this.seedDot = c;
      }

      this.style.display = this.style.display || 'block';
      this.appendChild(svg);
      this._svg = svg;

      if (this.still) { this.on = true; this.apply(); return; }
      this.apply();
      svg.addEventListener('mouseenter', () => { this.hover = true; this.apply(); });
      svg.addEventListener('mouseleave', () => { this.hover = false; this.apply(); });
      // os anéis nascem do centro para fora quando o símbolo entra na tela
      this.io = new IntersectionObserver(entries => {
        if (!entries.some(e => e.isIntersecting)) return;
        this.io.disconnect();
        requestAnimationFrame(() => requestAnimationFrame(() => { this.on = true; this.apply(); }));
      }, { threshold: 0.1 });
      this.io.observe(this);
    }

    disconnectedCallback() { this.io && this.io.disconnect(); }

    apply() {
      const { on, hover, still } = this;
      this.paths.forEach((p, i) => {
        const dir = i % 2 ? 1 : -1;
        const delay = still ? 0 : hover ? i * 35 : on ? i * 70 : 0;
        p.style.transform = !on ? 'scale(.55) rotate(-25deg)' : hover ? `rotate(${dir * (4 + i * .6)}deg) scale(${1 + i * .006})` : 'none';
        p.style.opacity = on ? 1 : 0;
        p.style.transition = still ? 'none' : `transform ${hover ? .9 : 1.2}s ${EASE} ${delay}ms, opacity .8s ${EASE} ${delay}ms`;
      });
      if (this.seedDot) {
        this.seedDot.style.transform = !on ? 'scale(0)' : hover ? 'scale(1.6)' : 'scale(1)';
        this.seedDot.style.transition = still ? 'none' : `transform .6s ${EASE} ${on && !hover ? this.n * 70 : 0}ms`;
      }
    }
  }

  customElements.define('leo-digital', LeoDigital);
})();
