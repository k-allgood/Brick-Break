const canvas = document.getElementById("gamescreen");
const ctx = canvas.getContext("2d");
const gameWidth = 800;
const gameHeight = 600;
let brickColumns = 5;
let brickRows = 4;
let allBricks = [];

class Brick {
  constructor() {
    this.width = 75;
    this.height = 20;
    this.position = {
      x: 0,
      y: 0,
    };
    this.padding = 5;
    this.offsetTop = 30;
    this.offsetLeft = 30;
  }

  draw(ctx) {
    for (let c = 0; c < brickColumns; c++) {
      for (let r = 0; r < brickRows; r++) {
        if (c === brickColumns && r === brickRows) {
          return;
        } else {
          //Set each bricks (x,y) coords
          let brickX = c * (this.width + this.padding) + this.offsetLeft;
          let brickY = r * (this.height + this.padding) + this.offsetTop;

          ctx.beginPath();
          ctx.rect(brickX, brickY, this.width, this.height);
          ctx.fillStyle = "green";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }
}

class Paddle {
  constructor(gameWidth, gameHeight) {
    this.width = 150;
    this.height = 30;

    this.position = {
      x: gameWidth / 2 - this.width / 2,
      y: gameHeight - this.height - 10,
    };
  }
  draw(ctx) {
    ctx.fillStyle = "slategray";
    ctx.beginPath();
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.closePath();
  }
}

class Ball {
  constructor() {
    this.position = {
      x: canvas.width / 2,
      y: canvas.height - 50,
      dx: 2,
      dy: -2,
    };
    this.radius = 10;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
    this.position.x += this.position.dx;
    this.position.y += this.position.dy;

    //Checks if the radius of the ball collides with objects
    if (
      this.position.x + this.position.dx > canvas.width - this.radius ||
      this.position.x + this.position.dx < this.radius
    ) {
      //Bounce off the left or right wall
      this.position.dx = -this.position.dx;
    }

    if (this.position.y + this.position.dy < this.radius) {
      //Bounce off the top wall
      this.position.dy = -this.position.dy;
    }
    //Check if the ball hits the bottom wall
    if (this.position.y + this.position.dy > canvas.height - this.radius) {
      alert("GAME OVER");
      document.location.reload();
      clearInterval(interval); // Needed for Chrome to end game
    }
    //Check if the ball's y-cord is equal to the paddle's y -cord
    if (this.position.y === paddle.position.y) {
      //Check if the ball's x-cord is greater than the paddle's x-cord, and if it's less than the paddle width
      if (
        this.position.x > paddle.position.x &&
        this.position.x < paddle.position.x + paddle.width
      ) {
        //Bounce off the paddle
        this.position.dy = -this.position.dy;
      }
    }
  }
}

let brick = new Brick();
let paddle = new Paddle(gameWidth, gameHeight);
let ball = new Ball();

brick.draw(ctx);
paddle.draw(ctx);
ball.draw(ctx);

//Redraws every 10ms
let interval = setInterval(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  brick.draw(ctx);
  ball.draw(ctx);
  paddle.draw(ctx);
}, 10);

const eventHandler = () => {
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowLeft":
        //Move left
        ctx.clearRect(
          paddle.position.x,
          paddle.position.y,
          paddle.width,
          paddle.height
        );
        paddle.position.x -= 15;
        //Stops paddle from leaving left edge of screen
        if (paddle.position.x < 0) {
          paddle.position.x = 0;
        }
        paddle.draw(ctx);
        break;
      case "ArrowRight":
        //Move right
        ctx.clearRect(
          paddle.position.x,
          paddle.position.y,
          paddle.width,
          paddle.height
        );
        paddle.position.x += 15;
        //Stops paddle from leaving right edge of screen
        if (paddle.position.x > canvas.width - paddle.width) {
          paddle.position.x = canvas.width - paddle.width;
        }
        paddle.draw(ctx);
        break;
      default:
        return;
    }
  });
};
eventHandler();
