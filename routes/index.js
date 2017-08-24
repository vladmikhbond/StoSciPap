"use strict";
const model = require("../model/model.js");
const checkAuth = require("../middleware/checkAuth.js");
const createError = require('http-errors');

module.exports = function (app) {

    // show login form
    app.get('/', function (req, res) {
        let userName = req.session ? req.session.userName : "";
        res.render('login', {userName: userName});
    });


    // show waiting hall form
    app.post('/', function (req, res, next)
    {
        let userName = req.body.userName;
        let password = req.body.password;
        let user = model.findUserByName(userName);
        if (user){
            if (user.password === password) {
                // good user - save name in session
                req.session.userName = user.name;
                res.render('hall', {waitings: model.whoWaits(), myName: userName});
            } else {
                // bad user - 401
                return next (createError(401, 'Please login to view this page.'));
            }
        } else {
            // register new user
            req.session.userName = userName;
            model.users.push({name: userName, password: password});
            res.render('hall', {waitings: model.whoWaits(), myName: userName});
        }
    });


    // show game page
    app.post('/game',  checkAuth, function (req, res) {
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
                game.player2 = model.findUserByName(myName);
            }
            res.render('game', {game: game, myName: myName});
        }
    );

}
