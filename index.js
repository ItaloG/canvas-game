import Player from "./classes/Player.js";
import Projectile from "./classes/Projectile.js";
import Enemy from "./classes/Enemy.js";
import Particle from "./classes/particle.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const scoreNum = document.querySelector("#scoreNum");
const startgameBtn = document.querySelector("#startGameBtn");
const modal = document.querySelector("#modal");
const finalScore = document.querySelector("#finalScore");

canvas.width = innerWidth;
canvas.height = innerHeight;

const xCor = canvas.width / 2;
const yCor = canvas.height / 2;

let player = new Player(xCor, yCor, 10, "white", c);
let projectiles = [];
let enemies = [];
let particles = [];
let animationId;
let score = 0;

function init() {
  player = new Player(xCor, yCor, 10, "white", c);
  projectiles = [];
  enemies = [];
  particles = [];
  score = 0;
  scoreNum.innerHTML = score;
  finalScore.innerHTML = score;
  startgameBtn.innerHTML = "Restart Game"
}

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

function animate() {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = "rgb(0, 0, 0, 0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });
  projectiles.forEach((projectile, index) => {
    projectile.update();

    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    }
  });

  enemies.forEach((enemy, index) => {
    enemy.update();

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

    if (dist - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationId);
      modal.style.display = "flex";
      finalScore.innerHTML = score;
    }

    projectiles.forEach((projectile, pIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      if (dist - enemy.radius - projectile.radius < 1) {
        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 6),
                y: (Math.random() - 0.5) * (Math.random() * 6),
              },
              c
            )
          );
        }

        if (enemy.radius - 10 > 5) {
          score += 100;
          scoreNum.innerHTML = score;

          gsap.to(enemy, {
            radius: enemy.radius - 10,
          });
          setTimeout(() => {
            projectiles.splice(pIndex, 1);
          }, 0);
        } else {
          score += 250;
          scoreNum.innerHTML = score;

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

startgameBtn.addEventListener("click", () => {
  init();
  animate();
  spawmEnemies();
  modal.style.display = "none";
});
