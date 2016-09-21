//GLOBAL VARIABLES
//for when conditions are met to finish a round
var winState = 0;
//count # of characters that make it across
var winCount = 0;
//hold imgs for the 5 playable characters
var charArray = ['images/char-boy.png', 'images/char-cat-girl.png', 'images/char-horn-girl.png', 'images/char-pink-girl.png', 'images/char-princess-girl.png'];
//index for which character is currently being played
var charSlot = 0;
//index for displaying character portraits at bottom of screen
var lifeSlot = 0;
//index for displaying character life status over character portraits
//start at -1 for ease of using only ++ on win/loss event
var statusCount = -1;
//empty array to fill with success/fail imgs as needed to show character status
var statusArray = [];
//empty array for storing lifeState objects
var lifeStateArray = [];

//OBJECTS
//handle each character (or life) displayed at bottom of screen
var Life = function() {
  this.sprite = charArray[lifeSlot];
  this.x = (lifeSlot * (101/2));
  this.y = 606 - (171/2) - 11;
};

// Life.prototype.update = function() {
// };

Life.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 101/2, 171/2);
};

//handle indicator for showing success or failure of each character
var lifeState = function() {
  this.sprite = statusArray[statusCount];
  this.x = (statusCount * (101/2) + 10);
  this.y = 606 - (171/2);
};

lifeState.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 101/3, 171/3);
};
//lifeStateArray = [];

// Enemies our player must avoid
var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';

  //call initial positioning
  this.startPosition();
};

//set enemy start position and speed randomly
Enemy.prototype.startPosition = function() {
  //start off screen
  this.x = Math.random() * ((-25) - (-175)) + (-175);
  //start at random stone-block row
  this.y = 60 + (Math.round(Math.random() * (2.49 - (-0.5)) + (-0.5)))*83;
  //random speed
  this.enemySpeed = Math.random() * (235 - 35) + 35;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.

  //movement
  this.x += this.enemySpeed * dt;

  //reuse enemy by moving it back to a new starting position once off screen
  if(this.x > 7 * 101) {
    this.startPosition();
  }

  //collision detection
  if(this.y === 60 && player.y === 43 || this.y === 143 && player.y === 126 || this.y === 226 && player.y === 209) {
    if(this.x + 101 >= player.x + 35 && this.x <= player.x + 66) {
      // player.x = 2 * 101;
      // player.y = 5 * 75;
      if(charSlot < 4) {
        charSlot++;
        statusCount++;
        statusArray.push('images/Rock.png');
        lifeStateArray.push(new lifeState());
        player = new Player();
      }
			//reset if went through all characters
      else {
        charSlot = 0;
        statusCount = -1;
        statusArray = [];
        lifeStateArray = [];
        winState = 1;
        player = new Player();
      }
    }
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  //this.sprite = 'images/char-boy.png';
  this.sprite = charArray[charSlot];
  this.winSprite = 'images/Star.png';
  //starting position bottom center
  this.x = 2 * 101;
  this.y = 5 * 75 /*83*/;
};

Player.prototype.update = function() {
  if(this.y < 0) {
    //reset position to start
    this.x = 2* 101;
    this.y = 5 *75;
    if(charSlot < 4) {
      charSlot++;
      statusCount++;
      winCount++;
      statusArray.push('images/Heart.png');
      lifeStateArray.push(new lifeState());
      player = new Player();
    }
		//reset if went through all characters
    else {
      charSlot = 0;
      statusCount = -1;
      statusArray = [];
      lifeStateArray = [];
      winCount++;
      winState = 1;
      player = new Player();
    }
  }
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	//if finish round show score
  if(winState === 1) {
    ctx.drawImage(Resources.get(this.winSprite), this.x, this.y);
    ctx.font = '72px serif';
    ctx.fillStyle = 'yellow';
    ctx.fillText(winCount + '/5', this.x, this.y + 50);
    setTimeout(function() {
      winState = 0;
      winCount = 0;
    }, 1000);
  }
};

Player.prototype.handleInput = function(keyPress) {
  switch(keyPress) {
    case 'up':
      if(this.y > 0) {
        this.y -= 83;
      }
      break;
    case 'right':
      if(this.x < 101 * 4) {
        this.x += 101;
      }
      break;
    case 'down':
      if(this.y < (75 * 5)) {
        this.y += 83;
      }
      break;
    case 'left':
      if(this.x > 0) {
        this.x -= 101;
      }
      break;
  };
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();

var allEnemies = [];
for(i = 0; i < 4; i++) {
  allEnemies.push(new Enemy());
}

var lives = [];
for(lifeSlot; lifeSlot < 5; lifeSlot++) {
  lives.push(new Life());
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
