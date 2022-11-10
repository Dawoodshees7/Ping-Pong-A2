let arrowUpPressed = false;
let arrowDownPressed = false;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const paddleHitSound = new Audio('../sounds/paddleHitSound.wav');
const scoredSound = new Audio('../sounds/scoredSound.wav');
const wallpaddleHitSound = new Audio('../sounds/wallpaddleHitSound.wav');
const netWidth = 9;
const netHeight = canvas.height;
const paddleWidth = 15;
const paddleHeight = 80;

// ----------------------------------------------------------

const net = {
  x: canvas.width / 2 - netWidth / 2,
  y: 0,
  width: netWidth,
  height: netHeight,
  color: "#008000"
};

const user = {
  x: 10,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: "green",
  score: 0
};

const cpu = {
  x: canvas.width - (paddleWidth + 10),
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: "green",
  score: 0
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 9,
  speed: 6.5,
  velocityX: 10,
  velocityY: 9,
  color: "red"
};

// ----------------------------------------------------------

function makeNet() {
  ctx.fillStyle = net.color;
  ctx.fillRect(net.x, net.y, net.width, net.height);
}

function printScore(x, y, score) {
  ctx.fillStyle = 'red';
  ctx.font = '70px fantasy';
  ctx.fillText(score, x, y);
}

function drawPaddle(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function drawBall(x, y, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, true); 
  ctx.closePath();
  ctx.fill();
}
// ----------------------------------------------------------

window.addEventListener('keydown', downArrowKey);
window.addEventListener('keyup', upArrowKey);

// ----------------------------------------------------------
function downArrowKey(event) {
  switch (event.keyCode) {
    case 38:
      arrowUpPressed = true;
      break;
    case 40:
      arrowDownPressed = true;
      break;
  }
}

function upArrowKey(event) {
  switch (event.keyCode) {
    case 38:
      arrowUpPressed = false;
      break;
    case 40:
      arrowDownPressed = false;
      break;
  }
}

// ----------------------------------------------------------

function ballReset() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speed = 7;
  ball.velocityX = -ball.velocityX;
  ball.velocityY = -ball.velocityY;
}

// ----------------------------------------------------------

function detectHit(player, ball) {
  // returns Boolean
  player.top = player.y;
  player.right = player.x + player.width;
  player.bottom = player.y + player.height;
  player.left = player.x;
  ball.top = ball.y - ball.radius;
  ball.right = ball.x + ball.radius;
  ball.bottom = ball.y + ball.radius;
  ball.left = ball.x - ball.radius;

  return ball.left < player.right && ball.top < player.bottom && ball.right > player.left && ball.bottom > player.top;
}
//-------------------------------------------------------------------

// Update the game positions
function update() {
  if (arrowUpPressed && user.y > 0) {
    user.y -= 8;
  } else if (arrowDownPressed && (user.y < canvas.height - user.height)) {
    user.y += 8;
  }

  // check if ball hits Ceiling or floor
  if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
    // play wallpaddleHitSound
    wallpaddleHitSound.play();
    ball.velocityY = -ball.velocityY;
  }

   // if ball hit on right wall
   if (ball.x + ball.radius >= canvas.width) {
    // play scoredSound
    scoredSound.play();
    // User scored
    user.score += 1;
    document.getElementById('h2').innerHTML = 'YOU scored! +1';
    ballReset();
  }

  // if ball hit on left wall
  if (ball.x - ball.radius <= 0) {
    // play scoredSound
    scoredSound.play();
    // cpu scored
    cpu.score += 1;
    document.getElementById('h2').innerHTML = 'CPU scored! +1';

    ballReset();
  }

  //-------------------------------------------------------------------

  if (user.score == 20) {
    alert("You Won! Congrats!")
    document.location.reload();
  }
  else if (cpu.score == 20) {
    alert("You Lost!");
    document.location.reload();
  }

  //-------------------------------------------------------------------

  // move the ball
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  cpu.y += ((ball.y - (cpu.y + cpu.height / 2))) * 0.09;

  let player = (ball.x < canvas.width / 2) ? user : cpu;

  if (detectHit(player, ball)) {
    paddleHitSound.play();
    let angle = 0;

    // if ball hit the top of paddle
    if (ball.y < (player.y + player.height / 2)) {
      angle = -1 * Math.PI / 4;
    } else if (ball.y > (player.y + player.height / 2)) {
      // if it hit the bottom of paddle
      angle = Math.PI / 4;
    }

    ball.velocityX = (player === user ? 1 : -1) * ball.speed * Math.cos(angle);
    ball.velocityY = ball.speed * Math.sin(angle);

    // increase ball speed with every contact
    ball.speed += 0.2;
  }
}

//-------------------------------------------------------------------

// render function draws everything on to canvas
function render() {
  // bg color black
  ctx.fillStyle = "black"; 
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  makeNet();
  printScore(canvas.width / 4, canvas.height / 6, user.score);
  printScore(3 * canvas.width / 4, canvas.height / 6, cpu.score);
  drawPaddle(user.x, user.y, user.width, user.height, user.color);
  drawPaddle(cpu.x, cpu.y, cpu.width, cpu.height, cpu.color);
  drawBall(ball.x, ball.y, ball.radius, ball.color);
}

// gameLoop
function gameLoop() {
  render();
  update();
}
setInterval(gameLoop, 1000 / 60);






