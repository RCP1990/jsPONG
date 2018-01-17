var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;

var player1Score = 0;
var player2Score = 0;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS= 10;
const PADDLE_HEIGHT = 60;
const WINNING_SCORE = 3;

function getMousePos(evt) { //evt for eventhandler
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	//account for where on the page cursor is
	var mouseX = evt.clientX - rect.left - root.scrollLeft; 
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}

function handleMouseClick(evt)
{
	if(showingWinScreen) {
		player1Score = 0;
		player2Score = 0;
		showingWinScreen = false;
	}
}

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 400;
	var framesPerSecond = 30;
	setInterval(function(){
		moveEverything();
		drawEverything();
	}, 1000/framesPerSecond );

	canvas.addEventListener('mousedown', handleMouseClick);

	canvas.addEventListener('mousemove', 
		function(evt){
			var mousePos = getMousePos(evt);
			paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
		});
}
function ballReset() {
	if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
		showingWinScreen = true;

	}

ballSpeedX = -ballSpeedX;	
ballX = canvas.width/2;
ballY = canvas.height/2;
}

function computerMovement() {
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
	if(paddle2YCenter < ballY - 35) {
		paddle2Y = paddle2Y + 6;
	} else if(paddle2YCenter > ballY + 35) {
		paddle2Y = paddle2Y - 6;
	}
}

/*function computerMovement() {
	var y_pos = ballY;
	var diff = -((paddle2Y + (PADDLE_HEIGHT / 2)) - y_pos)

 if(diff < 0 && diff < -4) { // max speed up
    diff = -5;
  } else if(diff > 0 && diff > 4) { // max speed down
    diff = 5;
  }

  paddle2Y == diff;
  if(paddle2Y < 0) {
    paddle2Y = 0;
  } else if (paddle2Y + PADDLE_HEIGHT > 600) {
    paddle2Y = 600 - PADDLE_HEIGHT;
  }
};*/



function moveEverything() { //Make the ball bounce off the paddles
	if(showingWinScreen) {
		return;
	}
	computerMovement();

	ballX += ballSpeedX;
	ballY += ballSpeedY;
	
	if(ballX < 0) {
		if(ballY > paddle1Y &&
			ballY < paddle1Y+PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;

			var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);
			ballSpeedY = deltaY	* 0.30;
		} else {
			player2Score++;	
			ballReset();
			
		}
	}
	if(ballX > canvas.width) {
		if(ballY > paddle2Y &&
			ballY < paddle2Y+PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;

			var deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2);
			ballSpeedY = deltaY	* 0.30;
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

function drawNet() {
	for (var i=0; i<canvas.height; i+=40) {
		colorRect (canvas.width/2-1,i,2,20, 'white');
	}
}

function drawEverything() {

	colorRect(0,0,canvas.width,canvas.height, 'black');

	if(showingWinScreen) {
		canvasContext.fillStyle = 'white';
		canvasContext.font = "28px MumboSSK";
		if(player1Score >= WINNING_SCORE) {
			canvasContext.fillText("You Won!", 215, 100);
		} else if(player2Score >= WINNING_SCORE) {
			canvasContext.fillText("The Computer Won", 175, 100);
		}

		canvasContext.fillText("Click To Play Again", 175, 350);
		return;
	}
	drawNet();
	//left player paddle
	colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT, 'white'); 

	//right player paddle
	colorRect(canvas.width-PADDLE_THICKNESS,paddle2Y,
		PADDLE_THICKNESS,PADDLE_HEIGHT, 'white'); 

	//next line draws the ball
	DrawBall(ballX, ballY, 10, 'white');
    canvasContext.font = "40px pongScore"
	canvasContext.fillText(player1Score, 140, 50);
	canvasContext.fillText(player2Score, canvas.width-180, 50);
}

function DrawBall(centerX, centerY, radius, drawColor) {
	canvasContext.fillStyle = 'white';
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX, topY, width, height);
}
