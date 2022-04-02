let gameLoop, reboot, score, score1, board, board1, customFont;
let leaderboard = [];
// stores different images for medals
let medal = [];
// stores flappy bird animation
let fp = [];
let fpy, fpx, fpydirect, fpyspeed, fpxspeed, gravity, x;
// obstacle and the x and y positions
let obsdown, obsup, obs;
let px;
let pys;
// loads sprites from the flappy bird game
let spritesheet, spritesheet1;
let background1, ground, gx;
let fpb, fpgo, fpgo1, fptap, fpreset, fpleaderboard, fpboard;
// sets database for score
let database;

function preload() {
	spritesheet = loadImage("sprite.png");
	spritesheet1 = loadImage("sprites2.png");
	ground = loadImage("ground.png");
	board1 = loadImage("leaderboard.png");
	customFont = loadFont('ChunkFive-Regular.otf');
}


function setup() {
// Your web app's Firebase configuration, this is unique to each database and
// can be found in your Firebase Project
	// For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
		apiKey: "AIzaSyCQzw9-0hT1777gj8RbyHQFs3KmpGVaCUg",
    authDomain: "highscore-1cd42.firebaseapp.com",
    projectId: "highscore-1cd42",
    storageBucket: "highscore-1cd42.appspot.com",
    messagingSenderId: "164299564623",
    appId: "1:164299564623:web:17e92cbfccd62e103bac3a",
    measurementId: "G-YPQ1Z15E91"
  };
  // Initialize Firebase.3/dist/index
  firebase.initializeApp(firebaseConfig);
	
	createCanvas(288, 512);
	background(0);
	gameLoop = 0;
	score = 0;
	score1 = 0;
	leaderboard = [95, 82, 63, 47, 45];
	frameRate(30);
	textFont(customFont);

	// loads all the sprites that relate to flappy bird
	fp[0] = spritesheet.get(525, 125, 40, 30);
	fp[1] = spritesheet.get(525, 176, 40, 44);
	fpb = spritesheet.get(290, 344, 195, 46);
	fpgo = spritesheet.get(290, 395, 191, 43);
	fpgo1 = spritesheet.get(290, 114, 229, 119);
	fptap = spritesheet.get(344, 278, 78, 65);
	fpreset = spritesheet1.get(265, 137, 55, 32);
	fpleaderboard = spritesheet1.get(323, 112, 55, 32);
	fpboard = board1.get(0, 0, 40, 116);
	x = fp[0];
	// sets boolean variables
	var hit = false;
	obs = false;
	reboot = false;
	board = false;
	
	// sets position, speed and direction of the flappy bird
	fpx = width / 2;
	fpy = height / 2;
	fpydirect = 1;
	fpyspeed = 1;
	fpxspeed = 1;
	gravity = 1;
	// sets background and pipes
	background1 = spritesheet.get(0, 0, 288, 512);
	obsdown = spritesheet.get(603, 0, 54, 272);
	obsup = spritesheet.get(657, 0, 56, 243);
	// position of pipes and ground
	gx = 0;
	pys = random([100, 125, 150, 175, 200]);	
	px = width + 50;
	// four different sprites for medals that the player can earn
	medal[1] = spritesheet.get(600, 273, 50, 46);
	medal[2] = spritesheet.get(530, 457, 47, 46);
	medal[3] = spritesheet.get(480, 457, 50, 46);
	medal[4] = spritesheet.get(437, 288, 47, 46);
}

function keyTyped() {
	// gives jumpping & animation effect to the bird 
	if(key == ' ' && fpyspeed >= 0.1) {	
		x = fp[1];
		fpyspeed -= 10;
	}
	// starts game
	if(key == ' ' && gameLoop == 0) {
		gameLoop = 1;
	}
}

function mousePressed() {
	// resets the game
	if (mouseIsPressed && mouseButton == LEFT && gameLoop == 2 && collideRectRect(mouseX, mouseY, 50, 100, (width / 2) - 15, (height / 2) + 200, 10, -50)) {
			reboot = true;
	}
	if (mouseIsPressed && mouseButton == LEFT && gameLoop == 2 && collideRectRect(mouseX, mouseY, 50, 100, (width / 2) + 70, (height / 2) + 200, 10, -50)) {
			board = true;
	}
}


