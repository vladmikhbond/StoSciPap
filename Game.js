"use strict";

module.exports = Game

function Game(player1, player2) {
    "use strict";
    this.player1 = player1;
    this.player2 = player2;
    this.steps = [];
    this.lastStep = [undefined, undefined];
}

Game.prototype.isStepReady = function() {
    return this.lastStep[0] && this.lastStep[1];
}

Game.prototype.acceptStep = function() {
    this.steps.push(this.lastStep);
    this.lastStep[0] = this.lastStep[1] = undefined;
    // TODO: вести счет
}