export class Board extends HTMLDivElement {
    /**
     * The positions that are still not occupied
     * by an entity (block)
     * @type {number[][]}
     */
    freePositions = [];


    constructor() {
        super();
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
        let positionIndex = this.freePositions.findIndex([x, y]);
        if (positionIndex < 0) return;
        this.freePositions = this.freePositions.slice(0, positionIndex) + this.freePositions.slice(positionIndex + 1);
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
        let n = Number.parseInt(this.getAttribute("n"));
        this.querySelectorAll(".block").forEach(block => block.remove());
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                let block = document.createElement("div");
                block.setAttribute("class", "board__block");
                this.appendChild(block);
                this.freePositions.push([i, j]);
            }
        }
    }
}