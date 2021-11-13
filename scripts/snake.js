import { SnakeHead, SnakeBlock } from "./snake-block.js";

/**
 * Class featuring the salient methods of a snake for the game
 */
export class Snake {

    /**
     * Head of the snake
     * @type {SnakeHead}
     */
    head;

    /**
     * Blocks of the snake (excluding the head)
     * @type {SnakeBlock[]}
     */
    blocks = [];

    /**
     * Simple constructor
     * @constructor Simple constructor
     * @param {SnakeHead} head Head of the snake
     * @param  {...SnakeBlock} blocks Initial blocks of the array
     */
    constructor(head, ...blocks) {
        this.head = head;
        this.blocks = blocks;
    }

    /**
     * Makes the snake advance; the head advances and the remaining blocks
     * take the position of the one that comes before than they.
     * 
     * It starts from the end of the array to get the desired behavior (remember if it starts
     * from the beginning, all blocks end up with the same position)
     */
    advance() {
        for (let i = this.blocks.length - 1; i > 0; i--) {
            let currentBlock = this.blocks[i];
            let nextBlock = this.blocks[i - 1];
            currentBlock.moveToBlock(nextBlock);
        }
        this.blocks[0].moveToBlock(this.head);
        this.head.advance();
    }

    /**
     * Checks if the head has the same position as any other block
     * 
     * At the very beginning, I wanted to make it so that it checks
     * that all blocks have different positions.
     * I will let that code commented, since I have already written it
     * @returns {boolean} If the snake is biting itself
     */
    isBitingItself() {
        return this.blocks.some(block => this.head.sameAs(block));
        // let allBlocks = [...this.blocks, this.head];
        // for (let i = 0; i < allBlocks.length; i++) {
        //     let currentBlock = allBlocks[i];
        //     for (let j = i + 1; j<allBlocks.length; j++) {
        //         let nextBlock = allBlocks[j];
        //         if (currentBlock.sameAs(nextBlock)) return true;
        //     }
        // }
        // return false;
    }

    /**
     * Generates a new block and adds it to the snake
     */
    addBlock() {
        let lastBlock = this.blocks[this.blocks.length - 1];
        this.blocks.push(new SnakeBlock(lastBlock.x, lastBlock.y, lastBlock.direction));
    }
}