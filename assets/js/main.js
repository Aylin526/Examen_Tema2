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
// 🔹 BALÓN (OBJETO)
// =============================
const ballImage = new Image();
ballImage.src = "assets/img/ball.png";

const ball = {
  x: 100,
  y: 100,
  size: 50,
  dx: 3, // velocidad en X
  dy: 3  // velocidad en Y
};

// =============================
// 🔹 ANIMACIÓN
// =============================
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar balón
  ctx.drawImage(ballImage, ball.x, ball.y, ball.size, ball.size);

  // Movimiento
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Rebote en bordes
  if (ball.x + ball.size > canvas.width || ball.x < 0) {
    ball.dx *= -1;
  }

  if (ball.y + ball.size > canvas.height || ball.y < 0) {
    ball.dy *= -1;
  }

  requestAnimationFrame(animate);
}

// Esperar a que cargue la imagen
ballImage.onload = () => {
  animate();
};