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
  { bg: ['#0d0520','#4a1080'], accent: '#9b4dca', title: 'VOID',  artist: 'Artista 1', spotify: '...' },
  { bg: ['#0a1628', '#0f3460'], accent: '#4a9eff', title: 'DRIFT',  artist: 'Artista 1', spotify: '...'  },
  { bg: ['#1a0505', '#6b1515'], accent: '#ff4444', title: 'EMBER',  artist: 'Artista 1', spotify: '...'  },
  { bg: ['#051a0d', '#0f4a25'], accent: '#22cc66', title: 'BLOOM',  artist: 'Artista 1', spotify: '...'  },
  { bg: ['#1a1505', '#6b5a10'], accent: '#ffcc00', title: 'HAZE',  artist: 'Artista 1', spotify: '...'   },
  { bg: ['#0d1a1a', '#0f4a4a'], accent: '#00cccc', title: 'TIDE',  artist: 'Artista 1', spotify: '...'   },
  { bg: ['#1a0510', '#6b1540'], accent: '#ff4499', title: 'PULSE',  artist: 'Artista 1', spotify: '...'  },
  { bg: ['#0a0a1a', '#1a1a5a'], accent: '#6666ff', title: 'DEEP',  artist: 'Artista 1', spotify: '...'   },
  { bg: ['#0d1505', '#2a4a10'], accent: '#88cc22', title: 'RAW',  artist: 'Artista 1', spotify: '...'    },
  { bg: ['#1a0d05', '#6b3010'], accent: '#ff8833', title: 'BURN',  artist: 'Artista 1', spotify: '...'   },
];

// Extrai o SVG para reusar no modal
function makeCoverSVG(c, i) {
  return `<img src="${c.img}" alt="${c.title}" style="width:100%;height:100%;object-fit:cover;display:block;">`;
}

function makeCover(c, i) {
  const rank = (i % 10) + 1;
  const item = document.createElement('div');
  item.className = 'cover-item';
  item.innerHTML = `
    <div class="cover-ph">${makeCoverSVG(c, i)}</div>
    <div class="cover-overlay"></div>
  `;

  // Abre modal ao clicar — só nas 10 originais (não duplicatas)
  item.addEventListener('click', () => openModal(c, rank));

  addHoverListeners(item);
  return item;
}

const track = document.getElementById('carousel');

// Duplica para loop infinito contínuo
[...COVERS, ...COVERS].forEach((c, i) => {
  track.appendChild(makeCover(c, i));
});

// ── Modal ──
const overlay = document.createElement('div');
overlay.className = 'modal-overlay';
overlay.innerHTML = `
  <div class="modal" style="position:relative">
    <button class="modal-close" id="modal-close">✕</button>
    <div class="modal-cover" id="modal-cover"></div>
    <div class="modal-info">
      <div class="modal-rank" id="modal-rank"></div>
      <div class="modal-title" id="modal-title"></div>
      <div class="modal-artist" id="modal-artist"></div>
      <a href="#" target="_blank" class="modal-spotify" id="modal-spotify">
        ▶ Ouvir no Spotify
      </a>
    </div>
  </div>
`;
document.body.appendChild(overlay);

document.getElementById('modal-close').addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function openModal(c, rank) {
  document.getElementById('modal-rank').textContent = `#${rank} — top 10`;
  document.getElementById('modal-title').textContent = c.title;
  document.getElementById('modal-artist').textContent = c.artist;
  document.getElementById('modal-spotify').href = c.spotify;

  // reutiliza o SVG do cover
  const coverEl = document.getElementById('modal-cover');
  coverEl.innerHTML = makeCoverSVG(c, rank - 1);

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  addHoverListeners(document.getElementById('modal-spotify'));
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}