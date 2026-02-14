// Main Valentine App Logic
// Handles button interactions, celebrations, and fireworks

// ---------- DOM Elements ----------
const btns = document.getElementById('btns');
const yesBtn = document.getElementById('yesBtn');
const noBtn  = document.getElementById('noBtn');
const success = document.getElementById('success');
const topline = document.getElementById('topline');
const question = document.getElementById('question');
const emoji = document.getElementById('emoji');
const caption = document.getElementById('caption');

// Full-screen overlay so "fixed" never gets trapped by backdrop-filter containers
const yesOverlay = document.createElement('div');
yesOverlay.style.position = 'fixed';
yesOverlay.style.inset = '0';
yesOverlay.style.zIndex = '20000';
yesOverlay.style.pointerEvents = 'none';
document.body.appendChild(yesOverlay);

let dodges = 0;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// ---------- Emoji and Caption Stages ----------
const emojiStages = [
  { minDodges: 0, emoji: "😊", caption: "pls say yes" },
  { minDodges: 1, emoji: "🤔", caption: "wait... really?" },
  { minDodges: 3, emoji: "😳", caption: "this is awkward" },
  { minDodges: 5, emoji: "🥺", caption: "pls reconsider" },
  { minDodges: 8, emoji: "🥺", caption: "do I smell or something?" },
  { minDodges: 11, emoji: "😰", caption: "what did I do to deserve this?" },
  { minDodges: 14, emoji: "🥹", caption: "confused why no was even an option" },
  { minDodges: 17, emoji: "🥹", caption: "who hurt you?" },
  { minDodges: 20, emoji: "😢", caption: "starting to hurt a little" },
  { minDodges: 23, emoji: "😢", caption: "is it my hair?" },
  { minDodges: 26, emoji: "😭", caption: "this is getting ridiculous" },
  { minDodges: 29, emoji: "😭", caption: "I showered today I swear" },
  { minDodges: 32, emoji: "😭", caption: "why are you like this" },
  { minDodges: 35, emoji: "💔", caption: "my heart can't take this" },
  { minDodges: 38, emoji: "🫠", caption: "I'm literally melting" },
  { minDodges: 41, emoji: "🫠", caption: "was it something I said?" },
  { minDodges: 44, emoji: "💀", caption: "you're killing me" },
  { minDodges: 47, emoji: "💀", caption: "call 911" },
  { minDodges: 50, emoji: "👻", caption: "I'm dead now, thanks" },
  { minDodges: 55, emoji: "👻", caption: "haunting you forever" },
  { minDodges: 60, emoji: "🪦", caption: "RIP to my self-esteem" },
  { minDodges: 70, emoji: "🤡", caption: "I'm the whole circus at this point" },
  { minDodges: 80, emoji: "🗿", caption: "emotionally unavailable now" },
  { minDodges: 90, emoji: "💩", caption: "this is just cruel" },
];

// ---------- Helper Functions ----------
function clamp(n, lo, hi){ return Math.max(lo, Math.min(hi, n)); }

let noButtonEscaped = false;

function placeNoRandom(mouseX, mouseY) {
  // Switch to fixed positioning on first dodge
  if (!noButtonEscaped) {
    noBtn.style.position = 'fixed';
    noBtn.style.zIndex = '1000';
    noButtonEscaped = true;
  }

  const minDistance = 300;

  // Use very conservative bounds that work even if viewport shrinks (e.g. DevTools opens)
  const rect = noBtn.getBoundingClientRect();
  const btnW = Math.ceil(rect.width);
  const btnH = Math.ceil(rect.height);

  // Assume minimum viewport of 1200x600 and keep button well within that
  const safeWidth = Math.min(window.innerWidth, 1200);
  const safeHeight = Math.min(window.innerHeight, 600);

  const marginX = 150;
  const marginY = 100;

  const maxX = safeWidth - btnW - marginX;
  const maxY = safeHeight - btnH - marginY;

  let x, y, attempts = 0;

  // Keep trying random positions until we find one far from the mouse
  // Calculate distance from mouse to CENTER of button
  do {
    x = marginX + Math.floor(Math.random() * (maxX - marginX));
    y = marginY + Math.floor(Math.random() * (maxY - marginY));

    // Distance from mouse to button center
    const btnCenterX = x + btnW / 2;
    const btnCenterY = y + btnH / 2;
    const dist = Math.sqrt(
      Math.pow(btnCenterX - mouseX, 2) +
      Math.pow(btnCenterY - mouseY, 2)
    );

    if (dist >= minDistance) break;
    attempts++;
  } while (attempts < 30);

  console.log('Dodge:', {x, y, btnW, btnH, maxX, maxY, innerWidth: window.innerWidth, innerHeight: window.innerHeight});

  // Position fixed to viewport (no transform so x,y are exact top-left)
  noBtn.style.left = x + 'px';
  noBtn.style.top = y + 'px';
  noBtn.style.transform = 'none';
}

