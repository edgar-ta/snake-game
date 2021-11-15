import { Board } from "./board.js";
import { SnakeBlock, SnakeHead } from "./snake-block.js";
import { Snake } from "./snake.js";
import { Apple } from "./apple.js";

customElements.define("board-div", Board, { "extends": "div" });
customElements.define("snake-block", SnakeBlock, { "extends": "div" });
customElements.define("snake-head", SnakeHead, { "extends": "div" });
customElements.define("apple-div", Apple, { "extends": "div" });

/**
 * Gets a random element from an array
 * @param {any[]} arr Array to get an element from
 * @returns {any} Random element
 */
const getRandomElement = (arr) => {
    let randIndex = ~~(Math.random() * arr.length);
    return arr[randIndex];
}

/**
 * Rounds a number to the nearest multiple of a half
 * @param {number} num Some numeric value
 * @returns The value, rounded so that `{x}` is either 0.5 or 0
 */
const roundToHalfs = (num) => Math.round(2 * num) / 2;

/**
 * Number of frames per second of the game animation
 * @type {number}
 */
let frames = 2;



/**
 * Snake that the player will use to play
 * @type {Snake}
 */
let snake;

/**
 * Board in which the snake is going to be contained
 * @type {Board}
 */
let board = document.querySelector("#board");

/**
 * Apple the snake will have to capture
 * @type {Apple}
 */
let apple;



/**
 * If the current game is running
 * @type {boolean}
 */
let isRunning = false;

/**
 * Points of the current game
 * @type {number}
 */
let points = 0;

/**
 * Index of the interval that makes the snake move
 */
let gameIndex = -1;

/**
 * Initializes the values of the snake and apple and
 * makes the game run
 * @todo Get custom SnakeBlocks through menu
 */
function onStart() {
    snake = generateSnake();
    apple = generateApple();
    gameIndex = setInterval(advance, 1000 / frames);
    isRunning = true;

    // this is getting kinda tricky, I should create another
    // function to help set everything in place
    document.querySelector("#startBtn").remove();

    let 
    pauseBtn = document.querySelector("#pauseBtn"), 
    restartBtn = document.querySelector("#restartBtn");

    pauseBtn.removeAttribute("disabled");
    restartBtn.removeAttribute("disabled");

    pauseBtn.classList.remove("control-btn--disabled");
    restartBtn.classList.remove("control-btn--disabled");
}

/**
 * If the game is running, then clear the interval
 * that makes the snake advance; if not, re-create
 * that interval
 */
function togglePause() {
    if (isRunning) {
        clearInterval(gameIndex);
        isRunning = false;
    } else {
        gameIndex = setInterval(advance, 1000 / frames);
        isRunning = true;
    }
}

/**
 * Lets the player know that they lost and asks for another round
 * @fire When the user loses (the snake bites itself or is out of the board)
 * @todo Actually respond to the user's answer
 */
function onLose() {
    alert("Better luck for the next one; do you want to play again?");
}

/**
 * Captures the apple; updates the points
 * and adds to the snake a new block
 * @fire When the head of the snake gets to the same position than the apple
 */
function onAppleCapture() {
    points += apple.capture();
    updatePoints();
    apple = generateApple();

    let block = snake.newBlock();
    board.appendChild(block);
    snake.blocks.push(block);
}

/**
 * Disables the apple and generates a new
 * @fire When the apple has exceeded the time to be consumed
 */
function onAppleMissed() {
    apple.disable();
    apple = generateApple();
}

/**
 * Changes the direction of the snake when the user presses a key.
 * 
 * ---
 * It responds to w, a, s, d as up, left, down, right, respectively
 * @param {KeyboardEven} e Event that triggers the function
 */
function onChangeDirection(e) {
    switch (e.key) {
        case "w": snake.head.setDirection(SnakeBlock.UP); break;
        case "a": snake.head.setDirection(SnakeBlock.LEFT); break;
        case "s": snake.head.setDirection(SnakeBlock.DOWN); break;
        case "d": snake.head.setDirection(SnakeBlock.RIGHT);
    }
}

/**
 * Takes the some random free positions from the board and makes an
 * apple from those.
 * 
 * Also, appends the apple to the board.
 * @todo Get custom apple by menu options
 * @returns {Apple} Apple in free position of the board
 */
function generateApple() {
    let [x, y] = getRandomElement(board.substractPositions(snake.getPositions()));
    let apple = new Apple(x, y, 200, 4 * 1000 / frames);
    board.appendChild(apple);
    return apple;
}

/**
 * Generates a snake with automatically generated blocks
 * 
 * ---
 * The snake is in vertical position and goes down.
 * If the number of blocks is too large that it doesn't fit
 * the board, then just stops adding them.
 * 
 * Also, it appends all snake blocks (including head) into the
 * board
 * @param {number} initialX Initial coordinate of the snake's head
 * @param {number} initialY Initial coordinate of the snake's head
 * @param {number} initialN Initial number of blocks (besides the head) the snake should have
 * @returns {Snake} Snake of the characteristics given
 */
function generateSnake(initialX = 4, initialY = 4, initialN = 2) {
    let snake = new Snake(new SnakeHead(initialX, initialY, SnakeBlock.DOWN));
    for (let i = 1; i <= initialN; i++) {
        if (initialY - i < 1) break;
        snake.blocks.push(new SnakeBlock(initialX, initialY - i, SnakeBlock.DOWN));
    }
    snake.execOnAll(block => board.appendChild(block));
    return snake;
}

/**
 * Checks if the coordinates of the snake are
 * lesser than zero or greater than the dimension
 * of the board
 * @returns {boolean} If the snake is not on the board
 */
function isOutOfBoundaries() {
    let head = snake.head;
    return head.x < 0 || head.x > board.n || head.y < 0 || head.y > board.n;
}

/**
 * Lets the user know how many points they've got so far
 */
function updatePoints() {
    document.querySelector("#points").textContent = roundToHalfs(points);
    // 1 extra for the head
    document.querySelector("#blocksLong").textContent = snake.blocks.length + 1;
}

/**
 * Makes the snake move; checks for any events that could update
 * the points or make the game end
 */
function advance() {
    snake.advance();
    if (snake.isBitingItself() || isOutOfBoundaries()) onLose();
    if (apple.isConsumed()) onAppleMissed();
    if (snake.head.sameAs(apple)) onAppleCapture();
}

document.querySelector("#startBtn").addEventListener("click", onStart);
document.querySelector("#pauseBtn").addEventListener("click", togglePause);
document.addEventListener("keydown", onChangeDirection);