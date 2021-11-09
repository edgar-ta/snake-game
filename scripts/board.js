export class Board extends HTMLDivElement {
    constructor() {
        super();
        this.setAttribute("class", "board");
        this.populateBoard();
    }

    /**
     * Removes all blocks from the board and adds n^2 new ones
     */
    populateBoard() {
        let n = Number.parseInt(this.getAttribute("n"));
        this.querySelectorAll(".block").forEach(block => block.remove());
        for (let i = 0; i < n ** 2; i++) {
            let block = document.createElement("div");
            block.setAttribute("class", "board__block");
            this.appendChild(block);
        }
    }
}