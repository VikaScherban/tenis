window.onload = init;

var canvasWidth = 800;
var canvasHeight = 500;

var context;
var ballctx;
var ctxPlayer1;
var ctxPlayer2;
var player1;
var player2;
var ball;

var isPlaying;

var board = new Image();
board.src = "images/board.jpg";

var requestAnimFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame  ||
    window.oRequestAnimationFrame  ||
    window.msRequestAnimationFrame;

function init() {
    // create canvas
    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);

    this.ballcanvas = document.createElement('canvas');
    document.body.appendChild(this.ballcanvas);

    this.player1canvas = document.createElement('canvas');
    document.body.appendChild(this.player1canvas);
    this.player2canvas = document.createElement('canvas');
    document.body.appendChild(this.player2canvas);

    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;

    this.ballcanvas.width = this.canvasWidth;
    this.ballcanvas.height = this.canvasHeight;

    this.player1canvas.width = this.canvasWidth;
    this.player1canvas.height = this.canvasHeight;
    this.player2canvas.width = this.canvasWidth;
    this.player2canvas.height = this.canvasHeight;

    //context
    context = this.canvas.getContext('2d');
    ballctx = this.ballcanvas.getContext('2d');
    ctxPlayer1 = this.player1canvas.getContext('2d');
    ctxPlayer2 = this.player2canvas.getContext('2d');

    drawBackground();

    player1 = new Player1();
    player2 = new Player2();
    ball = new Ball();

    startLoop();

    document.addEventListener("keydown", checkKeyDown, false);
    document.addEventListener("keyup", checkKeyUp, false);
}

function loop() {
    if (isPlaying) {
        draw();
        update();
        requestAnimFrame(loop);
    }
}

function startLoop() {
    isPlaying = true;
    loop();
}

function draw() {
    ball.draw();
    player1.draw();
    player2.draw();
}

function update() {
    ball.update();
    player1.update();
    player2.update();
}

function drawBackground() {
    context.fillStyle = "#3D3D3D";
    context.fillRect(0,0,800,500);
}

Ball.prototype.draw = function () {
    clearBallCtx();
    ballctx.beginPath();
    ballctx.fillStyle = "#fff";
    ballctx.arc(this.drawX, this.drawY, this.radius, 0, Math.PI*2, false);
    ballctx.closePath();
    ballctx.fill();
}

Ball.prototype.update = function () {
    if (player2.drawY - 10 < this.drawY && player2.drawY + 10 + player2.height > this.drawY && player2.drawX - player2.width / 2 - 3 <= this.drawX){
         this.xspeed = -this.xspeed;
         this.yspeed = -this.yspeed;

    }
    if (player1.drawY - 10 < this.drawY && player1.drawY + 10 + player1.height > this.drawY && player1.drawX + player1.width + 10 >= this.drawX) {
        this.xspeed = -this.xspeed;
        this.yspeed = -this.yspeed;
    }
    if (this.drawX > canvasWidth) {
        this.dir = "STOP2";
    }
    if (this.drawX < 0) {
        this.dir = "STOP1"
    }
    if (this.isSpace) {
        if (this.dir == "STOP1") {
            this.dir = "MOVE";
            this.xspeed = -this.xspeed;
            this.yspeed = -this.yspeed;
        }
        if (this.dir == "STOP2") {
            this.dir = "MOVE";
            this.xspeed = -this.xspeed;
            this.yspeed = -this.yspeed;
        }
    }
    //удар об нижню стінку
    if (this.drawY>canvasHeight) {
        this.yspeed = -this.yspeed;
    }
    //удар об верхню стінку
    if (this.drawY<0){
        this.yspeed = -this.yspeed;
    }
    this.BallMove();
}

