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
        this.innerHTML = `
        <svg viewBox="-8 -8 316 316" xmlns="http://www.w3.org/2000/svg">
            <path d="
            M 0 100
            v 125
            q 0 25 50 50
            q 50 25 75 25
            h 50
            q 25 0 75 -25
            q 50 -25 50 -50
            v -150
            q 0 -25 -50 -50
            q -50 -25 -75 -25
            h -50
            q -25 0 -75 25
            q -50 25 -50 50
            z
            " fill="green" stroke="orange" stroke-width="16" stroke-linejoin="round" />
        </svg>
        `;
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
        // SVGS are facing left, that's why I need to calculate respect to that direction
        this.style.transform = `rotate(${(newDirection - SnakeBlock.LEFT) * 90}deg)`;
    }

    /**
     * Moves to the position (x and y coordinates) of another block
     * @param {SnakeBlock} block Block to get position
     */
    moveToBlock(block) {
        if (block.x != this.x) this.setX(block.x);
        if (block.y != this.y) this.setY(block.y);
        this.setDirection(block.direction);
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
     * Variable that will help set the direction of the head,
     * making sure it only sets it every time it advances
     * avoiding the ability to rotate the head and bite itself
     * @type {number}
     */
    superDirection;

    /**
     * Passes the values and sets its class
     * @constructor Self-explanatory
     * @param {number} initialX Initial coordinate of the head
     * @param {number} initialY Initial coordinate of the head
     * @param {number} initialDirection Self-explanatory
     */
    constructor(initialX, initialY, initialDirection) {
        super(initialX, initialY, initialDirection);
        this.superDirection = initialDirection;
        this.setAttribute("class", "snake-head");
        this.innerHTML = `
        <svg viewBox="-8 -8 316 316" xmlns="http://www.w3.org/2000/svg">
            <path d="
            M 250 0
            a 50 50 0 0 1 50 50
            v 200
            a 50 50 0 0 1 -50 50
            q -50 0 -100 -25
            l -125 -62.5
            q -25 -12.5 -25 -37.5
            v -50
            q 0 -25 25 -37.5
            l 125 -62.5
            q 50 -25 100 -25
            z
            " fill="green" stroke="orange" stroke-width="16" stroke-linejoin="16" />

            <circle cx="25" cy="125" r="12.5"/>
            <circle cx="25" cy="175" r="12.5"/>

            <path d="
            M 150 50
            q -6.25 43.75 -50 50
            q 31.25 -18.75 50 -50
            " />

            <path d="
            M 150 250
            q -6.25 -43.75 -50 -50
            q 31.25 18.75 50 50
            " />
        </svg>
        `;
    }

    /**
     * Advances (changes its position) the snake head depending
     * on its direction
     */
    advance() {
        this.superDirection = this.direction;
        switch (this.superDirection) {
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

    /**
     * If the new direction is valid, then sets the head to it
     * @param {number} newDirection New direction to set the head to
     */
    setDirection(newDirection) {
        if (this.isValidDirection(newDirection))
            super.setDirection(newDirection);
    }

    /**
     * Checks the new direction to set the head to and,
     * if its not the contrary or the same direction,
     * allows it to set it
     * @param {number} direction New direction to set the head
     * @returns {boolean} Whether the snake should change its direction or not
     */
    isValidDirection(direction) {
        return Math.abs(this.superDirection - direction) != 2;
    }
}

export { SnakeBlock, SnakeHead }