"use strict";

const Game = require("./Game.js");

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

// ------------------------------------------------------

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




//---------------------------------------------------------------------

// show login form
function login_action(req, res){
    res.render('login');
}

// show waiting hall form
function hall_action(req, res){
    let userName = req.body.userName;
    if (!isUserNameUnique(userName)) {
        res.send(userName + " is busy.");
    } else {
        // select waiting users
        users.push({name: userName});
        res.render('hall', {waitings: whoWaits(), myName: userName});
    }
}

// show game page
function game_action(req, res){
     let selectedUserName = req.body.user;
     let myName = req.body.myName;
     let game;
     if (selectedUserName === myName) {
        // create a new half ready game
        game = createNewGame(myName);
        games.push(game);
    } else {
        // find an existing game and add a second player to it
        game = games.find(g => g.player1.name == selectedUserName && g.player2 == undefined);
        game.player2 = userByName(myName);
    }
     res.render('game', {game: game, myName: myName});

}

////////// EXPORTS /////////////////

exports.login_action = login_action;
exports.hall_action = hall_action;
exports.game_action = game_action;
exports.users = users;
exports.games = games;

exports.userByName = userByName;
exports.removeUser = removeUser;
exports.removeGame = removeGame;
