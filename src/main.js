class App {
  constructor() {
    this.root = document.documentElement;
    this.board = document.querySelector(".board");
    this.boardCoord = this.board.getBoundingClientRect();
    this.startPosX = this.boardCoord.x / 2;
    this.startPosY = this.boardCoord.y / 2;

    this.ball = document.querySelector(".ball");
    this.ballX = 0;
    this.ballY = 0;
    this.ballVX = 50;
    this.ballVY = 50;
    this.ballArea = this.ball.getBoundingClientRect().width;

    //Why do this?
    this.loop = this.loop.bind(this);
    this.isAnimating = false;
  }

  impactFrame(times) {
    console.log("IMPACT");
    let counter = 0;
    // this.root.style.background = "#2a2a2a";
    const intervalId = setInterval(() => {
      console.log("impact", counter);

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
      console.log("pretrig impact");
      this.impactFrame(times);
      this.isAnimating = true;
      setTimeout(() => {
        console.log("trig impact");
        this.isAnimating = false;
      }, 10 * Math.abs(this.ballVY));
    }
  }

  async loop() {
    requestAnimationFrame(this.loop);

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

    //prevent ball from going through walls by changing its velocity
    if (this.ballY < this.ballArea) {
      //when ball touch top wall
      this.ballY = this.ballArea;
      this.ballVY *= -1;
      this.accelerate();
    } else if (
      this.ballY + this.ballArea >
      this.boardCoord.height - this.ballArea
    ) {
      this.ballY = this.boardCoord.height - this.ballArea * 2;
      this.ballVY *= -1;
      this.accelerate();
    }

    if (this.ballX < this.ballArea) {
      //when ball touch left wall
      this.ballX = this.ballArea;
      this.ballVX *= -1;
      this.accelerate();
      this.checkHighspeed();
    } else if (
      this.ballX + this.ballArea >
      this.boardCoord.width - this.ballArea
    ) {
      this.ballX = this.boardCoord.width - this.ballArea * 2;
      this.ballVX *= -1;
      this.accelerate();
      this.checkHighspeed();
    }
    console.log(
      this.boardCoord.width - this.ballArea,
      this.ballX,
      this.boardCoord.height - this.ballArea,
      this.ballY
    );
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

  setupEvents() {}
}

const app = new App();
app.setupEvents();
requestAnimationFrame(app.loop);
