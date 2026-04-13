const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Ajustar tamaño
function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// =============================
// 🔹 SCORE / NIVEL
// =============================
let score = 0;
let level = 1;

const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");

// =============================
// 🔹 HIGH SCORE
// =============================
const highScoreElement = document.getElementById("highScore");
let highScore = localStorage.getItem("highScore") || 0;

highScoreElement.textContent = "Récord: " + highScore;

// BOTÓN PRO
document.getElementById("resetHighScore").addEventListener("click", () => {
  localStorage.removeItem("highScore");
  highScore = 0;
  highScoreElement.textContent = "Récord: 0";
});

// =============================
// 🔹 DIFICULTAD
// =============================
let baseSpeed = 3;

// =============================
// 🔹 IMAGEN
// =============================
const ballImage = new Image();
ballImage.src = "assets/img/ball.png";

// =============================
// 🔹 BALONES
// =============================
let balls = [];

function createBall() {
  let size = Math.random() * 30 + 30;

  balls.push({
    x: Math.random() * (canvas.width - size),
    y: Math.random() * (canvas.height - size),
    size: size,
    dx: (Math.random() - 0.5) * baseSpeed * 2,
    dy: (Math.random() - 0.5) * baseSpeed * 2
  });
}

function createInitialBalls() {
  for (let i = 0; i < 10; i++) {
    createBall();
  }
}

// =============================
// 🔹 ANIMACIÓN
// =============================
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  balls.forEach(ball => {
    ctx.drawImage(ballImage, ball.x, ball.y, ball.size, ball.size);

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.size > canvas.width || ball.x < 0) {
      ball.dx *= -1;
    }

    if (ball.y + ball.size > canvas.height || ball.y < 0) {
      ball.dy *= -1;
    }
  });

  requestAnimationFrame(animate);
}

// =============================
// 🔹 NIVELES
// =============================
function updateLevel() {
  let newLevel = Math.floor(score / 50) + 1;

  if (newLevel > level) {
    level = newLevel;
    baseSpeed += 0.5;

    levelElement.textContent = "Nivel: " + level;

    // MEJORA PRO: agregar balones sin reiniciar
    for (let i = 0; i < 2; i++) {
      createBall();
    }
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
// 🔹 CLICK
// =============================
canvas.addEventListener("click", function (e) {
  const rect = canvas.getBoundingClientRect();

  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  balls = balls.filter(ball => {
    const centerX = ball.x + ball.size / 2;
    const centerY = ball.y + ball.size / 2;
    const radius = ball.size / 2;

    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= radius) {
      score += 10;
      scoreElement.textContent = "Puntos: " + score;

      updateLevel();
      updateHighScore();

      return false;
    }

    return true;
  });
});

// =============================
// 🔹 INICIO
// =============================
ballImage.onload = () => {
  createInitialBalls();
  animate();
};