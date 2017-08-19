"use strict";

const Game = require("./game_module.js").Game;

const users = [{name: "user1"}, {name: "user2"}, {name: "user3"}, {name: "user4"},  ];
const games = [new Game(users[0],users[1]), new Game(users[2]), new Game(users[3])];

function userByName(userName) {
    return users.find(u => u.name === userName);
}

function isUserNameUnique(userName) {
    return userByName(userName) === undefined;
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
exports.isUserNameUnique = isUserNameUnique;
exports.userByName = userByName;
exports.removeUser = removeUser;
exports.whoWaits = whoWaits;

exports.games = games;
exports.removeGame = removeGame;
exports.createNewGame = createNewGame;
