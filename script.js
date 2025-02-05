const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

// Dynamically set canvas size based on screen size
// function resizeCanvas() {
//   canvas.width = window.innerWidth * 0.9; // 90% of screen width
//   canvas.height = window.innerHeight * 0.8; // 80% of screen height
// }
// resizeCanvas();
// window.addEventListener('resize', resizeCanvas);

// Grid size and paddle/ball dimensions (relative to canvas size)
const grid = Math.floor(canvas.width * 0.02); // 2% of canvas width
const paddleHeight = grid * 5; // Paddle height is 5 grid units
const maxPaddleY = canvas.height - grid - paddleHeight;
const ballSize = grid; // Ball size is 1 grid unit

// Paddle and ball speeds (relative to canvas size)
const paddleSpeed = Math.floor(canvas.height * 0.01); // 1% of canvas height
const ballSpeed = Math.floor(canvas.width * 0.005); // 0.5% of canvas width

// Left paddle
const leftPaddle = {
  x: grid * 2,
  y: canvas.height / 2 - paddleHeight / 2,
  width: grid,
  height: paddleHeight,
  dy: 0 // Paddle velocity
};

// Right paddle
const rightPaddle = {
  x: canvas.width - grid * 3,
  y: canvas.height / 2 - paddleHeight / 2,
  width: grid,
  height: paddleHeight,
  dy: 0 // Paddle velocity
};

// Ball
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: ballSize,
  height: ballSize,
  dx: ballSpeed, // Ball velocity in x direction
  dy: -ballSpeed, // Ball velocity in y direction
  resetting: false // Flag to reset ball position
};

// Collision detection function
function collides(obj1, obj2) {
  return obj1.x < obj2.x + obj2.width &&
         obj1.x + obj1.width > obj2.x &&
         obj1.y < obj2.y + obj2.height &&
         obj1.y + obj1.height > obj2.y;
}

// Game loop
function loop() {
  requestAnimationFrame(loop);
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Move paddles
  leftPaddle.y += leftPaddle.dy;
  rightPaddle.y += rightPaddle.dy;

  // Prevent paddles from going out of bounds
  leftPaddle.y = Math.max(grid, Math.min(leftPaddle.y, maxPaddleY));
  rightPaddle.y = Math.max(grid, Math.min(rightPaddle.y, maxPaddleY));

  // Draw paddles
  context.fillStyle = 'white';
  context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
  context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

  // Move ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Ball collision with top and bottom walls
  if (ball.y < grid || ball.y + ball.height > canvas.height - grid) {
    ball.dy *= -1; // Reverse ball direction
  }

  // Reset ball if it goes out of bounds
  if ((ball.x < 0 || ball.x > canvas.width) && !ball.resetting) {
    ball.resetting = true;
    setTimeout(() => {
      ball.resetting = false;
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.dx = ballSpeed * (Math.random() > 0.5 ? 1 : -1); // Randomize direction
      ball.dy = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
    }, 400);
  }

  // Ball collision with paddles
  if (collides(ball, leftPaddle)) {
    ball.dx *= -1;
    ball.x = leftPaddle.x + leftPaddle.width; // Prevent sticking
  } else if (collides(ball, rightPaddle)) {
    ball.dx *= -1;
    ball.x = rightPaddle.x - ball.width; // Prevent sticking
  }

  // Draw ball
  context.fillRect(ball.x, ball.y, ball.width, ball.height);

  // Draw walls
  context.fillStyle = 'lightgrey';
  context.fillRect(0, 0, canvas.width, grid); // Top wall
  context.fillRect(0, canvas.height - grid, canvas.width, grid); // Bottom wall

  // Draw dotted line in the middle
  for (let i = grid; i < canvas.height - grid; i += grid * 2) {
    context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
  }
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') rightPaddle.dy = -paddleSpeed;
  if (e.key === 'ArrowDown') rightPaddle.dy = paddleSpeed;
  if (e.key === 'w') leftPaddle.dy = -paddleSpeed;
  if (e.key === 's') leftPaddle.dy = paddleSpeed;
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') rightPaddle.dy = 0;
  if (e.key === 'w' || e.key === 's') leftPaddle.dy = 0;
});

// Start the game
loop();