function growYes() {
  // Faster growth - increased multiplier
  const growth = Math.sqrt(dodges) * 0.8;
  const maxGrowth = 4;
  const actualGrowth = Math.min(maxGrowth, growth);

  // Increase padding and font size for smooth growth
  const basePadding = 12;
  const baseFontSize = 16;
  const padding = basePadding + actualGrowth * 12;
  const fontSize = baseFontSize + actualGrowth * 8;

  yesBtn.style.padding = `${padding}px ${padding * 1.5}px`;
  yesBtn.style.fontSize = `${fontSize}px`;

  // move toward center initially, then zombie mode takes over
  if (dodges < 20) {
    const leftPos = Math.min(50, 30 + Math.sqrt(dodges) * 2.5);
    yesBtn.style.left = leftPos + '%';
  }
}

function updateText() {
  // Find the current emoji stage based on dodge count
  let currentStage = emojiStages[0];
  for (let i = emojiStages.length - 1; i >= 0; i--) {
    if (dodges >= emojiStages[i].minDodges) {
      currentStage = emojiStages[i];
      break;
    }
  }

  emoji.textContent = currentStage.emoji;
  caption.textContent = currentStage.caption;
}

function dodgeNo(mouseX, mouseY) {
  dodges++;

  // If zombie mode is active, increase speed slightly with each dodge
  if (yesZombieActive) {
    zombieSpeedMultiplier = Math.min(3, zombieSpeedMultiplier + 0.08);
  }

  growYes();
  updateText();
  placeNoRandom(mouseX, mouseY);

  // Optional: Update header text at high dodge counts
  if (dodges >= 90) {
    yesBtn.textContent = "YES!!!";
    topline.textContent = "Ok, ok. We both know the answer.";
  }
}

// ---------- No Button Event Listeners ----------
noBtn.addEventListener('mouseenter', (e) => dodgeNo(e.clientX, e.clientY));
noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  dodgeNo(touch.clientX, touch.clientY);
}, {passive:false});

// If they somehow click No, still dodge + deny politely
noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  dodgeNo(e.clientX, e.clientY);
});

// ---------- Sound Effects ----------
const yayAudio = document.getElementById('yaySound');
yayAudio.volume = 0.7;

function playYaySound() {
  yayAudio.currentTime = 0;
  yayAudio.play().catch(err => console.log('Audio play failed:', err));
}

// ---------- CSS-based Fireworks (GPU accelerated) ----------
const fxContainer = document.getElementById('fx');
const colors = ['#ff4fd8','#ff3b6b','#ffd1f0','#9fe7ff','#fff1a8'];

function burst(x, y, count=90) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'fw-particle';

    // Random angle and distance
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 200;
    const fx = Math.cos(angle) * distance;
    const fy = Math.sin(angle) * distance - Math.random() * 50;

    // Random color and duration
    const color = colors[Math.floor(Math.random() * colors.length)];
    const duration = 0.6 + Math.random() * 0.8;

    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.backgroundColor = color;
    particle.style.boxShadow = `0 0 8px ${color}`;
    particle.style.setProperty('--fx', fx + 'px');
    particle.style.setProperty('--fy', fy + 'px');
    particle.style.animation = `fwBurst ${duration}s ease-out forwards`;

    fxContainer.appendChild(particle);

    // Remove after animation
    setTimeout(() => particle.remove(), duration * 1000 + 100);
  }
}

