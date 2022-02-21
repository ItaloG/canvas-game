import Player from "./classes/Player.js";
import Projectile from "./classes/Projectile.js";
import Enemy from "./classes/Enemy.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const xCor = canvas.width / 2;
const yCor = canvas.height / 2;

const player = new Player(xCor, yCor, 30, "blue", c);

const projectiles = [];
const enemies = [];

function spawmEnemies() {
  setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4;
    let x;
    let y;

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    const color = "green";
    const angle = Math.atan2(yCor - y, xCor - x);
    const velocity = { x: Math.cos(angle), y: Math.sin(angle) };

    enemies.push(new Enemy(x, y, radius, color, velocity, c));
  }, 1000);
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
  projectiles.forEach((p) => {
    p.update();
  });

  enemies.forEach((en, index) => {
    en.update();

    projectiles.forEach((p, pIndex) => {
      const dist = Math.hypot(p.x - en.x, p.y - en.y);

      if (dist - en.radius - p.radius < 1) {
        setTimeout(() => {
          enemies.splice(index, 1);
          projectiles.splice(pIndex, 1);
        }, 0);
      }
    });
  });
}

addEventListener("click", (e) => {
  const angle = Math.atan2(e.clientY - yCor, e.clientX - xCor);
  const velocity = { x: Math.cos(angle), y: Math.sin(angle) };
  projectiles.push(new Projectile(xCor, yCor, 5, "red", velocity, c));
});

animate();
spawmEnemies();
