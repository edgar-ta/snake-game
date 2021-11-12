/**
 * Class that emulates the behavior of the parts of the snake in the game.
 * 
 * In order for the methods of positioning to work, the blocks should be
 * contained in a div whose display is grid
 */
class SnakeBlock extends HTMLDivElement {
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

    /**
     * Passes the values and sets its styling to work
     * within a grid div
     * @constructor Simple constructor
     * @param {number} initialX Initial coordinate of the block
     * @param {number} initialY Initial coordinate of the block
     * @param {number} initialDirection Initial direction of the block
     */
    constructor(initialX, initialY, initialDirection) {
        super();
        this.setX(initialX);
        this.setY(initialY);
        this.setDirection(initialDirection);
        this.setAttribute("class", "snake-block");
    }

    /**
     * Checks if the block has an attribute, if it does,
     * returns it, if not, returns the fallback
     * @param {string} qualifiedName Name of the attribute to get
     * @param {string} fallbackValue Fallback value of that attribute
     * @returns {string} Either the attribute or the fallback
     */
    getFallbackAttribute(qualifiedName, fallbackValue) {
        if (this.hasAttribute(qualifiedName))
        return this.getAttribute(qualifiedName);
        return fallbackValue;
    }

    /**
     * Sets a new x in the properties of the snake block
     * and in it styling
     * @param {number} newX Self-explanatory
     */
    setX(newX) {
        this.x = newX;
        this.style.gridColumn = `${newX}`;
    }

    /**
     * Sets a new y in the properties of the snake block
     * and in its styling
     * @param {number} newY Self-explanatory
     */
    setY(newY) {
        this.y = newY;
        this.style.gridRow = `${newY}`;
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

    /**
     * Moves to the position (x and y coordinates) of another block
     * @param {SnakeBlock} block Block to get position
     */
    moveToBlock(block) {
        this.setX(block.x);
        this.setY(block.y);
    }

    /**
     * Checks if a block has the same position (x and y) that this
     * @param {SnakeBlock} block Block to check
     * @return {boolean} If both blocks have the same coordinates
     */
    sameAs(block) {
        return this.x == block.x && this.y == block.y;
    }
}

/**
 * Class that emulates the behavior of the head of the snake.
 * 
 * It inherits from snake block and it adds the ability to advance
 * (set its own x and y according to its direction)
 */
class SnakeHead extends SnakeBlock {
    /**
     * Passes the values and sets its class
     * @constructor Self-explanatory
     * @param {number} initialX Initial coordinate of the head
     * @param {number} initialY Initial coordinate of the head
     * @param {number} initialDirection Self-explanatory
     */
    constructor(initialX, initialY, initialDirection) {
        super(initialX, initialY, initialDirection);
        this.setAttribute("class", "snake-head");
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

export { SnakeBlock, SnakeHead }