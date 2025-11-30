// I watched this tutroial https://www.youtube.com/watch?v=VNs96uQoetw&t=5699s to understand how to make the game and adapt it for my website

// Game constants
const PHYSICS_GRAVITY = 0.5; //these control the physics and speed of the game
const JUMP_POWER = -14;
const MOVE_SPEED = 4;
const ENEMY_SPEED = 0.6;

// Social link blocks config
const LINK_BLOCKS = { //I made it so when the player hits the surprise boxes they are redirected to my social pages, such as linkedin, behance and github
  linkedin: {
    url: "https://www.linkedin.com/in/neesan-o-brien-shea/",
    contactId: "linkedin",
  },
  behance: {
    url: "https://www.behance.net/neesanoshea",
    contactId: "behance",
  },
  github: {
    url: "https://github.com/nobriens",
    contactId: "github",
  },
};

// Here is the playstate, it tracks the score, level and lives (however later on I made it so the player only has one life and there is only one level)
let waitingToStart = true;
let levels = []

let playState = {
  score: 0,
  level: 1,
  lives: 5,
  gamePlaying: true,
  keys: {}, // this stores the pressed keys
};

// This part was for the player's position, size and movement values
let hero = {
  element: document.getElementById("mario"),
  x: 50,
  y: 340,
  width: 45, // the player sprite was the only one that wasn't equal width and height
  height: 75,
  velX: 0,
  velY: 0,
  onBlock: false,
};

//Here are the game objects arrays, everything in the level is stored here
let gameObjects = {
  platforms: [],
  enemies: [],
  coins: [],
  surpriseBlocks: [],
  pipes: [],
};

// This intitiates the game and loads the level
function bootGame() {
  loadStage(playState.level - 1);
  Loop();
}

function loadStage(levelIndex) { // compared to the tutorial which had two levels, for my use case I only needed one so when the player completes this level it shows the win screen
  if (levelIndex >= levels.length) {
    showGameOver(true);
    return;
  }

  clearStage();

  const level = levels[levelIndex];

  const gameArea = document.getElementById("game-area");

  // This resets the player when completing the level
  hero.x = 50;
  hero.y = 340;
  hero.velX = 0;
  hero.velY = 0;
  hero.element.className = "";
  updateElementPos(hero.element, hero.x, hero.y);

  // Platforms
  level.platforms.forEach((platformData, index) => {
    const platform = createElement("div", `platform ${platformData.type}`, {
      left: platformData.x + "px",
      top: platformData.y + "px",
      width: platformData.width + "px",
      height: platformData.height + "px",
    });
    gameArea.appendChild(platform);
    gameObjects.platforms.push({
      element: platform,
      ...platformData,
      id: "platform-" + index,
    });
  });

  // Enemies
  level.enemies.forEach((enemyData, index) => {
    const enemy = createElement("div", `enemy ${enemyData.type}`, {
      left: enemyData.x + "px",
      top: enemyData.y + "px",
    });
    gameArea.appendChild(enemy);
    gameObjects.enemies.push({
      element: enemy,
      x: enemyData.x,
      y: enemyData.y,
      width: 40,
      height: 40,
      direction: -1,
      speed: ENEMY_SPEED,
      id: "enemy-" + index,
      alive: true,
    });
  });

  // Coins
  level.coins.forEach((coinData, index) => {
    const coin = createElement("div", "coin", {
      left: coinData.x + "px",
      top: coinData.y + "px",
    });
    gameArea.appendChild(coin);
    gameObjects.coins.push({
      element: coin,
      x: coinData.x,
      y: coinData.y,
      width: 40,
      height: 40,
      collected: false,
      id: "coin-" + index,
    });
  });

  // LinkedIn block
  level.surpriseBlocksLinkedin.forEach((blockData, index) => {
    const block = createElement("div", "surprise-blocklinkedin", {
      left: blockData.x + "px",
      top: blockData.y + "px",
    });
    gameArea.appendChild(block);
    gameObjects.surpriseBlocks.push({
      element: block,
      x: blockData.x,
      y: blockData.y,
      width: 40,
      height: 40,
      type: blockData.type,
      hit: false,
      id: "block-linkedin-" + index,
    });
  });

  // Behance block
  level.surpriseBlocksBehance.forEach((blockData, index) => {
    const block = createElement("div", "surprise-blockbehance", {
      left: blockData.x + "px",
      top: blockData.y + "px",
    });
    gameArea.appendChild(block);
    gameObjects.surpriseBlocks.push({
      element: block,
      x: blockData.x,
      y: blockData.y,
      width: 40,
      height: 40,
      type: blockData.type, 
      hit: false,
      id: "block-behance-" + index,
    });
  });

  // GitHub block
  level.surpriseBlocksGithub.forEach((blockData, index) => {
    const block = createElement("div", "surprise-blockgithub", {
      left: blockData.x + "px",
      top: blockData.y + "px",
    });
    gameArea.appendChild(block);
    gameObjects.surpriseBlocks.push({
      element: block,
      x: blockData.x,
      y: blockData.y,
      width: 40,
      height: 40,
      type: blockData.type, // "github"
      hit: false,
      id: "block-github-" + index,
    });
  });

  // Pipe
  level.pipes.forEach((pipeData, index) => {
    const pipe = createElement("div", "pipe", {
      left: pipeData.x + "px",
      top: pipeData.y + "px",
      width: "80px",
      height: "80px",
    });

    gameArea.appendChild(pipe);

    gameObjects.pipes.push({
      element: pipe,
      x: pipeData.x,
      y: pipeData.y,
      width: 80,
      height: 80,
      id: "pipe-" + index,
    });
  });
}

