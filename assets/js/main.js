const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Ajustar tamaño correctamente
function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Dibujo simple
ctx.fillStyle = "cyan";
ctx.fillRect(50, 50, 100, 100);

ctx.fillStyle = "white";
ctx.font = "20px Arial";
ctx.fillText("Canvas funcionando 🚀", 50, 30);