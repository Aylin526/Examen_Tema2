const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// =============================
// 🔹 RESIZE
// =============================
function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// =============================
// 🔹 UI
// =============================
let score = 0;
let level = 1;

const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const highScoreElement = document.getElementById("highScore");

// =============================
// 🔹 HIGH SCORE
// =============================
let highScore = localStorage.getItem("highScore") || 0;
highScoreElement.textContent = "Récord: " + highScore;

document.getElementById("resetHighScore").onclick = () => {
  localStorage.removeItem("highScore");
  highScore = 0;
  highScoreElement.textContent = "Récord: 0";
};

// =============================
// 🔥 PARTÍCULAS
// =============================
let particles = [];

function createParticles(x, y) {
  for (let i = 0; i < 10; i++) {
    particles.push({
      x,
      y,
      dx: (Math.random() - 0.5) * 5,
      dy: (Math.random() - 0.5) * 5,
      life: 25
    });
  }
}

// =============================
// 🔹 DIFICULTAD
// =============================
let baseSpeed = 1.5;

// =============================
// 🔹 BALÓN
// =============================
const ballImage = new Image();
ballImage.src = "assets/img/ball.png";

let balls = [];

// 🔥 salen desde arriba hacia el jugador
function createBall() {
  let size = Math.random() * 25 + 25;

  balls.push({
    x: Math.random() * canvas.width,
    y: -50,
    size: size,
    speed: baseSpeed + Math.random() * 2
  });
}

// iniciales
function createInitialBalls() {
  for (let i = 0; i < 10; i++) createBall();
}

// =============================
// 🔹 NIVEL
// =============================
function updateLevel() {
  let newLevel = Math.floor(score / 50) + 1;

  if (newLevel > level) {
    level = newLevel;
    baseSpeed += 0.4;

    levelElement.textContent = "Nivel: " + level;

    for (let i = 0; i < 2; i++) createBall();
  }
}

// =============================
// 🔹 HIGH SCORE UPDATE
// =============================
function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreElement.textContent = "Récord: " + highScore;
  }
}

// =============================
// 🔹 CLICK (ATAJAR)
// =============================
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();

  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  balls.forEach(ball => {
    const dx = mouseX - ball.x;
    const dy = mouseY - ball.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < ball.size / 2) {
      score += 10;
      scoreElement.textContent = "Puntos: " + score;

      updateLevel();
      updateHighScore();

      createParticles(ball.x, ball.y);

      // reinicio inmediato
      ball.x = Math.random() * canvas.width;
      ball.y = -50;
      ball.size = Math.random() * 25 + 25;
      ball.speed = baseSpeed + Math.random() * 2;
    }
  });
});

// =============================
// 🔹 ANIMACIÓN
// =============================
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ⚽ BALONES
  balls.forEach(ball => {
    ball.y += ball.speed;

    ctx.drawImage(ballImage, ball.x, ball.y, ball.size, ball.size);

    // si sale → reinicia arriba
    if (ball.y > canvas.height + 50) {
      ball.x = Math.random() * canvas.width;
      ball.y = -50;
      ball.size = Math.random() * 25 + 25;
    }
  });

  // 💥 PARTÍCULAS
  particles.forEach((p, i) => {
    ctx.fillStyle = "rgba(0,255,200,1)";
    ctx.fillRect(p.x, p.y, 3, 3);

    p.x += p.dx;
    p.y += p.dy;
    p.life--;

    if (p.life <= 0) particles.splice(i, 1);
  });

  requestAnimationFrame(animate);
}

// =============================
// 🔹 START
// =============================
createInitialBalls();
animate();
// =============================
// 🔥 CONTROL DE INICIO
// =============================
let gameStarted = false;

const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");

// Detener juego al inicio
function gameLoop() {
  if (!gameStarted) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ⚽ BALONES
  balls.forEach(ball => {
    ball.y += ball.speed;
    ctx.drawImage(ballImage, ball.x, ball.y, ball.size, ball.size);

    if (ball.y > canvas.height + 50) {
      ball.x = Math.random() * canvas.width;
      ball.y = -50;
      ball.size = Math.random() * 25 + 25;
    }
  });

  // 💥 PARTÍCULAS
  particles.forEach((p, i) => {
    ctx.fillStyle = "rgba(0,255,200,1)";
    ctx.fillRect(p.x, p.y, 3, 3);

    p.x += p.dx;
    p.y += p.dy;
    p.life--;

    if (p.life <= 0) particles.splice(i, 1);
  });

  requestAnimationFrame(gameLoop);
}

// Iniciar juego
startBtn.addEventListener("click", () => {
  gameStarted = true;
  startScreen.style.display = "none";

  createInitialBalls();
  gameLoop();
});
