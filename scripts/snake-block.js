export class SnakeBlock extends HTMLDivElement {
    /**
     * Integer that refers to the x the snake block occupies
     * in a board (1-indexed)
     * @type {number}
     */
    x;

    /**
     * Integer that refers to the y the snake block occupies
     * in a board (1-indexed)
     * @type {number}
     */
    y;

    /**
     * One of the four satic directions (see below) that refers to where
     * is going the snake block
     */
    direction;

    static UP = 0;
    static RIGHT = 1;
    static DOWN = 2;
    static LEFT = 3;

    constructor() {
        super();
        this.x = Number.parseInt(this.getAttribute("initial-x")) ?? 1;
        this.y = Number.parseInt(this.getAttribute("initial-y")) ?? 1;
        this.direction = Number.parseInt(this.getAttribute("direction")) ?? DOWN;
    }

    /**
     * Sets a new x in the properties of the snake block
     * and in it styling
     * @param {number} newX Self-explanatory
     */
    setX(newX) {
        this.x = newX;
        this.style.gridColumn = `${x}`;
    }

    /**
     * Sets a new y in the properties of the snake block
     * and in its styling
     * @param {number} newY Self-explanatory
     */
    setY(newY) {
        this.y = newY;
        this.style.gridRow = `${y}`;
    }

    /**
     * Sets a new direction for the snake block.
     * 
     * It is also intended to change how the snake block
     * looks, but that will come in the future
     * @param {number} newDirection Self-explanatory
     */
    setDirection(newDirection) {
        this.direction = newDirection;
    }
}

export class SnakeHead extends SnakeBlock {
    constructor() {
        super();
    }

    /**
     * Advances (changes its position) the snake head depending
     * on its direction
     */
    advance() {
        switch (this.direction) {
            case SnakeBlock.UP:
                this.setY(this.y - 1);
                break;
            
            case SnakeBlock.RIGHT:
                this.setX(this.x + 1);
                break;
            
            case SnakeBlock.DOWN:
                this.setY(this.y + 1);
                break;
            
            default:
                this.setX(this.x - 1);
        }
    }
}