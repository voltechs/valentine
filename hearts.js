// Background Floating Hearts Animation
// Creates smooth floating hearts that drift upward in a wave pattern

const heartsLayer = document.getElementById('hearts');
const heartGlyphs = ['💗','💖','💘','💝','💕','💓','💞','❤️','🩷'];

function spawnBgHeart() {
  const h = document.createElement('div');
  h.className = 'heart';
  h.textContent = heartGlyphs[(Math.random()*heartGlyphs.length)|0];

  const x = Math.random() * 100;         // vw
  const dur = 3 + Math.random() * 6;     // seconds (wider range)
  const size = 14 + Math.random() * 22;  // px

  // Wave amplitude and direction for smooth floating
  const waveAmp = (40 + Math.random() * 80).toFixed(0);
  const waveDir = Math.random() < 0.5 ? -1 : 1; // randomly go left or right
  const wave = (waveAmp * waveDir) + 'px';
  const dy = (window.innerHeight + 200).toFixed(0) + 'px';

  h.style.left = x + 'vw';
  h.style.fontSize = size + 'px';
  h.style.animationDuration = dur + 's';
  h.style.setProperty('--wave', wave);
  h.style.setProperty('--dy', dy);

  heartsLayer.appendChild(h);
  setTimeout(() => h.remove(), dur * 1000);
}

// Massively increased heart spawn rate - from 220ms to 80ms interval
setInterval(spawnBgHeart, 80);
