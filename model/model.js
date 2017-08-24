"use strict";

const Game = require("./game.js").Game;

const users = [];
const games = [];

function findUserByName(userName) {
    return users.find(u => u.name === userName);
}

function whoWaits() {
    return users.filter(u => {
        let gs = games.filter(g => g.player1 === u && g.player2 === undefined);
        return gs.length > 0;
    });
}

function removeUser(user) {
    let i = users.indexOf(user);
    if (i !== -1) {
        users.splice(i, 1);
    }
}

function createNewGame(userName) {
    let user = users.find(u => u.name === userName);
    return new Game(user);
}

function removeGame(game) {
    let i = games.indexOf(game);
    if (i !== -1) {
        games.splice(i, 1);
    }
}

////////// EXPORTS /////////////////

exports.users = users;
exports.findUserByName = findUserByName;

exports.removeUser = removeUser;
exports.whoWaits = whoWaits;

exports.games = games;
exports.removeGame = removeGame;
exports.createNewGame = createNewGame;
