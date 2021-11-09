import { Board } from "./board.js";
import { SnakeBlock, SnakeHead } from "./snake-block.js";


customElements.define("board-div", Board, {"extends": "div"});
customElements.define("snake-block", SnakeBlock, {"extends": "div"});
customElements.define("snake-head", SnakeHead, {"extends": "div"})