// Helper functions
function updateElementPos(element, x, y) { // Moves a DOM element to match the x/y postion
  element.style.left = x + "px";
  element.style.top = y + "px";
}

// this creates a div
function createElement(type, className, styles = {}) {
  const element = document.createElement("div");
  element.className = className;
  Object.assign(element.style, styles);
  return element;
}

// this was used to clear all the keys as when being redirect to websites movement would get stuck
function resetInputState() {
  playState.keys = {};
  hero.velX = 0;
}

// win or lose screen
function showGameOver(won) {
  playState.gamePlaying = false;
  document.getElementById("game-over-title").textContent = won
    ? "Congratulations You won"
    : "Game over";
  document.getElementById("final-score").textContent = playState.score;
  document.getElementById("game-over").style.display = "block";
}

// this remoeves everything from the screen even though it is only one level I couldn't get the game to work without it
function clearStage() {
  Object.values(gameObjects)
    .flat()
    .forEach((obj) => {
      if (obj.element && obj.element.parentNode) {
        obj.element.remove();
      }
    });


    // Resets object arrays
  gameObjects = {
    platforms: [],
    enemies: [],
    coins: [],
    surpriseBlocks: [],
    pipes: [],
  };
}

function highlightContactLink(contactId) {
  if (!contactId) return;
  const el = document.querySelector(`.contact-link[data-id="${contactId}"]`);
  if (!el) return;

  el.classList.add("hit-from-game");
  setTimeout(() => {
    el.classList.remove("hit-from-game");
  }, 1000);
}

// Input handling
document.addEventListener("keydown", (e) => {
  playState.keys[e.code] = true;

  // this was a necessary part of the code, as I need to make sure the arrow and space keys wouldn't scroll the page when the game was playing
  if (!waitingToStart &&
    (
    e.code === "Space" ||
    e.code === "ArrowUp" ||
    e.code === "ArrowDown" ||
    e.code === "ArrowLeft" ||
    e.code === "ArrowRight"
    )
  ) {
    e.preventDefault();
  }

  // Starts game
  if (waitingToStart && e.code === "Space") {
    startGame();
  }
});

document.addEventListener("keyup", (e) => {
  playState.keys[e.code] = false;
});

// hides the start screen an starts game
function startGame() {
  waitingToStart = false;
  document.getElementById("game-start").style.display = "none";
}

document.getElementById("start-button").addEventListener("click", startGame);
document.getElementById("game-area").addEventListener("click", () => {
  if (waitingToStart) startGame();
});

// Game loop
function Loop() {
  if (waitingToStart) {
    requestAnimationFrame(Loop);
    return;
  }

  if (!playState.gamePlaying) return;

  update();
  requestAnimationFrame(Loop);
}

