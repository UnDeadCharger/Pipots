class App {
  constructor() {
    this.root = document.documentElement;

    //Board
    this.board = document.querySelector(".board");
    this.boardCoord = this.board.getBoundingClientRect();
    this.startPosX = this.boardCoord.width / 2;
    this.startPosY = this.boardCoord.height / 2;

    //Ball
    this.ball = document.querySelector(".ball");
    this.grid = this.ball.getBoundingClientRect().width;
    this.ballX = this.startPosX;
    this.ballY = this.startPosY;
    this.ballVX = 10;
    this.ballVY = 10;
    this.ballArea = this.grid;

    //Paddle:
    this.paddleL = document.querySelector(".paddle-left");
    this.paddleR = document.querySelector(".paddle-right");

    this.paddleLY = this.paddleL.getBoundingClientRect().y;
    this.paddleRY = this.paddleR.getBoundingClientRect().y;
    this.paddleLVY = 0;
    this.paddleRVY = 0;
    // this.paddle = document.querySelector(".paddle-right");d
    //disable input
    this.paddleLDisabled = false;
    this.paddleRDisabled = false;

    //Why do this?
    this.loop = this.loop.bind(this);
    this.setupEvents = this.setupEvents.bind(this);
    this.isAnimating = false;
  }

  //Collision detection
  getBall() {
    return {
      x: this.ballX,
      y: this.ballY,
      width: this.ballArea,
      height: this.ballArea,
    };
  }

  //   getPaddleLeft() {
  //     const paddle = this.paddle.getBoundingClientRect();
  //     return paddle;
  //   }

  collides(rect1, rect2) {
    return !(
      rect1.x > rect2.x + rect2.width ||
      rect1.x + rect1.width < rect2.x ||
      rect1.y > rect2.y + rect2.height ||
      rect1.y + rect1.height < rect2.y
    );
  }

  impactFrame(times) {
    let counter = 0;
    // this.root.style.background = "#2a2a2a";
    const intervalId = setInterval(() => {
      if (counter >= times * 2) {
        this.root.style.background = "black";
        clearInterval(intervalId);
        return;
      }
      this.root.style.background =
        this.root.style.background === "black" ? "#868686" : "black";
      this.ball.style.background =
        this.ball.style.background === "black" ? "#868686" : "black";
      counter++;
    }, 10);
  }

  //THe game loop
  accelerate() {
    if (Math.abs(this.ballVY) > 200 || Math.abs(this.ballVX) > 200) return;
    this.ballVY = this.ballVY * 1.1;
    this.ballVX = this.ballVX * 1.1;
  }

  checkHighspeed() {
    if (Math.abs(this.ballVY) > 100 || Math.abs(this.ballVX) > 100) {
      const times = Math.abs(this.ballVY) / 50 - 1;
      this.impactFrame(times);
      this.isAnimating = true;
      setTimeout(() => {
        this.isAnimating = false;
      }, 10 * Math.abs(this.ballVY));
    }
  }

  async loop() {
    requestAnimationFrame(this.loop);

    // move paddles by their velocity
    this.paddleLY += this.paddleLVY;
    this.paddleRY += this.paddleRVY;
    // prevent paddles from going through walls
    if (this.paddleLY < this.grid) {
      this.paddleLY = this.grid;
    } else if (
      this.paddleLY >
      this.boardCoord.height -
        this.paddleL.getBoundingClientRect().height -
        this.grid
    ) {
      this.paddleLY =
        this.boardCoord.height -
        this.paddleL.getBoundingClientRect().height -
        this.grid;
    }

    if (this.paddleRY < this.grid) {
      this.paddleRY = this.grid;
    } else if (
      this.paddleRY >
      this.boardCoord.height -
        this.paddleR.getBoundingClientRect().height -
        this.grid
    ) {
      this.paddleRY =
        this.boardCoord.height -
        this.paddleR.getBoundingClientRect().height -
        this.grid;
    }
    this.paddleL.style.transform = `translateY(${this.paddleLY}px)`;
    this.paddleR.style.transform = `translateY(${this.paddleRY}px)`;

    if (this.isAnimating) {
      //Play flashing animation
      //Keep the ball still for (15 * velocity) ms
      //player can still move
      this.ball.style.background === "red"
        ? (this.ball.style.background = "blue")
        : (this.ball.style.background = "red");
      return;
    }
    this.ball.style.background = "white";
    // move ball by its velocity
    this.ballX += this.ballVX;
    this.ballY += this.ballVY;
    // check collision
    if (this.collides(this.getBall(), this.paddleL.getBoundingClientRect())) {
      this.ballX =
        this.paddleL.getBoundingClientRect().x +
        this.paddleL.getBoundingClientRect().width;
      this.ballVX *= -1;
      this.accelerate();
      this.checkHighspeed();
    }
    if (this.collides(this.getBall(), this.paddleR.getBoundingClientRect())) {
      this.ballX =
        this.paddleR.getBoundingClientRect().x -
        this.paddleR.getBoundingClientRect().width;
      this.ballVX *= -1;
      this.accelerate();
      this.checkHighspeed();
    }

    //prevent ball from going through walls by changing its velocity
    if (this.ballY < this.ballArea) {
      //when ball touch top wall
      this.ballY = this.ballArea;
      this.ballVY *= -1;
    } else if (
      this.ballY + this.ballArea >
      this.boardCoord.height - this.ballArea
    ) {
      this.ballY = this.boardCoord.height - this.ballArea * 2;
      this.ballVY *= -1;
    }

    if (this.ballX < this.ballArea) {
      //when ball touch left wall
      this.ballX = this.ballArea;
      this.ballVX *= -1;
    } else if (
      this.ballX + this.ballArea >
      this.boardCoord.width - this.ballArea
    ) {
      this.ballX = this.boardCoord.width - this.ballArea * 2;
      this.ballVX *= -1;
    }
    //update ball position
    this.ball.style.transform = `translate(${this.ballX}px, ${this.ballY}px)`;
  }

  async execute(func) {}

  reset() {
    this.positionX = this.startPosX;
    this.positionY = this.startPosY;

    this.velocityX = 5;
    this.velocityY = 5;
  }

  setupEvents() {
    const paddleSpeed = 10;
    // listen to keyboard events to move the paddles
    document.addEventListener("keydown", (e) => {
      // up arrow key
      if (e.key === "ArrowUp") {
        this.paddleRVY = -paddleSpeed;
      }
      // down arrow key
      else if (e.key === "ArrowDown") {
        this.paddleRVY = paddleSpeed;
      }

      // w key
      if (e.key === "w") {
        this.paddleLVY = -paddleSpeed;
      }
      // s key
      else if (e.key === "s") {
        this.paddleLVY = paddleSpeed;
      }
    });

    // listen to keyboard events to stop the paddle if key is released
    document.addEventListener("keyup", (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        this.paddleRVY = 0;
      }

      if (e.key === "w" || e.key === "s") {
        this.paddleLVY = 0;
      }
    });

    this.ball.style.transform = `translate(${this.startPosX}px, ${this.startPosY}px)`;
  }
}

const app = new App();
app.setupEvents();
requestAnimationFrame(app.loop);
