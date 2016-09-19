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

//Set enemy start position and speed randomly
Enemy.prototype.startPosition = function() {
  //start off screen
  this.x = Math.random() * ((-175) - (-25)) + (-25);
  //start at random stone-block row
  this.y = 60 + (Math.round(Math.random() * (2.49 - (-0.5)) + (-0.5)))*83;
  //random speed
  this.enemySpeed = Math.random() * (235 - 35) + 35;
}

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
      if(this.x + 101 >= player.x + 20 && this.x <= player.x + 81) {
        player.x = 2 * 101;
        player.y = 5 * 75;
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
  this.sprite = 'images/char-boy.png';
  //starting position bottom center
  this.x = 2 * 101;
  this.y = 5 * 75 /*83*/;
};

Player.prototype.update = function() {
  if(this.y < 0) {
    //reset position to start
    this.x = 2* 101;
    this.y = 5 *75;
  }
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y)
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
  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();

var allEnemies = [];
for (i = 0; i < 4; i++) {
  allEnemies.push(new Enemy);
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