function draw() {

	
	// sets the speed of bird
	fpy += fpyspeed * fpydirect; 
	// start screen
	if (gameLoop == 0) {
		// creates images
		image(background1, 0, 0);
		image(x, fpx - 17, fpy - 15);
		image(fpb, (width / 2) - 100, (height / 2) - 100);
		image(fptap, (width / 2) - 16, (height / 2) + 30);
		image(ground, gx, height - 100, 500, 200);
		// bounces bird back and forth in the same x position
		if (fpy > (height / 2) + 3 || fpy < (height / 2) - 3) {
			fpydirect *= -1
		}
	}
	// game screen
	if (gameLoop == 1) {
		
		// detects the distance between x position of the obstacle and flappy bird
		if (abs(fpx - px) <= 2) {
			score += 1;
		}
		// checks to see whether current score is larger or equal to their highscore
		if (score >= score1) {
			score1 = score;
		}
		// references shared high score and sets score as high score depending on score
		database = firebase.database().ref('highscoreShared').set(score1);
		// references shared high score and reads the data within the reference point
		// used highscore variable to clairfy whether or not the data is being transferred
		// score1 is referred to as highscore instead of the actual highscore variable 
		let highscore = firebase.database().ref('highscoreShared').on('value', function(snapshot){
		highScore = snapshot.val();
		})
		// reads the highscore in the console log
		console.log(highScore);
		
		reboot = false;
		// allows y position of bird to be affected by gravity
		fpyspeed -= gravity;
		gravity = -0.5
		fpydirect = 1;
		// recreates images
		image(background1, 0, 0);
		image(x, fpx - 17, fpy - 15);
		image(ground, gx, height - 100, 500, 200);
		// animates the ground
		gx -= 5;
		
		if (gx <= -180) {
			gx = 0;
		}
		// brings bird backwards from it's starting position
		fpx -= fpxspeed;
		if (fpxspeed <= 7) {
			x = fp[0];
		}
		if(fpx <= 120) {
			fpxspeed = 0.75;
		}
		if (fpx <= 85) {
			fpxspeed = 0;
		}
		if (fpxspeed <= 0.75) {
			obs = true;
		}
		// creates obstacles, moving from right to left
		if (obs) {
			image(obsdown, px, pys - 200, 70, 300);
			image(obsup, px, pys + 200, 70, 300);
			px -= 5;
			image(ground, gx, height - 100, 500, 200);
		}
		// resets obstacles after reaching the end of the screen
		if(px <= -100) {
			pys = random([100, 125, 150, 175, 200]);	
			px = width + 25;
		}
		// adds a score for everytime player passes the obstacle
			textSize(25); 
			text(score, 15, 30);
		// detects collision if bird hits the ground or obstacle
		floorhit = collideRectRect(0, height - 100, 500, 200, fpx, fpy, 1, -47); 
			if (floorhit) {
				fpyspeed = 0;
				gameLoop = 2;
			}
		upperhit = collideRectRect(px, pys - 200, 90, 300, fpx, fpy, 10, 10);
			if (upperhit) {
				gameLoop = 2;
			}
		lowerhit = collideRectRect(px, pys + 200, 90, 300, fpx, fpy, 10, 10);
			if (lowerhit) {
				gameLoop = 2;
			}
	}
	// end screen
	if (gameLoop == 2) {
		
		image(background1, 0, 0);
		image(fpgo, (width / 2) - 100, (height / 2) - 100);
		image(fpgo1, (width / 2) - 115, (height / 2) - 30);
		image(fpreset, (width / 2) - 65, (height / 2) + 100);
		image(fpleaderboard, (width / 2) + 20, (height / 2) + 100);
		
		// sets the medal based on what score you have
		if (score >= 2 && score <= 4) {
			image(medal[1], (width / 2) - 91, (height / 2) + 15);
		}
		if (score >= 4 && score <= 6) {
			image(medal[2], (width / 2) - 89, (height / 2) + 15);
		}
		if (score >= 6 && score <= 8) {
			image(medal[3], (width / 2) - 91, (height / 2) + 15);
		}
		if (score >= 8) {
			image(medal[4], (width / 2) - 89, (height / 2) + 15);
		}
			fill(255, 190, 100);
			textSize(20);	
			text(score, (width / 2) + 65, (height / 2) + 23);
			text(score1, (width / 2) + 68, (height / 2) + 67);
			
		if (board) {
			image(fpboard, 0, 0, 40, 150);
			for (let i = 0; i < leaderboard.length; i++) {
				textSize(15);
				fill(0);
				text(leaderboard[i], 12, (i + 1) *25);
			}
		}
		
		// resets the game
		if (reboot) {
			board = false;
			gameLoop = 0;
			score = 0;
			fill (0);
			image (background1, 0, 0);
			image (x, fpx - 17, fpy - 15);
			image (fpb, (width / 2) - 100, (height / 2) - 100);
			image (fptap, (width / 2) - 16, (height / 2) + 30);
			image (ground, gx, height - 100, 500, 200);
			
			if (fpy > (height / 2) + 3 || fpy < (height / 2) - 3) {
			fpydirect *= -1;
			}
			
			fpx = width / 2;
			fpy = height / 2;
			fpydirect = 1;
			fpyspeed = 1;
			fpxspeed = 1;
			gravity = 1;
			
			pys = random([100, 125, 150, 175, 200]);		
			px = width + 100;
		}
	}
}