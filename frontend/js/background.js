// js/background.js
document.addEventListener("DOMContentLoaded", () => {
  const galaxyCanvas = document.getElementById("galaxy-bg");
  const lightBg = document.getElementById("light-icons-bg");
  if (!galaxyCanvas || !lightBg) return;

  const ctx = galaxyCanvas.getContext("2d");

  // Handle resize
  const resizeCanvas = () => {
    galaxyCanvas.width = window.innerWidth;
    galaxyCanvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  /* 🌌 Galaxy animation for dark mode */
  const stars = Array.from({ length: 150 }).map(() => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 2,
    speed: Math.random() * 0.5 + 0.2,
    alpha: Math.random() * 0.8 + 0.2
  }));

  function drawGalaxy() {
    ctx.clearRect(0, 0, galaxyCanvas.width, galaxyCanvas.height);
    const gradient = ctx.createRadialGradient(
      galaxyCanvas.width / 2,
      galaxyCanvas.height / 2,
      0,
      galaxyCanvas.width / 2,
      galaxyCanvas.height / 2,
      galaxyCanvas.width / 1.2
    );
    gradient.addColorStop(0, "#0b1439");
    gradient.addColorStop(1, "#000010");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, galaxyCanvas.width, galaxyCanvas.height);

    for (const s of stars) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
      ctx.fill();
      s.y += s.speed;
      if (s.y > galaxyCanvas.height) s.y = -5;
    }

    requestAnimationFrame(drawGalaxy);
  }
  drawGalaxy();

  /* 💸 Floating turquoise doodles for light mode */
  const icons = [
    "💰", "💳", "💵", "📈", "🪙", "🏦"
  ];

  function createFloatingIcons() {
    for (let i = 0; i < 25; i++) {
      const el = document.createElement("span");
      el.className = "floating-icon";
      el.textContent = icons[Math.floor(Math.random() * icons.length)];
      el.style.left = `${Math.random() * 100}%`;
      el.style.bottom = `-${Math.random() * 100}px`;
      el.style.fontSize = `${16 + Math.random() * 20}px`;
      el.style.opacity = Math.random() * 0.8 + 0.2;
      el.style.animationDuration = `${10 + Math.random() * 15}s`;
      el.style.animationDelay = `${Math.random() * 8}s`;
      lightBg.appendChild(el);
    }
  }
  createFloatingIcons();

  /* 🌗 Theme observer */
  const observer = new MutationObserver(updateMode);
  observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

  function updateMode() {
    const dark = document.body.classList.contains("dark");
    galaxyCanvas.style.opacity = dark ? "1" : "0";
    lightBg.style.opacity = dark ? "0" : "1";
  }

  updateMode();
});
