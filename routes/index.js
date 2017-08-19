"use strict";
const model = require("../model/model.js");

module.exports = function (app) {

    // show login form
    app.get('/', function (req, res) {
        res.render('login');
    });

    // show waiting hall form
    app.post('/', function (req, res) {
        let userName = req.body.userName;
        if (!model.isUserNameUnique(userName)) {
            res.send(userName + " is busy.");
        } else {
            // select waiting users
            model.users.push({name: userName});
            res.render('hall', {waitings: model.whoWaits(), myName: userName});
        }
    });

    // show game page
    app.post('/game', function (req, res) {
            let selectedUserName = req.body.user;
            let myName = req.body.myName;
            let game;
            if (selectedUserName === myName) {
                // create a new half ready game
                game = model.createNewGame(myName);
                model.games.push(game);
            } else {
                // find an existing game and add a second player to it
                game = model.games.find(g => g.player1.name == selectedUserName && g.player2 == undefined);
                game.player2 = model.userByName(myName);
            }
            res.render('game', {game: game, myName: myName});
        }
    );

}
