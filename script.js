const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size dynamically based on screen size
canvas.width = window.innerWidth * 0.9; // 90% of screen width
canvas.height = window.innerHeight * 0.6; // 60% of screen height

// Game variables
const paddleWidth = 10;
const paddleHeight = canvas.height / 5; // Paddle height scales with screen size
const ballSize = 10;

// Paddle positions
let paddle1Y = canvas.height / 2 - paddleHeight / 2; // Player-controlled paddle
let paddle2Y = canvas.height / 2 - paddleHeight / 2; // AI-controlled paddle

// Ball position and velocity
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 3;
let ballSpeedY = 3;

// Paddle movement flags
let paddle1Up = false;
let paddle1Down = false;

// Draw paddles
function drawPaddle(x, y) {
  ctx.fillStyle = "white";
  ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

// Draw ball
function drawBall() {
  ctx.fillStyle = "white";
  ctx.fillRect(ballX, ballY, ballSize, ballSize);
}

// Move paddles
function movePaddle1() {
  if (paddle1Up) {
    paddle1Y = Math.max(0, paddle1Y - 5); // Move up smoothly
  }
  if (paddle1Down) {
    paddle1Y = Math.min(canvas.height - paddleHeight, paddle1Y + 5); // Move down smoothly
  }
}

// AI paddle movement
function movePaddle2() {
  // Move the AI paddle to follow the ball
  const paddleCenter = paddle2Y + paddleHeight / 2;
  if (paddleCenter < ballY) {
    paddle2Y = Math.min(canvas.height - paddleHeight, paddle2Y + 3); // Move down
  } else if (paddleCenter > ballY) {
    paddle2Y = Math.max(0, paddle2Y - 3); // Move up
  }
}

// Ball movement and collision
function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Ball collision with top and bottom walls
  if (ballY <= 0 || ballY + ballSize >= canvas.height) {
    ballSpeedY *= -1;
  }

  // Ball collision with paddles
  if (
    (ballX <= paddleWidth && ballY + ballSize >= paddle1Y && ballY <= paddle1Y + paddleHeight) ||
    (ballX + ballSize >= canvas.width - paddleWidth &&
      ballY + ballSize >= paddle2Y &&
      ballY <= paddle2Y + paddleHeight)
  ) {
    ballSpeedX *= -1;
  }

  // Ball out of bounds (reset position)
  if (ballX <= 0 || ballX + ballSize >= canvas.width) {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX *= -1; // Reverse direction
  }
}

// Draw everything
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddles and ball
  drawPaddle(0, paddle1Y); // Paddle 1 (left, player-controlled)
  drawPaddle(canvas.width - paddleWidth, paddle2Y); // Paddle 2 (right, AI-controlled)
  drawBall();
}

// Game loop
function gameLoop() {
  movePaddle1(); // Move player paddle
  movePaddle2(); // Move AI paddle
  moveBall();
  draw();
  requestAnimationFrame(gameLoop);
}

// Event listeners for smooth paddle movement (mobile and desktop)
const paddle1UpButton = document.getElementById("paddle1Up");
const paddle1DownButton = document.getElementById("paddle1Down");

// Touch events for mobile
paddle1UpButton.addEventListener("touchstart", () => {
  paddle1Up = true;
});
paddle1UpButton.addEventListener("touchend", () => {
  paddle1Up = false;
});

paddle1DownButton.addEventListener("touchstart", () => {
  paddle1Down = true;
});
paddle1DownButton.addEventListener("touchend", () => {
  paddle1Down = false;
});
// Mouse events for desktop
paddle1UpButton.addEventListener("mousedown", () => {
  paddle1Up = true;
});
paddle1UpButton.addEventListener("mouseup", () => {
  paddle1Up = false;
});

paddle1DownButton.addEventListener("mousedown", () => {
  paddle1Down = true;
});
paddle1DownButton.addEventListener("mouseup", () => {
  paddle1Down = false;
});
// Start the game
gameLoop();