"use strict";

const WebSocket = new require('ws');
const model = require("../model/model.js");

// WebSocket-сервер на порту
const webSocketServer = new WebSocket.Server({
    port: 8001
});

webSocketServer.on('connection', function(ws) {
    console.log("Сервер: новое соединение");
    // on server
    ws.on('message', function(message) {
        console.log('Сервер: получил сообщение ' + message);
        let playerName = message.split(':')[0];
        let command = message.split(':')[1];
        switch (command) {
            case 'hi':
                hi_command(playerName, ws);
                break;
            case '1':
            case '2':
            case '3':
                step_command(playerName, command, ws);
                break;
        }
    });

    ws.on('close', function() {
        console.log('Сервер: соединение закрыто' );
    });

});

function hi_command(playerName, ws) {
    // находим данного игрока в списке и сохраняем сокет
    let user = model.findUserByName(playerName);
    if (!user) {
        console.log('Сервер: не найден пользователь ' + playerName);
        return;
    }
    user.socket = ws;
    // находим игру с данным игроком и определяеи ее готовность
    let game = model.games.find(g => g.player1 == user || g.player2 == user);
    if (!game) {
        console.log('Сервер: не найдена игра с игроком ' + user.name);
        return;
    }
    user.socket = ws;

    if (game.player1 == undefined || game.player2 == undefined) {
        let json = JSON.stringify({
            "command": "halfready",
            "name1": game.player1.name,
        });
        ws.send(json);
    } else {
        if (game.player1.socket && game.player1.socket.readyState === WebSocket.OPEN) {
            game.player1.socket.send(JSON.stringify({
                "command": "ready",
                "name1": game.player1.name,
                "name2": game.player2.name,
            }));
        }
        if (game.player2.socket && game.player2.socket.readyState === WebSocket.OPEN) {
            game.player2.socket.send(JSON.stringify({
                "command": "ready",
                "name1": game.player2.name,
                "name2": game.player1.name,
            }));
        }
    }
}

function step_command(playerName, subj, ws) {
    // находим игру с данным игроком
    let user = model.findUserByName(playerName);
    let game = model.games.find(g => g.player1 == user || g.player2 == user);
    // находим индекс игрока, приславшего ход, и записываем ход
    let i = game.player1 == user ? 0 : 1;
    game.lastStep[i] = subj;

    // если оба игрока походили, запоминаем ход и отсылаем им результат
    if (game.isStepReady()) {
        let winner = game.acceptStep();
        let data = {
            "command": "step",
            "steps": deepCopy(game.steps),
            "score": game.getScore(),
            "winner": winner
        };
        game.player1.socket.send(JSON.stringify(data));
        reverse(data);
        game.player2.socket.send(JSON.stringify(data));

        // if game is over - remove the players and the game
        if (winner) {
            //model.removeUser(game.player1);
            //model.removeUser(game.player2);
            model.removeGame(game);
        }
    }

    function deepCopy(steps) {
        let res = [];
        for (let i = 0; i < steps.length; i++) {
            res.push(steps[i].slice());
        }
        return res;
    }

    function reverse(data) {
        for (let i = 0; i < data.steps.length; i++) {
            data.steps[i].reverse();
        }
        data.score.reverse();
    }

}
