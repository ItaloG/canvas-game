import Player from "./classes/Player.js";
import Projectile from "./classes/Projectile.js";
import Enemy from "./classes/Enemy.js";

console.log(gsap);
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const xCor = canvas.width / 2;
const yCor = canvas.height / 2;

const player = new Player(xCor, yCor, 10, "white", c);

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

    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;

    const angle = Math.atan2(yCor - y, xCor - x);
    const velocity = { x: Math.cos(angle), y: Math.sin(angle) };

    enemies.push(new Enemy(x, y, radius, color, velocity, c));
  }, 1000);
}

let animationId;
function animate() {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = "rgb(0, 0, 0, 0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  projectiles.forEach((p, index) => {
    p.update();

    if (
      p.x + p.radius < 0 ||
      p.x - p.radius > canvas.width ||
      p.y + p.radius < 0 ||
      p.y + p.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    }
  });

  enemies.forEach((en, index) => {
    en.update();

    const dist = Math.hypot(player.x - en.x, player.y - en.y);

    if (dist - en.radius - player.radius < 1) {
      cancelAnimationFrame(animationId);
    }

    projectiles.forEach((p, pIndex) => {
      const dist = Math.hypot(p.x - en.x, p.y - en.y);

      if (dist - en.radius - p.radius < 1) {
        if (en.radius - 10 > 5) {
          gsap.to(en,  {
            radius: en.radius - 10
          })
          setTimeout(() => {
            projectiles.splice(pIndex, 1);
          }, 0);
        } else {
          setTimeout(() => {
            enemies.splice(index, 1);
            projectiles.splice(pIndex, 1);
          }, 0);
        }
      }
    });
  });
}

addEventListener("click", (e) => {
  const angle = Math.atan2(e.clientY - yCor, e.clientX - xCor);
  const velocity = { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 };
  projectiles.push(new Projectile(xCor, yCor, 5, "white", velocity, c));
});

animate();
spawmEnemies();
