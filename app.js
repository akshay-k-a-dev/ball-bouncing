const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const gravitySlider = document.getElementById('gravity');
const frictionSlider = document.getElementById('friction');
const ballCountSpan = document.getElementById('ballCount');

let W, H;
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

let gravity = +gravitySlider.value;
let friction = +frictionSlider.value;
gravitySlider.oninput = () => gravity = +gravitySlider.value;
frictionSlider.oninput = () => friction = +frictionSlider.value;

class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 20 + Math.random() * 20;
    this.vx = (Math.random() - 0.5) * 10;
    this.vy = (Math.random() - 0.5) * 10;
    this.color = `hsl(${Math.random()*360}, 70%, 50%)`;
    this.trail = [];
    this.maxTrail = 20;
  }
  update() {
    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;

    if (this.x + this.radius > W) {
      this.x = W - this.radius;
      this.vx *= -1 * friction;
    } else if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.vx *= -1 * friction;
    }
    if (this.y + this.radius > H) {
      this.y = H - this.radius;
      this.vy *= -1 * friction;
    } else if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.vy *= -1 * friction;
    }

    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > this.maxTrail) this.trail.shift();
  }
  draw() {
    ctx.beginPath();
    for (let i = 0; i < this.trail.length; i++) {
      const p = this.trail[i];
      const alpha = (i + 1) / this.trail.length;
      ctx.fillStyle = this.color.replace('50%)', `${50 * alpha}%)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, this.radius * alpha, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

const balls = [];
function spawnBall(x, y) {
  balls.push(new Ball(x, y));
  ballCountSpan.textContent = balls.length;
}

canvas.addEventListener('click', (e) => {
  spawnBall(e.clientX, e.clientY);
});

for (let i = 0; i < 5; i++) {
  spawnBall(Math.random() * W, Math.random() * H);
}

function animate() {
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(0, 0, W, H);

  balls.forEach(b => {
    b.update();
    b.draw();
  });

  requestAnimationFrame(animate);
}

animate();
