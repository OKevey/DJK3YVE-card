// ── Cursor ──
const cur = document.getElementById('cur');
const curR = document.getElementById('cur-r');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top  = my + 'px';
});

(function loop() {
  rx += (mx - rx) * .11;
  ry += (my - ry) * .11;
  curR.style.left = rx + 'px';
  curR.style.top  = ry + 'px';
  requestAnimationFrame(loop);
})();

function addHoverListeners(el) {
  el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
}

document.querySelectorAll('a, .stat-card, .skill').forEach(addHoverListeners);

// ── CountUp ──
function countUp(el, target, duration = 1800) {
  const start = performance.now();
  function update(now) {
    const p    = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val  = Math.round(ease * target);
    if (target >= 1000000) {
      el.textContent = (val / 1000000).toFixed(1) + 'M';
    } else if (target >= 1000) {
      el.textContent = (val / 1000).toFixed(0) + 'K';
    } else {
      el.textContent = val;
    }
    if (p < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ── Placeholder data — troque pelos valores reais ──
const DATA = {
  covers:  47,
  streams: 2400000,
  artists: 23,
};

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => countUp(document.getElementById('stat-covers'),  DATA.covers,  1400), 0);
      setTimeout(() => countUp(document.getElementById('stat-streams'), DATA.streams, 1800), 100);
      setTimeout(() => countUp(document.getElementById('stat-artists'), DATA.artists, 1200), 200);
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

statsObserver.observe(document.querySelector('.stats-row'));

// ── Carousel — 10 capas placeholder ──
// Para usar imagens reais, substitua cada objeto por:
// { img: 'caminho/para/imagem.jpg', title: 'NOME' }
// e ajuste makeCover() para usar <img> em vez do SVG.
const COVERS = [
  { bg: ['#0d0520', '#4a1080'], accent: '#9b4dca', title: 'VOID'  },
  { bg: ['#0a1628', '#0f3460'], accent: '#4a9eff', title: 'DRIFT' },
  { bg: ['#1a0505', '#6b1515'], accent: '#ff4444', title: 'EMBER' },
  { bg: ['#051a0d', '#0f4a25'], accent: '#22cc66', title: 'BLOOM' },
  { bg: ['#1a1505', '#6b5a10'], accent: '#ffcc00', title: 'HAZE'  },
  { bg: ['#0d1a1a', '#0f4a4a'], accent: '#00cccc', title: 'TIDE'  },
  { bg: ['#1a0510', '#6b1540'], accent: '#ff4499', title: 'PULSE' },
  { bg: ['#0a0a1a', '#1a1a5a'], accent: '#6666ff', title: 'DEEP'  },
  { bg: ['#0d1505', '#2a4a10'], accent: '#88cc22', title: 'RAW'   },
  { bg: ['#1a0d05', '#6b3010'], accent: '#ff8833', title: 'BURN'  },
];

function makeCover(c, i) {
  const rank = (i % 10) + 1;
  const item = document.createElement('div');
  item.className = 'cover-item';

  item.innerHTML = `
    <div class="cover-ph">
      <svg width="150" height="150" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cg${i}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stop-color="${c.bg[0]}"/>
            <stop offset="100%" stop-color="${c.bg[1]}"/>
          </linearGradient>
        </defs>
        <rect width="150" height="150" fill="url(#cg${i})"/>
        <line x1="0"   y1="50"  x2="150" y2="50"  stroke="${c.accent}" stroke-opacity=".08" stroke-width="1"/>
        <line x1="0"   y1="100" x2="150" y2="100" stroke="${c.accent}" stroke-opacity=".08" stroke-width="1"/>
        <line x1="50"  y1="0"   x2="50"  y2="150" stroke="${c.accent}" stroke-opacity=".08" stroke-width="1"/>
        <line x1="100" y1="0"   x2="100" y2="150" stroke="${c.accent}" stroke-opacity=".08" stroke-width="1"/>
        <circle cx="75" cy="75" r="32" fill="none" stroke="${c.accent}" stroke-opacity=".2" stroke-width="1"/>
        <circle cx="75" cy="75" r="10" fill="${c.accent}" fill-opacity=".15"/>
        <text x="75" y="138" text-anchor="middle"
          font-family="sans-serif" font-weight="900" font-size="11"
          fill="${c.accent}" fill-opacity=".7" letter-spacing="3">${c.title}</text>
        <rect x="6" y="6" width="22" height="14" fill="rgba(0,0,0,0.5)"/>
        <text x="17" y="17" text-anchor="middle"
          font-family="monospace" font-size="8" font-weight="700"
          fill="${c.accent}" fill-opacity=".9">#${rank}</text>
      </svg>
    </div>
    <div class="cover-overlay"></div>
  `;

  addHoverListeners(item);
  return item;
}

const track = document.getElementById('carousel');

// Duplica para loop infinito contínuo
[...COVERS, ...COVERS].forEach((c, i) => {
  track.appendChild(makeCover(c, i));
});
