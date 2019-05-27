var canvas;
var canvasContext;

var ballX;
var ballY;
var ballSpeedX = 5;
var ballSpeedY = 5;
var ballRadius = 10;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;

var player1Score = 0;
var player2Score = 0;
const WINING_SCORE = 5;

var showingWinScreen = false;


function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;

	return {
		x: mouseX,
		y: mouseY
	};
}

window.onload = function () {
	canvas = document.getElementById("gameCanvas");
	canvasContext = canvas.getContext("2d");
	
	//set the initial position of the ball
	ballReset();

	var framesPerSecond = 30;
	setInterval(function() {
		moveEverything();
		drawEverything();
	}, 1000/framesPerSecond);

	canvas.addEventListener("click", startNewGame);

	canvas.addEventListener("mousemove", function(evt) {
		var mousePos = calculateMousePos(evt);
		paddle1Y = mousePos.y - PADDLE_HEIGHT/2;
	});
}

function drawEverything() {

	//field
	colorRect(0, 0, canvas.width, canvas.height, 'black');

	if(showingWinScreen) {
		var winner;
		if(player1Score >= WINING_SCORE)
			winner = "Player1";
		else if(player2Score >= WINING_SCORE)
			winner = "Player2";

		canvasContext.fillStyle = "white";
		canvasContext.fillText(winner + " won!", 360, 200);
		canvasContext.fillText("Click to continue...", 350, 500);
		return;
	}

	drawNet();

	//draw paddles
	colorRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, "white");
	colorRect(canvas.width - PADDLE_WIDTH, paddle2Y,
		         PADDLE_WIDTH, PADDLE_HEIGHT, "white");

	//draw the ball
	colorCircle(ballX, ballY, ballRadius, "white");

	//score
	canvasContext.fillText(player1Score, 100, 100);
	canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

function colorRect(leftX, topY, width, height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX, topY, width, height); 
}

function colorCircle(centerX, centerY, radius, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill();
}

function drawNet() {
	for(let i = 2; i < canvas.height; i += 36) {
		colorRect(canvas.width/2-1, i, 2, 20, "white");
	}
}

function moveEverything() {
	if(showingWinScreen) {
		return;
	}

	computerMovement();
	var deltaY; ballY - (paddle1Y + PADDLE_HEIGHT / 2);

	ballX += ballSpeedX;
	ballY += ballSpeedY;
	if(ballX < 0 + PADDLE_WIDTH) {
		if(ballY + ballRadius/2 > paddle1Y && 
			 ballY - ballRadius/2 < paddle1Y + PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;

			deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player2Score++;
			ballReset();
		}
	}
	if(ballX > canvas.width - PADDLE_WIDTH) {
		if(ballY + ballRadius / 2 > paddle2Y && 
			 ballY - ballRadius / 2 < paddle2Y + PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;
			deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player1Score++;
			ballReset();
		}
	}
	if(ballY < 0) {
		ballSpeedY = -ballSpeedY;
	}
	if(ballY > canvas.height) {
		ballSpeedY = -ballSpeedY;
	}
}

function computerMovement() {
	var paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;
	if(paddle2YCenter < ballY - 25) {
		paddle2Y += 10;
	} else if (paddle2YCenter > ballY + 25){
		paddle2Y -= 10;
	}
}

function ballReset() {
		if(player1Score >= WINING_SCORE ||
			 player2Score >= WINING_SCORE) {
			showingWinScreen = true;
		}

		//random vertical direction of the ball with random speed;
		if(Math.floor( Math.random() * 2 ) == 0 ) {
			ballSpeedY = -(Math.floor(Math.random() * (16 - 5)) + 5);
		} else {
			ballSpeedY = Math.floor(Math.random() * (16 - 5)) + 5;
		}

		ballSpeedX = -ballSpeedX;

		ballX = canvas.width/2;
		ballY = canvas.height/2;
}

function startNewGame(evt) {
	if(showingWinScreen) {	
		player2Score = 0;
		player1Score = 0;
		showingWinScreen = false;
	}
}