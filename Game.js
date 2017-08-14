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
    this.lastStep = [undefined, undefined];
}

// "1" - stone, "2" - scissors, "3" - paper
Game.prototype.getScore = function() {
    let res = [0, 0];
    for (let i = 0; i < this.steps.length; i++) {
        let a = this.steps[i][0], b = this.steps[i][1];
        if ( a == b) {
            res[0] += 0.5;
            res[1] += 0.5;
        } else if (a == "1" && b == "2" || a == "2" && b == "3" || a == "3" && b == "1") {
            res[0] += 1;
        } else {
            res[1] += 1;
        }
    }
    return res;
}
