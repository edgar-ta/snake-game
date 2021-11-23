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
     * Passes the size, sets its correspondant class and `n`
     * @constructor 
     */
    constructor() {
        super();
        this.setAttribute("class", "board");
        // default size
        this.setN(15);
    }
    
    /**
     * Sets the new n dimension of the board
     * 
     * ---
     * Also, removes all blocks from the board, adds n^2 new ones.
     * and, it populates the free positions of the board.
     * 
     * The calculation for the length of the blocks inside the board comes
     * from its original grid; `repeat(10, 7vmin)`.  
     * If there are `n - 1`
     * gaps that, as defined in main.css measure `0.5vmin`, then the
     * length of the gaps is `(n - 1)vmin / 2`; 4.5vmin when n = 10, and the total length of the
     * model board is 10 * 7vmin + 4.5vmin = 74.5vmin.  
     * If we want all boards to measure the same, we can substract the gap length from
     * the total length and then (since there will be `n` blocks in total that will together
     * occupy that length) divide by n.
     * Finally, the expresion ends up being:  
     * blockWidth   = (74.5vmin - (n - 1)vmin / 2) / n  
     *              = (149vmin / 2 - (n - 1)vmin / 2) / n  
     *              = (149vmin - (n - 1)vmin) / (2 * n)  
     *              = (149vmin - nvmin + 1vmin) / (2 * n)  
     *              = `(150vmin - nvmin) / (2 * n)`
     */
    setN(newN) {
        this.n = newN;
        let blockWidth = (150 - this.n) / (2 * this.n);
        this.style.gridTemplate = `repeat(${this.n}, ${blockWidth}vmin) / repeat(${this.n}, ${blockWidth}vmin)`;
        this.replaceChildren();
        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < this.n; j++) {
                let block = document.createElement("div");
                block.setAttribute("class", "board__block");
                block.style.gridRow = `${i+1}`;
                block.style.gridColumn = `${j+1}`;
                this.appendChild(block);
                this.positions.push([i + 1, j + 1]);
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