// Main update logic
function update() { // moves players, enemies, checks collisions and updates the score
  const prevX = hero.x;
  const prevY = hero.y;
  const prevBottom = prevY + hero.height;
  const prevTop = prevY;

  // left and riught
  if (playState.keys["ArrowLeft"] || playState.keys["KeyA"]) {
    hero.velX = -MOVE_SPEED;
  } else if (playState.keys["ArrowRight"] || playState.keys["KeyD"]) {
    hero.velX = MOVE_SPEED;
  } else {
    hero.velX *= 0.8;
  }

  // jump
  if (playState.keys["Space"] && hero.onBlock) {
    hero.velY = JUMP_POWER;
    hero.onBlock = false;
  }

  // Gravity
  if (!hero.onBlock) {
    hero.velY += PHYSICS_GRAVITY;
  }

  // Moves player
  hero.x += hero.velX;
  hero.y += hero.velY;

// bounces mario off the edge of the screen
if (hero.x <= 0) {
  hero.x = 0;         
  hero.velX *= -1;   
}

if (hero.x + hero.width >= 800) {
  hero.x = 800 - hero.width;
  hero.velX *= -1;
}


  // Platform collision
  hero.onBlock = false;
for (let platform of gameObjects.platforms) {
  if (isTouching(hero, platform)) {
    if (hero.velY > 0 && prevBottom <= platform.y) { // this made it so you can only land on platfroms from above as I had an issue originally where you could land from the side
      hero.y = platform.y - hero.height;
      hero.velY = 0;
      hero.onBlock = true;
    }
  }
}

  // Pipe collision from top
for (let pipe of gameObjects.pipes) {
  if (isTouching(hero, pipe)) {
    if (hero.velY > 0 && prevBottom <= pipe.y) {
      hero.y = pipe.y - hero.height;
      hero.velY = 0;
      hero.onBlock = true;
    }
  }
// Enemy movement and collisions
for (let enemy of gameObjects.enemies) {
  if (!enemy.alive) continue;

  enemy.x += enemy.speed * enemy.direction;

  let heroOnPlatform = false;
  for (let platform of gameObjects.platforms) {
    if (
      enemy.x + enemy.width > platform.x &&
      enemy.x < platform.x + platform.width &&
      enemy.y + enemy.height >= platform.y - 5 &&
      enemy.y + enemy.height <= platform.y + 5
    ) {
      heroonPlatform = true;
      break;
    }
  }

if (!heroonPlatform) {enemy.direction *= -1;
}
// bounces enemies off the edge of the screen
if (enemy.x <= 0) {enemy.direction = 1;
}

if (enemy.x + enemy.width >= 800) {enemy.direction = -1;
}

  updateElementPos(enemy.element, enemy.x, enemy.y);

  // Player-enemy collision
  if (isTouching(hero, enemy)) {
    const stomped =
      hero.velY > 0 &&          // moving down
      prevBottom <= enemy.y;           // was clearly above last frame

    if (stomped) {
      // Jump on enemy
      enemy.alive = false;
      enemy.element.remove();
      hero.velY = JUMP_POWER * 0.7;
      playState.score += 100;
    } else {
      // Any other collision = damage
      Die();
    }
  }
}}

  // Coin collection
  for (let coin of gameObjects.coins) {
    if (!coin.collected && isTouching(hero, coin)) {
      coin.collected = true;
      coin.element.remove();
      playState.score += 50;
    }
  }

// surprise blocks (linkedin, behance, github)
  for (let block of gameObjects.surpriseBlocks) {
  const isHitFromBelow =
  !block.hit &&
  isTouching(hero, block) &&
  hero.velY < 0 &&
  prevTop >= block.y + block.height;

    if (isHitFromBelow) {
      block.hit = true;
      block.element.classList.add("hit");

// opens links
if (LINK_BLOCKS[block.type]) {
  const info = LINK_BLOCKS[block.type];

  // Clears stuck keys before opening a new tab
  resetInputState();

  // Highlights the DOM contact link
  highlightContactLink(info.contactId);

  if (info.url) {
    window.open(info.url, "_blank");
  }
  
  playState.score += 150;
}
  }
    }

  // Enter pipe to win
  for (let pipe of gameObjects.pipes) {
    if (
      hero.onBlock &&
      hero.x + hero.width > pipe.x &&
      hero.x < pipe.x + pipe.width &&
      Math.abs(hero.y + hero.height - pipe.y) < 5 &&
      playState.keys["ArrowDown"]
    ) {
      showGameOver(true);
    }
  }

  // Fall through platforms makes you die
  if (hero.y > 540) {
    Die();
  }

  updateElementPos(hero.element, hero.x, hero.y);

  // Updates score on screen
  document.getElementById("score").textContent = playState.score;
}

// Collision checks
function isTouching(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// restart management
function Die() {
  playState.lives--;
  if (playState.lives <= 0) {
    showGameOver(false);
  }
}

function restartStage() {
  // Resets game
  playState.score = 0;
  playState.level = 1;
  playState.lives = 5;
  playState.gamePlaying = true;
  playState.keys = {};

  // Go back to press start state
  waitingToStart = true;
  resetInputState();

  // Hides Game Over overlay and shows start screen again
  document.getElementById("game-over").style.display = "none";
  document.getElementById("game-start").style.display = "block";

  loadStage(0);
  Loop();
}

document
  .getElementById("restart-button")
  .addEventListener("click", restartStage);

// Load level data from JSON, then start the game
window.addEventListener("DOMContentLoaded", () => {
  fetch("levels.json") 
    .then((res) => {
      if (!res.ok) {
        throw new Error("HTTP error " + res.status);
      }
      return res.json();
    })
    .then((data) => {
      levels = data.levels;
      console.log("Levels loaded:", levels);
      bootGame();
    })
    .catch((err) => {
      console.error("Error loading levels.json:", err);
    });
});
