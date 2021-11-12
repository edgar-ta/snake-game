import { Board } from "./board.js";
import { SnakeBlock, SnakeHead } from "./snake-block.js";
import { Snake } from "./snake.js";

customElements.define("board-div", Board, {"extends": "div"});
customElements.define("snake-block", SnakeBlock, {"extends": "div"});
customElements.define("snake-head", SnakeHead, {"extends": "div"});

/**
 * @type {Board}
 */
let board = document.querySelector("#board");

/**
 * @type {HTMLButtonElement}
 */
let startBtn = document.querySelector("#startBtn");

/**
 * @type {number}
 */
let gameIndex;

function startGame() {
    let snake = new Snake(new SnakeHead(5, 5, SnakeBlock.DOWN), new SnakeBlock(5, 4), new SnakeBlock(5, 3));
    for (let block of snake.blocks)
    board.appendChild(block);
    board.appendChild(snake.head);
    startBtn.remove();
    // console.log("Hello world!");
    gameIndex = setInterval(() => {
        // debugger
        snake.advance();
        snake.blocks.forEach(block => console.log(`x: ${block.x}, y: ${block.y}`));
    }, 1000);
}

startBtn.addEventListener("click", startGame);