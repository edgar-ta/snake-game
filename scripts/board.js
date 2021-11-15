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
    positions = [];

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
                this.positions.push([i, j]);
            }
        }
    }

    /**
     * Takes the passed positions and returns the positions
     * of the board that are not any of those
     * @param {number[][]} toSubstract Array of positions to compare to
     * @returns {number[][]} Array of the positions of the board, except those in the positions passed
     */
    substractPositions(toSubstract) {
        let res = [...this.positions];
        for (let sPos of toSubstract) {
            let posIndex = res.findIndex(bPos => {
                let [pX, pY] = bPos;
                let [sX, sY] = sPos;
                return pX == sX && pY == sY;
            });
            if (posIndex > -1) 
            res.splice(posIndex, 1);
        }
        return res;
    }
}