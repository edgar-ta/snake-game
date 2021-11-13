/**
 * Model of a proper timeout object that fires once
 */
class Alarm {
    /**
     * Number of miliseconds the function of the alarm
     * is going to take to execute
     * @type {number}
     */
    timeout;

    /**
     * Function (callback) the alarm will execute
     */
    fun;

    /**
     * Date the alarm was set
     * @type {Date}
     */
    start;

    /**
     * Date the alarm will have to end
     * @type {Date}
     */
    end;

    /**
     * Index the alarm occupies among the timeouts
     * generated by `setTimeout`
     * @type {number}
     */
    index;

    /**
     * If the alarm has already been executed
     * @type {boolean}
     */
    consumed;

    /**
     * Simple constructor
     * @constructor
     * @param {callback} fun Function the alarm will execute
     * @param {number} timeout Time (from now; in ms) it will take for the alarm to fire
     * @param {boolean} set Whether or not to start running the alarm when created (true by default)
     */
    constructor(fun, timeout, set=true) {
        this.fun = fun;
        this.timeout = timeout;
        this.consumed = false;

        let now = Date.now();

        this.start = now;
        this.end = now + timeout;
        if (set) this.set();
    }

    /**
     * Starts running the alarm.
     * 
     * After the timeout passes, it will execute its function
     * and clear itself
     */
    set() {
        this.index = setTimeout(() => {
            this.fun();
            this.clear();
        }, this.timeout);
    }

    /**
     * Clears itself from the list of timeouts
     */
    clear() {
        clearTimeout(this.index);
        this.consumed = true;
    }

    /**
     * Gets the time passed since the alarm was set (miliseconds)
     * @returns {number} Time passed between now and the start of the alarm
     */
    getElapsedTime() {
        return Date.now() - this.start;
    }

    /**
     * Gets the remaining time for the alarm to be fired (miliseconds)
     * @returns {number} Time difference between now and the end of the alarm
     */
    getLeftTime() {
        return this.end - Date.now();
    }
}

class Apple extends HTMLDivElement {
    /**
     * X position of an apple in a board
     * @type {number}
     */
    x;

    /**
     * Y position of an apple in a board
     * @type {number}
     */
    y;

    /**
     * Maximum points a snake can get for capturing
     * this apple
     * @type {number}
     */
    maxPoints;

    /**
     * Alarm that will help get the points of the
     * snake for capturing the apple
     * @type {Alarm}
     */
    alarm;

    /**
     * Simple constructor
     * @constructor Simple constructor
     * @param {number} x X coordinate of the apple
     * @param {number} y Y coordinate of the apple
     * @param {number} maxPoints Max amount of points the snake will get for capturing the apple
     * @param {number} timespan Timespan the snake will have to capture the apple (miliseconds)
     */
    constructor(x=1, y=1, maxPoints=10, timespan=1000) {
        super();
        this.setX(x);
        this.setY(y);
        this.maxPoints = maxPoints;
        this.alarm = new Alarm(() => this.disable(), timespan);
        this.setAttribute("class", "apple")
    }

    /**
     * Sets the position in the class and styling
     * of the apple
     * @param {number} newX X coordinate of the apple
     */
    setX(newX) {
        this.x = newX;
        this.style.gridColumn = `${newX}`;
    }

    /**
     * Sets the position in the class and styling
     * of the apple
     * @param {number} newY Y coordinate of the apple
     */
    setY(newY) {
        this.y = newY;
        this.style.gridRow = `${newY}`;
    }

    /**
     * Whenever the snake captures this apple; disables it and
     * returns the correspondant points for the time taken
     * to capture
     * @return {number} Correspondant points for the capture
     */
    capture() {
        this.disable();
        return this.maxPoints * (1 - this.alarm.getElapsedTime() / this.alarm.timeout);
    }

    /**
     * Checks if the alarm of the apple has already been consumed
     * @returns {boolean} If it has already been consumed
     */
    isConsumed() {
        return this.alarm.consumed;
    }

    /**
     * Disables the apple; removes it from the DOM and clears its alarm
     */
    disable() {
        this.remove();
    }
}

export { Alarm, Apple }