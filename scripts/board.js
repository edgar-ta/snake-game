/**
 * Class featuring control methods for the positions of a snake
 * 
 * The board being size `n` means that it's `n` blocks (divs) tall
 * and wide, containing then `n`^2 blocks
 */
export class Board extends HTMLDivElement {
    /**
     * The positions that are still not occupied
     * by an entity (block)
     * @type {number[][]}
     */
    freePositions = [];

    /**
     * Dimension of the board
     * @type {number}
     */
    n;


    /**
     * Passes the size, sets its correspondant class and populates the board
     * @constructor 
     * @param {number} n Size of the board
     */
    constructor() {
        super();
        this.n = Number.parseInt(this.getAttribute("n"));
        this.setAttribute("class", "board");
        this.populateBoard();
    }

    /**
     * Checks if the position with the parameters given
     * is in the `freePositions` array
     * @param {number} x Self-explanatory
     * @param {number} y Self-explanatory
     * @returns If the position `[x, y]` is free
     */
    isFree(x, y) {
        return this.freePositions.includes([x, y]);
    }

    /**
     * Deletes the position `[x, y]` from the
     * `freePositions` array.
     * 
     * If the position is not in the array, then 
     * it does nothing
     * @param {number} x Self-explanatory
     * @param {number} y Self-explanatory
     */
    occupyPosition(x, y) {
        let positionIndex = this.freePositions.indexOf([x, y]);
        if (positionIndex < 0) return;
        this.freePositions = [...this.freePositions.slice(0, positionIndex), ...this.freePositions.slice(positionIndex + 1)];
    }

    /**
     * Pushes the position `[x, y]` into the `freePositions` array.
     * 
     * If the position is already there, then it does nothing.
     * @param {number} x Self-explanatory
     * @param {number} y Self-explanatory
     */
    disocuppyPosition(x, y) {
        if (this.isFree(x, y)) return;
        this.freePositions.push([x, y]);
    }

    /**
     * Removes all blocks from the board and adds n^2 new ones.
     * 
     * Also, it populates the free positions of the board
     */
    populateBoard() {
        this.querySelectorAll(".block").forEach(block => block.remove());
        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < this.n; j++) {
                let block = document.createElement("div");
                block.setAttribute("class", "board__block");
                this.appendChild(block);
                this.freePositions.push([i, j]);
            }
        }
    }

    /**
     * Gets a random position from the free ones
     * @returns {number[]} Free random position
     */
    getRandomPosition() {
        let randomIndex = ~~(Math.random() * this.freePositions.length);
        let randomPosition = this.freePositions[randomIndex];
        return randomPosition;
    }
}