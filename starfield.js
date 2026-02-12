// Starfield Canvas Animation
// Soft bokeh dots inspired by social.png — dreamy, romantic sparkle

(() => {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d', { alpha: true });

  const DPR = Math.min(2, window.devicePixelRatio || 1);
  let W = 0, H = 0;
  let particles = [];
  let sprites = null;

  const rand = (a, b) => a + Math.random() * (b - a);

  function makeSprite(size, drawFn) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d');
    g.translate(size / 2, size / 2);
    drawFn(g, size / 2);
    return c;
  }

  function buildSprites() {
    // Warm palette: white, soft pink, hot pink, light magenta
    const colors = [
      [255, 255, 255],
      [255, 190, 220],
      [255, 140, 200],
      [255, 120, 180],
      [220, 180, 255],
    ];

    function rgba([r, g, b], a) { return `rgba(${r},${g},${b},${a})`; }

    // Soft round bokeh dot — just a radial gradient circle
    const bokeh = colors.map(col => makeSprite(64, (g, r) => {
      const grad = g.createRadialGradient(0, 0, 0, 0, 0, r);
      grad.addColorStop(0.0, rgba(col, 0.9));
      grad.addColorStop(0.15, rgba(col, 0.5));
      grad.addColorStop(0.4, rgba(col, 0.15));
      grad.addColorStop(1.0, rgba(col, 0.0));
      g.fillStyle = grad;
      g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fill();
    }));

    // Tiny sharp dot for distant stars
    const dot = colors.map(col => makeSprite(16, (g, r) => {
      const grad = g.createRadialGradient(0, 0, 0, 0, 0, r);
      grad.addColorStop(0.0, rgba(col, 1.0));
      grad.addColorStop(0.3, rgba(col, 0.4));
      grad.addColorStop(1.0, rgba(col, 0.0));
      g.fillStyle = grad;
      g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fill();
    }));

    // Rare subtle 4-point sparkle — very faint, no harsh lines
    const sparkle = colors.slice(0, 3).map(col => makeSprite(48, (g, r) => {
      // Soft bloom
      const grad = g.createRadialGradient(0, 0, 0, 0, 0, r);
      grad.addColorStop(0.0, rgba(col, 0.7));
      grad.addColorStop(0.2, rgba(col, 0.25));
      grad.addColorStop(1.0, rgba(col, 0.0));
      g.fillStyle = grad;
      g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fill();

      // Very subtle cross
      g.lineCap = 'round';
      g.strokeStyle = rgba(col, 0.5);
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(-r * 0.7, 0); g.lineTo(r * 0.7, 0);
      g.moveTo(0, -r * 0.7); g.lineTo(0, r * 0.7);
      g.stroke();
    }));

    return { bokeh, dot, sparkle };
  }

  function resize() {
    W = window.innerWidth | 0;
    H = window.innerHeight | 0;
    canvas.width = (W * DPR) | 0;
    canvas.height = (H * DPR) | 0;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    sprites = buildSprites();

    const area = W * H;
    // Mostly tiny dots, some bokeh, very few sparkles
    const dotCount     = Math.floor(area / 2500);
    const bokehCount   = Math.floor(area / 6000);
    const sparkleCount = Math.floor(area / 40000);

    particles = [];

    for (let i = 0; i < dotCount; i++) {
      particles.push({
        x: rand(0, W),
        y: rand(0, H),
        kind: 'dot',
        colIdx: Math.floor(Math.random() * 5),
        s: rand(0.15, 0.6),
        a: rand(0.2, 0.6),
        t: rand(0, Math.PI * 2),
        sp: rand(0.3, 1.2),
      });
    }

    for (let i = 0; i < bokehCount; i++) {
      particles.push({
        x: rand(0, W),
        y: rand(0, H),
        kind: 'bokeh',
        colIdx: Math.floor(Math.random() * 5),
        s: rand(0.15, 0.55),
        a: rand(0.15, 0.45),
        t: rand(0, Math.PI * 2),
        sp: rand(0.2, 0.8),
      });
    }

    for (let i = 0; i < sparkleCount; i++) {
      particles.push({
        x: rand(0, W),
        y: rand(0, H),
        kind: 'sparkle',
        colIdx: Math.floor(Math.random() * 3),
        s: rand(0.4, 0.8),
        a: rand(0.3, 0.6),
        t: rand(0, Math.PI * 2),
        sp: rand(0.4, 1.0),
      });
    }
  }

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';

    for (const p of particles) {
      p.t += dt * p.sp;
      const tw = Math.sin(p.t) * 0.5 + 0.5;
      const alpha = p.a * (0.4 + tw * 0.6);

      ctx.globalAlpha = alpha;

      const img = sprites[p.kind][p.colIdx];
      const w = img.width * p.s, h = img.height * p.s;
      ctx.drawImage(img, p.x - w / 2, p.y - h / 2, w, h);
    }

    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  requestAnimationFrame(frame);
})();
