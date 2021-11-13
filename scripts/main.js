import { Board } from "./board.js";
import { SnakeBlock, SnakeHead } from "./snake-block.js";
import { Snake } from "./snake.js";
import { Apple } from "./apple.js";

customElements.define("board-div", Board, { "extends": "div" });
customElements.define("snake-block", SnakeBlock, { "extends": "div" });
customElements.define("snake-head", SnakeHead, { "extends": "div" });
customElements.define("apple-div", Apple, { "extends": "div" });

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
    snake = new Snake(
        new SnakeHead(4, 4, SnakeBlock.DOWN),
        new SnakeBlock(4, 3, SnakeBlock.DOWN),
        new SnakeBlock(4, 2, SnakeBlock.DOWN)
    );
    apple = generateApple();
    gameIndex = setInterval(advance, 1000 / frames);
    isRunning = true;

    // debugger
    snake.execOnAll((block) => board.appendChild(block));
    snake.execOnAll((block) => board.occupyPosition(block.x, block.y));

    document.querySelector("#startBtn").remove();
    document.querySelector("#pauseBtn").setAttribute("disabled", "false");
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

    // the position of the tail is disoccupied, but since
    // it now contains another block (this block has the position of the tail),
    // it is necessary to re-occupy that position
    board.occupyPosition(block.x, block.y);
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
    let [x, y] = board.getRandomPosition();
    let apple = new Apple(x, y, 200, 4 * 1000 / frames);
    board.appendChild(apple)
    return apple;
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
    document.querySelector("#points").textContent = points;
}

/**
 * Makes the snake move; checks for any events that could update
 * the points or make the game end
 * @todo (Dis)ocuppy positions as the snake advances
 */
function advance() {
    // you only need to manipulate the position of
    // the edges of the snake. since the tail moves
    // to a position already ocuppied, you only need
    // to free its previous position.
    // the head moves to a new position non-ocuppied,
    // so i need to ocuppy it

    let tail = snake.blocks[snake.blocks.length - 1];
    let tailX = tail.x;
    let tailY = tail.y;

    snake.advance();
    board.disocuppyPosition(tailX, tailY);
    board.occupyPosition(snake.head.x, snake.head.y);

    if (snake.isBitingItself() || isOutOfBoundaries()) onLose();
    if (apple.isConsumed()) onAppleMissed();
    if (snake.head.sameAs(apple)) onAppleCapture();
}

document.querySelector("#startBtn").addEventListener("click", onStart);
document.querySelector("#pauseBtn").addEventListener("click", togglePause);
document.addEventListener("keydown", onChangeDirection);