Ball.prototype.BallMove= function () {
    if (this.dir == "MOVE") {
        this.drawX = this.drawX + this.xspeed;
        this.drawY = this.drawY + this.yspeed;
    }
    if (this.dir == "STOP1") {
        this.drawX = player1.width +14;
        this.drawY = player1.drawY + player1.height/2;
    }
    if (this.dir == "STOP2") {
        this.drawX = canvasWidth - player2.width - 14;
        this.drawY = player2.drawY + player2.height/2;
    }

}


Player1.prototype.draw = function () {
    clearPlayer1Ctx();
    ctxPlayer1.drawImage(board, 400,400, 500, 300, //пов'язано з картинкою
        this.drawX,this.drawY, this.width, this.height);
}

Player1.prototype.update = function () {
    if(this.drawY <= 3 ) this.drawY = 0;
    if (this.drawY > canvasHeight-100) this.drawY = canvasHeight-100;
    this.chooseDir();
}

Player2.prototype.draw = function () {
    clearPlayer2Ctx();
    ctxPlayer2.drawImage(board, 400,400, 500, 300, //пов'язано з картинкою
        this.drawX,this.drawY, this.width, this.height);
}

Player2.prototype.update = function () {
    if(this.drawY <= 3 ) this.drawY = 0;
    if (this.drawY > canvasHeight-100) this.drawY = canvasHeight-100;
    this.chooseDir();
}

Player1.prototype.chooseDir =function () {
    if (this.isUp) {
        this.drawY -=this.speed;
    }
    if (this.isDown) {
        this.drawY +=this.speed;
    }
}

Player2.prototype.chooseDir = function () {
    if (this.isUp) {
        this.drawY -=this.speed;
    }
    if (this.isDown) {
        this.drawY +=this.speed;
    }

}
//Game Objects
function Player1() {
    this.drawX = 0;
    this.drawY = canvasHeight/2 - 50;
    this.width = 20;
    this.height = 100;
    this.speed = 5;
    //for keys
    this.isUp = false;
    this.isDown = false;
}
function Player2() {
    this.drawX = 780;
    this.drawY = canvasHeight/2 -50;
    this.width = 20;
    this.height = 100;
    this.speed = 5;
    //for keys
    this.isUp = false;
    this.isDown = false;
}

function Ball() {
    this.drawX = 0;
    this.drawY = 0;
    this.radius = 10;
    this.speed = 3;
    this.xspeed = 3;
    this.yspeed = 5;
    //direction
    this.dir = "MOVE";
    this.isSpace = false;
}

//Clear functions
function clearBallCtx() {
    ballctx.clearRect(0,0,canvasWidth, canvasHeight);
}
function clearPlayer1Ctx() {
    ctxPlayer1.clearRect(0,0,canvasWidth, canvasHeight);
}
function clearPlayer2Ctx() {
    ctxPlayer2.clearRect(0,0,canvasWidth, canvasHeight);
}

//Keys functions
function checkKeyDown(e) {
    var keyID = e.keyCode || e.which;
    var keyChar = String.fromCharCode(keyID);

    if (keyChar == "W") {
        player1.isUp = true;
        e.preventDefault();
    }
    if (keyChar == "S") {
        player1.isDown = true;
        e.preventDefault();
    }

    if (keyID == 38){
        player2.isUp = true;
        e.preventDefault()
    }
    if (keyID == 40){
        player2.isDown = true;
        e.preventDefault();
    }

    if (keyID == 32){
        ball.isSpace = true;
        e.preventDefault();
    }
}

function checkKeyUp(e) {
    var keyID = e.keyCode || e.which;
    var keyChar = String.fromCharCode(keyID);

    if (keyChar == "W") {
        player1.isUp = false;
        e.preventDefault();
    }
    if (keyChar == "S") {
        player1.isDown = false;
        e.preventDefault();
    }
    if (keyID == 38){
        player2.isUp = false;
        e.preventDefault()
    }
    if (keyID == 40){
        player2.isDown = false;
        e.preventDefault();
    }
    if (keyID == 32){
        ball.isSpace = false;
        e.preventDefault();
    }
}