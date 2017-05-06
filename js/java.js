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
var game;
var winscore = 3;
//очки
var score1 = 0;
var score2 = 0;
var prevDir;

var isPlaying;

var board = new Image();
board.src = "images/board.jpg";

var requestAnimFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame  ||
    window.oRequestAnimationFrame  ||
    window.msRequestAnimationFrame;

function init() {
    // створення фону
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
    game = new Game();

    startLoop();

    document.addEventListener("keydown", checkKeyDown, false);
    document.addEventListener("keyup", checkKeyUp, false);
}

function loop() {
    game.update();
    if (isPlaying) {
        draw();
        update();
    }
    requestAnimFrame(loop);
}

function startLoop() {
    loop();
}

function draw() {
    ball.draw();
    player1.draw();
    player2.draw();
    drawScore();
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
};

Ball.prototype.update = function () {
    //відбиття від другого плеєра
    if (player2.drawY - 10 < this.drawY && player2.drawY + 10 + player2.height > this.drawY && player2.drawX - player2.width / 2 - 3 <= this.drawX){
         this.xspeed = -this.xspeed;
         this.yspeed = -this.yspeed;
        if (this.xspeed > 0)   this.xspeed = this.xspeed1;
        else  this.xspeed = -this.xspeed1;
        if (this.yspeed > 0) this.yspeed = this.yspeed1;
        else this.yspeed = -this.yspeed1;
    }
    //відбиття від першого плеєра
    if (player1.drawY - 10 < this.drawY && player1.drawY + 10 + player1.height > this.drawY && player1.drawX + player1.width + 10 >= this.drawX) {
        this.xspeed = -this.xspeed;
        this.yspeed = -this.yspeed;
        if (this.xspeed > 0)   this.xspeed = this.xspeed2;
        else  this.xspeed = -this.xspeed2;
        if (this.yspeed > 0) this.yspeed = this.yspeed2;
        else this.yspeed = -this.yspeed2;
    }
    if (this.drawX > canvasWidth) {
        this.dir = "STOP2";
    }
    if (this.drawX < 0) {
        this.dir = "STOP1";
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
        this.dir = "MOVE";
    }
    //удар об верхню стінку
    if (this.drawY<0){
        this.yspeed = -this.yspeed;
        this.dir = "MOVE";
    }
    this.BallMove();
};

Ball.prototype.BallMove= function () {
    if (this.dir == "MOVE") {
        this.drawX = this.drawX + this.xspeed;
        this.drawY = this.drawY + this.yspeed;
        prevDir = "MOVE";
    }
    if (this.dir == "STOP1") {
        if (prevDir!="STOP1") score2++;
        this.drawX = player1.width +14;
        this.drawY = player1.drawY + player1.height/2;
        prevDir = "STOP1";
    }
    if (this.dir == "STOP2") {
        if (prevDir!="STOP2") score1++;
        this.drawX = canvasWidth - player2.width - 14;
        this.drawY = player2.drawY + player2.height/2;
        prevDir = "STOP2";
    }
};


Player1.prototype.draw = function () {
    clearPlayer1Ctx();
    ctxPlayer1.drawImage(board, 400,400, 500, 300, //пов'язано з картинкою
        this.drawX,this.drawY, this.width, this.height);
};

Player1.prototype.update = function () {
    if(this.drawY <= 3 ) this.drawY = 0;
    if (this.drawY > canvasHeight-100) this.drawY = canvasHeight-100;
    this.chooseDir();
};

Player2.prototype.draw = function () {
    clearPlayer2Ctx();
    ctxPlayer2.drawImage(board, 400,400, 500, 300, //пов'язано з картинкою
        this.drawX,this.drawY, this.width, this.height);
};

Player2.prototype.update = function () {
    if(this.drawY <= 3 ) this.drawY = 0;
    if (this.drawY > canvasHeight-100) this.drawY = canvasHeight-100;
    this.chooseDir();
};

Player1.prototype.chooseDir =function () {
    if (this.isUp) {
        this.drawY -=this.speed;
    }
    if (this.isDown) {
        this.drawY +=this.speed;
    }
};

Player2.prototype.chooseDir = function () {
    if (this.isUp) {
        this.drawY -=this.speed;
    }
    if (this.isDown) {
        this.drawY +=this.speed;
    }

};
Game.prototype.getStatus = function () {
    return this.status;
};
Game.prototype.update = function () {
    // clear scene
    drawBackground();
    drawScore();
    if (score1 == winscore || score2 == winscore)  this.status = "OVER";
    switch (this.getStatus()) {
        //play
        case "PLAY":
            isPlaying = true;
            if (this.isEnter) this.status = "PAUSE";
            break;
        // none
        case "START":
            if (this.isEnter) {isPlaying = true; this.status = "PLAY";}
            this.showMsg('TENIS Game', 'Press Enter to play');
            break;

        // game over
        case "OVER":
            isPlaying = false;
            if (score1 > score2) this.showMsg('Game Over', 'Press Enter to play again', 'Left player is WIN');
            else this.showMsg('Game Over', 'Press Enter to play again', 'Right player is WIN');
            if (this.isEnter) this.status = "PLAY";
            score1 = 0;
            score2 = 0;
            break;

        // pause
        case "PAUSE":
            if (this.isEnter) this.status = "PLAY";
            isPlaying = false;
            this.showMsg('Pause', 'Press Enter to continue');
            break;
    }
};

Game.prototype.showMsg = function(header, action, addition) {
    // background
    context.beginPath();
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    context.closePath();

    // top text
    context.beginPath();
    context.font = "normal normal 32px cursive";
    context.fillStyle = '#FF0000';
    context.textAlign = "center";
    context.fillText(header, canvasWidth / 2, canvasHeight / 2);
    context.closePath();

    // middle text
    context.beginPath();
    context.font = "normal normal 14px monospace";
    context.fillStyle = '#B22222';
    context.textAlign = "center";
    context.fillText(action, canvasWidth / 2, canvasHeight / 2 + 32);
    context.closePath();
    // bottom addition text
    if (addition !== undefined) {
        context.beginPath();
        context.font = "normal normal 14px monospace";
        context.fillStyle = '#B22222';
        context.textAlign = "center";
        context.fillText(addition, canvasWidth / 2, canvasHeight - 32);
        context.closePath();
    }

};
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
    this.yspeed = 4;
    this.xspeed1 = 4;
    this.yspeed1 = 5;
    this.xspeed2 = 3;
    this.yspeed2 = 4;
    //direction
    this.dir = "MOVE";
    this.isSpace = false;
}

function Game() {
    this.status = "START";
    this.isEnter = false;
}

function drawScore() {
    drawBackground();
    context.fillStyle = "#fff";
    var str1 = score1.toString() ;
    var str2 = score2.toString();
    context.fillText(str1 + " : " + str2, canvasWidth/2, 20);
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
    if (keyID == 13){
        game.isEnter = true;
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
    if (keyID == 13){
        game.isEnter = false;
        e.preventDefault();
    }
}