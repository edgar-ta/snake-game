/**
 * Model of a proper timeout object
 */
class Alarm {
    /**
     * The date the alarm was set to begin
     * @type {Date}
     */
    start;

    /**
     * The date the alarm finished
     * @type {Date}
     */
    end;

    /**
     * Number of miliseconds the alarm will take to execute
     * (since its begins til finishes)
     * @type {number}
     */
    timespan;

    /**
     * Number of miliseconds passed since the alarm began
     * 
     * ---
     * This property is intended to be private since it doesn't
     * update continuely, but whenever `update()` is called.
     * 
     * To get the currently ellapsed time when called, use the
     * `getEllapsedTime()` function (which updates and returns this property)
     * @type {number}
     */
    ellapsed;

    /**
     * Number of miliseconds to pass til the alarm finishes
     * 
     * ---
     * This property is intended to be private since it doesn't
     * update continuely, but whenever `update()` is called.
     * 
     * To get the currently left time when called, use the
     * `getLeftTime()` function (which updates and returns this property)
     * @type {number}
     */
    left;

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
     * @param {number} timespan Miliseconds the alarm will take to execute
     * @param {boolean} toBegin Whether the alarm should begin when created (true by default)
     */
    constructor(callback, timespan, toBegin = true) {
        this.callback = callback;
        this.timespan = timespan;
        this.start = Date.now();
        this.isPaused = false;
        this.isConsumed = false;
        if (toBegin) this.begin();
    }

    /**
     * Makes the alarm start
     * 
     * ---
     * Sets a timeout that will execute the alarm's callback
     * and finish it in `timespan` miliseconds
     */
    begin() {
        this.index = setTimeout(() => {
            this.callback();
            this.finish();
        }, this.timespan);
    }

    /**
     * Finishes the alarm
     * 
     * ---
     * Sets the end date of the alarm, the
     * `isConsumed` and `isPaused` variables, removes
     * its timeout and sets its index to -1
     */
    finish() {
        this.end = Date.now();
        this.isConsumed = true;
        this.isPaused = false;
        clearTimeout(this.index);
        this.index = -1;
    }

    /**
     * Updates the left and ellapsed variables
     */
    update() {
        this.ellapsed = this.start - Date.now();
        this.left = this.timespan - this.ellapsed;
    }

    /**
     * Toggles the alarm between paused and unpaused (running)
     * 
     * ---
     * If the alarm is consumed, then it does nothing
     */
    togglePause() {
        if (this.isConsumed) return;
        if (this.isPaused) 
            this.index = setTimeout(() => {
                this.callback();
                this.finish();
            }, this.left);
        else {
            // save the time left when the alarm is paused
            // to use it when it is unpaused
            this.update();
            clearTimeout(this.index);
        }
        this.isPaused = !this.isPaused;
    }

    /**
     * Gets the ellapsed time of the alarm
     * 
     * ---
     * Updates the variable and then returns it
     * @returns {number} Currently ellapsed time
     */
    getEllapsedTime() {
        this.update();
        return this.ellapsed;
    }

    /**
     * Gets the left time of the alarm
     * 
     * ---
     * Updates the variable and then returns it
     * @returns {number} Currently left time
     */
    getLeftTime() {
        this.update();
        return this.left;
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
    constructor(x = 1, y = 1, maxPoints = 10, timespan = 1000) {
        super();
        this.setX(x);
        this.setY(y);
        this.maxPoints = maxPoints;
        this.alarm = new Alarm(() => this.remove(), timespan);
        this.setAttribute("class", "apple")
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
        let audio = new Audio("../res/other/snake-bite.mp3");
        audio.play();
        this.finish();
        return this.maxPoints * (this.alarm.getLeftTime() / this.alarm.timespan);
    }

    /**
     * Checks if the alarm of the apple has already been consumed
     * @returns {boolean} If it has already been consumed
     */
    isConsumed() {
        return this.alarm.isConsumed;
    }

    /**
     * Toggles pause on the apple's alarm
     */
    togglePause() {
        this.alarm.togglePause();
    }

    /**
     * Removes the apple and finishes its alarm
     */
    finish() {
        this.remove();
        this.alarm.finish();
    }
}

export { Alarm, Apple }