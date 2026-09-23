(function () {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  const colors = ['#ff6fb5', '#8a4fff', '#ffc94d', '#5ad1ff', '#ff8a3d'];

  let width, height;
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function makePiece(burst) {
    return {
      x: burst ? width / 2 + (Math.random() - 0.5) * 120 : Math.random() * width,
      y: burst ? height * 0.55 + (Math.random() - 0.5) * 40 : -20 - Math.random() * height,
      size: 6 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: burst ? -(4 + Math.random() * 6) : 1 + Math.random() * 1.5,
      speedX: burst ? (Math.random() - 0.5) * 10 : (Math.random() - 0.5) * 1,
      gravity: burst ? 0.25 : 0,
      rotation: Math.random() * 360,
      spin: (Math.random() - 0.5) * 10,
      life: burst ? 90 + Math.random() * 30 : Infinity,
    };
  }

  let ambient = [];
  const AMBIENT_COUNT = 45;
  if (!reduceMotion) {
    for (let i = 0; i < AMBIENT_COUNT; i++) ambient.push(makePiece(false));
  }

  let burstPieces = [];

  function drawPiece(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);

    ambient.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.spin;
      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }
      drawPiece(p);
    });

    burstPieces = burstPieces.filter((p) => p.life > 0);
    burstPieces.forEach((p) => {
      p.speedY += p.gravity;
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.spin;
      p.life -= 1;
      drawPiece(p);
    });

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  function burstConfetti() {
    for (let i = 0; i < 120; i++) burstPieces.push(makePiece(true));
  }

  const cake = document.getElementById('cake');
  const blowBtn = document.getElementById('blow-btn');
  const wishMessage = document.getElementById('wish-message');

  blowBtn.addEventListener('click', () => {
    if (cake.classList.contains('blown')) return;
    cake.classList.add('blown');
    blowBtn.disabled = true;
    blowBtn.textContent = '🎉 ¡Deseo pedido!';
    wishMessage.textContent = '¡Feliz Cumpleaños, Melanie! Que se cumpla tu deseo. 🎂✨';
    wishMessage.classList.add('show');
    burstConfetti();
  });

  // ---------- Birthday lock / countdown ----------
  const BIRTHDAY_MONTH = 10; // November (0-indexed)
  const BIRTHDAY_DAY = 14;

  const countdownScreen = document.getElementById('countdown-screen');
  const celebration = document.getElementById('celebration');
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins = document.getElementById('cd-mins');
  const cdSecs = document.getElementById('cd-secs');

  function isBirthdayToday(now) {
    return now.getMonth() === BIRTHDAY_MONTH && now.getDate() === BIRTHDAY_DAY;
  }

  function nextBirthday(now) {
    let year = now.getFullYear();
    let target = new Date(year, BIRTHDAY_MONTH, BIRTHDAY_DAY, 0, 0, 0, 0);
    if (now > target) target = new Date(year + 1, BIRTHDAY_MONTH, BIRTHDAY_DAY, 0, 0, 0, 0);
    return target;
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function revealCelebration() {
    if (countdownTimer) clearInterval(countdownTimer);
    countdownScreen.hidden = true;
    celebration.hidden = false;
    burstConfetti();
  }

  let countdownTimer = null;

  function startCountdown() {
    const target = nextBirthday(new Date());

    function tick() {
      const now = new Date();
      if (isBirthdayToday(now)) {
        revealCelebration();
        return;
      }
      const diff = target - now;
      if (diff <= 0) {
        revealCelebration();
        return;
      }
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;
      cdDays.textContent = pad(days);
      cdHours.textContent = pad(hours);
      cdMins.textContent = pad(mins);
      cdSecs.textContent = pad(secs);
    }

    tick();
    countdownTimer = setInterval(tick, 1000);
  }

  if (isBirthdayToday(new Date())) {
    countdownScreen.hidden = true;
    celebration.hidden = false;
  } else {
    startCountdown();
  }
})();