function celebrate() {
  success.classList.add('show');
  topline.textContent = "Indecisive queen defeated";
  question.textContent = "Will you be my valentine?";
  caption.textContent = "YAYYYYY!!!!";
  emoji.textContent = "🥰";

  // Play celebratory sound!
  playYaySound();

  // Hide the buttons nicely
  yesBtn.style.opacity = 0;
  noBtn.style.opacity = 0;
  yesBtn.style.pointerEvents = 'none';
  noBtn.style.pointerEvents = 'none';

  // CSS-based fireworks - optimized for smoothness
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const w = window.innerWidth;
  const h = window.innerHeight;

  // Initial center burst
  burst(cx, cy, 120);

  // Immediate bursts around center
  burst(cx - 200, cy - 150, 80);
  burst(cx + 200, cy - 150, 80);
  burst(cx - 200, cy + 100, 70);
  burst(cx + 200, cy + 100, 70);
  burst(cx, cy - 200, 60);

  // Cascading bursts across entire screen
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      const x = 150 + Math.random() * (w - 300);
      const y = 100 + Math.random() * (h - 200);
      burst(x, y, 50 + Math.random() * 40);
    }, i * 120);
  }

  // Sustained finale bursts
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      const x = 200 + Math.random() * (w - 400);
      const y = 150 + Math.random() * (h - 300);
      burst(x, y, 50);
    }, 1800 + i * 150);
  }

  // TONS of extra background hearts - increased from 100 to 200
  for (let i=0;i<200;i++) setTimeout(spawnBgHeart, i*25);

  // Enable mousedown-to-firework after celebration
  setTimeout(() => {
    document.addEventListener('mousedown', (e) => {
      burst(e.clientX, e.clientY, 80);
      // Spawn a few hearts too
      for (let i=0;i<3;i++) setTimeout(spawnBgHeart, i*50);
    });
  }, 500);
}

yesBtn.addEventListener('click', (e) => { e.preventDefault(); celebrate(); });

// ---------- Track Mouse/Touch Position ----------
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

document.addEventListener('touchmove', (e) => {
  if (e.touches.length > 0) {
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;
  }
}, { passive: true });

document.addEventListener('touchstart', (e) => {
  if (e.touches.length > 0) {
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;
  }
}, { passive: true });

// ---------- Zombie Yes Button ----------
// Slowly follows the mouse after 20 dodges
let yesZombieActive = false;
let yesX = 0;
let yesY = 0;
let zombieSpeedMultiplier = 0.3; // Start super slow, increases with each dodge

function zombieYes() {
  if (dodges >= 20 && !yesZombieActive) {
    yesZombieActive = true;

    // Get current button position before moving to overlay
    const rect = yesBtn.getBoundingClientRect();
    yesX = rect.left + rect.width / 2;
    yesY = rect.top + rect.height / 2;

    // Move Yes button to overlay so positioning is truly viewport-based
    yesOverlay.appendChild(yesBtn);

    yesBtn.style.position = 'absolute';
    yesBtn.style.transform = 'none';
    yesBtn.style.margin = '0';
    yesBtn.style.pointerEvents = 'auto';
  }

  if (yesZombieActive) {
    // Move with momentum: accelerate when far, max speed in middle, decelerate when close
    const dx = mouseX - yesX;
    const dy = mouseY - yesY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 1) {
      if (dist > 200) {
        // Far: accelerate smoothly (lerp = slow start)
        const lerpSpeed = 0.02 * zombieSpeedMultiplier;
        yesX += dx * lerpSpeed;
        yesY += dy * lerpSpeed;
      } else if (dist > 50) {
        // Medium distance: constant max speed
        const maxSpeed = 3 * zombieSpeedMultiplier;
        yesX += (dx / dist) * maxSpeed;
        yesY += (dy / dist) * maxSpeed;
      } else {
        // Close: decelerate smoothly (higher lerp = smooth slow down)
        const lerpSpeed = 0.08 * zombieSpeedMultiplier;
        yesX += dx * lerpSpeed;
        yesY += dy * lerpSpeed;
      }
    }

    // Center button on tracked position
    const rect = yesBtn.getBoundingClientRect();
    yesBtn.style.left = Math.round(yesX - rect.width / 2) + 'px';
    yesBtn.style.top = Math.round(yesY - rect.height / 2) + 'px';
  }

  requestAnimationFrame(zombieYes);
}

zombieYes();

// ---------- Initial Positions ----------
(function init(){
  btns.style.position = 'relative';

  yesBtn.style.position = 'absolute';
  yesBtn.style.left = '30%';
  yesBtn.style.top  = '50%';
  // Don't set transform inline - let CSS handle it with scale variable

  // Position No button the same way initially
  noBtn.style.position = 'absolute';
  noBtn.style.left = '70%';
  noBtn.style.top  = '50%';
  noBtn.style.transform = 'translate(-50%,-50%)';
})();
