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

  // ---------- Birthday lock / countdown ----------
  // The surprise opens on Nov 14, 2026 (local time) and stays open after that.
  const REVEAL_DATE = new Date(2026, 10, 14, 0, 0, 0, 0);

  // The celebration markup is not present in the page source and is only
  // decoded and inserted once the birthday date actually arrives, so it
  // can't be read by viewing source / dev tools before the reveal.
  const CELEBRATION_B64 =
    'PGRpdiBjbGFzcz0iYmFsbG9vbnMiIGFyaWEtaGlkZGVuPSJ0cnVlIj4KICAgIDxzcGFuIGNsYXNzPSJiYWxsb29uIGIxIj7wn46IPC9zcGFuPgogICAgPHNwYW4gY2xhc3M9ImJhbGxvb24gYjIiPvCfjog8L3NwYW4+CiAgICA8c3BhbiBjbGFzcz0iYmFsbG9vbiBiMyI+8J+OiDwvc3Bhbj4KICAgIDxzcGFuIGNsYXNzPSJiYWxsb29uIGI0Ij7wn46IPC9zcGFuPgogICAgPHNwYW4gY2xhc3M9ImJhbGxvb24gYjUiPvCfjog8L3NwYW4+CiAgICA8c3BhbiBjbGFzcz0iYmFsbG9vbiBiNiI+8J+OiDwvc3Bhbj4KICA8L2Rpdj4KCiAgPG1haW4+CiAgICA8c2VjdGlvbiBjbGFzcz0iaGVybyI+CiAgICAgIDxwIGNsYXNzPSJleWVicm93Ij7inKggaG95IGVzIHR1IGTDrWEg4pyoPC9wPgogICAgICA8aDEgY2xhc3M9ImxvZ28iPk1lbGFuaWU8L2gxPgogICAgICA8cCBjbGFzcz0ic3VidGl0bGUiPsKhRmVsaXogQ3VtcGxlYcOxb3MhPC9wPgogICAgICA8cCBjbGFzcz0idGFnbGluZSI+UXVlIGVzdGUgbnVldm8gYcOxbyBlc3TDqSBsbGVubyBkZSByaXNhcywgc29ycHJlc2FzIHkgbW9tZW50b3MgaW5vbHZpZGFibGVzLjwvcD4KICAgIDwvc2VjdGlvbj4KCiAgICA8c2VjdGlvbiBjbGFzcz0idmlkZW8tc2VjdGlvbiI+CiAgICAgIDx2aWRlbyBjbGFzcz0iYmlydGhkYXktdmlkZW8iIHNyYz0idmlkZW8ubXA0IiBwb3N0ZXI9InBvcnRhZGEuanBnIiBjb250cm9scyBwbGF5c2lubGluZSBwcmVsb2FkPSJtZXRhZGF0YSI+PC92aWRlbz4KICAgIDwvc2VjdGlvbj4KCiAgICA8c2VjdGlvbiBjbGFzcz0icGhvdG8tc2VjdGlvbiI+CiAgICAgIDxpbWcgY2xhc3M9ImJpcnRoZGF5LXBob3RvIiBzcmM9ImZvdG8uanBlZyIgYWx0PSJGb3RvcyBjb24gTWVsYW5pZTogRGUgbGFzIHBlcnNvbmFzIG3DoXMgaW1wb3J0YW50ZXMiIGxvYWRpbmc9ImxhenkiPgogICAgPC9zZWN0aW9uPgoKICAgIDxzZWN0aW9uIGNsYXNzPSJsZXR0ZXItc2VjdGlvbiI+CiAgICAgIDxhcnRpY2xlIGNsYXNzPSJsZXR0ZXIiPgogICAgICAgIDxkaXYgY2xhc3M9ImxldHRlci1zZWFsIiBhcmlhLWhpZGRlbj0idHJ1ZSI+4p2kPC9kaXY+CiAgICAgICAgPGgyIGNsYXNzPSJsZXR0ZXItZ3JlZXRpbmciPkZlbGl6IGN1bXBsZWHDsW9zLCBNZWxhbmllLiDinaTvuI88L2gyPgogICAgICAgIDxwPkVzcGVybyBkZSBjb3JhesOzbiBxdWUgaG95IHRlbmdhcyB1biBkw61hIG11eSBib25pdG8sIHF1ZSBsYSB2aWRhIHRlIHJlZ2FsZSBtdWNow61zaW1hcyByYXpvbmVzIHBhcmEgc29ucmXDrXIgeSBxdWUgdG9kb3MgZXNvcyBzdWXDsW9zIHkgbWV0YXMgcXVlIHRlbsOpcyBzZSB2YXlhbiBoYWNpZW5kbyByZWFsaWRhZC48L3A+CiAgICAgICAgPHA+UXVpZXJvIHF1ZSBzZXDDoXMgcXVlLCBhIHBlc2FyIGRlIGxhIGRpc3RhbmNpYSwgc2llbXByZSB0ZSB2b3kgYSBxdWVyZXIsIHNpZW1wcmUgdm95IGEgZXh0cmHDsWFydGUgeSBzaWVtcHJlIHZhcyBhIHNlZ3VpciBzaWVuZG8gdW5hIHBlcnNvbmEgbXV5IGltcG9ydGFudGUgcGFyYSBtw60uPC9wPgogICAgICAgIDxwPlkgdGVuw6kgcHJlc2VudGUgcXVlIHNpZW1wcmUgdmFzIGEgY29udGFyIGNvbiBtaSBhcG95bywgcXVlIHZveSBhIGRlc2VhcnRlIGxvIG1lam9yIHkgcXVlIG1lIHZhIGEgYWxlZ3JhciBzYWJlciBxdWUgZXN0w6FzIGJpZW4sIHF1ZSBzb3MgZmVsaXogeSBxdWUgZXN0w6FzIGN1bXBsaWVuZG8gdG9kbyBsbyBxdWUgdGUgcHJvcG9uw6lzLjwvcD4KICAgICAgICA8cD5HcmFjaWFzIHBvciBoYWJlciBzaWRvIGFsZ3VpZW4gdGFuIGVzcGVjaWFsIGVuIG1pIHZpZGEsIGNyZW8gcXVlIG5hZGllIGVuIG1pIHZpZGEgaGEgbGxlZ2FkbyBhIHRlbmVyIHRhbnRvIHZhbG9yIGNvbW8gbG8gdHV2aXN0ZSB2b3MuPC9wPgogICAgICAgIDxwIGNsYXNzPSJsZXR0ZXItY2xvc2luZyI+VGUgcXVpZXJvIG11Y2jDrXNpbW8sIE1lbGFuaWUuIEVzcGVybyBxdWUgbGEgdmlkYSB0ZSB0cmF0ZSBib25pdG8sIGhveSB5IHNpZW1wcmUuIOKdpO+4jzwvcD4KICAgICAgICA8cCBjbGFzcz0ibGV0dGVyLXNpZ25hdHVyZSI+4oCUIERpZWdvPC9wPgogICAgICA8L2FydGljbGU+CiAgICA8L3NlY3Rpb24+CgogICAgPGZvb3Rlcj4KICAgICAgPHA+SGVjaG8gY29uIPCfkpwgcGFyYSBNZWxhbmllPC9wPgogICAgPC9mb290ZXI+CiAgPC9tYWluPg==';

  function decodeCelebration(b64) {
    const binary = atob(b64);
    const percentEncoded = binary
      .split('')
      .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');
    return decodeURIComponent(percentEncoded);
  }

  function revealLetterOnScroll() {
    const letter = document.querySelector('.letter');
    if (!letter) return;
    if (!('IntersectionObserver' in window) || reduceMotion) {
      letter.classList.add('visible');
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        letter.classList.add('visible');
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(letter);
  }

  const countdownScreen = document.getElementById('countdown-screen');
  const celebration = document.getElementById('celebration');
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins = document.getElementById('cd-mins');
  const cdSecs = document.getElementById('cd-secs');

  function isRevealed(now) {
    return now >= REVEAL_DATE;
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function revealCelebration() {
    if (countdownTimer) clearInterval(countdownTimer);
    if (!celebration.dataset.filled) {
      celebration.innerHTML = decodeCelebration(CELEBRATION_B64);
      celebration.dataset.filled = 'true';
      revealLetterOnScroll();
    }
    countdownScreen.hidden = true;
    celebration.hidden = false;
    burstConfetti();
  }

  let countdownTimer = null;

  function startCountdown() {
    function tick() {
      const now = new Date();
      if (isRevealed(now)) {
        revealCelebration();
        return;
      }
      const diff = REVEAL_DATE - now;
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

  if (window.FORCE_REVEAL === true || isRevealed(new Date())) {
    revealCelebration();
  } else {
    startCountdown();
  }
})();
