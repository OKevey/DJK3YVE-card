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
    if (target >= 1000000000) {
      el.textContent = (val / 1000000000).toFixed(1) + 'B';
    } else if (target >= 1000000) {
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
  covers:  342,
  streams: 1500000000,
};

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => countUp(document.getElementById('stat-covers'),  DATA.covers,  1400), 0);
      setTimeout(() => countUp(document.getElementById('stat-streams'), DATA.streams, 1800), 100);
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
  { img:'Arts/MONTAGEM LADRAO.png', title: 'MONTAGEM LADRAO',  artist: 'ATLXS, MXZI', spotify: 'https://open.spotify.com/track/48WnIIBbnttcwUQ77MBoMI' },
  { img:'Arts/MONTAGEM XONADA.png', title: 'MONTAGEM XONADA',  artist: 'MXZI, Dj Samir, DJ Javi26', spotify: 'https://open.spotify.com/track/2Gs0iF27my40p0dANv2rAg'  },
  { img:'Arts/MONTAGEM SUPERSONIC.png', title: 'MONTAGEM SUPERSONIC',  artist: 'KHAOS, Jmilton', spotify: 'https://open.spotify.com/track/2r2vr5ujMEZN9hJzwwc6Jk' },
  { img:'Arts/NO BATIDAO.png', title: 'NO BATIDAO',  artist: 'ZXKAI, slxughter', spotify: 'https://open.spotify.com/track/7vg9noSnFEyPfwLiaCW4vi' },
  { img:'Arts/CLIMA LINDO3.png', title: 'CLIMA LINDO',  artist: 'GXMZ, Repsaj', spotify: 'https://open.spotify.com/track/3DXxNFEYRt2Fro0mHBa4Qd' },
  { img:'Arts/RITMO DE VERÃO.png', title: 'RITMO DE VERAO',  artist: 'GXMZ, SEKIMANE, Repsaj', spotify: 'https://open.spotify.com/track/4zyt3pQgPQGmpPgf9mifqk' },
  { img:'Arts/DIRTY SHOES FUNK.png', title: 'DIRTY SHOES FUNK',  artist: 'DJ Javi26, ovg!, SASORIIXPP', spotify: 'https://open.spotify.com/track/070T0rKUug5m8pjamiBCdE' },
  { img:'Arts/MONTAGEM BANDIDO.png', title: 'MONTAGEM BANDIDO',  artist: 'Jmilton, Itamar MC', spotify: 'https://open.spotify.com/track/5s9JKS0P0exKgwLe4yCjAK' },
  { img:'Arts/REINADO (rubix x tas).png', title: 'REINADO',  artist: 'Jmilton, CHASHKAKEFIRA', spotify: 'https://open.spotify.com/track/12GD6hVuuDyfSOqUMwX6ph' },
  { img:'Arts/nakama art PSD.png', title: 'DIA DELICIA',  artist: 'Nakama, ΣP', spotify: 'https://open.spotify.com/track/094IjHeVUviN4aBnSXYsuj' },
];

// svg extract
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

  // modal thing open
  item.addEventListener('click', () => openModal(c, rank));

  addHoverListeners(item);
  return item;
}

const track = document.getElementById('carousel');

// loops
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
        ▶ Listen on Spotify!
      </a>
    </div>
  </div>
`;
document.body.appendChild(overlay);

document.getElementById('modal-close').addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function openModal(c, rank) {
  document.getElementById('modal-rank').textContent = `#${rank} — Hall of fame`;
  document.getElementById('modal-title').textContent = c.title;
  document.getElementById('modal-artist').textContent = c.artist;
  document.getElementById('modal-spotify').href = c.spotify;

  // forgor what this do
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