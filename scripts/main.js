import { Board } from "./board.js";



customElements.define("board-div", Board, {"extends": "div"});

// /**
//  * removes all divs (called blocks) inside the board
//  * and adds another n^2
//  * @param {number} n measure for the number of blocks to add
//  */
// function addBlocks(n = 10) {
//     let board = document.querySelector(".board");
//     document.querySelectorAll(".board__block").forEach(block => block.remove());
//     for (let i = 0; i< n ** 2; i++) {
//         let block = document.createElement("div");
//         block.setAttribute("class", "board__block");
//         board.appendChild(block);
//     }
// }


// addBlocks();