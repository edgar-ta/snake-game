/**
 * Model of a proper timeout object
 */
class Alarm {

    /**
     * Marker used to keep track of the pauses made to the alarm
     * @type {number}
     */
    timemarker;

    /**
     * Number of miliseconds the alarm will take to execute
     * (since it starts til it ends)
     * @type {number}
     */
    timeout;

    /**
     * Total number of miliseconds passed since the alarm started
     * 
     * ---
     * This property is intended to help keep track of the pauses
     * made to the alarm. It doesn't update continously, but whenever
     * `pause` is called
     * @type {number}
     */
    totalEllapsed;

    /**
     * If the alarm is paused
     * @type {boolean}
     */
    isPaused;

    /**
     * If the alarm has already finished
     * @type {boolean}
     */
    isConsumed;

    /**
     * Index of the alarm's timeout
     * @type {number}
     */
    index;

    /**
     * Callback the alarm will execute
     * @type {callback}
     */
    callback;

    /**
     * Creates the alarm
     * @constructor Creates the alarm
     * @param {callback} callback Callback the alarm will execute
     * @param {number} timeout Miliseconds the alarm will take to execute
     * @param {boolean} toStart Whether the alarm should start running when created (true by default)
     */
    constructor(callback, timeout, toStart = true) {
        this.callback = callback;
        this.timeout = timeout;
        this.isPaused = false;
        this.isConsumed = false;
        this.totalEllapsed = 0;
        if (toStart) this.start();
    }

    /**
     * Makes the alarm start
     * 
     * ---
     * Updates the marker to now, sets a timeout that will 
     * execute the alarm's callback and end it in `timeout` miliseconds
     */
    start() {
        this.timemarker = Date.now();
        this.index = setTimeout(() => {
            this.callback();
            this.end();
        }, this.timeout);
    }

    /**
     * Ends the alarm
     * 
     * ---
     * Sets the `isConsumed` and `isPaused` variables
     * to `true` and `false`, respectively, and removes
     * its timeout, setting its index to `NEGATIVE_INFINITY`
     */
    end() {
        this.isConsumed = true;
        this.isPaused = false;
        clearTimeout(this.index);
        this.index = Number.NEGATIVE_INFINITY;
    }

    /**
     * Gets the time that the alarm has been running
     * 
     * ---
     * Notice how it doesn't just get the time passed
     * since the alarm started, but the time
     * passed while the alarm hasn't been paused.
     * @returns {number} Time ellapsed for the alarm
     */
    getEllapsedTime() {
        return this.totalEllapsed + (this.isPaused? 0: Date.now() - this.timemarker);
    }

    /**
     * Gets the time that the alarm will need to execute
     * 
     * ---
     * The calculation is pretty simple; it only calls `getEllapsedTime`
     * and substracts it from the total timeout of the alarm
     * @returns {number} Time left for the alarm to execute (end)
     */
    getLeftTime() {
        return this.timeout - this.getEllapsedTime();
    }

    /**
     * Pauses the alarm
     * 
     * ---
     * If the alarm is consumed, it does nothing.
     * 
     * Clears its timeout and updates `totalEllapsed`
     * to save the time passed since the last time it
     * started running (the timemarker) to now
     */
    pause() {
        if (this.isConsumed) return;
        this.totalEllapsed += Date.now() - this.timemarker;
        clearTimeout(this.index);
        // debugger
        // this.totalEllapsed = getEllapsedTime();
        this.index = Number.NEGATIVE_INFINITY;
        this.isPaused = true;
    }

    /**
     * Unpauses the alarm (makes it run again)
     * 
     * ---
     * Updates the timemarker (to keep track of next possible pauses) 
     * and sets the timeout again, with the time left
     */
    resume() {
        // debugger
        this.timemarker = Date.now();
        this.index = setTimeout(() => {
            this.callback();
            this.end()
        }, this.timeout - this.totalEllapsed /* this.getLeftTime() */);
        this.isPaused = false;
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
     * @param {number} timeout timeout the snake will have to capture the apple (miliseconds)
     */
    constructor(x = 1, y = 1, maxPoints = 10, timeout = 1000) {
        super();
        this.setX(x);
        this.setY(y);
        this.setAttribute("class", "apple")
        this.maxPoints = maxPoints;
        this.alarm = new Alarm(() => this.remove(), timeout);
        this.innerHTML = `
        <svg viewBox="-8 -8 216 216" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="100" fill="red" stroke="orange" stroke-width="16" />
        </svg>
        `;
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
     * Whenever the snake captures this apple; finishes it and
     * returns the correspondant points for the time taken
     * to capture
     * @return {number} Correspondant points for the capture
     */
    capture() {
        new Audio("../res/sounds/snake-bite.mp3").play();
        this.end();
        return this.maxPoints * (this.alarm.getLeftTime() / this.alarm.timeout);
    }

    /**
     * Checks if the alarm of the apple has already been consumed
     * @returns {boolean} If it has already been consumed
     */
    isConsumed() {
        return this.alarm.isConsumed;
    }

    /**
     * Removes the apple and ends its alarm
     */
    end() {
        this.remove();
        this.alarm.end();
    }
}

export { Alarm, Apple }